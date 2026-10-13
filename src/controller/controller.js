import {
  getAllNotes,
  getByID,
  addNewNote,
  removeNotes,
  editNote,
} from "../services/service.js";

export class notesController {
  static validateText(title, content) {
    if (typeof title !== "string" || !title.trim() || title.length > 100) {
      return "title is required (string, 1-100 chars)";
    }
    if (
      typeof content !== "string" ||
      !content.trim() ||
      content.length > 1000
    ) {
      return "content is required (string, 1-1000 chars)";
    }
    return null;
  }

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
    return res.status(200).json(note);
  }

  static async createNote(req, res) {
    const newNote = req.body;

    const error = notesController.validateText(newNote.title, newNote.content);
    if (error) {
      return res.status(400).json({ message: error });
    }

    try {
      const note = await addNewNote(newNote);
      return res.status(201).json(note);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Note could not be created." });
    }
  }

  static async modifyNote(req, res) {
    const { noteId } = req.params;
    const note = req.body;

    const error = notesController.validateText(note.title, note.content);
    if (error) {
      return res.status(400).json({ message: error });
    }

    try {
      const newNote = await editNote(noteId, note);
      return res.status(200).json({ message: "Note updated", newNote });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Note couldn't be updated" });
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

    return res.status(200).json({ message: "Note deleted" });
  }
}
