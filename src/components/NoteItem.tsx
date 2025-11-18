import { router } from "expo-router";
import { Star } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radii, shadow, spacing } from "../styles/theme";
import { Note } from "../types/note";
import { Card } from "./card";
import { Checkbox } from "./checkbox";

interface NoteItemProps {
  note: Note;
  // layout: 'list' (default) or 'grid'
  layout?: 'list' | 'grid';
  // visual variant (default or recycle)
  variant?: 'default' | 'recycle';
  // optional handlers (when provided, NoteItem will call these instead of default navigation)
  onPress?: (note: Note) => void;
  onLongPress?: (note: Note) => void;
  // whether the item is in selected state
  selected?: boolean;
}

export function NoteItem({ note, layout = 'list', variant = 'default', onPress, onLongPress, selected = false }: NoteItemProps) {
  const formattedDate = new Date(note.createdAt).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  if (variant === 'recycle') {
    return (
      <Pressable
        style={[styles.container, styles.containerRecycle, selected && styles.selected]}
        onPress={() => onPress ? onPress(note) : undefined}
        onLongPress={() => onLongPress ? onLongPress(note) : undefined}
      >
        <Card style={styles.cardInner}>
          <Checkbox
            isSelected={selected}
            onSelectedChange={() => onPress ? onPress(note) : undefined}
            style={styles.checkboxOverlay}
          />

          <Card.Body>
            {note.title && <Card.Title>{note.title}</Card.Title>}
            {note.content && <Card.Description>{note.content}</Card.Description>}
            <Text style={styles.date}>{formattedDate}</Text>
          </Card.Body>
        </Card>
      </Pressable>
    );
  }

  return (
    <Pressable
      style={[styles.container, layout === 'grid' && styles.containerGrid, selected && styles.selected]}
      onPress={() => onPress ? onPress(note) : router.push({ pathname: '/note/[id]', params: { id: note.id } })}
      onLongPress={() => onLongPress ? onLongPress(note) : undefined}
    >
      <Card style={styles.cardWrapper}>
        <Card.Body>
          <View style={styles.header}>
            {note.title && <Card.Title>{note.title}</Card.Title>}
            {note.isStarred && <Star size={16} color={colors.gold} fill={colors.gold} />}
          </View>
          {note.content && <Card.Description>{note.content}</Card.Description>}
          <Text style={styles.date}>{formattedDate}</Text>
        </Card.Body>
      </Card>
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
  selected: {
    borderWidth: 2,
    borderColor: colors.primary600,
  },
  // grid variant: occupy roughly half width, with smaller margin
  containerGrid: {
    flex: 1,
    marginHorizontal: spacing.sm,
    marginBottom: spacing.md,
  },
  // recycle variant: card appearance for recycle list
  containerRecycle: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginHorizontal: spacing.sm,
    marginBottom: spacing.sm,
    borderRadius: radii.card,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  cardInner: {
    position: 'relative',
    width: '100%',
  },
  checkboxOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 2,
    width: 36,
    height: 36,
  },
  cardWrapper: {
    width: '100%',
  },
  content: {
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
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
    marginTop: 6,
  },
});
