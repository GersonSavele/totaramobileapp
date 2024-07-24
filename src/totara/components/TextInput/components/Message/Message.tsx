import { useContext } from 'react';
import { Text } from 'react-native';

import { ThemeContext } from '@/src/totara/theme';

import { getMessageStyles } from './styles';
import type { MessageProps } from './types';

export const Message = ({ status, children, testID }: MessageProps) => {
  const theme = useContext(ThemeContext);
  const styles = getMessageStyles({ theme });

  return (
    <Text testID={testID} style={[theme.textXSmall, styles[status ?? 'hide']]}>
      {children}
    </Text>
  );
};
