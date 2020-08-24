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

import { Content, Form, Input } from "native-base";
import React, { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import DeviceInfo from "react-native-device-info";
import { useSiteUrl, Props } from "./SiteUrlHook";

import { InputTextWithInfo, PrimaryButton } from "@totara/components";
import { translate } from "@totara/locale";
import { constants } from "@totara/lib";
import { TotaraTheme } from "@totara/theme/Theme";
import { margins, paddings } from "@totara/theme/constants";
import { deviceScreen } from "@totara/lib/tools";

const { DEV_ORG_URL, DEBUG_MODE } = constants;

const SiteUrl = (props: Props) => {
  const [siteUrl, setSiteUrl] = useState(DEBUG_MODE ? DEV_ORG_URL : "");
  const { siteUrlState, onSubmit, isSiteUrlSubmitted } = useSiteUrl(props);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Content enableOnAndroid contentContainerStyle={styles.mainContent}>
        <Form style={styles.siteUrlContainer}>
          <View style={styles.logoContainer}>
            <Image source={require("@resources/images/totara_logo/totara_logo.png")} style={styles.logo} />
          </View>
          <View style={styles.formContainer}>
            <View>
              <Text style={styles.urlTitle}>{translate("site_url.title")}</Text>
              <Text style={styles.urlInformation}>{translate("site_url.url_information")}</Text>
            </View>
            <InputTextWithInfo
              placeholder={translate("site_url.url_text_placeholder")}
              message={siteUrlState.inputSiteUrlMessage}
              status={siteUrlState.inputSiteUrlStatus}>
              <Input
                keyboardType="url"
                clearButtonMode="while-editing"
                autoCapitalize="none"
                onChangeText={(text) => setSiteUrl(text)}
                value={siteUrl}
                style={styles.inputText}
                autoFocus={!isSiteUrlSubmitted}
                testID={"urlInput"}
                returnKeyType={"done"}
                onSubmitEditing={() => onSubmit(siteUrl)}
              />
            </InputTextWithInfo>
            <PrimaryButton
              onPress={() => onSubmit(siteUrl)}
              text={translate("general.enter")}
              style={styles.buttonEnter}
              mode={isSiteUrlSubmitted ? "loading" : undefined}
            />
          </View>
        </Form>
      </Content>

      <Text style={styles.version}>
        {translate("general.version")}: {DeviceInfo.getVersion()}({DeviceInfo.getBuildNumber()})
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContent: {
    flexGrow: 1
  },
  siteUrlContainer: {
    flex: 1,
    justifyContent: "space-between"
  },
  logoContainer: {
    height: "40%",
    flexDirection: "column",
    justifyContent: "center",
    flex: 1
  },
  logo: {
    width: deviceScreen.width * 0.5,
    /**To make sure width work properly, aspectRatio needs to be set.
     * However, totara.logo has not a good aspectRatio (0.7083333333), I decided to infer the totara.logo aspectRatio using width/height */
    aspectRatio: 120 / 85,
    alignSelf: "center"
  },

  formContainer: {
    height: "60%",
    paddingHorizontal: paddings.paddingXL
  },

  version: {
    ...TotaraTheme.textXSmall,
    color: TotaraTheme.colorNeutral6,
    textAlign: "center",
    marginBottom: margins.marginS,
    flexDirection: "column-reverse"
  },

  urlTitle: {
    ...TotaraTheme.textH3
  },
  urlInformation: {
    ...TotaraTheme.textRegular,
    color: TotaraTheme.colorNeutral6
  },
  inputText: {
    paddingRight: 0,
    paddingLeft: 0
  },
  buttonEnter: {
    marginTop: margins.marginS
  }
});

export default SiteUrl;
