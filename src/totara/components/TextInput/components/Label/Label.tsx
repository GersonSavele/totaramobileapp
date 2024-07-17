import { useContext } from 'react';
import Animated, { LinearTransition } from 'react-native-reanimated';

import { ThemeContext } from '@/src/totara/theme';

import { getLabelStyles } from './styles';
import type { LabelProps } from './types';

export const Label = ({ isActive, children }: LabelProps) => {
  const theme = useContext(ThemeContext);
  const styles = getLabelStyles({ theme, isActive });

  return (
    <Animated.Text layout={LinearTransition.duration(150)} style={styles.label}>
      {children}
    </Animated.Text>
  );
};
