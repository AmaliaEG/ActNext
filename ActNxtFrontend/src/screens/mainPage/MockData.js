import { addDoc, collection } from 'firebase/firestore';

const addSampleTask = async () => {
    await addDoc(collection(db, 'tasks'), {
      description: "Send discount to new users",
      colour: "green",
      dateAssigned: new Date('2025-04-15'),
      group: "newCustomer",
      priority: 2
    });
  };