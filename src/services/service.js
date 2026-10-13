import { randomUUID } from "crypto";
import fs from "fs/promises";

const filePath = process.env.DATA_FILE;
let queu = Promise.resolve();

const withLocke = (fn) => {
  const run = queu.then(fn);
  queu = run.catch(() => {});
  return run;
};

const readNotes = async () => {
  const text = await fs.readFile(filePath, "utf-8");
  return JSON.parse(text);
};

const writeNote = async (notes) => {
  await fs.writeFile(filePath, JSON.stringify(notes, null, 2));
};

export const getAllNotes = async () => {
  return readNotes();
};

export const getByID = async (noteId) => {
  const notes = await readNotes();
  const note = notes.find((N) => N.id === noteId);
  return note;
};

export const addNewNote = async (note) => {
  withLocke(async () => {
    const notes = await readNotes();

    const newNote = {
      id: randomUUID(),
      title: note.title,
      content: note.content,
      createdAt: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
    };

    notes.push(newNote);
    await writeNote(notes);

    return newNote;
  });
};

export const editNote = async (noteId, noteUpdate) => {
  withLocke(async () => {
    const notes = await readNotes();
    const noteIndex = notes.findIndex((N) => N.id === noteId);

    if (noteIndex === -1) return false;

    const currentNote = notes[noteIndex];

    const newNote = {
      ...currentNote,
      title: noteUpdate.title,
      content: noteUpdate.content,
      updatedAt: new Date().toISOString(),
    };

    notes[noteIndex] = newNote;
    await writeNote(notes);

    return newNote;
  });
};

export const removeNotes = async (noteID) => {
  withLocke(async () => {
    const notes = await readNotes();
    const noteIndex = notes.findIndex((N) => N.id === noteID);

    if (noteIndex < 0) {
      return false;
    }

    const [removedNote] = notes.splice(noteIndex, 1);

    await writeNote(notes);
    return removedNote;
  });
};
