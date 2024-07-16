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
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { Images } from '@resources/images';
import { authLinkingHandler } from '@totara/auth/authUtils';
import { Button, InfoModal } from '@totara/components';
import { useSession } from '@totara/core';
import { fetchData, registerDevice } from '@totara/core/AuthRoutines';
import { config } from '@totara/lib';
import { translate } from '@totara/locale';
import React, { useCallback, useEffect, useState } from 'react';
import type { ImageSourcePropType } from 'react-native';
import { Linking } from 'react-native';
import { useDispatch } from 'react-redux';

const BrowserLogin = () => {
  // eslint-disable-next-line no-undef
  const fetchDataWithFetch = fetchData(fetch);
  const navigation = useNavigation();
  const { params } = useRoute();
  const { siteUrl } = params as any;
  const { initSession, siteInfo, apiKey } = useSession();
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(true);

  const [setupSecret, setSetupSecret] = useState();

  const urlHandler = url => {
    authLinkingHandler({
      onLoginSuccess: ({ secret }) => {
        setSetupSecret(secret);
      },
      onLoginFailure: () => {
        console.warn('error');
      }
    })(url);
  };

  useEffect(() => {
    if (setupSecret && !apiKey) {
      registerDevice(
        fetchDataWithFetch,
        AsyncStorage
      )({
        uri: siteUrl,
        secret: setupSecret,
        siteInfo: siteInfo
      })
        .then(res => {
          dispatch(initSession({ apiKey: res.apiKey }));
          navigation.goBack();
        })
        .catch(ee => {
          console.warn(ee);
        });
    }
  }, [setupSecret, apiKey]);

  useFocusEffect(
    useCallback(() => {
      Linking.addEventListener('url', urlHandler);
      return () => {
        Linking.removeAllListeners('url');
      };
    }, [])
  );
  const loginUrl = config.loginUri(siteUrl);
  return (
    <InfoModal
      title={translate('browser_login.title')}
      description={translate('browser_login.description')}
      imageSource={Images.browserLogin as ImageSourcePropType}
      visible={visible}>
      <Button
        variant="primary"
        text={translate('browser_login.primary_title')}
        onPress={() => {
          Linking.openURL(loginUrl);
        }}
        icon="external-link-alt"
      />
      <Button
        variant="tertiary"
        text={translate('browser_login.tertiary_title')}
        onPress={() => {
          setVisible(false);
          navigation.goBack();
        }}
      />
    </InfoModal>
  );
};

export default BrowserLogin;
