import { query, collection, getDocs, where } from 'firebase/firestore';
import { firestore } from '../../firebase/firebase.utils';
import { store } from '../store';

export const fetchActivities = () => {
  return new Promise(async (resolve, reject) => {
    const state = store.getState();
    const userId = state.authentication.account.id;
    const poolRef = collection(firestore, 'pools');
    const q = query(poolRef, where('senderAddress', '==', userId));
    try {
      const tempList: any = [];
      const snapshot = await getDocs(q);
      snapshot.forEach((doc) => {
        const data = doc.data();
        tempList.push(data);
      });
      resolve(tempList);
    } catch (err) {
      console.log(`Error getting documents`, err);
      resolve([]);
    }
  });
};
