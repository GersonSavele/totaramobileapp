import { gutter } from '@totara/theme';
import { ActivityIndicator } from 'react-native';

import Icon from '../../../Icon';
import type { IndicatorProps } from './types';

export const ButtonIndicator = ({ mode, icon, color, size }: IndicatorProps) => {
  const styleIndicator = { marginLeft: gutter };
  switch (mode) {
    case 'loading':
      return <ActivityIndicator size="small" color={color} style={styleIndicator} />;
    default:
      return icon ? <Icon name={icon} size={size} color={color} style={styleIndicator} /> : null;
  }
};
