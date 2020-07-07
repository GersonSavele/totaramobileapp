/**
 * This file is part of Totara Enterprise.
 *
 * Copyright (C) 2020 onwards Totara Learning Solutions LTD
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
import { Text, View } from "react-native";
import activitiesStyles from "./activitiesStyles";

type ActivityLabelProps = {
  label: any;
};
const TextTypeLabel = ({ label = {} }: ActivityLabelProps) => {
  const description = validationProperty(label.description);
  return description ? (
    <View style={activitiesStyles.labelContainer}>
      {description && (
        <Text
          style={{
            ...activitiesStyles.labelTextDescription
          }}>
          {description}
        </Text>
      )}
    </View>
  ) : null;
};

const validationProperty = (property: string) => {
  return property && property.trim().length > 0 && property.trim();
};

export default TextTypeLabel;
