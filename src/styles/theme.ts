import { colors as baseColors } from "../../themes/colors";

// Centralized UI tokens for spacing, radii, shadows and colors
export const colors = {
  ...baseColors,
  // page-specific UI overrides
  homeBackground: 'rgba(255, 255, 255, 0.9)',
  // accents
  gold: '#FFD700',
};

export const spacing = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  horizontal: 24,
};

export const radii = {
  small: 8,
  card: 16,
};

// Shadow style matching provided screenshot (x:0 y:4 blur:8 spread:0 color primary @10%)
export const shadow = {
  shadowColor: baseColors.primary600,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
  elevation: 4,
};

export default {
  colors,
  spacing,
  radii,
  shadow,
};
