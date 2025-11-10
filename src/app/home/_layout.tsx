import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../../../themes/colors';

export default function HomeLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: '#F1F3F5',
          headerShadowVisible: false,
        }}
      />
    </>
  );
}