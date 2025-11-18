import { StatusBar } from 'expo-status-bar';
import { Menu, RotateCw, Trash2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import AppSidebar from '../../components/AppSidebar';
import { Checkbox } from '../../components/checkbox';
import { NoteItem } from '../../components/NoteItem';
import { colors, spacing } from '../../styles/theme';
import { Note } from '../../types/note';
import { StorageService } from '../../utils/storage';

export default function RecycleScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [deleted, setDeleted] = useState<Note[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const loadDeleted = async () => {
    const items = await StorageService.getDeletedNotes();
    setDeleted(items);
  };

  useEffect(() => {
    loadDeleted();
  }, []);

  const handleRestore = async (ids: string[]) => {
    for (const id of ids) {
      await StorageService.restoreFromBin(id);
    }
    setSelectedIds([]);
    loadDeleted();
  };

  const handleDeletePermanently = async (ids: string[]) => {
    Alert.alert('Delete permanently', `This will remove ${ids.length} note(s) permanently.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        for (const id of ids) await StorageService.deletePermanently(id);
        setSelectedIds([]);
        loadDeleted();
      } }
    ]);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      return [...prev, id];
    });
  };

  const selectAllToggle = () => {
    if (selectedIds.length === deleted.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(deleted.map(d => d.id));
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={{
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        paddingTop: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <Pressable onPress={() => setMenuVisible(true)}>
            <Menu size={20} color="#F1F3F5" />
          </Pressable>
          <Text style={{
            color: '#F1F3F5',
            fontSize: 18,
            fontWeight: '400'
          }}>
            {`Recycle bin (${deleted.length})`}
          </Text>
        </View>

        {/* When selection is active show Select All checkbox, otherwise keep spacing */}
        {selectedIds.length > 0 ? (
          <Pressable onPress={selectAllToggle} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Checkbox
              isSelected={selectedIds.length === deleted.length}
              onSelectedChange={selectAllToggle}
              style={{ width: 36, height: 36 }}
              iconProps={{ size: 14, color: '#fff' }}
            />
            <Text style={{ color: '#F1F3F5', fontSize: 16 }}>Select all</Text>
          </Pressable>
        ) : (
          <View style={{ width: 48 }} />
        )}
      </View>
      <AppSidebar visible={menuVisible} onClose={() => setMenuVisible(false)} />

      {deleted.length === 0 ? (
        <View style={{ flex: 1, padding: spacing.md }}>
          <Text style={styles.empty}>No deleted notes.</Text>
        </View>
      ) : (
        <FlatList
          data={deleted}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: spacing.md }}
          renderItem={({ item }) => (
            <NoteItem
              note={item}
              variant="recycle"
              layout="list"
              selected={selectedIds.includes(item.id)}
              onLongPress={() => toggleSelect(item.id)}
              onPress={() => {
                // if selection mode is active, toggle selection; otherwise do nothing
                if (selectedIds.length > 0) toggleSelect(item.id);
              }}
            />
          )}
        />
      )}

      {/* Bottom action bar when items selected */}
      {selectedIds.length > 0 && (
        <View style={styles.bottomBar}>
          <Pressable style={styles.bottomAction} onPress={() => handleRestore(selectedIds)}>
            <RotateCw size={28} color={colors.primary700} />
            <Text style={styles.bottomActionText}>Restore</Text>
          </Pressable>
          <Pressable style={styles.bottomAction} onPress={() => handleDeletePermanently(selectedIds)}>
            <Trash2 size={28} color={colors.primary700} />
            <Text style={[styles.bottomActionText, styles.bottomActionTextDanger]}>Delete</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.homeBackground },
  header: {
    paddingTop: 56,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  back: { color: '#fff' },
  title: { color: '#fff', fontSize: 18 },
  empty: { padding: spacing.md, color: colors.primary500 },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardTitle: { fontWeight: '600', marginBottom: spacing.sm },
  cardPreview: { color: colors.primary500 },
  cardActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: spacing.sm, marginTop: spacing.sm },
  actionButton: { padding: spacing.sm, borderRadius: 6, backgroundColor: colors.primary100, marginRight: spacing.sm },
  actionText: { color: colors.primary800 },
  actionButtonDanger: { padding: spacing.sm, borderRadius: 6, backgroundColor: '#ffecec' },
  actionTextDanger: { color: '#b00020' },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 18,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: colors.white,
  },
  bottomAction: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 160,
  },
  bottomActionText: {
    marginTop: 8,
    fontSize: 14,
    color: colors.primary500,
  },
  bottomActionTextDanger: {
    color: '#B00020',
  }
});
