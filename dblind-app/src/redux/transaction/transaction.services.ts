import { query, collection, getDocs, where } from 'firebase/firestore';
import { firestore } from '../../firebase/firebase.utils';
import { store } from '../store';

export const fetchTransactions = () => {
  return new Promise(async (resolve, reject) => {
    const state = store.getState();
    const userId = state.authentication.account.id;
    const transactionRef = collection(firestore, 'transactions');
    const q1 = query(transactionRef, where('senderAddress', '==', userId));
    const q2 = query(transactionRef, where('receiverAddress', '==', userId));
    try {
      const tempList: any = [];
      let snapshot = await getDocs(q1);
      snapshot.forEach((doc) => {
        const data = doc.data();
        const record = { ...data, createdAt: data.createdAt.toDate() };
        tempList.push(record);
      });
      snapshot = await getDocs(q2);
      snapshot.forEach((doc) => {
        const data = doc.data();
        const record = { ...data, createdAt: data.createdAt.toDate() };
        tempList.push(record);
      });
      tempList.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
      resolve(tempList);
    } catch (err) {
      console.log(`Error getting documents`, err);
      resolve([]);
    }
  });
};
