type StoredReviewRecord = {
  id: string;
  companyName?: string;
  jobTitle?: string;
  jobDescription?: string;
  feedback: Feedback;
  createdAt: number;
  resumeFileName: string;
  imageFileName: string;
  resumeBlob: Blob;
  imageBlob: Blob;
};

const DB_NAME = "hirelens-local";
const DB_VERSION = 1;
const REVIEW_STORE = "reviews";

const openDb = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(REVIEW_STORE)) {
        db.createObjectStore(REVIEW_STORE, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
  });
};

const runTransaction = async <T>(
  mode: IDBTransactionMode,
  handler: (store: IDBObjectStore) => Promise<T>,
): Promise<T> => {
  const db = await openDb();
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(REVIEW_STORE, mode);
    const store = tx.objectStore(REVIEW_STORE);

    handler(store)
      .then((value) => {
        tx.oncomplete = () => {
          db.close();
          resolve(value);
        };
      })
      .catch((err) => {
        db.close();
        reject(err);
      });

    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
};

const requestToPromise = <T>(request: IDBRequest<T>): Promise<T> =>
  new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

export const saveReviewRecord = async (input: {
  id: string;
  companyName?: string;
  jobTitle?: string;
  jobDescription?: string;
  feedback: Feedback;
  resumeFile: File;
  imageFile: File;
}): Promise<void> => {
  const payload: StoredReviewRecord = {
    id: input.id,
    companyName: input.companyName,
    jobTitle: input.jobTitle,
    jobDescription: input.jobDescription,
    feedback: input.feedback,
    createdAt: Date.now(),
    resumeFileName: input.resumeFile.name,
    imageFileName: input.imageFile.name,
    resumeBlob: input.resumeFile,
    imageBlob: input.imageFile,
  };

  await runTransaction("readwrite", async (store) => {
    await requestToPromise(store.put(payload));
  });
};

export const getReviewRecord = async (
  id: string,
): Promise<StoredReviewRecord | null> => {
  return runTransaction("readonly", async (store) => {
    const row = await requestToPromise(store.get(id));
    return (row as StoredReviewRecord | undefined) ?? null;
  });
};

export const listReviewSummaries = async (): Promise<Resume[]> => {
  return runTransaction("readonly", async (store) => {
    const rows = (await requestToPromise(
      store.getAll(),
    )) as StoredReviewRecord[];

    return rows
      .sort((a, b) => b.createdAt - a.createdAt)
      .map((row) => ({
        id: row.id,
        companyName: row.companyName,
        jobTitle: row.jobTitle,
        imagePath: row.imageFileName,
        resumePath: row.resumeFileName,
        feedback: row.feedback,
      }));
  });
};

export const getReviewImageObjectUrl = async (
  id: string,
): Promise<string | null> => {
  const record = await getReviewRecord(id);
  if (!record) return null;
  return URL.createObjectURL(record.imageBlob);
};

export const getReviewPdfObjectUrl = async (
  id: string,
): Promise<string | null> => {
  const record = await getReviewRecord(id);
  if (!record) return null;

  const pdfBlob = new Blob([record.resumeBlob], { type: "application/pdf" });
  return URL.createObjectURL(pdfBlob);
};

export const clearAllReviews = async (): Promise<void> => {
  await runTransaction("readwrite", async (store) => {
    await requestToPromise(store.clear());
  });
};

export const getReviewCount = async (): Promise<number> => {
  return runTransaction("readonly", async (store) => {
    return requestToPromise(store.count());
  });
};
