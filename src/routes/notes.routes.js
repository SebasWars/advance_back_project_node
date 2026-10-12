import { Router } from "express";
import { notesController } from "../controller/controller.js";

export const notes = Router();

notes.get("/", notesController.getNotes);
notes.get("/:noteId", notesController.getNoteByID);
notes.post("/", notesController.createNote);
notes.put("/:id", notesController.modifyNote);
notes.delete("/:noteId", notesController.deleteNote);
