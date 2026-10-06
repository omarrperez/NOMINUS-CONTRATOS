import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { db } from './config';
import { handleFirestoreError, OperationType } from './errorHandler';
import { Company, LaborContract, CloudDocument } from '../types/contract';

const COMPANIES_COLLECTION = 'companies';
const CONTRACTS_COLLECTION = 'contracts';
const CLOUD_DOCS_COLLECTION = 'cloudDocuments';
const SETTINGS_COLLECTION = 'settings';

// ==================== EMPRESAS ====================
export function subscribeToCompanies(
  onData: (companies: Company[]) => void,
  onError?: (err: unknown) => void
) {
  return onSnapshot(
    collection(db, COMPANIES_COLLECTION),
    (snapshot) => {
      const list: Company[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as Company);
      });
      onData(list);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, COMPANIES_COLLECTION);
    }
  );
}

export async function saveCompanyToFirestore(company: Company): Promise<void> {
  const path = `${COMPANIES_COLLECTION}/${company.id}`;
  try {
    await setDoc(doc(db, COMPANIES_COLLECTION, company.id), company);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// ==================== CONTRATOS ====================
export function subscribeToContracts(
  onData: (contracts: LaborContract[]) => void,
  onError?: (err: unknown) => void
) {
  return onSnapshot(
    collection(db, CONTRACTS_COLLECTION),
    (snapshot) => {
      const list: LaborContract[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as LaborContract);
      });
      onData(list);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, CONTRACTS_COLLECTION);
    }
  );
}

export async function saveContractToFirestore(contract: LaborContract): Promise<void> {
  const path = `${CONTRACTS_COLLECTION}/${contract.id}`;
  try {
    await setDoc(doc(db, CONTRACTS_COLLECTION, contract.id), contract);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteContractFromFirestore(contractId: string): Promise<void> {
  const path = `${CONTRACTS_COLLECTION}/${contractId}`;
  try {
    await deleteDoc(doc(db, CONTRACTS_COLLECTION, contractId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function batchSaveContractsToFirestore(contracts: LaborContract[]): Promise<void> {
  try {
    const batch = writeBatch(db);
    for (const c of contracts) {
      const ref = doc(db, CONTRACTS_COLLECTION, c.id);
      batch.set(ref, c);
    }
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, CONTRACTS_COLLECTION);
  }
}

// ==================== BÓVEDA DOCUMENTAL CLOUD ====================
export function subscribeToCloudDocuments(
  onData: (docs: CloudDocument[]) => void,
  onError?: (err: unknown) => void
) {
  return onSnapshot(
    collection(db, CLOUD_DOCS_COLLECTION),
    (snapshot) => {
      const list: CloudDocument[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as CloudDocument);
      });
      onData(list);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, CLOUD_DOCS_COLLECTION);
    }
  );
}

export async function saveCloudDocumentToFirestore(cloudDoc: CloudDocument): Promise<void> {
  const path = `${CLOUD_DOCS_COLLECTION}/${cloudDoc.id}`;
  try {
    await setDoc(doc(db, CLOUD_DOCS_COLLECTION, cloudDoc.id), cloudDoc);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteCloudDocumentFromFirestore(docId: string): Promise<void> {
  const path = `${CLOUD_DOCS_COLLECTION}/${docId}`;
  try {
    await deleteDoc(doc(db, CLOUD_DOCS_COLLECTION, docId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ==================== CONFIGURACIÓN Y TASA BCV ====================
export function subscribeToSettings(
  onData: (settings: { bcvRate?: number }) => void,
  onError?: (err: unknown) => void
) {
  return onSnapshot(
    doc(db, SETTINGS_COLLECTION, 'global'),
    (snapshot) => {
      if (snapshot.exists()) {
        onData(snapshot.data() as { bcvRate?: number });
      }
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, `${SETTINGS_COLLECTION}/global`);
    }
  );
}

export async function saveBcvRateToFirestore(rate: number): Promise<void> {
  const path = `${SETTINGS_COLLECTION}/global`;
  try {
    await setDoc(doc(db, SETTINGS_COLLECTION, 'global'), {
      id: 'global',
      bcvRate: rate,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// ==================== INICIALIZACIÓN / SEEDING ====================
export async function seedInitialFirestoreData(
  defaultCompanies: Company[],
  defaultContracts: LaborContract[],
  defaultCloudDocs: CloudDocument[],
  initialBcvRate: number
): Promise<void> {
  try {
    // Check if companies exist
    const compSnap = await getDocs(collection(db, COMPANIES_COLLECTION));
    if (compSnap.empty) {
      const batch = writeBatch(db);
      for (const comp of defaultCompanies) {
        batch.set(doc(db, COMPANIES_COLLECTION, comp.id), comp);
      }
      for (const contract of defaultContracts) {
        batch.set(doc(db, CONTRACTS_COLLECTION, contract.id), contract);
      }
      for (const cloudDoc of defaultCloudDocs) {
        batch.set(doc(db, CLOUD_DOCS_COLLECTION, cloudDoc.id), cloudDoc);
      }
      batch.set(doc(db, SETTINGS_COLLECTION, 'global'), {
        id: 'global',
        bcvRate: initialBcvRate,
        lastUpdated: new Date().toISOString()
      });
      await batch.commit();
    }
  } catch (error) {
    console.warn('Seeding check encountered error (using offline/local fallbacks if needed):', error);
  }
}
