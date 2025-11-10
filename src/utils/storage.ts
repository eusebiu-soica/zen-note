import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note } from '../types/note';

const NOTES_KEY = '@zen-note/notes';

export const StorageService = {
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