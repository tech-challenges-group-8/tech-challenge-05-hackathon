import type { TextStyle } from 'react-native';

export const fontWeight = (value: string): TextStyle['fontWeight'] =>
  value as TextStyle['fontWeight'];