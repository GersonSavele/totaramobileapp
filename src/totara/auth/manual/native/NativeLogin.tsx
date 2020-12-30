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

import React, { useContext } from "react";
import { StyleSheet, View, Image, Text, TouchableOpacity, Linking } from "react-native";
import { Form, Input, Container, Content } from "native-base";
import SafeAreaView from "react-native-safe-area-view";

import { config } from "@totara/lib";
import { gutter, ThemeContext } from "@totara/theme";
import { PrimaryButton, InputTextWithInfo, FormError } from "@totara/components";
import { translate } from "@totara/locale";
import { fetchData } from "@totara/core/AuthRoutines";

import { ManualFlowChildProps } from "../ManualFlowChildProps";
import { useNativeFlow } from "./NativeFlowHook";
import { margins } from "@totara/theme/constants";
import { TotaraTheme } from "@totara/theme/Theme";
import { TEST_IDS } from "@totara/lib/testIds";
import CloseButton from "@totara/components/CloseButton";

const NativeLogin = (props: ManualFlowChildProps) => {
  // fetch from global
  // eslint-disable-next-line no-undef
  const fetchDataWithFetch = fetchData(fetch);

  const {
    nativeLoginState,
    onManualFlowCancel,
    onClickEnter,
    inputUsernameWithShowError,
    inputPasswordWithShowError,
    onFocusInput
  } = useNativeFlow(fetchDataWithFetch)(props);

  const [theme] = useContext(ThemeContext);

  return (
    <Container style={[{ flex: 0 }, theme.viewContainer]}>
      <View style={{ backgroundColor: theme.colorSecondary1, zIndex: 3 }}>
        <SafeAreaView />
        <View style={styles.navigation}>
          <CloseButton onPress={onManualFlowCancel} />
        </View>
      </View>
      <View style={{ position: "relative", zIndex: 2 }}>
        <FormError
          message={translate("native_login.error_unauthorized")}
          isShow={nativeLoginState.errorStatusUnauthorized}
        />
      </View>
      <Content style={styles.content} enableOnAndroid>
        <Image
          source={theme.urlLogo ? { uri: theme.urlLogo } : require("@resources/images/totara_logo/totara_logo.png")}
          style={styles.totaraLogo}
          resizeMode={"contain"}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.loginTitle}>{translate("native_login.header_title")}</Text>
          <Text style={styles.loginInformation}>{translate("native_login.login_information")}</Text>
        </View>
        <Form>
          <View>
            <InputTextWithInfo
              placeholder={translate("native_login.username_text_placeholder")}
              message={
                nativeLoginState.inputUsernameStatus == "error"
                  ? translate("native_login.validation.enter_valid_username")
                  : undefined
              }
              status={nativeLoginState.inputUsernameStatus}>
              <Input
                clearButtonMode="while-editing"
                autoCapitalize="none"
                onChangeText={inputUsernameWithShowError}
                value={nativeLoginState.inputUsername}
                style={styles.inputText}
                onFocus={onFocusInput}
                testID={TEST_IDS.USER_INPUT}
              />
            </InputTextWithInfo>
          </View>
          <View>
            <InputTextWithInfo
              placeholder={translate("native_login.password_text_placeholder")}
              message={
                nativeLoginState.inputPasswordStatus == "error"
                  ? translate("native_login.validation.enter_valid_password")
                  : undefined
              }
              status={nativeLoginState.inputPasswordStatus}>
              <Input
                secureTextEntry={true}
                clearButtonMode="while-editing"
                onChangeText={inputPasswordWithShowError}
                value={nativeLoginState.inputPassword}
                style={styles.inputText}
                onFocus={onFocusInput}
                testID={TEST_IDS.USER_PW}
              />
            </InputTextWithInfo>
          </View>
          <PrimaryButton
            onPress={onClickEnter}
            text={translate("general.enter")}
            mode={nativeLoginState.isRequestingLogin ? "loading" : undefined}
            testID={TEST_IDS.LOGIN}
          />
          <View style={[styles.forgotCredentialContainer, theme.textRegular]}>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(config.forgotPasswordUri(props.siteUrl));
              }}>
              <Text style={styles.forgotCredential}>{translate("native_login.forgot_username_password")}</Text>
            </TouchableOpacity>
          </View>
        </Form>
      </Content>
    </Container>
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
    alignItems: "flex-start",
    borderBottomWidth: 0,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  content: {
    paddingHorizontal: gutter
  },
  totaraLogo: {
    height: 88,
    width: "100%",
    marginTop: margins.marginXL
  },
  infoContainer: {
    justifyContent: "space-between",
    textAlignVertical: "center",
    marginBottom: margins.marginM,
    marginTop: margins.margin2XL
  },
  inputText: {
    paddingLeft: 0,
    marginLeft: 0
  },
  forgotCredentialContainer: {
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: margins.marginS
  },
  forgotCredential: {
    padding: margins.marginL,
    color: TotaraTheme.colorLink,
    textAlign: "center"
  }
});

export default NativeLogin;
