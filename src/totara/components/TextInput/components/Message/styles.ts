import { StyleSheet } from 'react-native';

import type { GetMessageStylesConfig } from './types';

export const getMessageStyles = ({ theme }: GetMessageStylesConfig) =>
  StyleSheet.create({
    hide: {
      opacity: 0
    },
    success: {
      color: theme.colorSuccess,
      opacity: 1
    },
    error: {
      color: theme.colorAlert,
      opacity: 1
    },
    focus: {
      color: theme.colorInfo,
      opacity: 0
    }
  });
