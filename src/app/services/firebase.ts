import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import firebase from 'firebase/compat/app';
import { getFirestore } from 'firebase/firestore';
import { onAuthStateChanged, User, signOut } from 'firebase/auth'; //allows for the user to logout of account/tracks state of user (signed in/signed out)
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc } from 'firebase/firestore';


//stores the Firebase connection info
const firebaseConfig = {
  apiKey: "AIzaSyCqAyI-Kc1wVs0oh7GSBvApvQyyN9SJlms",
  authDomain: "student-planner-calendar.firebaseapp.com",
  projectId: "student-planner-calendar",
  storageBucket: "student-planner-calendar.firebasestorage.app",
  messagingSenderId: "257082706753",
  appId: "1:257082706753:web:f6f6c912d8d7b349522fc0"
};

const app = initializeApp(firebaseConfig);

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  //Makes firebase authentication open for the app
  auth = getAuth(app);
  
  //Gives the app access to the Firestore database
  firestore = getFirestore(app);

   //stores the currently logged in user
  currentUser: User | null = null;

 //watches for when the user logs in or out specifically for changes of user state
  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      //updates the current user when something changes in authentication
      this.currentUser = user;

    });
  }
//logs the user out of Firebase
  async logoutUser(): Promise<void>{
    await signOut(this.auth);
  }

  async saveEvent(eventData: any): Promise<void> {
    await addDoc(
      collection(this.firestore, 'events'),
      eventData
    );
  }

  // Loads all events belonging to the currently logged in user
async getUserEvents(userId: string): Promise<any[]> {

  const eventsQuery = query(
    collection(this.firestore, 'events'),
    where('userId', '==', userId)
  );

  const querySnapshot = await getDocs(eventsQuery);

  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

}

//Deletes an event from the database by its ID
async deleteEvent(eventId: string): Promise<void> {

  await deleteDoc(
    doc(this.firestore, 'events', eventId)
  );

}
//Updates an existing event with new data
async updateEvent(
  eventId: string,
  updatedData: any
): Promise<void> {

  await updateDoc(
    doc(this.firestore, 'events', eventId),
    updatedData
  );

}


}
