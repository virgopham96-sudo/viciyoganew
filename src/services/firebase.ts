import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  Firestore,
  Unsubscribe
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Lead } from '../types';

let app: any = null;
let db: Firestore | null = null;
let isConfigured = false;

try {
  if (firebaseConfig?.projectId && firebaseConfig?.apiKey) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    const databaseId =
      firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
        ? firebaseConfig.firestoreDatabaseId
        : undefined;
    db = databaseId ? getFirestore(app, databaseId) : getFirestore(app);
    isConfigured = true;
  }
} catch (error) {
  console.warn('Firebase custom database init warning, trying default:', error);
  try {
    if (app) {
      db = getFirestore(app);
      isConfigured = true;
    }
  } catch (err2) {
    console.error('Fatal Firebase Firestore init error:', err2);
  }
}

export { db, isConfigured };

// Helper to remove undefined properties which are not permitted by Firestore
export function sanitizeForFirestore<T extends Record<string, any>>(obj: T): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        result[key] = value.map((v) =>
          typeof v === 'object' && v !== null ? sanitizeForFirestore(v) : v
        );
      } else if (typeof value === 'object' && value !== null) {
        result[key] = sanitizeForFirestore(value);
      } else {
        result[key] = value;
      }
    }
  }
  return result;
}

export const LEADS_COLLECTION = 'leads';

/**
 * Real-time subscription to leads collection across all devices
 */
export function subscribeToFirestoreLeads(
  onUpdate: (leads: Lead[]) => void,
  onError?: (err: any) => void
): Unsubscribe | null {
  if (!db) {
    if (onError) onError(new Error('Firebase Firestore chưa được kết nối'));
    return null;
  }

  try {
    const leadsRef = collection(db, LEADS_COLLECTION);
    const q = query(leadsRef, orderBy('createdAt', 'desc'));

    return onSnapshot(
      q,
      (snapshot) => {
        const leads: Lead[] = [];
        snapshot.forEach((docSnap) => {
          leads.push({ id: docSnap.id, ...(docSnap.data() as any) });
        });
        onUpdate(leads);
      },
      (err) => {
        console.warn('Firestore onSnapshot query warning, falling back to unordered listener:', err);
        return onSnapshot(
          leadsRef,
          (plainSnap) => {
            const leads: Lead[] = [];
            plainSnap.forEach((docSnap) => {
              leads.push({ id: docSnap.id, ...(docSnap.data() as any) });
            });
            leads.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
            onUpdate(leads);
          },
          (err2) => {
            console.error('Firestore leads subscription failed:', err2);
            if (onError) onError(err2);
          }
        );
      }
    );
  } catch (error) {
    console.error('Failed to set up Firestore leads listener:', error);
    if (onError) onError(error);
    return null;
  }
}

/**
 * Fetch all leads from Firestore once
 */
export async function fetchFirestoreLeads(): Promise<Lead[]> {
  if (!db) return [];
  try {
    const leadsRef = collection(db, LEADS_COLLECTION);
    const snap = await getDocs(leadsRef);
    const leads: Lead[] = [];
    snap.forEach((docSnap) => {
      leads.push({ id: docSnap.id, ...(docSnap.data() as any) });
    });
    leads.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    return leads;
  } catch (error) {
    console.error('Failed to fetch leads from Firestore:', error);
    return [];
  }
}

/**
 * Save or overwrite lead in Firestore
 */
export async function saveLeadToFirestore(lead: Lead): Promise<boolean> {
  if (!db) return false;
  try {
    const docRef = doc(db, LEADS_COLLECTION, lead.id);
    const cleanData = sanitizeForFirestore(lead);
    await setDoc(docRef, cleanData, { merge: true });
    return true;
  } catch (error) {
    console.error('Failed to save lead to Firestore:', error);
    return false;
  }
}

/**
 * Update partial lead fields in Firestore
 */
export async function updateLeadInFirestore(id: string, updates: Partial<Lead>): Promise<boolean> {
  if (!db) return false;
  try {
    const docRef = doc(db, LEADS_COLLECTION, id);
    const cleanUpdates = sanitizeForFirestore(updates);
    await updateDoc(docRef, cleanUpdates);
    return true;
  } catch (error) {
    console.error(`Failed to update lead ${id} in Firestore:`, error);
    return false;
  }
}

/**
 * Delete a lead from Firestore
 */
export async function deleteLeadFromFirestore(id: string): Promise<boolean> {
  if (!db) return false;
  try {
    const docRef = doc(db, LEADS_COLLECTION, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error(`Failed to delete lead ${id} from Firestore:`, error);
    return false;
  }
}

/**
 * Seed initial leads to Firestore if collection is empty
 */
export async function seedFirestoreIfEmpty(initialLeads: Lead[]): Promise<boolean> {
  if (!db || !initialLeads || initialLeads.length === 0) return false;
  try {
    const existing = await fetchFirestoreLeads();
    if (existing.length === 0) {
      console.log('Seeding initial leads to Firestore for multi-device sync...');
      for (const lead of initialLeads) {
        await saveLeadToFirestore(lead);
      }
      return true;
    }
    return false;
  } catch (error) {
    console.warn('Seed Firestore notice:', error);
    return false;
  }
}
