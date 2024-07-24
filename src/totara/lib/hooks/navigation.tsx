import { useNavigation as useRNNavigation, useRoute } from '@react-navigation/native';

import type { AllScreens, ScreenParams } from '../navigation.types';

export const useParams = <T extends keyof AllScreens>(_route: T) => useRoute<ScreenParams<T>['route']>().params;

export const useNavigation = <T extends keyof AllScreens>(_route: T) =>
  useRNNavigation<ScreenParams<T>['navigation']>();
