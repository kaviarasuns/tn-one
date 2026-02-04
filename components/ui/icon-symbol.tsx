// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  // Navigation
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',

  // Map & Location
  'map.fill': 'map',
  'location.fill': 'my-location',
  'mappin.circle.fill': 'place',

  // Time & Schedule
  'clock.fill': 'schedule',
  'clock.badge.exclamationmark.fill': 'schedule',
  'calendar': 'calendar-today',

  // Settings & Controls
  'gearshape.fill': 'settings',
  'slider.horizontal.3': 'tune',

  // Actions
  'magnifyingglass': 'search',
  'xmark.circle.fill': 'cancel',
  'xmark': 'close',
  'plus': 'add',
  'pencil': 'edit',
  'checkmark.circle.fill': 'check-circle',
  'arrow.clockwise': 'refresh',
  'repeat.circle.fill': 'repeat',
  'arrow.right': 'arrow-forward',
  'arrow.up.circle.fill': 'arrow-upward',
  'arrow.down.circle.fill': 'arrow-downward',

  // Transport
  'bus.fill': 'directions-bus',
  'speedometer': 'speed',

  // Communication
  'bell.fill': 'notifications',
  'envelope.fill': 'email',

  // UI Elements
  'star.fill': 'star',
  'speaker.wave.3.fill': 'volume-up',
  'moon.fill': 'nights-stay',
  'textformat.size': 'text-fields',
  'questionmark.circle.fill': 'help',
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  const iconName = MAPPING[name] || 'help-outline';
  return <MaterialIcons color={color} size={size} name={iconName} style={style} />;
}
