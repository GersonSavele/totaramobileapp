/*
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
 * @author Jun Yamog <jun.yamog@totaralearning.com
 */

import React, { useEffect, useContext } from "react";
import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import { Cell, TableView } from "react-native-tableview-simple";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { Query } from "react-apollo";
import { AuthConsumer } from "@totara/core";
import { NavigationInjectedProps } from "react-navigation";
import { NAVIGATION_SETTING } from "@totara/lib/Constant";
import { ThemeContext } from "@totara/theme";
import { UserOwnProfile } from "./api";
import GeneralErrorModal from "@totara/components/GeneralErrorModal";
import { UserProfile } from "@totara/types";

type Response = {
  profile: UserProfile;
};

type ProfileViewProps = {
  profile: UserProfile
  navigation:  NavigationInjectedProps
}

const Profile = ({ navigation }: NavigationInjectedProps) => {
  useEffect(() => {
    // To Do: React Navigation 5.x haven't released yet,We need to stop re-render set navigation title.
    // We should remove following line from inside of useEffect once they update their library
    navigation.setParams({ title: "Profile" });
  }, []);
  return (
    <Query<Response> query={UserOwnProfile}>
      {({ loading, data, error }) => {
        if (loading) return <Text>Loading...</Text>
        if (error) return <GeneralErrorModal />
        if (data) {
          return <ProfileViewDidAppear profile = {data.profile} navigation = {navigation}/>
        }
      }}
    </Query>
  );
};

const ProfileViewDidAppear = ({ profile, navigation }: ProfileViewProps) => {
  const [theme] = useContext(ThemeContext);
  return (
    <View style={[theme.viewContainer]}>
      <View style={{ backgroundColor: theme.colorSecondary1 }}>
        <View style={styles.headerContent}>
          <Image
            style={styles.avatar}
            source={{
              uri: profile.profileimage
            }}
          />
          <Text style={[theme.textH3]}>
            {profile.firstname} {profile.username}
          </Text>
          <Text style={[theme.textB3, { color: theme.textColorSubdued }]}>
            {profile.email}
          </Text>
          <Text
            style={[
              theme.textSmall,
              { color: theme.textColorSubdued, marginTop: 4 }
            ]}
          >
            Logged in as : {profile.username}
          </Text>
        </View>
      </View>
      <View style={styles.info}>
        <Text style={[theme.textH2]}>Manage</Text>
      </View>
      <ScrollView
        contentContainerStyle={{ backgroundColor: theme.colorSecondary1 }}
      >
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
          <Cell
            cellContentView={
              <Text style={[theme.textB2, { width: wp("100%") - 50 }]}>
                Settings
              </Text>
            }
            onPress={() => {
              navigation.navigate(NAVIGATION_SETTING);
            }}
            accessory="DisclosureIndicator"
          />
          <View style={{ height: 1, paddingLeft: 20 }}></View>
          <AuthConsumer>
            {auth => (
              <Cell
                cellContentView={
                  <Text style={[theme.textB2, { width: wp("100%") - 50 }]}>
                    Logout
                  </Text>
                }
                onPress={() => {
                  auth.logOut();
                }}
              />
            )}
          </AuthConsumer>
          <View style={{ height: 1, paddingLeft: 20 }}></View>
        </TableView>
      </ScrollView>
    </View>
  );
};

Profile.navigationOptions = () => ({
  title: "Profile"
});

export default Profile;

const styles = StyleSheet.create({
  headerContent: {
    padding: 24,
    alignItems: "center"
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    marginBottom: 10
  },
  info: {
    width: "100%",
    height: 30,
    marginTop: 16,
    marginLeft: 15,
    marginBottom: 16
  }
});
