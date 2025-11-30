import { renderHook, act } from '@testing-library/react';
import { useFirestore } from './useFirestore';
import { db } from '../firebase';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';

// Mock Firestore
vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual('firebase/firestore');
  return {
    ...actual,
    collection: vi.fn(),
    query: vi.fn(),
    onSnapshot: vi.fn(),
    addDoc: vi.fn(),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
    doc: vi.fn(),
    Timestamp: {
      now: vi.fn(() => ({
        toDate: () => new Date(),
      })),
    },
  };
});

// Mock db object
vi.mock('../firebase', () => ({
  db: {},
}));

describe('useFirestore', () => {
  const collectionName = 'test-collection';

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch data and update loading state', async () => {
    const mockData = [{ id: '1', name: 'Test' }];
    const mockSnapshot = {
      docs: mockData.map(d => ({
        id: d.id,
        data: () => ({ name: d.name }),
      })),
    };

    const mockUnsubscribe = vi.fn();
    (onSnapshot as vi.Mock).mockImplementation((q, callback) => {
      callback(mockSnapshot);
      return mockUnsubscribe;
    });

    const { result, rerender } = renderHook(() => useFirestore(collectionName));

    rerender();

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBe(null);
  });

  it('should add a document', async () => {
    const { result } = renderHook(() => useFirestore(collectionName));
    const newItem = { name: 'New Item' };

    await act(async () => {
      await result.current.add(newItem);
    });

    expect(addDoc).toHaveBeenCalled();
  });

  it('should update a document', async () => {
    const { result } = renderHook(() => useFirestore(collectionName));
    const updatedItem = { name: 'Updated Item' };

    await act(async () => {
      await result.current.update('1', updatedItem);
    });

    expect(updateDoc).toHaveBeenCalled();
  });

  it('should remove a document', async () => {
    const { result } = renderHook(() => useFirestore(collectionName));

    await act(async () => {
      await result.current.remove('1');
    });

    expect(deleteDoc).toHaveBeenCalled();
  });
});
