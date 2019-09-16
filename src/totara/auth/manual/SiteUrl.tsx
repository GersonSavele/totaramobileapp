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
  Text
} from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Form, Input, Content, Container } from "native-base";

import { resizeByScreenSize, theme, gutter, h1, h3 } from "@totara/theme";
import { PrimaryButton, InputTextWithInfo } from "@totara/components";
import { translate } from "@totara/locale";
import { OutProps } from "./SiteUrlHook";
import AuthErrorModal from "./AuthErrorModal";

const SiteUrl = ({siteUrlState, onChangeInputSiteUrl, onSubmit}: OutProps) => {
  return <Container>
    <Content>
      <Form style={styles.siteUrlContainer}>
        <View style={styles.container}>
          <Image source={require("@resources/images/totara_logo.png")} style={styles.totaraLogo} resizeMode="stretch"/>
          <View>
            <Text style={styles.infoTitle}>{translate("manual.site_url_title")}</Text>
            <Text style={styles.infoDescription}>{translate("manual.site_url_information")}</Text>
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
              onChangeText={onChangeInputSiteUrl}
              value={siteUrlState.inputSiteUrl}
              style={styles.inputText}
              autoFocus={true}/>
          </InputTextWithInfo>
          <PrimaryButton onPress={onSubmit} text={translate("general.enter")} style={styles.buttonEnter}/>
        </View>
      </Form>
    </Content>
  </Container>
};

const styles = StyleSheet.create({
  siteUrlContainer: {
    marginHorizontal: gutter,
    flex: 1
  },
  totaraLogo: {
    marginTop: resizeByScreenSize(32, 128, 128, 128),
    height: resizeByScreenSize(68, 68, 87, 87),
    width: resizeByScreenSize(94, 94, 120, 120),
    alignSelf: "center"
  },
  container: {
    height: hp(45),
    justifyContent: "space-between"
  },
  infoTitle: {
    fontSize: h1,
    color: theme.h1Color
  },
  infoDescription: {
    fontSize: h3,
    color: theme.h3Color
  },
  formContainer: {
    marginVertical: resizeByScreenSize(10, 20, 20, 20)
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
