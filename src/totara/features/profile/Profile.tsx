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
import { useQuery } from '@apollo/react-hooks';
import { AuthConsumer } from "@totara/core";
import { NavigationInjectedProps, NavigationParams } from "react-navigation";
import { NAVIGATION_SETTING } from "@totara/lib/Constant";
import { ThemeContext } from "@totara/theme";
import { userOwnProfile } from "./api";
import GeneralErrorModal from "@totara/components/GeneralErrorModal";
import { UserProfile } from "@totara/types";
import { AuthContext } from "@totara/core";
import { AUTHORIZATION } from "@totara/lib/Constant";
// @ts-ignore no types published yet for fortawesome react-native, they do have it react so check in future and remove this ignore
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { translate } from "@totara/locale";

type Response = {
  profile: UserProfile;
};

type ProfileViewProps = {
  profile: UserProfile
  navigation:  NavigationParams
}

const Profile = ({ navigation }: NavigationInjectedProps) => {
  useEffect(() => {
    // To Do: React Navigation 5.x haven't released yet,We need to stop re-render set navigation title.
    // We should remove following line from inside of useEffect once they update their library
    navigation.setParams({ title: "Profile" });
  }, []);

  const { loading, error, data } = useQuery(userOwnProfile);
  if (loading) return <Text>Loading...</Text>
  if (error) return <GeneralErrorModal siteUrl = ""/>
  if (data) {
    return <ProfileViewDidAppear profile = {data.profile} navigation = {navigation}/>
  }
};

const ProfileViewDidAppear = ({ profile, navigation }: ProfileViewProps) => {
  // To Do: Mean while, we need to determine, user profile image is default or not from hacking url which is received from API
  //However, after fixing api we should clean code in this ticket - MOB-386 
  const [theme] = useContext(ThemeContext);
  const { authContextState: {appState} } = useContext(AuthContext);
  const apiKey = appState!.apiKey;
  return (
    <View style={[theme.viewContainer]}>
      <View style={{ backgroundColor: theme.colorSecondary1 }}>
        <View style={styles.headerContent}>
          {profile.profileimage.indexOf("theme/image.php/basis/core/") == -1?
           <Image
           style={styles.avatar}
           source={{
             uri: profile.profileimage,
             headers: {
               [AUTHORIZATION]: `Bearer ${apiKey}`
             }
           }}
         /> : 
         <View style={[styles.avatar, {backgroundColor: theme.colorNeutral3, alignItems: "center", justifyContent: "center"}]}>
         <FontAwesomeIcon icon={"user"} color={theme.colorNeutral4} size={65} />
         </View>
          }
          <Text style={[theme.textH2, {fontWeight: "bold"}]}>
            {profile.firstname} {profile.surname}
          </Text>
          <Text style={[theme.textB3, { color: theme.textColorSubdued }]}>
            {profile.email}
          </Text>
          <Text
            style={[
              theme.textSmall,
              { color: theme.textColorSubdued, marginTop: 4 }
            ]}>
          {translate("user_profile.login_as")} : {profile.username}
          </Text>
        </View>
      </View>
      <View style={styles.info}>
        <Text style={[[theme.textH2, {fontWeight: "bold"}]]}>{translate("user_profile.manage_section")}</Text>
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
          <View style={{ height: 1, paddingLeft: 20 }}></View>
          <AuthConsumer>
            {auth => (
              <Cell
                cellContentView={
                  <Text style={[theme.textB2, { width: wp("100%") - 50 }]}>
                   {translate("user_profile.logout")}
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
