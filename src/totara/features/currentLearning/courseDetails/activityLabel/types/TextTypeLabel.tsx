/*

This file is part of Totara Enterprise.
*
Copyright (C) 2020 onwards Totara Learning Solutions LTD
*
Totara Enterprise is provided only to Totara Learning Solutions
LTD’s customers and partners, pursuant to the terms and
conditions of a separate agreement with Totara Learning
Solutions LTD or its affiliate.
*
If you do not have an agreement with Totara Learning Solutions
LTD, you may not access, use, modify, or distribute this software.
Please contact [sales@totaralearning.com] for more information.
*
*/
import React from "react";
import { Text, View } from "react-native";

import { AppliedTheme } from "@totara/theme/Theme";
import { textStyles } from "@totara/theme/activityLabel";

type ActivityLabelProps = {
  label: any;
  theme: AppliedTheme;
};
const TextTypeLabel = ({ label = {}, theme }: ActivityLabelProps) => {
  const name = validationProperty(label.name);
  const description = validationProperty(label.description);
  return name && description ? (
    <View style={textStyles.container}>
      {name ? (
        <Text
          style={{ ...textStyles.labelTextName, color: theme.colorNeutral6 }}
        >
          {name}
        </Text>
      ) : null}
      {description ? (
        <Text
          style={{
            ...textStyles.labelTextDescription,
            color: theme.colorNeutral6,
          }}
        >
          {description}
        </Text>
      ) : null}
    </View>
  ) : null;
};

const validationProperty = (property: string) => {
  return property && property.trim() !== "" ? property.trim() : null;
};

export default TextTypeLabel;
