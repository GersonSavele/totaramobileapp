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
import React from "react";
import { Text, TextStyle } from "react-native";
import { isEmpty } from "lodash";

import { DescriptionFormat } from "@totara/types/LearningItem";
import { jsonObjectToWekaNodes, wrappedWekaNodes } from "./weka/wekaUtils";
import { ToShortSummary } from "./weka/treeOperations";

type SummaryContentProps = {
  contentType?: DescriptionFormat;
  content?: any;
  style: TextStyle;
  numberOfLines: number;
};

export const SummaryContent = ({ contentType, content, numberOfLines, style }: SummaryContentProps) => {
  if (isEmpty(content)) {
    return null;
  }
  let shortText = content;
  if (contentType === DescriptionFormat.jsonEditor) {
    shortText = wrappedWekaNodes(jsonObjectToWekaNodes(JSON.parse(content))).accept(new ToShortSummary());
  }

  return (
    <Text style={style} numberOfLines={numberOfLines}>
      {shortText}
    </Text>
  );
};
