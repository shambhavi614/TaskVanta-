import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp,
  WhereFilterOp,
  DocumentData,
  QueryConstraint
} from 'firebase/firestore'
import { db } from './config'

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  PROJECTS: 'projects',
  PROJECT_MEMBERS: 'project_members',
  TASKS: 'tasks'
}

// Generic CRUD operations
export const createDocument = async (collectionName: string, data: any, customId?: string) => {
  try {
    if (customId) {
      // Use setDoc for custom IDs (like user profiles with auth UID)
      const docRef = doc(db, collectionName, customId)
      await setDoc(docRef, {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      return { id: customId, error: null }
    } else {
      // Use addDoc for auto-generated IDs
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      return { id: docRef.id, error: null }
    }
  } catch (error: any) {
    return { id: null, error: error.message }
  }
}

export const getDocument = async (collectionName: string, docId: string) => {
  try {
    const docRef = doc(db, collectionName, docId)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return { data: { id: docSnap.id, ...docSnap.data() }, error: null }
    } else {
      return { data: null, error: 'Document not found' }
    }
  } catch (error: any) {
    return { data: null, error: error.message }
  }
}

export const updateDocument = async (collectionName: string, docId: string, data: any) => {
  try {
    const docRef = doc(db, collectionName, docId)
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    })
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

export const deleteDocument = async (collectionName: string, docId: string) => {
  try {
    const docRef = doc(db, collectionName, docId)
    await deleteDoc(docRef)
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

export const queryDocuments = async (
  collectionName: string,
  constraints: QueryConstraint[] = []
) => {
  try {
    const q = query(collection(db, collectionName), ...constraints)
    const querySnapshot = await getDocs(q)
    
    const documents = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    return { data: documents, error: null }
  } catch (error: any) {
    return { data: [], error: error.message }
  }
}

// Helper to convert Firestore Timestamp to Date
export const timestampToDate = (timestamp: any): Date | null => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate()
  }
  return null
}

export { where, orderBy, Timestamp, serverTimestamp }
