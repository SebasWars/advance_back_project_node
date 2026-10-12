import {
  getAllNotes,
  getByID,
  addNewNote,
  removeNotes,
  editNote,
} from "../HTTP/services/service.js";

export class notesController {
  static async getNotes(req, res) {
    const readNotes = await getAllNotes();
    return res.status(200).json(readNotes);
  }

  static async getNoteByID(req, res) {
    const { noteId } = req.params;

    if (!noteId) {
      return res.status(400).json({ message: "Note ID is invalid." });
    }

    const note = await getByID(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }
    return res.status(302).json(note);
  }

  static async createNote(req, res) {
    const newNote = req.body;

    if (
      !newNote.title.trim() ||
      newNote.title.length > 100 ||
      !newNote.content.trim() ||
      newNote.content.length > 1000
    ) {
      return res.status(400).json({ message: "Note data can't be empty." });
    }

    try {
      const note = await addNewNote(newNote);
      return res.status(201).json(note);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: "Note could not be created." });
    }
  }

  static async modifyNote(req, res) {
    const { id } = req.params;
    const note = req.body;

    if (!note.title.trim() || !note.content.trim()) {
      return res.status(400).json({
        message: "It's not valid to update data with empty informacion.",
      });
    }

    try {
      const newNote = await editNote(id, note);
      return res.status(200).json({ message: "Note updated", newNote });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: "Note couldn't be updated" });
    }
  }

  static async deleteNote(req, res) {
    const { noteId } = req.params;

    if (!noteId) {
      return res.status(400).json({ message: "Invalid id." });
    }
    const noteDeleted = await removeNotes(noteId);

    if (!noteDeleted) {
      return res
        .status(404)
        .json({ message: "Note do not exist in the data base." });
    }

    return res.status(204).json({ message: "Note deleted" });
  }
}
