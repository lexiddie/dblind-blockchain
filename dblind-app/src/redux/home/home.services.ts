import { query, collection, getDocs, orderBy } from 'firebase/firestore';
import { firestore } from '../../firebase/firebase.utils';

export const fetchBlocks = async () => {
  return new Promise(async (resolve, reject) => {
    const blockRef = collection(firestore, 'blocks');
    const q = query(blockRef, orderBy('createdAt', 'desc'));
    try {
      const snapshot = await getDocs(q);
      const tempList: any = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        const record = { ...data, createdAt: data.createdAt.toDate() };
        tempList.push(record);
      });
      resolve(tempList);
    } catch (err) {
      console.log('Error getting documents:', err);
      resolve([]);
    }
  });
};
