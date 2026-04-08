import { db } from "./config";
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  setDoc,
  query, 
  orderBy,
  serverTimestamp,
  DocumentData
} from "firebase/firestore";

// Generic types
export interface FirestoreDocument extends DocumentData {
  id: string;
}

// Ensure db is not null before trying to use it
const getDbCollection = (collectionName: string) => {
  if (!db) throw new Error("Firestore is not initialized.");
  return collection(db, collectionName);
};

// Generic CRUD operations
export const getAllDocuments = async <T = DocumentData>(collectionName: string, orderField?: string, orderDirection: "asc" | "desc" = "desc"): Promise<(T & { id: string })[]> => {
  try {
    let q = query(getDbCollection(collectionName));
    if (orderField) {
      q = query(getDbCollection(collectionName), orderBy(orderField, orderDirection));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as (T & { id: string })[];
  } catch (error) {
    console.error(`Error getting documents from ${collectionName}:`, error);
    return [];
  }
};

export const getDocument = async <T = DocumentData>(collectionName: string, id: string): Promise<(T & { id: string }) | null> => {
  if (!db) return null;
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T & { id: string };
    }
    return null;
  } catch (error) {
    console.error(`Error getting document ${id} from ${collectionName}:`, error);
    return null;
  }
};

export const createDocument = async (collectionName: string, data: Record<string, unknown>): Promise<string | null> => {
  try {
    const docRef = await addDoc(getDbCollection(collectionName), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error(`Error creating document in ${collectionName}:`, error);
    return null;
  }
};

export const updateDocument = async (collectionName: string, id: string, data: Record<string, unknown>): Promise<boolean> => {
  if (!db) return false;
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error(`Error updating document ${id} in ${collectionName}:`, error);
    return false;
  }
};

export const setDocument = async (collectionName: string, id: string, data: Record<string, unknown>): Promise<boolean> => {
  if (!db) return false;
  try {
    const docRef = doc(db, collectionName, id);
    await setDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    return true;
  } catch (error) {
    console.error(`Error setting document ${id} in ${collectionName}:`, error);
    return false;
  }
};

export const deleteDocument = async (collectionName: string, id: string): Promise<boolean> => {
  if (!db) return false;
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error(`Error deleting document ${id} in ${collectionName}:`, error);
    return false;
  }
};
