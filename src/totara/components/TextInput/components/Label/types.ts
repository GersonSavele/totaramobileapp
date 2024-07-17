import type { PropsWithChildren } from 'react';

import type { AppliedTheme } from '@/src/totara/theme/Theme';

export type LabelProps = PropsWithChildren<{
  isActive: boolean;
}>;

export type GetLabelStyleConfig = {
  theme: AppliedTheme;
  isActive: boolean;
};
