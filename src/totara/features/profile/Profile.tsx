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
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView
} from "react-native";
import { Cell, TableView } from "react-native-tableview-simple";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { AuthConsumer } from "@totara/core";
import { Log } from "@totara/lib";
import { NavigationInjectedProps } from "react-navigation";
import { NAVIGATION_SETTING } from "@totara/lib/Constant";
import { ThemeContext } from "@totara/theme";

const Profile = ({ navigation }: NavigationInjectedProps) => {
  useEffect(() => {
    navigation.setParams({ title: "Profile" });
  }, []);
  const [theme] = useContext(ThemeContext);
  return (
    <View style={[theme.viewContainer]}>
      <View style={{backgroundColor : theme.colorSecondary1}}>
        <View style={styles.headerContent}>
          <Image
            style={styles.avatar}
            source={{
              uri: "https://bootdey.com/img/Content/avatar/avatar6.png"
            }}
          />
          <Text style={[theme.textH3]}>John Doe </Text>
          <Text style={[theme.textB3, { color: theme.textColorSubdued }]}>
            jhonnydoe@mail.com
          </Text>
          <Text style={[theme.textSmall, { color: theme.textColorSubdued }]}>
            Logged in as : Florida
          </Text>
        </View>
      </View>
      <View style={styles.info}>
        <Text style={[theme.textH2]}>Manage</Text>
      </View>
      <ScrollView contentContainerStyle={{backgroundColor : theme.colorSecondary1}}>
        <TableView>
          <Cell
            cellContentView={
              <Text
                style={[
                  theme.textB2,
                  {width: wp("100%") - 50}
                ]}
              >
                Your profile
              </Text>
            }
            onPress={() => Log.debug("Cell is clicked")}
            accessory="DisclosureIndicator"
          />
          <View style={{ height: 1, paddingLeft: 20 }}></View>
          <Cell
            cellContentView={
              <Text
                style={[
                  theme.textB2,
                  {width: wp("100%") - 50}
                ]}
              >
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
                  <Text
                    style={[
                      theme.textB2,
                      {width: wp("100%") - 50
                      }
                    ]}
                  >
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
    padding: 30,
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
    marginTop: 10,
    marginLeft: 15
  }
});
