import { router } from "expo-router";
import { Star } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radii, shadow, spacing } from "../styles/theme";
import { Note } from "../types/note";

interface NoteItemProps {
  note: Note;
  // layout: 'list' (default) or 'grid'
  layout?: 'list' | 'grid';
}

export function NoteItem({ note, layout = 'list' }: NoteItemProps) {
  const formattedDate = new Date(note.createdAt).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Pressable 
      style={[styles.container, layout === 'grid' && styles.containerGrid]}
      onPress={() => router.push({ pathname: '/note/[id]', params: { id: note.id } })}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          {note.title && (
            <Text style={styles.title} numberOfLines={1}>
              {note.title}
            </Text>
          )}
          {note.isStarred && <Star size={16} color={colors.gold} fill={colors.gold} />}
        </View>
        {note.content && (
          <Text style={styles.preview} numberOfLines={2}>
            {note.content}
          </Text>
        )}
        <Text style={styles.date}>{formattedDate}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: radii.card,
    // list-style card: full width with horizontal margins
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.horizontal,
    paddingVertical: spacing.md,
    ...shadow,
  },
  // grid variant: occupy roughly half width, with smaller margin
  containerGrid: {
    flex: 1,
    marginHorizontal: spacing.sm,
    marginBottom: spacing.md,
  },
  content: {
    gap: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary900,
    flex: 1,
  },
  preview: {
    fontSize: 14,
    color: colors.primary500,
    lineHeight: 20,
  },
  date: {
    fontSize: 12,
    color: colors.primary400,
    marginTop: 4,
  },
});
