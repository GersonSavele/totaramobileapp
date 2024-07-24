import type { PropsWithChildren } from 'react';
import type { ViewStyle } from 'react-native';

import type { AppliedTheme } from '@/src/totara/theme/Theme';

export type MessageProps = PropsWithChildren<{
  status?: MessageStatuses;
  style?: ViewStyle;
  testID?: string;
}>;

export type MessageStatuses = 'success' | 'focus' | 'error';

export type GetMessageStylesConfig = {
  theme: AppliedTheme;
};
