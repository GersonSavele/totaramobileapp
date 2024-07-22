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

import { DESCRIPTIONCONTENT_TEST_IDS } from '@totara/lib/testIds';
import { isValidUrlText } from '@totara/lib/tools';
import { margins } from '@totara/theme/constants';
import { TotaraTheme } from '@totara/theme/Theme';
import { DescriptionFormat } from '@totara/types/LearningItem';
import { isEmpty } from 'lodash';
import React from 'react';
import { Linking, StyleSheet, Text } from 'react-native';
import WebView from 'react-native-webview';

import { WekaContent } from './weka/WekaContent';

type DescriptionContentProps = {
  contentType: DescriptionFormat;
  content?: any;
  testID?: string;
  source?: any;
};

const onLoadWithRequestExternalBrowser = event => {
  if (isValidUrlText(event.url)) {
    Linking.openURL(event.url);
    return false;
  }
  return true;
};

const getWebview = ({ source, container, testID }) => (
  <WebView
    source={{
      html: `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>${source?.html}</body></html>`
    }}
    style={container}
    onShouldStartLoadWithRequest={onLoadWithRequestExternalBrowser}
    testID={testID || DESCRIPTIONCONTENT_TEST_IDS.WEB}
  />
);

// This will return component accordingly contentType(HTML, JSON_EDITOR or PLAIN_TEXT)
export const DescriptionContent = ({ contentType, content, testID, source }: DescriptionContentProps) => {
  const { container } = styles;

  /*eslint no-fallthrough: ["error", { "commentPattern": "break[\\s\\w]*omitted" }]*/
  switch (contentType) {
    case DescriptionFormat.jsonEditor:
      return <WekaContent content={content} testID={testID || DESCRIPTIONCONTENT_TEST_IDS.WEKA} style={container} />;
    default:
      // according to comment on MOB-1168:
      // If there is a 'fullmessagehtml'(source.html) field you should use that, and it will always be HTML
      if (!isEmpty(source?.html)) {
        return getWebview({ source, container, testID });
      }
      return (
        <Text testID={testID || DESCRIPTIONCONTENT_TEST_IDS.TEXT} style={{ ...TotaraTheme.textSmall, ...container }}>
          {content}
        </Text>
      );
  }
};

const styles = StyleSheet.create({
  container: {
    marginTop: margins.marginL
  }
});
