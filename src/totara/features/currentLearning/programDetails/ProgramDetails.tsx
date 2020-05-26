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
 * @author @author Tharaka Dushmantha <tharaka.dushmantha@totaralearning.com>
 *
 *
 */

import React, { useState, useContext } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { NavigationParams, NavigationInjectedProps } from "react-navigation";
// import { useQuery } from "@apollo/react-hooks";

import { normalize } from "@totara/theme";
import { translate } from "@totara/locale";
import { ThemeContext } from "@totara/theme";
import { CourseList } from "../courseList";
import OverviewDetails from "../overview/OverviewDetails";
import { Program } from "@totara/types";
import { HeaderView } from "@totara/components/currentLearning";
// import { coreProgram } from "./api";
//Import mock data from js file once API has been fixed should remove from here(only for UI testing)
import { program } from "../mock-data";

type ProgramProps = {
  program: Program;
  navigation: NavigationParams;
};

//To do : - implementing GraphQL query once api's has been done should remove here

// const ProgramDetails = ({ navigation }: NavigationInjectedProps) => {
//   const programId = navigation.getParam("targetId");
//   const { loading, error, data } = useQuery(coreProgram, {
//     variables: { programId: programId }
//   });
//   if (loading) return null;
//   if (error) return <GeneralErrorModal siteUrl= "" />;
//   if (data) {
//     return (
//       <ProgramDetailsComponent program={data.program} navigation={navigation} />
//     );
//   }
// };

const ProgramDetails = ({ navigation }: NavigationInjectedProps) => {
  return <ProgramDetailsComponent program={program} navigation={navigation} />;
};

const ProgramDetailsComponent = ({ navigation, program }: ProgramProps) => {
  const [showOverview, setShowOverview] = useState(true);
  const onSwitchTab = () => {
    setShowOverview(!showOverview);
  };
  const [theme] = useContext(ThemeContext);
  return (
    <HeaderView
      details={program}
      navigation={navigation}
      tabBarLeft={translate("program-details.overview")}
      tabBarRight={translate("program-details.courses")}
      onPress={onSwitchTab}
      showOverview={showOverview}
      badgeTitle="Program">
      <View
        style={[styles.container, { backgroundColor: theme.colorNeutral2 }]}>
        <View
          style={[
            styles.activitiesContainer,
            { backgroundColor: theme.colorNeutral1 }
          ]}>
          {!showOverview ? (
            <CourseList program={program} navigation={navigation} />
          ) : (
            <OverviewDetails
              learningItem={program}
              summaryTypeTitle="Certifications Summary"
            />
          )}
        </View>
      </View>
    </HeaderView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerContainer: {
    flex: 1,
    maxHeight: normalize(340),
    minHeight: normalize(320)
  },
  itemImage: {
    flex: 2.5,
    minHeight: normalize(160)
  },
  itemCard: {
    maxHeight: normalize(80),
    minHeight: normalize(60)
  },
  programLabelWrap: {
    borderRadius: 8,
    borderStyle: "solid",
    borderWidth: 1,
    alignSelf: "flex-start",
    alignItems: "center"
  },
  tabBarContainer: {
    flex: 0.4,
    maxHeight: 50,
    minHeight: 44
  },
  tabNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: normalize(16),
    width: Dimensions.get("window").width * 0.5,
    alignItems: "center",
    flex: 1
  },
  activitiesContainer: {
    flex: 3,
    padding: 0
  },
  toggleViewContainer: {
    flex: 0.25,
    marginLeft: 16,
    marginRight: 16,
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: Dimensions.get("window").width - 32
  },
  programLabelText: {
    fontSize: normalize(10),
    fontWeight: "500",
    fontStyle: "normal",
    textAlign: "center",
    paddingLeft: 4,
    paddingRight: 4,
    paddingTop: 1,
    paddingBottom: 2
  },
  tabSelected: {
    height: "100%",
    justifyContent: "center",
    paddingLeft: 24,
    paddingRight: 24
  }
});

export default ProgramDetails;
