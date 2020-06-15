/**
 *
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
 *
 */

import React, { useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  RefreshControl,
  Alert,
  TouchableOpacity
} from "react-native";
import { useQuery } from "@apollo/react-hooks";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { AuthConsumer, AuthContext } from "@totara/core";
import { ThemeContext, normalize } from "@totara/theme";
import GeneralErrorModal from "@totara/components/GeneralErrorModal";
import { UserProfile } from "@totara/types";
import { AUTHORIZATION, NAVIGATION } from "@totara/lib/constants";
import { userOwnProfile } from "./api";

import { translate } from "@totara/locale";
import { NetworkStatus as NS } from "apollo-boost";
import { Container } from "native-base";
import { iconSizes, margins, paddings } from "@totara/theme/constants";
import { Loading, NetworkStatus } from "@totara/components";
import { TotaraTheme } from "@totara/theme/Theme";
import { NavigationContext } from "react-navigation";

type ProfileViewProps = {
  profile: UserProfile;
};

const Profile = () => {
  const { loading, error, data, refetch, networkStatus } = useQuery(
    userOwnProfile
  );
  if (loading) return <Loading />;
  if (error) return <GeneralErrorModal siteUrl="" />;
  if (data) {
    return (
      <Container>
        <NetworkStatus />
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={networkStatus === NS.refetch}
              onRefresh={refetch}
            />
          }>
          <ProfileView profile={data.profile} />
        </ScrollView>
      </Container>
    );
  }
};

const ProfileView = ({ profile }: ProfileViewProps) => {
  const navigation = useContext(NavigationContext);
  const [theme] = useContext(ThemeContext);
  const {
    authContextState: { appState }
  } = useContext(AuthContext);
  const apiKey = appState!.apiKey;

  const confirmationLogout = (auth) =>
    Alert.alert(
      translate("user_profile.logout.title"),
      translate("user_profile.logout.message"),
      [
        {
          text: translate("general.cancel"),
          onPress: () => {},
          style: "cancel"
        },
        { text: translate("general.yes"), onPress: () => auth.logOut() }
      ],
      { cancelable: false }
    );

  const goToAbout = () => {
    navigation.navigate(NAVIGATION.NAVIGATION_ABOUT);
  };

  return (
    <View style={[theme.viewContainer]}>
      <View style={{ backgroundColor: theme.colorSecondary1 }}>
        <View style={styles.headerContent}>
          {profile.profileimage.indexOf("theme/image.php/basis/core/") == -1 ? (
            <Image
              style={styles.avatar}
              source={{
                uri: profile.profileimage,
                headers: {
                  [AUTHORIZATION]: `Bearer ${apiKey}`
                }
              }}
            />
          ) : (
            <View
              style={[
                styles.avatar,
                {
                  backgroundColor: theme.colorNeutral3,
                  alignItems: "center",
                  justifyContent: "center"
                }
              ]}>
              <FontAwesomeIcon
                icon={"user"}
                color={theme.colorNeutral4}
                size={65}
              />
            </View>
          )}
          <Text
            style={[
              theme.textH2,
              { fontWeight: "bold", fontSize: normalize(22) }
            ]}>
            {profile.firstname} {profile.surname}
          </Text>
          <Text
            style={[
              theme.textB3,
              { color: theme.textColorSubdued, fontSize: normalize(15) }
            ]}>
            {profile.email}
          </Text>
          <Text
            style={[
              theme.textSmall,
              {
                color: theme.textColorSubdued,
                marginTop: 6,
                fontSize: normalize(12)
              }
            ]}>
            {translate("user_profile.login_as", { username: profile.username })}
          </Text>
        </View>
      </View>

      <View style={styles.manageSection}>
        <Text style={styles.manageTitle}>
          {translate("user_profile.manage_section")}
        </Text>
        <View style={styles.manageOptions}>
          <View style={[styles.sectionOption, { flexDirection: "row" }]}>
            <TouchableOpacity onPress={goToAbout} style={{ flex: 1 }}>
              <Text style={TotaraTheme.textB1}>
                {translate("user_profile.about")}
              </Text>
            </TouchableOpacity>
            <View
              style={{
                alignSelf: "flex-end",
                alignContent: "flex-end",
                justifyContent: "flex-end"
              }}>
              <FontAwesomeIcon
                icon={"angle-right"}
                size={iconSizes.sizeM}
                style={{ alignSelf: "center" }}
                color={TotaraTheme.colorNeutral4}
              />
            </View>
          </View>

          <View style={styles.sectionOption}>
            <AuthConsumer>
              {(auth) => (
                <TouchableOpacity onPress={() => confirmationLogout(auth)}>
                  <Text style={TotaraTheme.textB1}>
                    {translate("user_profile.logout.button_text")}
                  </Text>
                </TouchableOpacity>
              )}
            </AuthConsumer>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContent: {
    padding: paddings.padding2XL,
    alignItems: "center"
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    marginBottom: margins.marginS
  },
  manageSection: {
    margin: margins.marginM
  },
  manageTitle: {
    ...TotaraTheme.textH2
  },
  manageOptions: {
    marginTop: margins.marginM
  },
  sectionOption: {
    paddingTop: paddings.paddingXL,
    paddingBottom: paddings.paddingXL,
    marginBottom: margins.marginS,
    borderBottomColor: TotaraTheme.colorNeutral3,
    borderBottomWidth: 1
  }
});

export default Profile;
