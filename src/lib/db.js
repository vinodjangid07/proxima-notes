import Dexie from "dexie";

export const dbLocal = new Dexie("ProximaNotesDB");

dbLocal.version(1).stores({
  notes: "id, userId, createdAt, updatedAt",
  syncQueue: "++id, noteId, action, timestamp"
});

/**
 * Migration helper: If user previously had notes in localStorage, import them to Dexie.
 */
export const migrateFromLocalStorage = async () => {
  try {
    const raw = localStorage.getItem("Notes List");
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const existingCount = await dbLocal.notes.count();
      if (existingCount === 0) {
        await dbLocal.notes.bulkPut(parsed.map(n => ({
          id: n.id,
          userId: n.userId || "guest",
          title: n.title || "",
          content: n.content || "",
          createdAt: typeof n.createdAt === "string" ? n.createdAt : new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })));
      }
    }
  } catch (err) {
    console.warn("Could not import from localStorage to IndexedDB:", err);
  }
};
