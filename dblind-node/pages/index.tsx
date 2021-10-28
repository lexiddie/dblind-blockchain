import { useEffect } from 'react';
import { SHA256, SHA1 } from 'crypto-js';
import { query, collection, getDocs, doc, getDoc, updateDoc, deleteDoc, where, orderBy, limit, onSnapshot, setDoc } from 'firebase/firestore';

import { firestore } from '../firebase/firebase.utils';

let servers: any = [];

let mainTimeout: any;
let mainInterval: any;
let currentQueueId: string = '';
// Zeus
const nodeId: string = '56b1e82e7a26e7d49468e139032e80f0bace170c';
// Babylon
// const nodeId: string = 'd3cbd293ce3826d1c9997096088fc1b220a960d6';
// Apollo
// const nodeId: string = 'dfe091a3f7bd0f75b2aea8a051b4f82f363b2c04';

const sortObject = (data: any) => {
  const result = Object.keys(data)
    .sort()
    .reduce((obj: any, key) => {
      obj[key] = data[key];
      return obj;
    }, {});
  return result;
};

const millisecondsToMinutes = (milliseconds: number) => {
  let minutes: number = Math.floor(milliseconds / 60000);
  let seconds: any = ((milliseconds % 60000) / 1000).toFixed(0);
  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
};

// const getRandomArbitrary = (min: number = 10, max: number = 30) => {
//   min = Math.ceil(min);
//   max = Math.floor(max);
//   return Math.floor(Math.random() * (max - min) + min) * 1000;
// };

// const addNewUser = () => {
//   const testRef = firestore.collection('tests');
//   const genId = testRef.doc().id;
//   console.log(`Checking New ID ${genId}`);
//   const data = {
//     id: genId,
//     name: 'Alexander'
//   };
//   testRef
//     .doc(genId)
//     .set(data)
//     .then(() => {
//       console.log(`Document has been added successful`);
//     });
// };

// const genHashId = () => {
//   const blockRef = firestore.collection('blocks');
//   const genId = blockRef.doc().id;
//   const hashId = SHA1(genId);
//   console.log(`Checking HashId`, hashId.toString());
//   const dateISO = new Date().toISOString();
//   // console.log(`Checking Current DateTime ISO String: `, dateISO);
//   // console.log(`Checking Current DateTime UTC String: `, new Date().toUTCString());
//   // console.log(`Checking Current DateTime String: `, new Date().toLocaleString());
//   // console.log(`Checking ISO into DateTime String: `, new Date(dateISO).toLocaleString());
//   // console.log(`Checking Current DateTime JSON: `, JSON.stringify(new Date()));
// };

// const firstBlock = () => {
//   const blockRef = firestore.collection('blocks');
//   const initialData = {
//     amount: 1000000,
//     previousHash: null,
//     ownerAddress: 'a45cd9c54a7db35e6548c9cfa4443e172927026e',
//     transactionAddress: 'ecca8c62b41f9a8acc0c495f6977b67733749b99cf6abf0e3b3c950bfc1ea26e',
//     createdBy: 'dfe091a3f7bd0f75b2aea8a051b4f82f363b2c04',
//     createdAt: new Date()
//   };
//   const blockHash = SHA256(JSON.stringify(sortObject(initialData))).toString();
//   blockRef
//     .doc(blockHash)
//     .set({ ...initialData, blockHash: blockHash })
//     .then(() => {
//       console.log(`The First Block has been added successful`);
//     });
// };

// const firstTransaction = () => {
//   const transactionRef = firestore.collection('transactions');
//   const initialData = {
//     amount: 1000000,
//     senderAddress: 'ad91dc6660d403d29bb47e3c39514396e968b991',
//     receiverAddress: 'a45cd9c54a7db35e6548c9cfa4443e172927026e',
//     label: 'dBlind Bank',
//     message: 'Deposit Currency',
//     createdAt: new Date()
//   };
//   const transactionHash = SHA256(JSON.stringify(sortObject(initialData))).toString();
//   transactionRef
//     .doc(transactionHash)
//     .set({ ...initialData, transactionHash: transactionHash })
//     .then(() => {
//       console.log(`Transaction has been added successful`);
//     });
// };

// const randomTime = (max: number) => {
//   return Math.floor(Math.random() * Math.floor(max));
// };

