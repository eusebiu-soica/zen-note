import { Stack } from "expo-router";
import { HeroUINativeProvider } from '../providers/hero-ui-native/provider';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '../../global.css';
import ThemeProvider from '../styles/ThemeProvider';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <ThemeProvider>
        <HeroUINativeProvider>
          <Stack screenOptions={{
            headerShown: false
          }} />
        </HeroUINativeProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
