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
  Alert
} from "react-native";
import { Cell, TableView } from "react-native-tableview-simple";
import { useQuery } from "@apollo/react-hooks";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { AuthConsumer, AuthContext } from "@totara/core";
import { ThemeContext, normalize } from "@totara/theme";
import GeneralErrorModal from "@totara/components/GeneralErrorModal";
import { UserProfile } from "@totara/types";
import { AUTHORIZATION } from "@totara/lib/constants";
import { userOwnProfile } from "./api";

import { translate } from "@totara/locale";
import { NetworkStatus as NS } from "apollo-boost";
import { Container } from "native-base";
import { fontSizes, margins, paddings } from "@totara/theme/constants";
import { NetworkStatus } from "@totara/components";

type ProfileViewProps = {
  profile: UserProfile;
};

const Profile = () => {
  const { loading, error, data, refetch, networkStatus } = useQuery(
    userOwnProfile
  );
  if (loading) return <Text>Loading...</Text>;
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
  const [theme] = useContext(ThemeContext);
  const {
    authContextState: { appState }
  } = useContext(AuthContext);
  const apiKey = appState!.apiKey;

  const confirmationLogout = (auth) =>
    Alert.alert(
      "Confirmation",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel"
        },
        { text: "Yes", onPress: () => auth.logOut() }
      ],
      { cancelable: false }
    );

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
            {translate("user_profile.login_as")}: {profile.username}
          </Text>
        </View>
      </View>

      <View style={styles.manageHeader}>
        <Text
          style={[
            [
              theme.textH2,
              { fontWeight: "bold", fontSize: fontSizes.fontSizeL }
            ]
          ]}>
          {translate("user_profile.manage_section")}
        </Text>
      </View>
      <View
        style={[
          styles.itemsContainer,
          { backgroundColor: theme.colorSecondary1 }
        ]}>
        <TableView>
          {/* <Cell // To Do : this ui for future implementation
            cellContentView={
              <Text style={[theme.textB2, { width: wp("100%") - 50 }]}>
                Your profile
              </Text>
            }
            onPress={() => Log.debug("Cell is clicked")}
            accessory="DisclosureIndicator"
          />
          <View style={{ height: 1, paddingLeft: 20 }}></View> */}
          {/* <Cell
            cellContentView={
              <Text style={[theme.textB2, { width: wp("100%") - 50 }]}>
                {translate("user_profile.setting_cell")}
              </Text>
            }
            onPress={() => {
              navigation.navigate(NAVIGATION_SETTING);
            }}
            accessory="DisclosureIndicator"
          /> */}

          <View style={{ marginTop: 1 }}>
            <AuthConsumer>
              {(auth) => (
                <Cell
                  cellContentView={
                    <Text
                      style={[
                        theme.textB2,
                        { margin: 0, fontSize: fontSizes.fontSizeM }
                      ]}>
                      {translate("user_profile.logout")}
                    </Text>
                  }
                  onPress={() => {
                    confirmationLogout(auth);
                  }}
                />
              )}
            </AuthConsumer>
          </View>
        </TableView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContent: {
    padding: paddings.margin2XL,
    alignItems: "center"
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    marginBottom: margins.marginS
  },
  manageHeader: {
    height: 30,
    margin: margins.marginL
  },
  itemsContainer: {
    marginLeft: margins.marginS,
    marginRight: margins.marginS
  }
});

export default Profile;