const initialCountdown = (milliseconds: number) => {
  let current: number = milliseconds;
  mainInterval = setInterval(() => {
    current -= 1000;
    console.log(`Countdown Task: ${millisecondsToMinutes(current)}`);
    if (current <= 0) {
      clearInterval(mainInterval);
    }
  }, 1000);
};

const initialTask = (transactionId: string, milliseconds: number) => {
  mainTimeout = setTimeout(() => {
    initialBlock(transactionId);
    console.log(`This Task Is Completed`);
  }, milliseconds);
};

const cleanTask = (queueId: string) => {
  const queueRef = collection(firestore, 'queues');
  const q = query(queueRef, where('id', '==', queueId), limit(1));
  const observer = onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        console.log('New Task: ', change.doc.data());
      }
      if (change.type === 'modified') {
        const current = change.doc.data();
        console.log('Modified Task: ', current);
        if (current.isCompleted) {
          currentQueueId = '';
          if (mainTimeout) {
            clearTimeout(mainTimeout);
            clearInterval(mainInterval);
            mainTimeout = null;
            mainInterval = null;
            observer();
            console.log(`Task Cleared`);
            console.log(`Realtime listener cleared`);
            console.log(`\n`);
          }
        }
      }
      if (change.type === 'removed') {
        console.log('Removed Task: ', change.doc.data());
      }
    });
  });
};

const closeQueue = (queueId: string) => {
  const queueRef = doc(firestore, 'queues', queueId);
  try {
    updateDoc(queueRef, {
      isCompleted: true
    });
    console.log(`The queue: ${queueId} is completed successfully.`);
  } catch (err) {
    console.log(`Err has occurred: `, err);
  }
};

const fetchQueue = () => {
  const queueRef = collection(firestore, 'queues');
  const q = query(queueRef, where('isCompleted', '==', false), where('createdAt', '<', new Date()), orderBy('createdAt'), limit(1));
  onSnapshot(q, (snapshot) => {
    console.log(`Received query snapshot of size ${snapshot.size}`);
    snapshot.forEach((item) => {
      const current = item.data();
      console.log(`Checking Object`, current);
      current.nodes.forEach((j: any) => {
        console.log(`Checking Node`, j);
        if (j.id === nodeId) {
          currentQueueId = item.id;
          console.log(`Checking QueueId ${currentQueueId}`);
          initialTask(current.transactionId, j.time);
          initialCountdown(j.time);
          cleanTask(item.id);
        }
      });
    });
  });
};

const initialBlock = async (transactionId: string) => {
  const poolRef = doc(firestore, 'pools', transactionId);
  const document = await getDoc(poolRef);
  if (!document.exists) {
    console.log(`No such document!`);
  } else {
    const transaction = document.data();
    console.log('Transaction data:', transaction);
    const isBanker = await checkBanker(transaction.senderAddress);
    if (!isBanker) {
      startAddingBlock(transaction);
    } else {
      startBankingBlock(transaction);
    }
  }
};

const checkBanker = async (senderId: string): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    const bankRef = collection(firestore, 'banks');
    try {
      const snapshot = await getDocs(bankRef);
      if (snapshot.empty) {
        console.log('No Bankers');
        resolve(false);
      }
      snapshot.forEach((document) => {
        const banker = document.data();
        if (document.id === senderId) {
          console.log(document.id, '=>', banker);
          console.log(`Sender is a banker`);
          resolve(true);
        }
      });
      resolve(false);
    } catch (err) {
      console.log('Error getting document:', err);
      reject(err);
    }
  });
};

const getLatestBlockAddress = async (): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    const blockRef = collection(firestore, 'blocks');
    const q = query(blockRef, orderBy('createdAt', 'desc'), limit(1));
    try {
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        snapshot.forEach((document) => {
          const currentDoc = document.data();
          console.log(`Latest Hash Original ${currentDoc.blockHash}`);
          resolve(currentDoc.blockHash);
        });
      }
      resolve('');
    } catch (err) {
      console.log('Error getting document:', err);
      reject(err);
    }
  });
};

const getReceiverBlock = async (receiverId: string) => {
  return new Promise(async (resolve, reject) => {
    const blockRef = collection(firestore, 'blocks');
    const q = query(blockRef, where('ownerAddress', '==', receiverId), orderBy('createdAt', 'desc'), limit(1));
    try {
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        snapshot.forEach((doc) => {
          const data = doc.data();
          console.log(`Receiver Block Data `, data);
          resolve(data);
        });
      }
      resolve('');
    } catch (err) {
      console.log('Error getting document:', err);
      reject(err);
    }
  });
};

