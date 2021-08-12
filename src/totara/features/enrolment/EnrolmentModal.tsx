/**
 * This file is part of Totara Enterprise.
 *
 * Copyright (C) 2021 onwards Totara Learning Solutions LTD
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

import React, { useLayoutEffect } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Input } from "react-native-elements/dist/input/Input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { PrimaryButton, SecondaryButton } from "@totara/components";
import { translate } from "@totara/locale";
import { fontWeights, margins, paddings } from "@totara/theme/constants";
import { TotaraTheme } from "@totara/theme/Theme";
import { NetworkStatus, useQuery } from "@apollo/client";
import { enrolmentInfoQuery } from "./api";

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingLeft: paddings.paddingXL,
    paddingRight: paddings.paddingXL
  },
  widgetContainer: {
    borderTopWidth: 1,
    borderColor: TotaraTheme.colorNeutral5,
    paddingVertical: paddings.paddingXL
  },
  widgetTitle: {
    ...TotaraTheme.textRegular,
    fontWeight: fontWeights.fontWeightBold
  },
  input: {
    paddingLeft: 0,
    marginTop: margins.marginL
  },
  button: {
    marginTop: margins.marginL
  },
  loadingEnrolmentData: {
    paddingHorizontal: paddings.paddingXL,
    justifyContent: "center",
    flex: 1,
    alignItems: "center"
  }
});

const GuestAccessWidget = ({ requirePassword }: { requirePassword: boolean }) => {
  return (
    <View testID={"guest_access_widget"} style={styles.widgetContainer}>
      <Text style={styles.widgetTitle}>{translate("enrolment_options.guest_access")}</Text>
      {requirePassword && (
        <Input
          containerStyle={styles.input}
          placeholder={translate("enrolment_options.password_required")}
          clearButtonMode="while-editing"
          autoCapitalize="none"
          testID={"guest_access_password"}
          returnKeyType={"done"}
        />
      )}
      <PrimaryButton
        testID={"guest_access_button"}
        style={styles.button}
        text={translate("enrolment_options.go_to_course")}
        onPress={() => null}
      />
    </View>
  );
};

const SelfEnrolmentWidget = ({
  id,
  requiresEnrolmentKey,
  customName,
  roleName
}: {
  id: string;
  requiresEnrolmentKey: boolean;
  customName: string;
  roleName: string;
}) => {
  const title = customName ? customName : translate("enrolment_options.self_enrolment_title", { roleName: roleName });
  return (
    <View testID={"self_enrolment_widget_" + id} style={styles.widgetContainer}>
      <Text style={styles.widgetTitle}>{title}</Text>
      {requiresEnrolmentKey && (
        <Input
          containerStyle={styles.input}
          placeholder={translate("enrolment_options.enrolment_key")}
          clearButtonMode="while-editing"
          autoCapitalize="none"
          testID={"self_enrolment_enrolment_key"}
          returnKeyType={"done"}
        />
      )}
      <PrimaryButton
        testID={"self_enrolment_button"}
        style={styles.button}
        text={translate("enrolment_options.enrol_me")}
        onPress={() => null}
      />
    </View>
  );
};

const EnrolmentOptionsContent = ({ enrolmentOptions }: { enrolmentOptions: any }) => {
  return (
    <KeyboardAwareScrollView style={styles.mainContainer}>
      {enrolmentOptions.map((enrolmentOption) => {
        const { id, type, passwordRequired, customName, roleName } = enrolmentOption;

        if (type === "guest") {
          return <GuestAccessWidget key={id} requirePassword={passwordRequired} />;
        }
        return (
          <SelfEnrolmentWidget
            key={id}
            id={id}
            requiresEnrolmentKey={passwordRequired}
            customName={customName}
            roleName={roleName}
          />
        );
      })}
    </KeyboardAwareScrollView>
  );
};

const LoadingEnrolmentData = () => {
  return (
    <View testID={"loading_enrolment_data"} style={styles.loadingEnrolmentData}>
      <ActivityIndicator />
      <Text style={{ marginTop: margins.marginL, textAlign: "center" }}>
        {translate("enrolment_options.loading_enrolment_data")}
      </Text>
    </View>
  );
};

const LoadingError = ({ onTryReload }: { onTryReload: () => void }) => {
  return (
    <View testID={"loading_error"} style={styles.loadingEnrolmentData}>
      <Text style={{ paddingTop: paddings.paddingL, textAlign: "center" }}>
        {translate("enrolment_options.loading_enrolment_error")}
      </Text>
      <View style={{ marginTop: margins.marginL }}>
        <SecondaryButton text={translate("general.try_again")} onPress={onTryReload}></SecondaryButton>
      </View>
    </View>
  );
};

type EnrolmentModalParamList = {
  EnrolmentModal: {
    targetId: string;
  };
};

export const EnrolmentModal = () => {
  const navigation = useNavigation();
  const { params } = useRoute<RouteProp<EnrolmentModalParamList, "EnrolmentModal">>();
  const { targetId } = params;

  const { data, networkStatus, error, refetch } = useQuery(enrolmentInfoQuery, {
    variables: { courseid: targetId },
    fetchPolicy: "no-cache"
  });

  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: translate("enrolment_options.title") });
  });

  if (!data && (networkStatus === NetworkStatus.loading || networkStatus === NetworkStatus.refetch))
    return <LoadingEnrolmentData />;

  if (error || networkStatus === NetworkStatus.error)
    return (
      <LoadingError
        onTryReload={() => {
          refetch();
        }}
      />
    );

  const { enrolmentInfo } = data;
  const { enrolmentOptions } = enrolmentInfo;

  return <EnrolmentOptionsContent enrolmentOptions={enrolmentOptions} />;
};
