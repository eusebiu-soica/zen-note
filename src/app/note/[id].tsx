import { router, useLocalSearchParams } from 'expo-router';
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

export default function EditNote() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  // Stare pentru modalul de text options
  const [textOptionsOpen, setTextOptionsOpen] = useState(false);
  
  // Stare simplă pentru a simula disponibilitatea Undo (se activează când scrii)
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

  useEffect(() => {
    const loadNote = async () => {
      const note = await StorageService.getNote(id);
      if (note) {
        setTitle(note.title);
        const htmlContent = note.content.startsWith('<') ? note.content : `<p>${note.content.replace(/\n/g, '<br>')}</p>`;
        setContent(htmlContent);
        setTimeout(() => {
          richTextEditorRef.current?.setContentHTML(htmlContent);
        }, 100);
      } else {
        router.back();
      }
    };
    loadNote();
  }, [id]);

  useEffect(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(async () => {
      if (title.trim() || content.trim()) {
        const note: Note = {
          id,
          title: title.trim(),
          content: content.trim(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await StorageService.saveNote(note);
      }
    }, 500);
    return () => { if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current); };
  }, [title, content, id]);

  const handleContentChange = (text: string) => {
    setContent(text);
    // Când conținutul se schimbă, activăm butonul Undo
    if (!canUndo) setCanUndo(true);
  };

  // Constante pentru design
  const iconColor = '#54585C';
  const iconSize = 20;

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
          <Pressable style={styles.iconButton} onPress={async () => {
            await StorageService.moveToBin(id as string);
            router.push('/home');
          }}>
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

      {/* --- TOOLBAR REGLAT --- */}
      <View style={styles.toolbar}>
        <View style={styles.toolbarRow}>
          
          <Pressable style={styles.toolButton}>
            <PenLine size={iconSize} color={iconColor} />
          </Pressable>

          <Pressable style={styles.toolButton}>
            <CheckSquare size={iconSize} color={iconColor} />
          </Pressable>

          {/* Butonul Text Options (Active State) */}
          <TextOptionsModal
            open={textOptionsOpen}
            onOpenChange={setTextOptionsOpen}
            trigger={
              <Pressable 
                style={[
                  styles.toolButton, 
                  textOptionsOpen && styles.activeToolButton // Aplică background gri când e deschis
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

          <Pressable style={styles.toolButton}>
            <Palette size={iconSize} color={iconColor} />
          </Pressable>

          <Pressable style={styles.toolButton}>
            <Text style={[styles.fontSizeText, { color: iconColor }]}>16</Text>
          </Pressable>

          {/* Buton Undo cu Logică de Culoare */}
          <Pressable 
            style={styles.toolButton} 
            onPress={() => {
              richTextEditorRef.current?.sendAction('undo', 'result')
              // Putem dezactiva vizual undo temporar sau gestiona stiva, 
              // dar momentan rămâne activ dacă ai scris ceva.
            }}
          >
            <Undo2 
              size={iconSize} 
              color={canUndo ? '#54585C' : '#DADDDF'} 
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
    // borderTopLeftRadius: 24,
    // borderTopRightRadius: 24,
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
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F3F5',
  },
  toolbarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
  },
  // --- STILURI BUTOANE ACTUALIZATE ---
  toolButton: {
    // Dimensiuni dinamice bazate pe padding
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8, // O rotunjire subtilă pentru când e selectat
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeToolButton: {
    backgroundColor: '#F0F2F5', // Fundalul gri deschis când e selectat
  },
  fontSizeText: {
    fontSize: 16,
    fontWeight: '500',
  },
});