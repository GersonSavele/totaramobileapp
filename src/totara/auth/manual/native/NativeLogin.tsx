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

import React, {useContext} from "react";
import { StyleSheet, View, Image, Text, TouchableOpacity, Linking } from "react-native";
import { Form, Input, Container, Content } from "native-base";
import SafeAreaView from "react-native-safe-area-view";

import { config } from "@totara/lib";
import { resizeByScreenSize, gutter, ThemeContext} from "@totara/theme";
import { PrimaryButton, InputTextWithInfo, TouchableIcon, FormError } from "@totara/components";
import { translate } from "@totara/locale";

import { OutProps } from "./NativeFlowHook";

const NativeLogin = ({
  nativeLoginState,
  onSetupSecretCancel,
  siteUrl,
  onClickEnter,
  inputUsernameWithShowError,
  inputPasswordWithShowError,
  onFocusInput
}: OutProps) => {
  const [ theme ] = useContext(ThemeContext);
  return (
    <Container style={[{ flex: 0 }, theme.viewContainer]}>
      <View style={{ backgroundColor: theme.colorSecondary1, zIndex: 3 }}>
        <SafeAreaView />
        <View style={styles.navigation}>
          <TouchableIcon onPress={() => { onSetupSecretCancel()}} icon={"times"} disabled={false} color={theme.navigationHeaderTintColor} />
        </View>
      </View>
      <View style={{position: "relative", zIndex: 2}}>
        <FormError message={translate("native-login.error_unauthorized")} isShow={nativeLoginState.errorStatusUnauthorized} />
      </View>
      <Content style={styles.content} enableOnAndroid>
        <Image source={theme.urlLogo ? { uri: theme.urlLogo } : require("@resources/images/totara_logo/totara_logo.png")} style={styles.totaraLogo} resizeMode={"contain"} />
        <View style={styles.infoContainer}>
          <Text style={theme.textH2}>{translate("native-login.header_title")}</Text>
          <Text style={theme.textH4}>{translate("native-login.login_information")}</Text>
        </View>
        <Form>
          <View style={styles.formInputContainer}>
            <InputTextWithInfo placeholder={translate("native-login.username_text_placeholder")} message={(nativeLoginState.inputUsernameStatus == "error")? translate("message.enter_valid_username"): undefined}
              status={nativeLoginState.inputUsernameStatus} >
              <Input
                clearButtonMode="while-editing"
                autoCapitalize="none"
                onChangeText={inputUsernameWithShowError}
                value={nativeLoginState.inputUsername}
                style={styles.inputText}
                onFocus={onFocusInput}
              />
            </InputTextWithInfo>
          </View>
          <View style={styles.formInputContainer}>
            <InputTextWithInfo placeholder={translate("native-login.password_text_placeholder")}  message={(nativeLoginState.inputPasswordStatus == "error")? translate("message.enter_valid_password"): undefined}
              status={nativeLoginState.inputPasswordStatus} >
              <Input
                secureTextEntry={true}
                clearButtonMode="while-editing"
                onChangeText={inputPasswordWithShowError}
                value={nativeLoginState.inputPassword}
                style={styles.inputText}
                onFocus={onFocusInput}
              />
            </InputTextWithInfo>
          </View>
          <View style={[ styles.forgotCredentialContainer, theme.textB1 ]}>
            <TouchableOpacity onPress={() => { Linking.openURL(config.forgotPasswordUri(siteUrl)); }} >
              <Text style={styles.forgotCredential}>{translate("native-login.forgot_username_password")}</Text>
            </TouchableOpacity>
          </View>
          <PrimaryButton onPress={onClickEnter} text={translate("general.enter")} mode={nativeLoginState.isRequestingLogin ? "loading": undefined} />
        </Form>
      </Content>
    </Container>    
  );
}

const styles = StyleSheet.create({
  navigation: {
    alignItems: "flex-start",
    borderBottomWidth: 0,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  content: {
    paddingHorizontal: gutter,
  },
  totaraLogo: {
    height: resizeByScreenSize(72, 72, 88, 88),
    width: "100%",
    marginTop: 24
  },
  infoContainer: {
    justifyContent: "space-between",
    textAlignVertical: "center",
    marginBottom: resizeByScreenSize(32, 32, 32, 32),
    marginTop: 32
  },
  formInputContainer: {
    marginBottom: 8
  },
  inputText: {
    paddingLeft: 0,
    marginLeft: 0
  },
  forgotCredentialContainer: {
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 8
  },
  forgotCredential: {
    padding: 16,
    textDecorationLine: "underline",
    textAlign: "center"
  }
});

export default NativeLogin;