const startBankingBlock = async (transaction: any) => {
  const receiverAddress = transaction.receiverAddress;
  const latestBlockHash: string = await getLatestBlockAddress();
  const receiverData: any = await getReceiverBlock(transaction.receiverAddress);

  delete transaction.id;
  delete transaction.isCompleted;
  const transactionData = {
    ...transaction,
    createdAt: new Date()
  };
  console.log(`Checking Transaction`, transaction);
  const transactionHash = SHA256(JSON.stringify(sortObject(transactionData))).toString();

  try {
    const documentRef = doc(firestore, 'transactions', transactionHash);
    await setDoc(documentRef, { ...transactionData, transactionHash: transactionHash });
    console.log(`New transaction has been added successful`);
    distributeTransaction({ ...transactionData, transactionHash: transactionHash });
  } catch (err) {
    console.log('Error getting document:', err);
  }

  const receiverBlock = {
    amount: 0,
    previousHash: latestBlockHash,
    ownerAddress: receiverAddress,
    transactionAddress: transactionHash,
    createdBy: nodeId,
    createdAt: new Date()
  };

  if (receiverData === '') {
    receiverBlock.amount = transaction.amount;
  } else {
    receiverBlock.amount = receiverData.amount + transaction.amount;
  }

  const receiverBlockHash = SHA256(JSON.stringify(sortObject(receiverBlock))).toString();

  try {
    const documentRef = doc(firestore, 'blocks', receiverBlockHash);
    await setDoc(documentRef, { ...receiverBlock, blockHash: receiverBlockHash });
    console.log(`The Receiver Block has been added successful`);
    distributeBlock({ ...receiverBlock, blockHash: receiverBlockHash });
  } catch (err) {
    console.log('Error adding document:', err);
  }
  closeQueue(currentQueueId);
};

const startAddingBlock = async (transaction: any) => {
  const senderAddress = transaction.senderAddress;
  const receiverAddress = transaction.receiverAddress;
  const latestBlockHash: string = await getLatestBlockAddress();
  const receiverData: any = await getReceiverBlock(transaction.receiverAddress);

  const blockRef = collection(firestore, 'blocks');
  const q = query(blockRef, where('ownerAddress', '==', senderAddress), orderBy('createdAt', 'desc'), limit(1));

  try {
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      console.log('No matching documents..');
      return;
    }
    snapshot.forEach((document) => {
      const block = document.data();
      console.log('Block Doc =>', block);
      if (block.amount >= transaction.amount) {
        delete transaction.id;
        delete transaction.isCompleted;
        const transactionData = {
          ...transaction,
          createdAt: new Date()
        };
        console.log(`Checking Transaction`, transaction);
        const transactionHash = SHA256(JSON.stringify(sortObject(transactionData))).toString();
        try {
          const documentRef = doc(firestore, 'transactions', transactionHash);
          setDoc(documentRef, { ...transactionData, transactionHash: transactionHash });
          console.log(`New transaction has been added successful`);
          distributeTransaction({ ...transactionData, transactionHash: transactionHash });
        } catch (err) {
          console.log('Error adding document:', err);
        }

        const senderAmount = block.amount - transaction.amount;
        const senderBlock = {
          amount: senderAmount,
          previousHash: latestBlockHash,
          ownerAddress: senderAddress,
          transactionAddress: transactionHash,
          createdBy: nodeId,
          createdAt: new Date()
        };
        const senderBlockHash = SHA256(JSON.stringify(sortObject(senderBlock))).toString();

        try {
          const documentRef = doc(firestore, 'blocks', senderBlockHash);
          setDoc(documentRef, { ...senderBlock, blockHash: senderBlockHash });
          console.log(`The sender Block has been added successful`);
          distributeBlock({ ...senderBlock, blockHash: senderBlockHash });
        } catch (err) {
          console.log('Error adding sender document in block:', err);
        }

        const receiverBlock = {
          amount: 0,
          previousHash: senderBlockHash,
          ownerAddress: receiverAddress,
          transactionAddress: transactionHash,
          createdBy: nodeId,
          createdAt: new Date()
        };

        if (receiverData === '') {
          receiverBlock.amount = transaction.amount;
        } else {
          receiverBlock.amount = receiverData.amount + transaction.amount;
        }

        const receiverBlockHash = SHA256(JSON.stringify(sortObject(receiverBlock))).toString();

        try {
          const documentRef = doc(firestore, 'blocks', receiverBlockHash);
          setDoc(documentRef, { ...receiverBlock, blockHash: receiverBlockHash });
          console.log(`The Receiver Block has been added successful`);
          distributeBlock({ ...receiverBlock, blockHash: receiverBlockHash });
        } catch (err) {
          console.log('Error adding receiver document in block:', err);
        }

        closeQueue(currentQueueId);
        return;
      }
    });
  } catch (err) {
    console.log('Error getting document in blocks:', err);
  }
};

