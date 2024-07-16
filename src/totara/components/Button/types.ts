import type { PropsWithChildren } from 'react';
import type { ViewStyle } from 'react-native';

import type { AppliedTheme } from '../../theme/Theme';
import type { IconName } from '../Icon';

export type ButtonProps = PropsWithChildren<{
  text?: string;
  icon?: IconName;
  style?: ViewStyle;
  onPress?: () => void;
  mode?: ButtonModes;
  testID?: string;
  variant: ButtonVariants;
}>;

export type ButtonModes = 'disabled' | 'loading';

export type ButtonVariants = 'primary' | 'secondary' | 'tertiary';

export type GetButtonStyleConfig = {
  variant: ButtonVariants;
  disabled: boolean;
  theme: AppliedTheme;
};
