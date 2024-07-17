import type { NativeSyntheticEvent, TextInputFocusEventData, TextInputProps as RNTextInputProps } from 'react-native';

import type { AppliedTheme } from '../../theme/Theme';

export type TextInputProps = RNTextInputProps &
  ValidatedTextInputProps & {
    label: string;
  };

type ValidatedTextInputProps =
  | {
      status: 'error' | 'focus';
      error: string;
    }
  | {
      status: undefined;
      error: undefined;
    };

export type FocusEvent = NativeSyntheticEvent<TextInputFocusEventData>;

export type GetTextInputStylesConfig = {
  theme: AppliedTheme;
  isFocused: boolean;
  isErrored: boolean;
};
