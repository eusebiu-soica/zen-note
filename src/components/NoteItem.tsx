import { router } from "expo-router";
import { Star } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radii, shadow, spacing } from "../styles/theme";
import { Note } from "../types/note";
import { Card } from "./card";
import { Checkbox } from "./checkbox";

const stripHtml = (html: string): string => {
  if (!html) return '';
  let text = html.replace(/<[^>]*>/g, '');
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  text = text.replace(/\s+/g, ' ').trim();
  return text;
};

interface NoteItemProps {
  note: Note;
  layout?: 'list' | 'grid';
  variant?: 'default' | 'recycle';
  onPress?: (note: Note) => void;
  onLongPress?: (note: Note) => void;
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
        style={[styles.containerRecycle, selected && styles.selected]}
        onPress={() => onPress ? onPress(note) : undefined}
        onLongPress={() => onLongPress ? onLongPress(note) : undefined}
      >
        <Card style={styles.cardInner}>
          <Checkbox
            isSelected={selected}
            onSelectedChange={() => onPress ? onPress(note) : undefined}
            style={styles.checkboxOverlay}
          />

          <Card.Body className="rounded-none">
            {note.title && (
              <Card.Title numberOfLines={1} ellipsizeMode="tail">
                {stripHtml(note.title)}
              </Card.Title>
            )}
            {note.content.trim() !== '' && (
              <Card.Description numberOfLines={3} ellipsizeMode="tail">
                {stripHtml(note.content)}
              </Card.Description>
            )}
            <Text style={styles.date}>{formattedDate}</Text>
          </Card.Body>
        </Card>
      </Pressable>
    );
  }

  const plainTextContent = note.content ? stripHtml(note.content) : '';
  const plainTextTitle = note.title ? stripHtml(note.title) : '';

  return (
    <Pressable
      // 1. Am scos padding-ul de pe containerul exterior
      style={[styles.container, layout === 'grid' && styles.containerGrid, selected && styles.selected]}
      onPress={() => onPress ? onPress(note) : router.push({ pathname: '/note/[id]', params: { id: note.id } })}
      onLongPress={() => onLongPress ? onLongPress(note) : undefined}
    >
      <Card style={styles.cardWrapper} className="p-0">
        {/* 2. Am aplicat padding-ul direct pe Card.Body via style={styles.cardBody} */}
        <Card.Body style={styles.cardBody} className="">
          <View style={styles.contentWrapper}>
            <View style={styles.header}>
              {plainTextTitle ? (
                <Card.Title 
                  style={styles.title} 
                  numberOfLines={1} 
                  ellipsizeMode="tail"
                >
                  {plainTextTitle}
                </Card.Title>
              ) : (
                 // Hack mic: Renderăm un View gol dacă nu e titlu ca să păstrăm alinierea
                 <View style={{flex:1}} />
              )}
              {note.isStarred && <Star size={16} color={colors.gold} fill={colors.gold} />}
            </View>
            
            {plainTextContent ? (
              <Card.Description 
                style={styles.description} 
                numberOfLines={3} 
                ellipsizeMode="tail"
              >
                {plainTextContent}
              </Card.Description>
            ) : null}
          </View>
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
    marginHorizontal: spacing.md,
    marginBottom: 24,
    // !!! IMPORTANT: Am scos paddingHorizontal și paddingVertical de aici
    ...shadow,
  },
  selected: {
    borderWidth: 2,
    borderColor: colors.primary600,
  },
  containerGrid: {
    flex: 1,
    marginHorizontal: spacing.sm,
    marginBottom: 24,
  },
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
    padding: 0,
    backgroundColor: 'transparent', // Asigură-te că wrapper-ul e transparent
  },
  cardBody: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderRadius: 0,
    minHeight: 100,
    // !!! IMPORTANT: Am mutat padding-ul AICI, în interior
    paddingHorizontal: 16, 
    paddingVertical: 20, 
  },
  contentWrapper: {
    flex: 1,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
  },
  description: {
    marginTop: 0,
    width: '100%',
    // lineHeight-ul ajută uneori la evitarea tăierii textului pe Android
    lineHeight: 22, 
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.primary900,
    flex: 1,
    marginRight: 8,
    minWidth: 0,
  },
  date: {
    fontSize: 12,
    color: colors.primary400,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
});