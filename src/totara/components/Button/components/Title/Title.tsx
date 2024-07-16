import { Text } from 'react-native';

import { translate } from '@/src/totara/locale';

import type { TitleProps } from './types';

export const Title = ({ mode, text, style }: TitleProps) => {
  switch (mode) {
    case 'loading':
      return <Text style={style}>{translate('general.loading')}</Text>;
    default:
      return <Text style={style}>{text}</Text>;
  }
};