const fetchNetworkBlocks = async (): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    const blockRef = collection(firestore, 'blocks');
    const q = query(blockRef, orderBy('createdAt'));
    try {
      const snapshot = await getDocs(q);
      let blocks = [];
      if (snapshot.empty) {
        console.log('No network blocks');
        resolve(blocks);
      }
      snapshot.forEach((doc) => {
        const block = doc.data();
        // console.log(doc.id, '=>', block);
        blocks.push(block);
      });
      resolve(blocks);
    } catch (err) {
      console.log('Error getting blocks:', err);
      reject(err);
    }
  });
};

const fetchNetworkTransactions = async (): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    const transactionRef = collection(firestore, 'transactions');
    const q = query(transactionRef, orderBy('createdAt'));
    try {
      const snapshot = await getDocs(q);
      let transactions = [];
      if (snapshot.empty) {
        console.log('No network transactions');
        resolve(transactions);
      }
      snapshot.forEach((doc) => {
        const transaction = doc.data();
        // console.log(doc.id, '=>', transaction);
        transactions.push(transaction);
      });
      resolve(transactions);
    } catch (err) {
      console.log(`Error getting transactions:`, err);
      reject(err);
    }
  });
};

const fetchLocalBlocks = async (): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    const blockRef = collection(firestore, 'nodes', nodeId, 'blocks');
    const q = query(blockRef, orderBy('createdAt'));
    try {
      const snapshot = await getDocs(q);
      let blocks = [];
      if (snapshot.empty) {
        console.log('No local blocks');
        resolve(blocks);
      }
      snapshot.forEach((doc) => {
        const block = doc.data();
        // console.log(doc.id, '=>', block);
        blocks.push(block);
      });
      resolve(blocks);
    } catch (err) {
      console.log(`Error getting local blocks`, err);
      reject(err);
    }
  });
};

const fetchLocalTransactions = async (): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    const transactionRef = collection(firestore, 'nodes', nodeId, 'transactions');
    const q = query(transactionRef, orderBy('createdAt'));
    try {
      const snapshot = await getDocs(q);
      let transactions = [];
      if (snapshot.empty) {
        console.log('No local transactions');
        resolve(transactions);
      }
      snapshot.forEach((doc) => {
        const transaction = doc.data();
        // console.log(doc.id, '=>', transaction);
        transactions.push(transaction);
      });
      resolve(transactions);
    } catch (err) {
      console.log(`Error getting local transactions`, err);
      reject(err);
    }
  });
};

const reinstateLocalBlocks = async (networkBlocks: any, localBlocks: any) => {
  const blockRef = collection(firestore, 'nodes', nodeId, 'blocks');
  networkBlocks.forEach((element: any) => {
    const result = localBlocks.some((item: any) => item.blockHash == element.blockHash);
    if (!result) {
      const localRef = doc(blockRef, element.blockHash);
      try {
        setDoc(localRef, element);
        console.log(`Block ${element.blockHash} has been reinstated locally node`);
      } catch (err) {
        console.log(`Block ${element.blockHash} is failure`);
      }
    }
  });
};

const reinstateLocalTransactions = async (networkTransactions: any, localTransactions: any) => {
  const transactionRef = collection(firestore, 'nodes', nodeId, 'transactions');
  networkTransactions.forEach((element: any) => {
    const result = localTransactions.some((item: any) => item.transactionHash == element.transactionHash);
    if (!result) {
      const localRef = doc(transactionRef, element.transactionHash);
      try {
        setDoc(localRef, element);
        console.log(`Transaction ${element.transactionHash} has been reinstated locally node`);
      } catch (err) {
        console.log(`Transaction ${element.blockHash} is failure`);
      }
    }
  });
};

const checkLocalBlocks = async () => {
  const networkBlocks = await fetchNetworkBlocks();
  console.log(`\n`);
  const localBlocks = await fetchLocalBlocks();
  console.log(`Checking Blocks`, networkBlocks.length);
  console.log(`Checking Local Blocks`, localBlocks.length);
  reinstateLocalBlocks(networkBlocks, localBlocks);
};

