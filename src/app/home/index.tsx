import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
    Grid2x2,
    Menu,
    Plus,
    Search,
    Star,
    Tag
} from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, Image, Pressable, ScrollView, Text, View } from 'react-native';
import AppSidebar from '../../components/AppSidebar';
import { NoteItem } from '../../components/NoteItem';
import { colors, spacing } from '../../styles/theme';
import { Note } from '../../types/note';
import { StorageService } from '../../utils/storage';


export default function NotesScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [menuVisible, setMenuVisible] = useState(false);

  const loadNotes = async () => {
    const storedNotes = await StorageService.getNotes();
    // Sort by most recently updated (fallback to createdAt) so recent notes appear first
    const sorted = [...storedNotes].sort((a, b) => {
      const aTime = new Date(a.updatedAt || a.createdAt).getTime();
      const bTime = new Date(b.updatedAt || b.createdAt).getTime();
      return bTime - aTime;
    });
    setNotes(sorted);
  };

  // Load notes when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadNotes();
    }, [])
  );
  return (
    <View style={{ flex: 1, backgroundColor: colors.primary }}>
      <StatusBar style="light" />
      
      {/* Custom Header - positioned right under status bar */}
      <View style={{
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        paddingTop: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Left section */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <Pressable onPress={() => setMenuVisible(true)}>
            <Menu size={20} color="#F1F3F5" />
          </Pressable>
          <Text style={{
            color: '#F1F3F5',
            fontSize: 18,
            fontWeight: '400'
          }}>
            My Notes
          </Text>
        </View>

        {/* Right section */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
          <Pressable>
            <Search size={20} color="#F1F3F5" />
          </Pressable>
          <Pressable>
            <Tag size={20} color="#F1F3F5" />
          </Pressable>
          <Pressable>
            <Star size={20} color="#F1F3F5" />
          </Pressable>
          <Pressable onPress={() => setViewMode(v => v === 'list' ? 'grid' : 'list')}>
            <Grid2x2 size={20} color={viewMode === 'grid' ? colors.primary100 : '#F1F3F5'} />
          </Pressable>
        </View>
      </View>

  {/* Main Content */}
  <View style={{ flex: 1, backgroundColor: colors.homeBackground }}>
        {notes.length === 0 ? (
          // Empty State
          <View style={{ 
            flex: 1, 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <View style={{ 
              width: 133, 
              height: 100, 
            }}>
              <Image
                source={require('../../../assets/images/empty-state.png')}
                style={{ 
                  width: 133, 
                  height: 133 
                }}
              />
            </View>
          </View>
        ) : (
          // Notes List or Grid
          viewMode === 'list' ? (
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingVertical: spacing.lg, paddingHorizontal: spacing.sm }}>
              {notes.map(note => (
                <NoteItem key={note.id} note={note} layout="list" />
              ))}
            </ScrollView>
          ) : (
            <FlatList
              data={notes}
              numColumns={2}
              key="grid"
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingVertical: spacing.lg, paddingHorizontal: spacing.sm }}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
              renderItem={({ item }) => <NoteItem key={item.id} note={item} layout="grid" />}
            />
          )
        )}

        {/* FAB */}
      <Pressable
        onPress={() => router.push('/note/new')}
        style={{
          position: 'absolute',
          bottom: 24,
          right: 24,
          backgroundColor: colors.primary,
          width: 56,
          height: 56,
          borderRadius: 28,
          alignItems: 'center',
          justifyContent: 'center',
          elevation: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
        }}
      >
        <Plus size={24} color="#F1F3F5" />
      </Pressable>
      <AppSidebar visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </View>
    </View>
  );
}