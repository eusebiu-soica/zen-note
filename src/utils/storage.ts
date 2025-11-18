import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note } from '../types/note';

const NOTES_KEY = '@zen-note/notes';
const DELETED_KEY = '@zen-note/deleted';

export const StorageService = {
  // Deleted / recycle bin helpers
  async getDeletedNotes(): Promise<Note[]> {
    try {
      const notes = await AsyncStorage.getItem(DELETED_KEY);
      return notes ? JSON.parse(notes) : [];
    } catch (error) {
      console.error('Error getting deleted notes:', error);
      return [];
    }
  },

  async getDeletedCount(): Promise<number> {
    const notes = await this.getDeletedNotes();
    return notes.length;
  },

  // Move a note to recycle bin (keeps a record in DELETED_KEY)
  async moveToBin(noteId: string): Promise<void> {
    try {
      const notes = await this.getNotes();
      const idx = notes.findIndex(n => n.id === noteId);
      if (idx >= 0) {
        const [removed] = notes.splice(idx, 1);
        // save updated notes list
        await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));

        // add to deleted list
        const deleted = await this.getDeletedNotes();
        deleted.unshift(removed);
        await AsyncStorage.setItem(DELETED_KEY, JSON.stringify(deleted));
      }
    } catch (error) {
      console.error('Error moving note to bin:', error);
    }
  },
  
  async restoreFromBin(noteId: string): Promise<void> {
    try {
      const deleted = await this.getDeletedNotes();
      const idx = deleted.findIndex(n => n.id === noteId);
      if (idx >= 0) {
        const [restored] = deleted.splice(idx, 1);
        await AsyncStorage.setItem(DELETED_KEY, JSON.stringify(deleted));

        const notes = await this.getNotes();
        notes.unshift(restored);
        await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
      }
    } catch (error) {
      console.error('Error restoring note from bin:', error);
    }
  },
  
  async deletePermanently(noteId: string): Promise<void> {
    try {
      const deleted = await this.getDeletedNotes();
      const remaining = deleted.filter(n => n.id !== noteId);
      await AsyncStorage.setItem(DELETED_KEY, JSON.stringify(remaining));
    } catch (error) {
      console.error('Error permanently deleting note:', error);
    }
  },
  async getNote(id: string): Promise<Note | null> {
    try {
      const notes = await this.getNotes();
      return notes.find(note => note.id === id) || null;
    } catch (error) {
      console.error('Error getting note:', error);
      return null;
    }
  },

  async getNotes(): Promise<Note[]> {
    try {
      const notes = await AsyncStorage.getItem(NOTES_KEY);
      return notes ? JSON.parse(notes) : [];
    } catch (error) {
      console.error('Error getting notes:', error);
      return [];
    }
  },

  async saveNote(note: Note): Promise<void> {
    try {
      const notes = await this.getNotes();
      const existingNoteIndex = notes.findIndex(n => n.id === note.id);
      
      if (existingNoteIndex >= 0) {
        notes[existingNoteIndex] = note;
      } else {
        notes.unshift(note); // Add new note at the beginning
      }

      await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error('Error saving note:', error);
    }
  },

  async deleteNote(noteId: string): Promise<void> {
    try {
      const notes = await this.getNotes();
      const filteredNotes = notes.filter(note => note.id !== noteId);
      await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(filteredNotes));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  },

  async toggleStarNote(noteId: string): Promise<void> {
    try {
      const notes = await this.getNotes();
      const noteIndex = notes.findIndex(note => note.id === noteId);
      if (noteIndex >= 0) {
        notes[noteIndex].isStarred = !notes[noteIndex].isStarred;
        await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
      }
    } catch (error) {
      console.error('Error starring note:', error);
    }
  }
};