/**
 * This file is part of Totara Enterprise.
 *
 * Copyright (C) 2021 onwards Totara Learning Solutions LTD
 *
 * Totara Enterprise is provided only to Totara Learning Solutions
 * LTD’s customers and partners, pursuant to the terms and
 * conditions of a separate agreement with Totara Learning
 * Solutions LTD or its affiliate.
 *
 * If you do not have an agreement with Totara Learning Solutions
 * LTD, you may not access, use, modify, or distribute this software.
 * Please contact [sales@totaralearning.com] for more information.
 */
import { isEmpty } from 'lodash';
import type { ReactNode } from 'react';
import React from 'react';
import type { ViewStyle } from 'react-native';
import { View } from 'react-native';

import { ToFullSummary } from './treeOperations';
import { jsonObjectToWekaNodes, wrappedWekaNodes } from './wekaUtils';

const WekaContent = ({ content, testID, style }: { content?: any; testID?: string; style?: ViewStyle }) => {
  if (isEmpty(content)) {
    return null;
  }
  const root = wrappedWekaNodes(jsonObjectToWekaNodes(JSON.parse(content)));
  return (
    <View style={style} testID={testID}>
      {root.accept(new ToFullSummary()) as ReactNode}
    </View>
  );
};

export { WekaContent };
