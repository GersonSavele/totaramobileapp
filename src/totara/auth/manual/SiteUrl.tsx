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

// FIX: Native-base Form has a type check issue, therefore ignoring
//@ts-nocheck

import { useNavigation } from '@react-navigation/native';
import { Images } from '@resources/images';
import { Button, InfoModal, TextInput } from '@totara/components';
import { useSession } from '@totara/core';
import IncompatibleApiModal from '@totara/core/IncompatibleApiModal';
import { config } from '@totara/lib';
import { NAVIGATION } from '@totara/lib/navigation';
import { TEST_IDS } from '@totara/lib/testIds';
import { deviceScreen } from '@totara/lib/tools';
import { translate } from '@totara/locale';
import { margins, paddings } from '@totara/theme/constants';
import { TotaraTheme } from '@totara/theme/Theme';
import { get } from 'lodash';
import React from 'react';
import type { ImageSourcePropType } from 'react-native';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

import { useSiteUrl } from './SiteUrlHook';

type PropSiteError = {
  onDismiss: () => void;
  siteUrlFailure: string;
  testID?: string;
};

const SiteErrorModal = ({ onDismiss, siteUrlFailure, testID }: PropSiteError) => {
  const content =
    siteUrlFailure === 'networkError'
      ? {
          title: translate('server_not_reachable.title'),
          description: translate('server_not_reachable.message'),
          imageSource: Images.generalError,
          primaryAction: translate('server_not_reachable.go_back')
        }
      : {
          title: translate('site_url.auth_invalid_site.title'),
          description: translate('site_url.auth_invalid_site.description'),
          imageSource: Images.urlNotValid,
          primaryAction: translate('site_url.auth_invalid_site.action_primary')
        };

  return (
    <InfoModal
      visible={true}
      title={content.title}
      description={content.description}
      imageSource={content.imageSource as ImageSourcePropType}
      testID={testID}>
      <Button variant="primary" text={content.primaryAction} onPress={onDismiss} />
    </InfoModal>
  );
};

const SiteUrl = () => {
  const navigation = useNavigation();
  const { setupHost, host } = useSession();
  const dispatch = useDispatch();

  // eslint-disable-next-line no-undef
  const initialSiteURL = host ? host : __DEV__ ? get(config, 'devOrgUrl', '') : '';

  const { siteUrlState, onSubmit, reset, onChangeInputSiteUrl } = useSiteUrl({
    siteUrl: initialSiteURL,
    onSiteInfoDone: siteInfo => {
      dispatch(setupHost({ host: siteUrlState.inputSiteUrl, siteInfo }));
      const { auth } = siteInfo;
      if (auth === 'browser') {
        return navigation.navigate(NAVIGATION.BROWSER_LOGIN, {
          siteUrl: siteUrlState.inputSiteUrl
        });
      } else if (auth === 'native') {
        return navigation.navigate(NAVIGATION.NATIVE_LOGIN);
      } else {
        return navigation.navigate(NAVIGATION.WEBVIEW_LOGIN);
      }
    }
  });

  const { inputSiteUrl, inputSiteUrlMessage, inputSiteUrlStatus } = siteUrlState;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.mainContent}>
        <View style={styles.siteUrlContainer}>
          <View style={styles.logoContainer}>
            <Image source={require('@resources/images/totara_logo/totara_logo.png')} style={styles.logo} />
          </View>
          <View style={styles.formContainer}>
            <View>
              <Text style={styles.urlTitle}>{translate('site_url.title')}</Text>
              <Text style={styles.urlInformation}>{translate('site_url.url_information')}</Text>
            </View>
            <TextInput
              keyboardType="url"
              onChangeText={text => onChangeInputSiteUrl(text)}
              value={inputSiteUrl}
              autoFocus={inputSiteUrlStatus !== 'fetching'}
              testID={TEST_IDS.SITE_URL_INPUT}
              returnKeyType="done"
              onSubmitEditing={() => onSubmit(inputSiteUrl!)}
              status={inputSiteUrlStatus === 'invalidUrl' ? 'error' : 'focus'}
              label={translate('site_url.url_text_placeholder')}
              error={inputSiteUrlMessage}
            />
            <Button
              variant="primary"
              onPress={() => onSubmit(inputSiteUrl!)}
              text={translate('general.enter')}
              style={styles.buttonEnter}
              mode={siteUrlState.inputSiteUrlStatus === 'fetching' ? 'loading' : undefined}
              testID={TEST_IDS.SUBMIT_URL}
            />
          </View>
        </View>
      </ScrollView>

      <Text style={styles.version}>
        {translate('general.version')}: {DeviceInfo.getVersion()}({DeviceInfo.getBuildNumber()})
      </Text>

      {(siteUrlState.inputSiteUrlStatus === 'invalidAPI' || siteUrlState.inputSiteUrlStatus === 'networkError') && (
        <SiteErrorModal
          onDismiss={() => reset()}
          siteUrlFailure={siteUrlState.inputSiteUrlStatus}
          testID={TEST_IDS.SITE_ERROR_MODAL}
        />
      )}
      {siteUrlState.inputSiteUrlStatus === 'minAPIVersionMismatch' && (
        <IncompatibleApiModal
          onCancel={() => reset()}
          siteUrl={siteUrlState.inputSiteUrl!}
          testID={TEST_IDS.INCOMPATIBLE_API_MODAL}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContent: {
    flexGrow: 1
  },
  siteUrlContainer: {
    flex: 1,
    justifyContent: 'space-between'
  },
  logoContainer: {
    height: '40%',
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1
  },
  logo: {
    width: deviceScreen.width * 0.5,
    /**To make sure width work properly, aspectRatio needs to be set.
     * However, totara.logo has not a good aspectRatio (0.7083333333), I decided to infer the totara.logo aspectRatio using width/height */
    aspectRatio: 120 / 85,
    alignSelf: 'center'
  },

  formContainer: {
    height: '60%',
    paddingHorizontal: paddings.paddingXL
  },

  version: {
    ...TotaraTheme.textXSmall,
    color: TotaraTheme.colorNeutral6,
    textAlign: 'center',
    flexDirection: 'column-reverse',
    paddingBottom: paddings.paddingL
  },

  urlTitle: {
    ...TotaraTheme.textH3
  },
  urlInformation: {
    ...TotaraTheme.textRegular,
    color: TotaraTheme.colorNeutral6
  },
  buttonEnter: {
    marginTop: margins.marginS
  }
});

export default SiteUrl;
