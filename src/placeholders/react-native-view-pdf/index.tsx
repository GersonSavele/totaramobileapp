import type { PropsWithChildren } from 'react';
import { Text, View } from 'react-native';

export type PDFViewProps = PropsWithChildren<Record<string, unknown>>;

export const PDFView = ({ children, ...props }: PDFViewProps) => (
  <View>
    <Text>Rendering PDFView with the following props:</Text>
    <Text>{JSON.stringify(props)}</Text>
    {children}
  </View>
);
