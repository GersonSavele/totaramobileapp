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

import { NetworkStatus, useQuery } from '@apollo/client';
import { HeaderBackButton } from '@react-navigation/elements';
import type { RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button, TertiaryButton } from '@totara/components';
import { DescriptionContent } from '@totara/components/DescriptionContent';
import { NAVIGATION, popAndGoToByRef } from '@totara/lib/navigation';
import { translate } from '@totara/locale';
import { fontWeights, margins, paddings } from '@totara/theme/constants';
import { TotaraTheme } from '@totara/theme/Theme';
import React, { useLayoutEffect } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { learningItemEnum } from '../constants';
import { enrolmentInfoQuery } from '../enrolment/api';
import { ImageElement } from './components';

const { textHeadline, textMedium, textRegular, colorNeutral3 } = TotaraTheme;

const overviewStyles = StyleSheet.create({
  root: {
    flex: 1,
    padding: paddings.paddingXL
  },

  banner: {
    aspectRatio: 2,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex'
  },

  imageElement: {
    borderWidth: 1,
    borderColor: colorNeutral3,
    flex: 1,
    width: '100%',
    aspectRatio: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },

  title: {
    marginTop: margins.marginL,
    ...textMedium,
    fontWeight: fontWeights.fontWeightBold
  },
  course: {
    marginTop: margins.marginL,
    ...textRegular
  },

  enrolment: {
    marginTop: margins.marginL,
    backgroundColor: colorNeutral3,
    alignItems: 'center',
    padding: paddings.paddingXL
  },

  enrolmentStatus: {
    ...textHeadline
  },

  enrolmentLoading: {
    marginTop: margins.marginL
  },

  enrolmentAction: {
    marginTop: margins.marginL
  }
});

type OverviewModalParamList = {
  OverviewModal: {
    itemid: string;
    title: string;
    mobileImage: string;
    summary: string;
  };
};

export const OverviewModal = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { params } = useRoute<RouteProp<OverviewModalParamList, 'OverviewModal'>>();

  // @ts-ignore
  const { itemid, title, mobileImage: imageSource, summary, summaryFormat } = params;

  const { data, networkStatus, error, refetch } = useQuery(enrolmentInfoQuery, {
    variables: { courseid: itemid },
    fetchPolicy: 'no-cache'
  });

  const enrolmentInfo = data?.enrolmentInfo;

  const canEnrol = enrolmentInfo?.canEnrol,
    guestAccess = enrolmentInfo?.guestAccess,
    isEnrolled = enrolmentInfo?.isEnrolled,
    privileged = enrolmentInfo?.privileged;

  const goTo = () => {
    if (isEnrolled || privileged) {
      const routeId = NAVIGATION.FIND_LEARNING_COURSE_DETAILS;
      // TODO Fix API Change!
      // navigation.navigate(routeId, { targetId: itemid, courseGroupType: learningItemEnum.Course });
    } else {
      popAndGoToByRef(NAVIGATION.ENROLMENT_MODAL, {
        targetId: itemid
      });
    }
  };

  const onTryReload = () => {
    refetch();
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: props => (
        <HeaderBackButton
          {...props}
          onPress={() => {
            navigation.goBack();
          }}
        />
      ),
      headerRight: () => {
        return (
          privileged && (
            <TertiaryButton
              testID="enrolment_modal_header_go_to_course"
              text={translate('find_learning_overview.go_to_course')}
              onPress={goTo}
            />
          )
        );
      }
    });
  }, [navigation]);

  const enrolmentStatusText = isEnrolled
    ? translate('find_learning_overview.you_are_enrolled')
    : guestAccess || canEnrol
      ? translate('find_learning_overview.you_can_enrol')
      : translate('find_learning_overview.you_are_not_enrolled');

  const isLoading = networkStatus === NetworkStatus.loading || networkStatus === NetworkStatus.refetch;

  return (
    <ScrollView style={{ ...overviewStyles.root, marginBottom: insets.bottom }}>
      <View style={overviewStyles.banner}>
        <ImageElement imageSrc={imageSource} style={overviewStyles.imageElement} />
      </View>
      <View style={overviewStyles.enrolment}>
        {isLoading && (
          <View testID={'enrolment_modal_loading'}>
            <ActivityIndicator />
            <Text style={overviewStyles.enrolmentLoading}>{translate('enrolment_options.loading_enrolment_data')}</Text>
          </View>
        )}
        {error && (
          <View testID={'enrolment_modal_loading_error'}>
            <Text>{translate('enrolment_options.loading_enrolment_error')}</Text>
            <View style={{ marginTop: margins.marginL }}>
              <Button variant="secondary" text={translate('general.try_again')} onPress={onTryReload} />
            </View>
          </View>
        )}
        {!isLoading && !error && (
          <View>
            <Text testID={'enrolment_modal_status_text'} style={overviewStyles.enrolmentStatus}>
              {enrolmentStatusText}
            </Text>
            {(guestAccess || isEnrolled || canEnrol || privileged) && (
              <View testID={'enrolment_modal_status_button'}>
                <Button
                  variant="primary"
                  style={overviewStyles.enrolmentAction}
                  text={translate('find_learning_overview.go_to_course')}
                  onPress={goTo}
                />
              </View>
            )}
          </View>
        )}
      </View>
      <Text style={overviewStyles.title}>{title}</Text>
      <DescriptionContent contentType={summaryFormat} content={summary} />
    </ScrollView>
  );
};
