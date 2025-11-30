import { useState, useEffect } from 'react';
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  where,
  QueryConstraint,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase';

export interface FirestoreHookResult<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
  add: (item: Omit<T, 'id'>) => Promise<void>;
  update: (id: string, item: Partial<T>) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

/**
 * Hook để làm việc với Firestore collection
 * @param collectionName Tên collection
 * @param queryConstraints Các điều kiện query (where, orderBy, etc.)
 * @returns Data, loading state và CRUD functions
 */
export function useFirestore<T extends { id: string }>(
  collectionName: string,
  queryConstraints: QueryConstraint[] = []
): FirestoreHookResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);

    try {
      const collectionRef = collection(db, collectionName);
      const q = queryConstraints.length > 0
        ? query(collectionRef, ...queryConstraints)
        : query(collectionRef);

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const items = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as T[];

          setData(items);
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.error(`Error fetching ${collectionName}:`, err);
          setError(err as Error);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error(`Error setting up listener for ${collectionName}:`, err);
      setError(err as Error);
      setLoading(false);
    }
  }, [collectionName, JSON.stringify(queryConstraints)]);

  const add = async (item: Omit<T, 'id'>) => {
    try {
      const collectionRef = collection(db, collectionName);
      await addDoc(collectionRef, {
        ...item,
        createdAt: Timestamp.now()
      });
    } catch (err) {
      console.error(`Error adding to ${collectionName}:`, err);
      throw err;
    }
  };

  const update = async (id: string, item: Partial<T>) => {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...item,
        updatedAt: Timestamp.now()
      });
    } catch (err) {
      console.error(`Error updating ${collectionName}/${id}:`, err);
      throw err;
    }
  };

  const remove = async (id: string) => {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
    } catch (err) {
      console.error(`Error deleting ${collectionName}/${id}:`, err);
      throw err;
    }
  };

  return { data, loading, error, add, update, remove };
}
