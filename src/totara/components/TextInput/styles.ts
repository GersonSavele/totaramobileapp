import { StyleSheet } from 'react-native';

import { paddings } from '../../theme/constants';
import type { GetTextInputStylesConfig } from './types';

export const getTextInputStyles = ({ theme, isFocused, isErrored }: GetTextInputStylesConfig) => {
  return StyleSheet.create({
    textInput: {
      borderBottomWidth: 0.5,
      borderBottomColor: isErrored ? theme.colorAlert : theme.colorNeutral6,
      ...theme.textRegular,
      paddingVertical: paddings.paddingM
    },
    message: {
      ...theme.textSmall,
      color: isErrored ? theme.colorAlert : theme.colorNeutral6
    },
    container: {
      marginBottom: 8,
      marginTop: 16,
      position: 'relative'
    }
  });
};
