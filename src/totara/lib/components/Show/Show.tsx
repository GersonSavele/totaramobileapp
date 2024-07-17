import type { ShowProps } from './types';

export const Show = ({ when, fallback, children }: ShowProps) => {
  if (!!when) return children;

  return fallback ?? <></>;
};
