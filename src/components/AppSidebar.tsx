import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Animated, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../styles/theme';
import { useTheme } from '../styles/ThemeProvider';
import { StorageService } from '../utils/storage';
import { Button } from './button';
import { Switch } from './switch';

interface AppSidebarProps {
  visible: boolean;
  onClose: () => void;
  onToggleTheme?: () => void;
  currentTheme?: 'light' | 'dark';
  onLanguageChange?: (lang: string) => void;
  language?: string;
}

export function AppSidebar({ visible, onClose, onToggleTheme, currentTheme = 'light', onLanguageChange, language = 'EN' }: AppSidebarProps) {
  const [notesCount, setNotesCount] = useState(0);
  const [deletedCount, setDeletedCount] = useState(0);
  const [anim] = useState(() => new Animated.Value(0));
  const [themeSwitch, setThemeSwitch] = useState(currentTheme === 'dark');

  useEffect(() => {
    const loadCounts = async () => {
      const notes = await StorageService.getNotes();
      const deleted = await StorageService.getDeletedCount();
      setNotesCount(notes.length);
      setDeletedCount(deleted);
    };
    if (visible) loadCounts();
  }, [visible]);

  useEffect(() => {
    Animated.timing(anim, {
      toValue: visible ? 1 : 0,
      duration: 240,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [-320, 0] });

  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setThemeSwitch(theme === 'dark');
  }, [theme]);

  const handleThemeToggle = () => {
    toggleTheme();
  };

  const handleLanguageToggle = () => {
    const next = language === 'EN' ? 'RO' : 'EN';
    onLanguageChange?.(next);
  };

  // Attempt to use HeroUI Native Drawer if available, otherwise fallback to Modal + Animated
  let HeroUIDrawer: any = null;
  try {
    // require at runtime so bundler doesn't fail if the named export doesn't exist
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const heroui = require('heroui-native');
    HeroUIDrawer = heroui?.Drawer || heroui?.Sheet || heroui?.Sidebar || null;
  } catch (e) {
    HeroUIDrawer = null;
  }

  const content = (
    <View>
      <Text style={styles.title}>ZenNote</Text>

      <Pressable style={styles.row} onPress={() => { router.push('/home'); onClose(); }}>
        <Text style={styles.rowLabel}>My notes</Text>
        <Text style={styles.rowCount}>{notesCount}</Text>
      </Pressable>

      <Pressable style={styles.row} onPress={() => { router.push('/recycle'); onClose(); }}>
        <Text style={styles.rowLabel}>Recycle bin</Text>
        <Text style={styles.rowCount}>{deletedCount}</Text>
      </Pressable>

      <View style={styles.separator} />

      <View style={styles.rowControl}>
        <Text style={styles.rowLabel}>Theme</Text>
        <Switch isSelected={themeSwitch} onSelectedChange={handleThemeToggle} />
      </View>

      <View style={styles.rowControl}>
        <Text style={styles.rowLabel}>Language</Text>
        <Button variant="secondary" size="sm" onPress={handleLanguageToggle} style={styles.langButton}>
          {language}
        </Button>
      </View>
    </View>
  );

  if (HeroUIDrawer) {
    try {
      // Try rendering HeroUI drawer component with common props
      const DrawerComp: any = HeroUIDrawer;
      return (
        <DrawerComp open={visible} onClose={onClose}>
          <View style={{ padding: spacing.lg }}>{content}</View>
        </DrawerComp>
      );
    } catch (e) {
      // fallthrough to modal fallback if render fails
    }
  }

  return (
    <Modal visible={visible} transparent animationType="none">
      <Pressable style={styles.backdrop} onPress={onClose} />

      <Animated.View style={[styles.drawer, { transform: [{ translateX }] }] }>
        {content}
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)'
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 320,
    paddingTop: 56,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: spacing.lg,
    color: colors.primary800,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  rowControl: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  rowLabel: {
    fontSize: 16,
    color: colors.primary800,
  },
  rowCount: {
    fontSize: 14,
    color: colors.primary600,
  },
  separator: {
    height: 1,
    backgroundColor: colors.primary100,
    marginVertical: spacing.md,
  },
  langButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.primary200,
  },
  langText: {
    color: colors.primary800,
  }
});

export default AppSidebar;