const checkLocalTransactions = async () => {
  const networkTransactions = await fetchNetworkTransactions();
  console.log(`\n`);
  const localTransactions = await fetchLocalTransactions();
  console.log(`Checking Transactions`, networkTransactions.length);
  console.log(`Checking Local Transactions`, localTransactions.length);
  reinstateLocalTransactions(networkTransactions, localTransactions);
};

const validationBlock = (document: any) => {
  try {
    const docId = document.blockHash;
    // console.log(`Checking DocId ${docId}`);
    delete document.blockHash;
    const initialData = {
      ...document,
      createdAt: document.createdAt.toDate()
    };
    const blockHash = SHA256(JSON.stringify(sortObject(initialData))).toString();
    if (docId === blockHash) {
      return true;
    }
    return false;
  } catch (err) {
    console.log(`This block after changed has err`, err);
    return false;
  }
};

const validationTransaction = (document: any) => {
  try {
    const docId = document.transactionHash;
    // console.log(`Checking DocId ${docId}`);
    delete document.transactionHash;
    const initialData = {
      ...document,
      createdAt: document.createdAt.toDate()
    };
    const transactionHash = SHA256(JSON.stringify(sortObject(initialData))).toString();
    if (docId === transactionHash) {
      return true;
    }
    return false;
  } catch (err) {
    console.log(`This transaction after changed has err`, err);
    return false;
  }
};

const monitorLocalBlocks = () => {
  const localBlockRef = collection(firestore, 'nodes', nodeId, 'blocks');
  onSnapshot(localBlockRef, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added' || change.type === 'modified') {
        const data = change.doc.data();
        const isValid = validationBlock(data);
        console.log(`Block ${change.doc.id} Validation ${isValid}`);
        if (!isValid) {
          try {
            deleteDoc(change.doc.ref);
            checkLocalBlocks();
          } catch (err) {
            console.log(`Deletion of local block err: `, err);
          }
        }
      }
      if (change.type === 'removed') {
        console.log('Removed Block: ', change.doc.data());
      }
    });
  });
};

const monitorLocalTransactions = () => {
  const localTransactionRef = collection(firestore, 'nodes', nodeId, 'transactions');
  onSnapshot(localTransactionRef, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added' || change.type === 'modified') {
        const data = change.doc.data();
        const isValid = validationTransaction(data);
        console.log(`Transaction ${change.doc.id} Validation ${isValid}`);
        if (!isValid) {
          try {
            deleteDoc(change.doc.ref);
            checkLocalTransactions;
          } catch (err) {
            console.log(`Deletion of local transaction err: `, err);
          }
        }
      }
      if (change.type === 'removed') {
        console.log('Removed Transaction: ', change.doc.data());
      }
    });
  });
};

const fetchNodes = async () => {
  const nodeRef = collection(firestore, 'nodes');
  try {
    const snapshot = await getDocs(nodeRef);
    servers = [];
    if (snapshot.empty) {
      console.log('No network nodes');
    }
    snapshot.forEach((doc) => {
      const node = doc.data();
      if (node.id === nodeId) {
        console.log(`Web Service with Node: ${node.name}`);
      }
      servers.push(node);
    });
  } catch (err) {
    console.log('Error getting document:', err);
  }
};

const distributeBlock = (block: any) => {
  servers.forEach((item: any) => {
    const blockRef = doc(firestore, 'nodes', item.id, 'blocks', block.blockHash);
    try {
      setDoc(blockRef, block);
      console.log(`New block has been distributed into ${item.name}`);
    } catch (err) {
      console.log(`Error distributing block into ${item.name}:`, err);
    }
  });
};

const distributeTransaction = (transaction: any) => {
  servers.forEach((item: any) => {
    const transactionRef = doc(firestore, 'nodes', item.id, 'transactions', transaction.transactionHash);
    try {
      setDoc(transactionRef, transaction);
      console.log(`New transaction has been distributed into ${item.name}`);
    } catch (err) {
      console.log(`Error distributing transaction into ${item.name}:`, err);
    }
  });
};

const Home = () => {
  useEffect(() => {
    fetchNodes();
    checkLocalBlocks();
    checkLocalTransactions();
    monitorLocalBlocks();
    monitorLocalTransactions();
    fetchQueue();
    return () => {};
  }, []);

  return <h2>Server is running</h2>;
};

export default Home;
