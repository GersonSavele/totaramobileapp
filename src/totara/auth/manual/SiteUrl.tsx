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
import React from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  StatusBar
} from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { Form, Input, Container, Content } from "native-base";

import { resizeByScreenSize, gutter, fontSizeH2, fontSizeH4, textColorDark, colorSecondary4, lineHeightH2, lineHeightH4 } from "@totara/theme";
import { PrimaryButton, InputTextWithInfo } from "@totara/components";
import { translate } from "@totara/locale";
import { OutProps } from "./SiteUrlHook";

const SiteUrl = ({siteUrlState, onChangeInputSiteUrl, onSubmit}: OutProps) => {

  return (
    <Container style={{ flex: 1, backgroundColor: colorSecondary4 }}>
      <Content>
        <StatusBar barStyle={"default"} />
        <Form style={styles.siteUrlContainer}>
          <View style={styles.container}>
            <Image source={require("@resources/images/totara_logo/totara_logo.png")} style={styles.totaraLogo} resizeMode="contain" />
            <View>
              <Text style={styles.infoTitle}>{translate("manual.site_url_title")}</Text>
              <Text style={styles.infoDescription}>{translate("manual.site_url_information")}</Text>
            </View>
          </View>
          <View style={styles.formContainer}>
            <InputTextWithInfo placeholder={translate("manual.site_url_text_placeholder")} message={siteUrlState.inputSiteUrlMessage} status={siteUrlState.inputSiteUrlStatus} >
              <Input
                keyboardType="url"
                clearButtonMode="while-editing"
                autoCapitalize="none"
                onChangeText={onChangeInputSiteUrl}
                value={siteUrlState.inputSiteUrl}
                style={styles.inputText}
                autoFocus={true}
              />
            </InputTextWithInfo>
            <PrimaryButton onPress={onSubmit} text={translate("general.enter")} style={styles.buttonEnter} />
          </View>
        </Form>
      </Content>
    </Container>
  );
};

const styles = StyleSheet.create({
  siteUrlContainer: {
    marginHorizontal: gutter,
    flex: 1
  },
  totaraLogo: {
    marginTop: 64,
    width: wp(33),
    alignSelf: "center"
  },
  container: {
    height: hp(45),
    justifyContent: "space-between"
  },
  infoTitle: {
    fontSize: fontSizeH2,
    lineHeight: lineHeightH2,
    color: textColorDark
  },
  infoDescription: {
    fontSize: fontSizeH4,
    lineHeight: lineHeightH4,
    color: textColorDark
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
  }
});

export default SiteUrl;
