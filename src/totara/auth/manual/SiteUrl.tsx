/**
 * This file is part of Totara Mobile
 *
 * Copyright (C) 2019 onwards Totara Learning Solutions LTD
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @author: Kamala Tennakoon <kamala.tennakoon@totaralearning.com>
 */
import { Container, Content, Form, Input } from "native-base";
import React, { useContext } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp
} from "react-native-responsive-screen";
import SafeAreaView from "react-native-safe-area-view";
import VersionInfo from "react-native-version-info";
import { useSiteUrl, Props } from "./SiteUrlHook";

import { InputTextWithInfo, PrimaryButton } from "@totara/components";
import { translate } from "@totara/locale";
import { gutter, resizeByScreenSize, ThemeContext } from "@totara/theme";

const SiteUrl = (props: Props) => {
  const [theme] = useContext(ThemeContext);
  const {
    siteUrlState,
    onChangeInputSiteUrl,
    onSubmit,
    isSiteUrlSubmitted
  } = useSiteUrl(props);

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
              <Text style={theme.textH2}>
                {translate("manual.site_url_title")}
              </Text>
              <Text style={theme.textH4}>
                {translate("manual.site_url_information")}
              </Text>
            </View>
          </View>
          <View style={styles.formContainer}>
            <InputTextWithInfo
              placeholder={translate("manual.site_url_text_placeholder")}
              message={siteUrlState.inputSiteUrlMessage}
              status={siteUrlState.inputSiteUrlStatus}
            >
              <Input
                keyboardType="url"
                clearButtonMode="while-editing"
                autoCapitalize="none"
                onChangeText={onChangeInputSiteUrl}
                value={siteUrlState.inputSiteUrl}
                style={styles.inputText}
                autoFocus={!isSiteUrlSubmitted}
                testID={"urlInput"}
              />
            </InputTextWithInfo>
            <PrimaryButton
              onPress={onSubmit}
              text={translate("general.enter")}
              style={styles.buttonEnter}
              mode={isSiteUrlSubmitted == true ? "loading" : undefined}
            />
          </View>
        </Form>
      </Content>
      <SafeAreaView>
        <Text
          style={[
            styles.version,
            theme.textLabel,
            { color: theme.textColorDisabled }
          ]}
        >
          {translate("general.version")}: {VersionInfo.appVersion}(
          {VersionInfo.buildVersion})
        </Text>
      </SafeAreaView>
    </Container>
  );
};

const styles = StyleSheet.create({
  siteUrlContainer: {
    marginHorizontal: gutter
  },
  totaraLogo: {
    marginTop: 64,
    width: wp(33),
    alignSelf: "center"
  },
  headerContainer: {
    height: hp(45),
    justifyContent: "space-between"
  },
  formContainer: {
    marginTop: resizeByScreenSize(32, 32, 32, 32)
  },
  inputText: {
    paddingRight: 0,
    paddingLeft: 0
  },
  buttonEnter: {
    marginTop: 8
  },
  version: {
    textAlign: "center",
    marginBottom: 8,
    flexDirection: "column-reverse"
  }
});

export default SiteUrl;
