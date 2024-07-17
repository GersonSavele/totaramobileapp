import { StyleSheet } from 'react-native';

import type { GetLabelStyleConfig } from './types';

export const getLabelStyles = ({ theme, isActive }: GetLabelStyleConfig) =>
  StyleSheet.create({
    label: {
      fontSize: theme.textXSmall.fontSize,
      color: theme.colorNeutral6,
      position: 'absolute',
      top: isActive ? -theme.textXSmall.fontSize : theme.textSmall.fontSize
    }
  });
