import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  ChevronLeft,
  MoreVertical,
  Pen,
  Plus,
  RotateCcw,
  Smile,
  Square,
  Star,
  Trash2,
  Type
} from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../../../themes/colors';
import { Note } from '../../types/note';
import { StorageService } from '../../utils/storage';

export default function NewNote() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [noteId] = useState(() => Math.random().toString(36).substring(7));
  const noteInputRef = useRef<TextInput>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Auto focus the note input when component mounts
  useEffect(() => {
    const focusTimeout = setTimeout(() => {
      noteInputRef.current?.focus();
    }, 100);

    return () => clearTimeout(focusTimeout);
  }, []);

  // Auto save when title or content changes
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      if (title.trim() || content.trim()) {
        const note: Note = {
          id: noteId,
          title: title.trim(),
          content: content.trim(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await StorageService.saveNote(note);
      }
    }, 500);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [title, content, noteId]);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        {/* Left section */}
        <View style={styles.headerLeft}>
          <Pressable onPress={() => {
            // Clear any pending auto-save
            if (saveTimeoutRef.current) {
              clearTimeout(saveTimeoutRef.current);
            }
            // Save immediately if there's content
            if (title.trim() || content.trim()) {
              const note: Note = {
                id: noteId,
                title: title.trim(),
                content: content.trim(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
              StorageService.saveNote(note).then(() => router.back());
            } else {
              router.back();
            }
          }}>
            <ChevronLeft size={22} color="#F1F3F5" />
          </Pressable>
          <TextInput
            placeholder="Title"
            placeholderTextColor="rgba(241, 243, 245, 0.5)"
            value={title}
            onChangeText={setTitle}
            style={styles.titleInput}
          />
        </View>

        {/* Right section */}
        <View style={styles.headerRight}>
          <Pressable style={styles.iconButton}>
            <Star size={20} color="#F1F3F5" />
          </Pressable>
          <Pressable style={styles.iconButton}>
            <Trash2 size={20} color="#F1F3F5" />
          </Pressable>
          <Pressable style={styles.iconButton}>
            <Plus size={20} color="#F1F3F5" />
          </Pressable>
          <Pressable style={styles.iconButton}>
            <MoreVertical size={20} color="#F1F3F5" />
          </Pressable>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <TextInput
          ref={noteInputRef}
          multiline
          placeholderTextColor="#666"
          value={content}
          onChangeText={setContent}
          style={styles.noteInput}
        />
      </View>

      {/* Bottom Toolbar */}
      <View style={styles.toolbar}>
        <View style={styles.toolbarRow}>
          <Pressable style={styles.toolButton}>
            <Pen size={20} color="#666" />
          </Pressable>
          <Pressable style={styles.toolButton}>
            <Square size={20} color="#666" />
          </Pressable>
          <Pressable style={styles.toolButton}>
            <Type size={20} color="#666" />
          </Pressable>
          <Pressable style={styles.toolButton}>
            <Smile size={20} color="#666" />
          </Pressable>
          <View style={styles.fontSizeContainer}>
            <Text style={styles.fontSize}>16</Text>
            <Text style={styles.fontSizeArrow}>▼</Text>
          </View>
          <Pressable style={styles.toolButton}>
            <RotateCcw size={20} color="#666" />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 60,
    backgroundColor: colors.primary,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  titleInput: {
    fontSize: 18,
    color: '#F1F3F5',
    flex: 1,
    padding: 0,
  },
  iconButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  noteInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    textAlignVertical: 'top',
    padding: 0,
  },
  toolbar: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingHorizontal: 16,
    paddingVertical: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  toolbarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
  },
  toolButton: {
    padding: 8,
  },
  fontSizeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 8,
  },
  fontSize: {
    fontSize: 16,
    color: '#666',
  },
  fontSizeArrow: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
});