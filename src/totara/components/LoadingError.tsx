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

import type { ApolloError } from '@apollo/client/errors';
import { Images } from '@resources/images';
import { translate } from '@totara/locale';
import { paddings } from '@totara/theme/constants';
import { TotaraTheme } from '@totara/theme/Theme';
import { get } from 'lodash';
import React from 'react';
import type { ImageSourcePropType } from 'react-native';
import { Image, StyleSheet, Text, View } from 'react-native';

import Button from './Button';

type LoadingErrorProps = {
  onRefreshTap(): void;
  testID?: string;
  error?: ApolloError;
};

const getErrorFeedback = (error?: ApolloError) => {
  // TODO: Deeper exploration into what the actual shape of the error is so we can type it accordingly
  // @ts-ignore next line
  if (error && error.networkError && (!error.networkError.statusCode || error.networkError.statusCode === 408)) {
    return {
      image: Images.offline,
      title: translate('content_error.title'),
      description: translate('content_error.description')
    };
  }
  const errorMessage = get(
    error,
    'networkError.result.errors[0].message',
    translate('general_error_feedback_modal.description')
  );
  return {
    image: Images.generalError,
    title: translate('general_error_feedback_modal.title'),
    description: errorMessage
  };
};

const LoadingError = ({ onRefreshTap, testID, error }: LoadingErrorProps) => {
  const errorFeedback = getErrorFeedback(error);
  return (
    <View style={styles.containerStyle} testID={testID}>
      <View style={styles.errorContainer}>
        <Image source={errorFeedback.image as ImageSourcePropType} />
        <Text style={styles.textTitle}>{errorFeedback.title}</Text>
        <Text style={styles.testDescription}>{errorFeedback.description}</Text>
      </View>

      <View style={styles.actionContainer}>
        <Button variant="primary" onPress={onRefreshTap} text={translate('general.try_again')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    height: '100%',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center'
  },
  errorContainer: {
    padding: paddings.paddingL,
    alignItems: 'center',
    alignContent: 'space-between'
  },
  actionContainer: {
    padding: paddings.paddingL
  },
  textTitle: {
    ...TotaraTheme.textH2,
    padding: paddings.paddingL,
    textAlign: 'center'
  },
  testDescription: {
    ...TotaraTheme.textRegular,
    marginHorizontal: paddings.paddingXL,
    textAlign: 'center'
  }
});

export default LoadingError;
