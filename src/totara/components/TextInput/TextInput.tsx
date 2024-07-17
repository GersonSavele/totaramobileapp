import { useContext, useState } from 'react';
import { Text, TextInput as RNTextInput, View } from 'react-native';

import { Show } from '../../lib/components/Show';
import { ThemeContext } from '../../theme';
import { Label } from './components/Label';
import { Message } from './components/Message';
import { getTextInputStyles } from './styles';
import type { FocusEvent, TextInputProps } from './types';

export const TextInput = ({ label, style, status, error, ...props }: TextInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const theme = useContext(ThemeContext);
  const isErrored = status === 'error';
  const isLabelActive = isFocused || !!props.value;

  const styles = getTextInputStyles({ theme, isFocused, isErrored });

  const handleFocus = (event: FocusEvent) => {
    setIsFocused(true);
    props.onFocus?.(event);
  };

  const handleBlur = (event: FocusEvent) => {
    setIsFocused(false);
    props.onBlur?.(event);
  };

  return (
    <View style={styles.container}>
      <Label isActive={isLabelActive}>{label}</Label>
      <RNTextInput
        {...props}
        clearButtonMode="while-editing"
        autoCapitalize="none"
        style={[styles.textInput, style]}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <Show when={isErrored}>
        <Message status={status}>{error}</Message>
      </Show>
    </View>
  );
};
