import type { ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native';

import { borderRadius, paddings } from '../../theme/constants';
import type { GetButtonStyleConfig } from './types';

export const getButtonStyles = ({ disabled, theme, variant }: GetButtonStyleConfig) => {
  const getTextColor = () => {
    if (variant === 'tertiary') return theme.colorLink;

    if (variant === 'secondary') return theme.textColorDark;

    return theme.colorText;
  };

  const commonButtonStyles = {
    height: 48,
    paddingHorizontal: paddings.paddingXL,
    minWidth: 150,
    borderRadius: borderRadius.borderRadiusXS,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled ? 0.5 : 1
  } as ViewStyle;

  const styles = StyleSheet.create({
    primary: {
      ...commonButtonStyles,
      backgroundColor: theme.colorPrimary
    },
    secondary: {
      ...commonButtonStyles,
      borderWidth: disabled ? 0 : 1,
      borderColor: theme.colorNeutral7,
      backgroundColor: disabled ? theme.colorSecondary1 : theme.colorNeutral1
    },
    tertiary: commonButtonStyles,
    title: {
      fontWeight: variant === 'tertiary' ? 'normal' : 'bold',
      fontSize: theme.textSmall.fontSize,
      color: getTextColor()
    }
  });

  return styles;
};
