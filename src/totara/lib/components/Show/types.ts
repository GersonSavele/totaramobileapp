import type { PropsWithChildren, ReactNode } from 'react';

export type ShowProps = PropsWithChildren<{
  when: AnyTruthyValue;
  fallback?: ReactNode;
}>;

type AnyTruthyValue = string | number | boolean | object | symbol | bigint;
