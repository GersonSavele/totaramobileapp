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

import { Container, Content, Form, Input } from "native-base";
import React, { useContext, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import DeviceInfo from "react-native-device-info";
import { useSiteUrl, Props } from "./SiteUrlHook";

import { InputTextWithInfo, PrimaryButton } from "@totara/components";
import { translate } from "@totara/locale";
import { gutter, ThemeContext } from "@totara/theme";
import { constants } from "@totara/lib";
import { TotaraTheme } from "@totara/theme/Theme";
import { deviceScreen } from "@totara/lib/tools";
import { margins } from "@totara/theme/constants";

const { DEV_ORG_URL, DEBUG_MODE } = constants;

const SiteUrl = (props: Props) => {
  const [theme] = useContext(ThemeContext);
  const [siteUrl, setSiteUrl] = useState(DEBUG_MODE ? DEV_ORG_URL : "");
  const { siteUrlState, onSubmit, isSiteUrlSubmitted } = useSiteUrl(props);

  return (
    <Container style={[theme.viewContainer, { flex: 0 }]}>
      <Content enableOnAndroid>
        <Form style={styles.siteUrlContainer}>
          <View style={styles.headerContainer}>
            <Image
              source={require("@resources/images/totara_logo/totara_logo.png")}
              style={styles.totaraLogo}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.urlTitle}>
                {translate("manual.site_url_title")}
              </Text>
              <Text style={styles.urlInformation}>
                {translate("manual.site_url_information")}
              </Text>
            </View>
          </View>
          <View style={styles.formContainer}>
            <InputTextWithInfo
              placeholder={translate("manual.site_url_text_placeholder")}
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
      <SafeAreaView>
        <Text
          style={[
            TotaraTheme.textH2,
            styles.version,
            theme.textXXSmall,
            { color: theme.colorNeutral8 }
          ]}>
          {translate("general.version")}: {DeviceInfo.getVersion()}(
          {DeviceInfo.getBuildNumber()})
        </Text>
      </SafeAreaView>
    </Container>
  );
};

const styles = StyleSheet.create({
  urlTitle: {
    ...TotaraTheme.textH3
  },
  urlInformation: {
    ...TotaraTheme.textRegular,
    color: TotaraTheme.colorNeutral6
  },
  siteUrlContainer: {
    marginHorizontal: gutter
  },
  totaraLogo: {
    marginTop: margins.margin2XL,
    width: deviceScreen.width * 0.33,
    alignSelf: "center"
  },
  headerContainer: {
    height: deviceScreen.height * 0.45,
    justifyContent: "space-between"
  },
  formContainer: {
    marginTop: margins.margin2XL
  },
  inputText: {
    paddingRight: 0,
    paddingLeft: 0
  },
  buttonEnter: {
    marginTop: margins.marginS
  },
  version: {
    textAlign: "center",
    marginBottom: margins.marginS,
    flexDirection: "column-reverse"
  }
});

export default SiteUrl;
