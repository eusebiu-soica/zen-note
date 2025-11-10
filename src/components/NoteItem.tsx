import { router } from "expo-router";
import { Star } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radii, shadow, spacing } from "../styles/theme";
import { Note } from "../types/note";

interface NoteItemProps {
  note: Note;
}

export function NoteItem({ note }: NoteItemProps) {
  const formattedDate = new Date(note.createdAt).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Pressable
      style={styles.container}
      onPress={() =>
        router.push({ pathname: "/note/[id]", params: { id: note.id } })
      }
    >
      <View style={styles.content}>
        <View style={styles.header}>
          {note.title && (
            <Text style={styles.title} numberOfLines={1}>
              {note.title}
            </Text>
          )}
          {note.isStarred && <Star size={16} color="#FFD700" fill="#FFD700" />}
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
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.horizontal,
    paddingVertical: spacing.md,
    ...shadow,
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
