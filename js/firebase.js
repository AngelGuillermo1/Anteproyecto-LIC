// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getFirestore,collection,addDoc,getDocs,getCountFromServer,deleteDoc,doc,getDoc,updateDoc } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCC1AcF4-01spNIiAWSf9GPHWCDEGUYFJk",
  authDomain: "editar-plantilla-bdd.firebaseapp.com",
  projectId: "editar-plantilla-bdd",
  storageBucket: "editar-plantilla-bdd.appspot.com",
  messagingSenderId: "764001708858",
  appId: "1:764001708858:web:efe972e3e60c4ff54afe03"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firestore
const db = getFirestore()

export const saveProduct = (Product) => {
    addDoc(collection(db,'jugadores'), Product);
}

export const getProducts=()=>getDocs(collection(db,'jugadores'))

  export const getProduct=(id)=>getDoc(doc(db,'jugadores',id))

  export const getProductListSize=async()=>{
    const products = collection(db, "jugadores");
    const snapshot = await getCountFromServer(products);
    return snapshot.data().count;
  }

export const deleteProduct=(id)=> deleteDoc(doc(db,'jugadores',id))

export const updateProduct=(id, newFields)=>updateDoc(doc(db,'jugadores',id), newFields)