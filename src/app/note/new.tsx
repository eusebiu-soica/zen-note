import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  CheckSquare,
  ChevronLeft,
  MoreVertical,
  Palette,
  PenLine,
  Plus,
  Star,
  Trash2,
  Type,
  Undo2
} from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { RichEditor } from 'react-native-pell-rich-editor';
import { colors } from '../../../themes/colors';
import { TextOptionsModal } from '../../components/TextOptionsModal';
import { Note } from '../../types/note';
import { StorageService } from '../../utils/storage';

export default function NewNote() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [noteId] = useState(() => Math.random().toString(36).substring(7));
   
  // Stare pentru modalul de text options
  const [textOptionsOpen, setTextOptionsOpen] = useState(false);
   
  // Stare pentru a simula disponibilitatea Undo
  const [canUndo, setCanUndo] = useState(false);

  const [textAlignment, setTextAlignment] = useState<'left' | 'center' | 'right'>('left');
  const [textFormats, setTextFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
  });
  const [editorReady, setEditorReady] = useState(false);
  const richTextEditorRef = useRef<RichEditor>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const applyCommand = (action: string, formatKey?: keyof typeof textFormats, needsKeyboard: boolean = true) => {
    if (!editorReady || !richTextEditorRef.current) return;
     
    if (needsKeyboard) {
      richTextEditorRef.current.focusContentEditor();
    }
     
    setTimeout(() => {
      if (action === 'strikeThrough') {
          const isCurrentlyActive = textFormats.strikethrough;
        if (isCurrentlyActive) {
           richTextEditorRef.current?.commandDOM(`(function(){ document.execCommand('strikeThrough', false, null); })()`);
        } else {
           richTextEditorRef.current?.commandDOM(`document.execCommand('strikeThrough', false, null)`);
        }
      } else {
        // @ts-ignore
        richTextEditorRef.current?.sendAction(action, 'result');
      }
       
      if (formatKey) {
        setTextFormats(prev => ({ ...prev, [formatKey]: !prev[formatKey] }));
      }
       
      if (!needsKeyboard) {
        setTimeout(() => {
          richTextEditorRef.current?.blurContentEditor();
        }, 150);
      }
    }, needsKeyboard ? 100 : 50);
  };

  // Auto focus the editor when component mounts
  useEffect(() => {
    const focusTimeout = setTimeout(() => {
      richTextEditorRef.current?.focusContentEditor();
    }, 300);
    return () => clearTimeout(focusTimeout);
  }, []);

  // Auto save when title or content changes
  useEffect(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
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
    return () => { if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current); };
  }, [title, content, noteId]);

  const handleContentChange = (text: string) => {
    setContent(text);
    // Când conținutul se schimbă, activăm butonul Undo
    if (!canUndo) setCanUndo(true);
  };

  // --- CONSTANTE DE DESIGN ACTUALIZATE ---
  const iconColor = '#54585C'; // Culoarea standard
  const iconSize = 20;         // Dimensiunea exacta
  const undoInactiveColor = '#DADDDF'; // Culoare undo inactiv

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <StatusBar style="light" />
       
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => router.back()}>
            <ChevronLeft size={24} color="#F1F3F5" />
          </Pressable>
          <TextInput
            placeholder="Title"
            placeholderTextColor="rgba(241, 243, 245, 0.5)"
            value={title}
            onChangeText={setTitle}
            style={styles.titleInput}
          />
        </View>

        <View style={styles.headerRight}>
          <Pressable style={styles.iconButton}><Star size={22} color="#F1F3F5" /></Pressable>
          <Pressable style={styles.iconButton}>
            <Trash2 size={22} color="#F1F3F5" />
          </Pressable>
          <Pressable style={styles.iconButton}><Plus size={22} color="#F1F3F5" /></Pressable>
          <Pressable style={styles.iconButton}><MoreVertical size={22} color="#F1F3F5" /></Pressable>
        </View>
      </View>

      <View style={styles.content}>
        <RichEditor
          ref={richTextEditorRef}
          initialContentHTML={content || ''}
          onChange={handleContentChange}
          editorInitializedCallback={() => setEditorReady(true)}
          editorStyle={{
            contentCSSText: `font-family: 'OpenSans-Regular'; font-size: 16px; line-height: 24px; color: #333;`,
            backgroundColor: 'transparent',
          }}
          style={styles.richEditor}
          placeholder="Start typing..."
          useContainer={false}
        />
      </View>

      {/* --- TOOLBAR REGLAT CONFORM SPECIFICATILOR --- */}
      <View style={styles.toolbar}>
        <View style={styles.toolbarRow}>
           
          {/* 1. Pen */}
          <Pressable style={styles.toolButton}>
            <PenLine size={iconSize} color={iconColor} />
          </Pressable>

          {/* 2. Checkbox */}
          <Pressable style={styles.toolButton}>
            <CheckSquare size={iconSize} color={iconColor} />
          </Pressable>

          {/* 3. Text Options (T) */}
          <TextOptionsModal
            open={textOptionsOpen}
            onOpenChange={setTextOptionsOpen}
            trigger={
              <Pressable 
                style={[
                  styles.toolButton, 
                  textOptionsOpen && styles.activeToolButton // Background activ
                ]}
              >
                <Type size={iconSize} color={iconColor} />
              </Pressable>
            }
            selectedAlignment={textAlignment}
            selectedFormats={textFormats}
            onAlignLeft={() => { setTextAlignment('left'); applyCommand('justifyLeft', undefined, false); }}
            onAlignCenter={() => { setTextAlignment('center'); applyCommand('justifyCenter', undefined, false); }}
            onAlignRight={() => { setTextAlignment('right'); applyCommand('justifyRight', undefined, false); }}
            onIndentRight={() => applyCommand('indent', undefined, false)}
            onIndentLeft={() => applyCommand('outdent', undefined, false)}
            onBold={() => applyCommand('bold', 'bold')}
            onItalic={() => applyCommand('italic', 'italic')}
            onUnderline={() => applyCommand('underline', 'underline')}
            onStrikethrough={() => applyCommand('strikeThrough', 'strikethrough')}
            onBulletList={() => applyCommand('unorderedList')}
            onNumberedList={() => applyCommand('orderedList')}
          />

          {/* 4. Palette */}
          <Pressable style={styles.toolButton}>
            <Palette size={iconSize} color={iconColor} />
          </Pressable>

          {/* 5. Font Size */}
          <Pressable style={styles.toolButton}>
            <Text style={[styles.fontSizeText, { color: iconColor }]}>16</Text>
          </Pressable>

          {/* 6. Undo */}
          <Pressable 
            style={styles.toolButton} 
            onPress={() => {
              // @ts-ignore - sendAction exists but types might not be perfect
              richTextEditorRef.current?.sendAction('undo', 'result');
            }}
          >
            <Undo2 
              size={iconSize} 
              color={canUndo ? iconColor : undoInactiveColor}
            /> 
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
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: colors.primary,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: '500',
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
    overflow: 'hidden',
    paddingHorizontal: 16, 
    paddingTop: 10,
  },
  richEditor: {
    flex: 1,
    minHeight: 200,
  },
  toolbar: {
    backgroundColor: '#fff',
    paddingHorizontal: 16, // Padding lateral general al barei
    paddingVertical: 5,
    paddingBottom: Platform.OS === 'ios' ? 28 : 5,
    borderTopWidth: 1,
    borderTopColor: '#F1F3F5',
  },
  toolbarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
  },
  // --- STILURI BUTOANE ACTUALIZATE PENTRU DIMENSIUNI FIXE ---
  toolButton: {
    paddingVertical: 6,   // Padding sus-jos cerut
    paddingHorizontal: 12, // Padding stanga-dreapta cerut
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeToolButton: {
    backgroundColor: '#F0F2F5', // Culoarea de selectie
  },
  fontSizeText: {
    fontSize: 16,
    fontWeight: '500',
  },
});