/**
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
 */

import React, { useState, useContext } from "react";
import { StyleSheet, View } from "react-native";
import { NavigationParams } from "react-navigation";
// import { useQuery } from "@apollo/react-hooks";
import { translate } from "@totara/locale";
import { ThemeContext } from "@totara/theme";
import CourseList from "./CourseList";
import OverviewDetails from "../overview/Details";
import { CourseGroup } from "@totara/types";
//import { coreCertification } from "./api";
import HeaderView from "../HeaderView";
//Import mock data from js file once API has been fixed should remove from here(only for UI testing)
import { program, certification } from "../mock-data";

type CourseGroupProps = {
  courseGroup: CourseGroup;
  navigation: NavigationParams;
  type: string;
};

// //To do : - implementing GraphQL query once api's has been done should remove here

// const Details = ({ navigation }: NavigationInjectedProps) => {
//   const programId = navigation.getParam("targetId");
//   const { loading, error, data } = useQuery(coreCertification, {
//     variables: { programId: programId }
//   });
//   if (loading) return null;
//   if (error) return <GeneralErrorModal siteUrl= "" />;
//   if (data) {
//     return (
//       <DetailsComponent program={data.program} navigation={navigation} />
//     );
//   }
// };

const CourseGroupDetails = ({ navigation, type }: CourseGroupProps) => {
  return (
    <DetailsUI
      courseGroup={type === "program" ? program : certification}
      navigation={navigation}
    />
  );
};

const DetailsUI = ({ navigation, courseGroup, type }: CourseGroupProps) => {
  const [showOverview, setShowOverview] = useState(true);
  const onSwitchTab = () => {
    setShowOverview(!showOverview);
  };
  const [theme] = useContext(ThemeContext);
  return (
    <HeaderView
      details={courseGroup}
      navigation={navigation}
      tabBarLeft={
        type === "program"
          ? translate("program-details.overview")
          : translate("certificate-details.overview")
      }
      tabBarRight={
        type === "program"
          ? translate("program-details.courses")
          : translate("certificate-details.courses")
      }
      onPress={onSwitchTab}
      showOverview={showOverview}
      badgeTitle={type === "program" ? "program" : "certification"}
      image={courseGroup.image}>
      <View
        style={[styles.container, { backgroundColor: theme.colorNeutral2 }]}>
        <View
          style={[
            styles.activitiesContainer,
            { backgroundColor: theme.colorNeutral1 }
          ]}>
          {!showOverview ? (
            <CourseList courseGroup={courseGroup} navigation={navigation} />
          ) : (
            <OverviewDetails
              learningItem={courseGroup}
              summaryTypeTitle={
                type === "program"
                  ? "Program Summary"
                  : "Certifications Summary"
              }
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
  activitiesContainer: {
    flex: 3,
    padding: 0
  }
});

export default CourseGroupDetails;
