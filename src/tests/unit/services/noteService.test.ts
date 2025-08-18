import { describe, it, expect, vi, beforeEach } from 'vitest';

import * as errorHandlerMiddleware from '../../../middlewares/errorHandlerMiddleware';
import * as noteRepository from '../../../repositories/notesRepository';
import * as noteService from '../../../services/notesServices';
import { noteFactory } from '../../factories/noteFactory';

vi.mock('../../../middlewares/errorHandlerMiddleware');
vi.mock('../../../repositories/notesRepository');

describe('Note Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  describe('createNote', () => {
    it('should create a note successfully', async () => {
      const userId = 1;
      const noteData = noteFactory.createMockNote({}, userId);

      await noteService.createNote(noteData, userId);

      expect(noteRepository.findNoteTitleByUser).toHaveBeenCalledWith(userId, noteData.title);
      expect(noteRepository.createNote).toHaveBeenCalledWith(noteData, userId);
    });

    it('should throw an error if the note title already exists', async () => {
      const userId = 1;
      const noteData = noteFactory.createMockNote({}, userId);
      const conflictError = { type: 'conflict', message: 'Note with this title already exists' };

      vi.spyOn(noteRepository, 'findNoteTitleByUser').mockResolvedValue(noteData);
      vi.spyOn(errorHandlerMiddleware, 'throwErrorMessage').mockImplementation(() => {
        throw conflictError;
      });

      await expect(noteService.createNote(noteData, userId)).rejects.toEqual(conflictError);
      expect(noteRepository.findNoteTitleByUser).toHaveBeenCalledWith(userId, noteData.title);
      expect(noteRepository.createNote).not.toHaveBeenCalled();
    });
  });

  describe('getUserNotes', () => {
    it('should return all user notes', async () => {
      const userId = 1;
      const notes = [noteFactory.createMockNote({ id: 1 }, userId), noteFactory.createMockNote({ id: 2 }, userId)];

      vi.spyOn(noteRepository, 'getUserNotes').mockResolvedValue(notes);

      const result = await noteService.getUserNotes(userId);

      expect(noteRepository.getUserNotes).toHaveBeenCalledWith(userId);
      expect(result).toEqual(notes);
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(2);
      expect(result.every((note) => note.userId === userId)).toBe(true);
    });

    it('should return an empty array if the user has no notes', async () => {
      const userId = 1;

      vi.spyOn(noteRepository, 'getUserNotes').mockResolvedValue([]);

      const result = await noteService.getUserNotes(userId);

      expect(noteRepository.getUserNotes).toHaveBeenCalledWith(userId);
      expect(result).toEqual([]);
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(0);
    });
  });

  describe('getNoteById', () => {
    it('should return a note by id', async () => {
      const userId = 1;
      const noteId = 10;
      const note = noteFactory.createMockNote({ id: noteId }, userId);

      vi.spyOn(noteRepository, 'getNoteById').mockResolvedValue(note);

      const result = await noteService.getNoteById(userId, noteId);

      expect(noteRepository.getNoteById).toHaveBeenCalledWith(noteId);
      expect(result).toEqual(note);
      expect(result).toBeInstanceOf(Object);
      expect(result.userId).toBe(userId);
      expect(result.id).toBe(noteId);
    });

    it('should throw an error if the note does not exist', async () => {
      const userId = 1;
      const noteId = 999;
      const notFoundError = { type: 'not_found', message: "Note doesn't exist" };

      vi.spyOn(noteRepository, 'getNoteById').mockResolvedValue(null);
      vi.spyOn(errorHandlerMiddleware, 'throwErrorMessage').mockImplementation(() => {
        throw notFoundError;
      });

      await expect(noteService.getNoteById(userId, noteId)).rejects.toEqual(notFoundError);
      expect(noteRepository.getNoteById).toHaveBeenCalledWith(noteId);
    });

    it('should throw an error if the note does not belong to the user', async () => {
      const userId = 1;
      const ownerId = 2;
      const noteId = 10;
      const note = noteFactory.createMockNote({ id: noteId }, ownerId);
      const forbiddenError = { type: 'forbidden', message: "You don't have the permission to see this note" };

      vi.spyOn(noteRepository, 'getNoteById').mockResolvedValue(note);
      vi.spyOn(errorHandlerMiddleware, 'throwErrorMessage').mockImplementation(() => {
        throw forbiddenError;
      });

      await expect(noteService.getNoteById(userId, noteId)).rejects.toEqual(forbiddenError);
      expect(noteRepository.getNoteById).toHaveBeenCalledWith(noteId);
    });
  });

  describe('updateNote', () => {
    it('should update a note successfully', async () => {
      const userId = 1;
      const noteId = 10;
      const note = noteFactory.createMockNote({}, userId);

      vi.spyOn(noteRepository, 'getNoteById').mockResolvedValue(note);

      await noteService.updateNote(userId, noteId, note);

      expect(noteRepository.getNoteById).toHaveBeenCalledWith(noteId);
      expect(noteRepository.updateNote).toHaveBeenCalledWith(noteId, note);
    });

    it('should throw an error if the note does not exist', async () => {
      const userId = 1;
      const noteId = 999;
      const note = noteFactory.createMockNote({}, userId);
      const notFoundError = { type: 'not_found', message: "Note doesn't exist" };

      vi.spyOn(noteRepository, 'getNoteById').mockResolvedValue(null);
      vi.spyOn(errorHandlerMiddleware, 'throwErrorMessage').mockImplementation(() => {
        throw notFoundError;
      });

      await expect(noteService.updateNote(userId, noteId, note)).rejects.toEqual(notFoundError);
      expect(noteRepository.getNoteById).toHaveBeenCalledWith(noteId);
      expect(noteRepository.updateNote).not.toHaveBeenCalled();
    });

    it('should throw an error if the note does not belong to the user', async () => {
      const userId = 1;
      const ownerId = 2;
      const noteId = 10;
      const note = noteFactory.createMockNote({ id: noteId }, ownerId);
      const forbiddenError = { type: 'forbidden', message: "You don't have the permission to update this note" };

      vi.spyOn(noteRepository, 'getNoteById').mockResolvedValue(note);
      vi.spyOn(errorHandlerMiddleware, 'throwErrorMessage').mockImplementation(() => {
        throw forbiddenError;
      });

      await expect(noteService.updateNote(userId, noteId, note)).rejects.toEqual(forbiddenError);
      expect(noteRepository.getNoteById).toHaveBeenCalledWith(noteId);
      expect(noteRepository.updateNote).not.toHaveBeenCalled();
    });
  });

  describe('deleteNote', () => {
    it('should delete a note successfully', async () => {
      const userId = 1;
      const noteId = 10;
      const note = noteFactory.createMockNote({}, userId);

      vi.spyOn(noteRepository, 'getNoteById').mockResolvedValue(note);

      await noteService.deleteNote(userId, noteId);

      expect(noteRepository.getNoteById).toHaveBeenCalledWith(noteId);
      expect(noteRepository.deleteNote).toHaveBeenCalledWith(noteId);
    });

    it('should throw an error if the note does not exist', async () => {
      const userId = 1;
      const noteId = 999;
      const notFoundError = { type: 'not_found', message: "Note doesn't exist" };

      vi.spyOn(noteRepository, 'getNoteById').mockResolvedValue(null);
      vi.spyOn(errorHandlerMiddleware, 'throwErrorMessage').mockImplementation(() => {
        throw notFoundError;
      });

      await expect(noteService.deleteNote(userId, noteId)).rejects.toEqual(notFoundError);
      expect(noteRepository.getNoteById).toHaveBeenCalledWith(noteId);
      expect(noteRepository.deleteNote).not.toHaveBeenCalled();
    });

    it('should throw an error if the note does not belong to the user', async () => {
      const userId = 1;
      const ownerId = 2;
      const noteId = 10;
      const note = noteFactory.createMockNote({ id: noteId }, ownerId);
      const forbiddenError = { type: 'forbidden', message: "You don't have the permission to delete this note" };

      vi.spyOn(noteRepository, 'getNoteById').mockResolvedValue(note);
      vi.spyOn(errorHandlerMiddleware, 'throwErrorMessage').mockImplementation(() => {
        throw forbiddenError;
      });

      await expect(noteService.deleteNote(userId, noteId)).rejects.toEqual(forbiddenError);
      expect(noteRepository.getNoteById).toHaveBeenCalledWith(noteId);
      expect(noteRepository.deleteNote).not.toHaveBeenCalled();
    });
  });
});
