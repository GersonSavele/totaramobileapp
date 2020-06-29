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
  ScrollView,
  RefreshControl,
  Alert,
  TouchableOpacity
} from "react-native";
import { useQuery } from "@apollo/react-hooks";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { AuthConsumer } from "@totara/core";
import GeneralErrorModal from "@totara/components/GeneralErrorModal";
import { UserProfile } from "@totara/types";
import { NAVIGATION } from "@totara/lib/navigation";
import { userOwnProfile } from "./api";

import { translate } from "@totara/locale";
import { NetworkStatus as NS } from "apollo-boost";
import { Container } from "native-base";
import { margins, paddings } from "@totara/theme/constants";
import { Loading, NetworkStatus, ImageWrapper } from "@totara/components";
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
    navigation.navigate(NAVIGATION.ABOUT);
  };

  const useDefaultImage =
    profile.profileimage.indexOf("theme/image.php/basis/core/") >= 0; //TODO: WEIRD WORKAROUND WE SUPPOSE TO FIX ONE DAY

  return (
    <View style={[TotaraTheme.viewContainer]}>
      <View style={{ backgroundColor: TotaraTheme.colorSecondary1 }}>
        <View style={styles.headerContent}>
          {!useDefaultImage ? (
            <ImageWrapper url={profile.profileimage} style={styles.avatar} />
          ) : (
            <View style={styles.avatar}>
              <FontAwesomeIcon
                icon={"user"}
                color={TotaraTheme.colorNeutral4}
                size={65}
              />
            </View>
          )}
          <Text style={styles.userDetails}>
            {profile.firstname} {profile.surname}
          </Text>
          <Text style={styles.userEmail}>{profile.email}</Text>
          <Text style={styles.userLoginAs}>
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
              <Text style={TotaraTheme.textRegular}>
                {translate("user_profile.about")}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sectionOption}>
            <AuthConsumer>
              {(auth) => (
                <TouchableOpacity onPress={() => confirmationLogout(auth)}>
                  <Text style={TotaraTheme.textRegular}>
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
    marginBottom: margins.marginS,
    backgroundColor: TotaraTheme.colorNeutral3,
    alignItems: "center",
    justifyContent: "center"
  },
  userDetails: {
    ...TotaraTheme.textHeadline
  },
  userEmail: {
    ...TotaraTheme.textXSmall,
    ...{ color: TotaraTheme.colorNeutral6 }
  },
  userLoginAs: {
    ...TotaraTheme.textXSmall,
    ...{
      color: TotaraTheme.colorNeutral6,
      marginTop: 6
    }
  },
  manageSection: {
    margin: margins.marginM
  },
  manageTitle: {
    ...TotaraTheme.textHeadline
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
