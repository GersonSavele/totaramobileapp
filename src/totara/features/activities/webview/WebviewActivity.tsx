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

import WebViewWrapper from '@totara/auth/WebViewWrapper';
import { Loading } from '@totara/components';
import { AUTH_HEADER_FIELD } from '@totara/lib/constants';
import { TotaraTheme } from '@totara/theme/Theme';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import Orientation from 'react-native-orientation-locker';
import WebView from 'react-native-webview';

import { useParams } from '@/src/totara/lib/hooks';

const PDF_TYPE = 'application/pdf';
/**
 * WebviewActivity opens an activity with the given url
 */

const WebviewActivity = () => {
  const { uri, backAction, activity, fileurl, mimetype, apiKey } = useParams('WebviewActivity');

  useEffect(() => {
    Orientation.unlockAllOrientations();
    return () => Orientation.lockToPortrait();
  }, []);

  return (
    <SafeAreaView style={TotaraTheme.viewContainer}>
      {mimetype === PDF_TYPE ? (
        <PDFViewWrapper fileurl={fileurl} apiKey={apiKey} />
      ) : (
        <WebViewWrapper uri={uri || activity?.viewurl!} backAction={backAction} />
      )}
    </SafeAreaView>
  );
};

const PDFViewWrapper = ({ fileurl, apiKey }: { fileurl?: string; apiKey?: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      <WebView
        source={{ headers: { [AUTH_HEADER_FIELD]: `${apiKey}` }, uri: fileurl }}
        onLoadEnd={() => setIsLoaded(true)}
      />
      {!isLoaded && (
        <View style={pdfViewStyle.loadingWrapper}>
          <Loading />
        </View>
      )}
    </>
  );
};

const pdfViewStyle = StyleSheet.create({
  loadingWrapper: { position: 'absolute', width: '100%', height: '100%' }
});

export { WebviewActivity };
