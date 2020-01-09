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

import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
} from "react-native";
import { Cell, Separator } from "react-native-tableview-simple";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { AuthConsumer } from "@totara/core";
import { Log } from "@totara/lib";
import { NavigationInjectedProps } from "react-navigation";
import { resizeByScreenSize } from "@totara/theme";

const profileList = [
  {
    key: "1",
    title: "Your profile"
  },
  {
    key: "2",
    title: "Settings"
  },
  {
    key: "3",
    title: "Logout"
  }
];

type cellDetailsProps = {
  key: string;
  title: string;
};

const reusableCellRender = ({ key, title }: cellDetailsProps) => {
  switch (title) {
    case "Logout":
      return (
        <AuthConsumer>
          {auth => (
            <Cell
            cellContentView={
              <Text style={styles.cellInfo}>
                {title}
              </Text>
            }
            onPress={() => {
                auth.logOut();
            }}
            />
          )}
        </AuthConsumer>
      );
    case "Your profile":
      return (
        <Cell
        cellContentView={
          <Text style={styles.cellInfo}>
            {title}
          </Text>
        }
        onPress={() => Log.debug("Cell is clicked")}
        accessory="DisclosureIndicator"
        />
      );
    case "Settings":
      return (
        <Cell
          cellContentView={
            <Text style={styles.cellInfo}>
              {title}
            </Text>
          }
          onPress={() => Log.debug("Cell is clicked")}
          accessory="DisclosureIndicator"
        />
      );
    default:
      return null;
  }
};

const Profile = ({ navigation }: NavigationInjectedProps) => {
  useEffect(() => {
    navigation.setParams({ title: "Profile" });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image
            style={styles.avatar}
            source={{
              uri: "https://bootdey.com/img/Content/avatar/avatar6.png"
            }}
          />

          <Text style={styles.name}>John Doe </Text>
          <Text style={styles.userEmail}>jhonnydoe@mail.com </Text>
          <Text style={styles.userName}>Logged in as : Florida </Text>
        </View>
      </View>
      <View style={styles.info}>
        <Text style={styles.tableHeader}>Manage</Text>
      </View>
      <FlatList
        data={profileList}
        renderItem={({ item }) => reusableCellRender(item)}
        ItemSeparatorComponent={({ highlighted }) => (
          <Separator isHidden={highlighted} />
        )}
      />
    </View>
  );
};

Profile.navigationOptions = () => ({
  title: "Profile"
});

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
    textAlign: "center",
    fontWeight: "bold",
    margin: 0,
    backgroundColor: "#FFFFFF",
    width: wp("100%")
  },
  header: {
    backgroundColor: "#f5f5f5"
  },
  headerContent: {
    padding: 30,
    alignItems: "center"
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom: 10
  },
  name: {
    fontSize: 18,
    color: "#000000",
    fontWeight: "600"
  },
  userEmail: {
    fontSize: 12,
    color: "#778899",
    fontWeight: "600"
  },
  userName: {
    fontSize: 10,
    color: "#778899",
    fontWeight: "200",
    marginTop: resizeByScreenSize(8, 8, 16, 16)
  },
  info: {
    width: "100%",
    height: 30,
    marginTop: 10,
    marginLeft: 15
  }, 
  cellInfo: {
    fontSize: resizeByScreenSize(14, 18, 22, 24),
    color: "#000000",
    fontWeight: "normal",
    width: wp("100%") - 50
  },
  tableHeader:{
    fontSize: resizeByScreenSize(14, 18, 22, 24),
    color: "#000000",
    fontWeight: "600"
  }
});
