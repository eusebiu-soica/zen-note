import { MaterialIcons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Button } from "heroui-native";
import { StyleSheet, Text, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, withRepeat, withTiming } from "react-native-reanimated";
import { colors } from "../../themes/colors";

// Background Square component
const BackgroundSquare = ({ style }: { style: any }) => {
  return (
    <Animated.View
      style={[{
        width: 60,
        height: 60,
        borderRadius: 8,
        position: 'absolute',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
      }, style]}
    />
  );
};

export default function Welcome() {
  // Animated styles for floating squares
  const square1Style = useAnimatedStyle(() => ({
    transform: [
      { rotate: withRepeat(withTiming('15deg', { duration: 6000, easing: Easing.linear }), -1, true) },
      { translateY: withRepeat(withTiming(-20, { duration: 4000 }), -1, true) }
    ],
  }));

  const square2Style = useAnimatedStyle(() => ({
    transform: [
      { rotate: withRepeat(withTiming('-10deg', { duration: 7000, easing: Easing.linear }), -1, true) },
      { translateY: withRepeat(withTiming(-15, { duration: 3000 }), -1, true) }
    ],
  }));

  const square3Style = useAnimatedStyle(() => ({
    transform: [
      { rotate: withRepeat(withTiming('20deg', { duration: 8000, easing: Easing.linear }), -1, true) },
      { translateY: withRepeat(withTiming(-25, { duration: 5000 }), -1, true) }
    ],
  }));

  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: false,
        }} 
      />
      <View style={styles.container}>
        <StatusBar style="light" />
        
        {/* Background Squares */}
        <BackgroundSquare style={[styles.square1, square1Style]} />
        <BackgroundSquare style={[styles.square2, square2Style]} />
        <BackgroundSquare style={[styles.square3, square3Style]} />

        {/* Main content */}
        <View style={styles.content}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <MaterialIcons name="description" size={48} color="white" />
          </View>

          {/* App name */}
          <Text style={styles.title}>ZenNote</Text>
          
          {/* Tagline */}
          <Text style={styles.tagline}>Your space for clear thoughts.</Text>
        </View>

        {/* Bottom section */}
        <View style={styles.bottomSection}>
        
          {/* Button */}
          <View style={styles.buttonContainer}>
            <Button className="w-full bg-neutral-50 rounded-md font-bold" variant="primary">
              <Text style={styles.buttonText}>
                Get started
              </Text>
            </Button>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    height: '100%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 60,
  },
  tagline: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
    marginBottom: 24,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  indicatorActive: {
    width: 32,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  buttonContainer: {
    marginBottom: 16,
  },
//   button: {
//     backgroundColor: 'white',
//     borderRadius: 12,
//     paddingVertical: 16,
//   },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
  },
  square1: {
    top: '15%',
    left: '10%',
  },
  square2: {
    top: '40%',
    right: '15%',
  },
  square3: {
    bottom: '35%',
    left: '20%',
  },
});

