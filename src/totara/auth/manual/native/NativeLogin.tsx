/**
 * This file is part of Totara Enterprise.
 *
 * Copyright (C) 2019 onwards Totara Learning Solutions LTD
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

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Images } from '@resources/images';
import { Button, FormError, InfoModal } from '@totara/components';
import { useSession } from '@totara/core';
import { fetchData, registerDevice } from '@totara/core/AuthRoutines';
import { config } from '@totara/lib';
import { NATIVE_LOGIN_TEST_IDS, TEST_IDS } from '@totara/lib/testIds';
import { translate } from '@totara/locale';
import { gutter, ThemeContext } from '@totara/theme';
import { margins } from '@totara/theme/constants';
import { TotaraTheme } from '@totara/theme/Theme';
import React, { useContext, useEffect } from 'react';
import type { ImageSourcePropType } from 'react-native';
import { Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { TextInput } from '@/src/totara/components';

import { useNativeFlow } from './NativeFlowHook';

const NativeLogin = () => {
  const fetchDataWithFetch = fetchData(fetch);
  const { siteInfo, host, apiKey, initSession } = useSession();
  const dispatch = useDispatch();
  const theme = useContext(ThemeContext);
  const navigation = useNavigation();

  const { nativeLoginState, onClickEnter, inputUsernameWithShowError, inputPasswordWithShowError, onFocusInput } =
    useNativeFlow(fetchDataWithFetch)({
      siteInfo: siteInfo!,
      siteUrl: host!
    });

  useEffect(() => {
    if (nativeLoginState.setupSecret && !apiKey) {
      registerDevice(
        fetchDataWithFetch,
        AsyncStorage
      )({
        uri: host!,
        secret: nativeLoginState.setupSecret,
        siteInfo: siteInfo
      }).then(res => {
        dispatch(initSession({ apiKey: res.apiKey }));
        navigation.goBack();
      });
    }
  }, [nativeLoginState.setupSecret, apiKey]);

  return (
    <ScrollView style={theme.viewContainer}>
      <View style={{ position: 'relative', zIndex: 2 }}>
        <FormError
          message={translate('native_login.error_unauthorized')}
          isShow={nativeLoginState.errorStatusUnauthorized}
          testID={TEST_IDS.NATIVE_LOGIN_ERROR}
        />
      </View>
      <ScrollView style={styles.content}>
        <Image
          source={theme.urlLogo ? { uri: theme.urlLogo } : require('@resources/images/totara_logo/totara_logo.png')}
          style={styles.totaraLogo}
          resizeMode={'contain'}
          testID={TEST_IDS.NATIVE_LOGIN_HEADER}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.loginTitle}>{translate('native_login.header_title')}</Text>
          <Text style={styles.loginInformation}>{translate('native_login.login_information')}</Text>
        </View>
        <View>
          <TextInput
            label={translate('native_login.username_text_placeholder')}
            onChangeText={inputUsernameWithShowError}
            value={nativeLoginState.inputUsername}
            onFocus={onFocusInput}
            testID={TEST_IDS.USER_INPUT}
            errorTestID={TEST_IDS.USER_INPUT_ERROR}
            status={nativeLoginState.inputUsernameStatus}
            error={translate('native_login.validation.enter_valid_username')}
          />
          <TextInput
            label={translate('native_login.password_text_placeholder')}
            secureTextEntry
            onChangeText={inputPasswordWithShowError}
            value={nativeLoginState.inputPassword}
            onFocus={onFocusInput}
            testID={TEST_IDS.USER_PW}
            errorTestID={TEST_IDS.USER_PW_ERROR}
            status={nativeLoginState.inputPasswordStatus}
            error={translate('native_login.validation.enter_valid_password')}
          />
          <Button
            variant="primary"
            onPress={onClickEnter}
            text={translate('general.enter')}
            mode={nativeLoginState.isRequestingLogin ? 'loading' : undefined}
            testID={TEST_IDS.LOGIN}
          />
          <View style={[styles.forgotCredentialContainer, theme.textRegular]}>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(config.forgotPasswordUri(host!));
              }}>
              <Text style={styles.forgotCredential}>{translate('native_login.forgot_username_password')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {nativeLoginState.unhandledLoginError && (
        <InfoModal
          title={translate('native_login.auth_general_error.title')}
          description={translate('native_login.auth_general_error.description')}
          imageSource={Images.generalError as ImageSourcePropType}
          testID={NATIVE_LOGIN_TEST_IDS.UNHANDLED_ERROR}>
          <Button
            variant="primary"
            text={translate('native_login.auth_general_error.action_primary')}
            onPress={onFocusInput}
          />
        </InfoModal>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loginTitle: {
    ...TotaraTheme.textH3
  },
  loginInformation: {
    ...TotaraTheme.textRegular,
    color: TotaraTheme.colorNeutral6
  },
  navigation: {
    alignItems: 'flex-start',
    borderBottomWidth: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: margins.marginM
  },
  content: {
    paddingHorizontal: gutter
  },
  totaraLogo: {
    height: 88,
    width: '100%',
    marginTop: margins.marginXL
  },
  infoContainer: {
    justifyContent: 'space-between',
    textAlignVertical: 'center',
    marginBottom: margins.marginM,
    marginTop: margins.margin2XL
  },
  forgotCredentialContainer: {
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: margins.marginS
  },
  forgotCredential: {
    padding: margins.marginL,
    color: TotaraTheme.colorLink,
    textAlign: 'center'
  }
});

export default NativeLogin;
