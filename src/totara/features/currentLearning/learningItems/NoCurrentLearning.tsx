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

import { Images } from '@resources/images';
import { Button } from '@totara/components';
import { useSession } from '@totara/core';
import { config } from '@totara/lib';
import { isEnableFindLearning } from '@totara/lib/tools';
import { translate } from '@totara/locale';
import { paddings } from '@totara/theme/constants';
import { TotaraTheme } from '@totara/theme/Theme';
import React from 'react';
import type { ImageSourcePropType } from 'react-native';
import { Image, Linking, StyleSheet, Text, View } from 'react-native';

type NoCurrentLearningProps = {
  testID?: string;
};

const NoCurrentLearning = ({ testID }: NoCurrentLearningProps) => {
  const { host, core } = useSession();
  const onPressFindLearning = () => {
    if (isEnableFindLearning(core)) {
      // TODO Fix
      // navigation.navigate(NAVIGATION.FIND_LEARNING);
    } else {
      Linking.openURL(config.findLearningUri(host!));
    }
  };
  return (
    <View style={styles.containerStyle} testID={testID}>
      <Image source={Images.noCurrentLearning as ImageSourcePropType} />
      <Text style={styles.noCurrentLearningDescription}>{translate('current_learning.no_learning_message')}</Text>
      <View style={styles.goToBrowserAction}>
        <Button
          variant="primary"
          onPress={onPressFindLearning}
          text={translate('current_learning.find_learning')}
          icon={!isEnableFindLearning(core) ? 'up-right-from-square' : null}
          style={{ alignSelf: 'center' }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    alignItems: 'center'
  },
  noCurrentLearningDescription: {
    ...TotaraTheme.textHeadline,
    fontWeight: 'bold',
    paddingTop: paddings.padding3XL
  },
  goToBrowserAction: {
    paddingTop: paddings.padding3XL
  }
});

export default NoCurrentLearning;
