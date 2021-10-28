import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { SHA256, SHA1 } from 'crypto-js';

admin.initializeApp();

const db = admin.firestore();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const getRandomArbitrary = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min) * 1000;
};

const sortObject = (data: any) => {
  const result = Object.keys(data)
    .sort()
    .reduce((obj: any, key) => {
      obj[key] = data[key];
      return obj;
    }, {});
  return result;
};

export const createQueue = functions
  .region('asia-east2')
  .firestore.document('pools/{poolId}')
  .onCreate(async (snap, _) => {
    const doc = snap.data();
    return db
      .collection('nodes')
      .where('isActive', '==', true)
      .get()
      .then((nodes) => {
        if (!nodes.empty) {
          const nodeList: any = [];
          nodes.forEach((doc) => {
            const currentDoc = doc.data();
            const genTime1 = getRandomArbitrary(10, 50);
            const genTime2 = getRandomArbitrary(10, 50);
            const genTime = genTime1 + genTime2;
            nodeList.push({ id: currentDoc.id, time: genTime });
          });
          const queueRef = db.collection('queues');
          const genId = queueRef.doc().id;
          const hashId = SHA1(genId).toString();
          const initialData = {
            id: hashId,
            isCompleted: false,
            createdAt: new Date(),
            transactionId: doc.id,
            nodes: nodeList
          };
          queueRef
            .doc(hashId)
            .set(initialData)
            .then(() => {
              console.log('Queue has been generated successful');
            })
            .catch((err) => {
              console.log(`Error getting document`, err);
              return Promise.reject(err);
            });
        }
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  });

// const getLatestBlockAddress = async (): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     const blockRef = db.collection('blocks');
//     blockRef
//       .orderBy('createdAt', 'desc')
//       .limit(1)
//       .get()
//       .then((snapshot) => {
//         if (!snapshot.empty) {
//           snapshot.forEach((doc) => {
//             const currentDoc = doc.data();
//             console.log(`Latest Hash Original ${currentDoc.blockHash}`);
//             resolve(currentDoc.blockHash);
//           });
//         }
//         resolve('');
//       })
//       .catch(() => {
//         reject('Error getting document:');
//       });
//   });
// };

// export const createMockBlock = functions.firestore.document('tests/{testId}').onCreate(async (snap, _) => {
//   // const blockRef = db.collection('blocks');
//   const initialData = {
//     amount: 1000000,
//     previousHash: '',
//     transactionAddress: 'db1653a57c3b34221f8e89688d779c5af25506c5ab125fdaacc9c6989f5fd08e',
//     createdBy: 'dfe091a3f7bd0f75b2aea8a051b4f82f363b2c04',
//     ownerAddress: 'a45cd9c54a7db35e6548c9cfa4443e172927026e',
//     createdAt: new Date()
//   };
//   const latestBlock = await getLatestBlockAddress();
//   if (latestBlock !== '') {
//     initialData.previousHash = latestBlock;
//   }
//   console.log(`Checking Original Block`, sortObject(initialData));
//   const blockHash = SHA256(JSON.stringify(sortObject(initialData))).toString();
//   await db
//     .collection('blocks')
//     .doc(blockHash)
//     .set({ ...initialData, blockHash: blockHash })
//     .then(() => {
//       console.log('Block has been generated successful');
//     })
//     .catch((err) => {
//       console.log(`Error getting document`, err);
//       return Promise.reject(err);
//     });

//   const transactionData = {
//     amount: 1000000,
//     senderAddress: 'ad91dc6660d403d29bb47e3c39514396e968b991',
//     receiverAddress: 'a45cd9c54a7db35e6548c9cfa4443e172927026e',
//     label: 'DBLIND Bank',
//     message: 'Deposit Currency',
//     createdAt: new Date()
//   };
//   console.log(`Checked Created Transaction`, sortObject(transactionData));
//   const transactionHash = SHA256(JSON.stringify(sortObject(transactionData))).toString();
//   await db
//     .collection('transactions')
//     .doc(transactionHash)
//     .set({ ...transactionData, transactionHash: transactionHash })
//     .then(() => {
//       console.log(`Transaction has been added successful`);
//     });
// });

export const blockPreventChanges = functions
  .region('asia-east2')
  .firestore.document('blocks/{blockId}')
  .onWrite(async (change, context) => {
    const docId = context.params.blockId;
    const document = change.after.exists ? change.after.data() : null;
    const oldDocument = change.before.exists ? change.before.data() : null;
    if (oldDocument == null && document != null) {
      try {
        delete document.blockHash;
        const initialData = {
          ...document,
          createdAt: document.createdAt.toDate()
        };
        const checkHash = SHA256(JSON.stringify(sortObject(initialData))).toString();
        if (docId !== checkHash) {
          await change.after.ref.delete();
          console.log(`This invalid block has been deleted 1`);
        }
      } catch (err) {
        console.log(`This block has err`, err);
        await change.after.ref.delete();
        console.log(`This invalid block has been deleted 2`);
      }
    } else if (oldDocument != null) {
      try {
        delete oldDocument.blockHash;
        const initialData = {
          ...oldDocument,
          createdAt: oldDocument.createdAt.toDate()
        };
        const blockHash = SHA256(JSON.stringify(sortObject(initialData))).toString();
        if (docId === blockHash) {
          await change.after.ref.set({ ...initialData, blockHash: blockHash });
          console.log('This block has been reinstated successful');
        }
      } catch (err) {
        console.log(`This block after changed has err`, err);
      }
    }
  });

export const transactionPreventChanges = functions
  .region('asia-east2')
  .firestore.document('transactions/{transactionId}')
  .onWrite(async (change, context) => {
    const docId = context.params.transactionId;
    const document = change.after.exists ? change.after.data() : null;
    console.log(`Checking Doc`, document);
    const oldDocument = change.before.exists ? change.before.data() : null;
    console.log(`Checking Old Doc`, oldDocument);
    if (oldDocument == null && document != null) {
      try {
        delete document.transactionHash;
        const initialData = {
          ...document,
          createdAt: document.createdAt.toDate()
        };
        const checkHash = SHA256(JSON.stringify(sortObject(initialData))).toString();
        console.log(`Checking Hash ${docId} vs ${checkHash}`);
        if (docId !== checkHash) {
          await change.after.ref.delete();
          console.log(`This invalid transaction has been deleted 1`);
        }
      } catch (err) {
        console.log(`This transaction has err`, err);
        await change.after.ref.delete();
        console.log(`This invalid transaction has been deleted 2`);
      }
    } else if (oldDocument != null) {
      try {
        delete oldDocument.transactionHash;
        const initialData = {
          ...oldDocument,
          createdAt: oldDocument.createdAt.toDate()
        };
        const transactionHash = SHA256(JSON.stringify(sortObject(initialData))).toString();
        if (docId === transactionHash) {
          await change.after.ref.set({ ...initialData, transactionHash: transactionHash });
          console.log('This transaction has been reinstated successful');
        }
      } catch (err) {
        console.log(`This transaction after changed has err`, err);
      }
    }
  });

export const cleanQueue = functions
  .region('asia-east2')
  .firestore.document('queues/{queueId}')
  .onWrite(async (change, context) => {
    const document = change.after.exists ? change.after.data() : null;
    console.log(`Checking Doc`, document);
    if (document != null) {
      try {
        if (document.isCompleted === true) {
          const poolRef = db.collection('pools');
          const transactionId = document.transactionId;
          await change.after.ref.delete();
          console.log(`This queue has been cleared`);
          await poolRef.doc(transactionId).delete();
          console.log(`This pool has been cleared`);
        }
      } catch (err) {
        console.log(`This queue has err`, err);
        await change.after.ref.delete();
        console.log(`This invalid queue has been deleted`);
      }
    }
  });
