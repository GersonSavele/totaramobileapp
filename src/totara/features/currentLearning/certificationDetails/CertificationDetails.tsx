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
import { StyleSheet, View } from "react-native";
import { NavigationParams, NavigationInjectedProps } from "react-navigation";
// import { useQuery } from "@apollo/react-hooks";
import { translate } from "@totara/locale";
import { ThemeContext } from "@totara/theme";
import { CourseList } from "../courseList";
import OverviewDetails from "../overview/OverviewDetails";
import { Certification } from "@totara/types";
//import { coreCertification } from "./api";
import { HeaderView } from "@totara/components/currentLearning";
//Import mock data from js file once API has been fixed should remove from here(only for UI testing)
import { certification } from "../mock-data";

type CertificationProps = {
  certification: Certification;
  navigation: NavigationParams;
};

//To do : - implementing GraphQL query once api's has been done should remove here

// const CertificationDetails = ({ navigation }: NavigationInjectedProps) => {
//   const programId = navigation.getParam("targetId");
//   const { loading, error, data } = useQuery(coreCertification, {
//     variables: { programId: programId }
//   });
//   if (loading) return null;
//   if (error) return <GeneralErrorModal siteUrl= "" />;
//   if (data) {
//     return (
//       <CertificationDetailsComponent program={data.program} navigation={navigation} />
//     );
//   }
// };

const CertificationDetails = ({ navigation }: NavigationInjectedProps) => {
  return (
    <CertificationDetailsComponent
      certification={certification}
      navigation={navigation}
    />
  );
};

const CertificationDetailsComponent = ({
  navigation,
  certification
}: CertificationProps) => {
  const [showOverview, setShowOverview] = useState(true);
  const onSwitchTab = () => {
    setShowOverview(!showOverview);
  };
  const [theme] = useContext(ThemeContext);
  return (
    <HeaderView
      details={certification}
      navigation={navigation}
      tabBarLeft={translate("certificate-details.overview")}
      tabBarRight={translate("certificate-details.courses")}
      onPress={onSwitchTab}
      showOverview={showOverview}
      badgeTitle="Certificate">
      <View
        style={[styles.container, { backgroundColor: theme.colorNeutral2 }]}>
        <View
          style={[
            styles.activitiesContainer,
            { backgroundColor: theme.colorNeutral1 }
          ]}>
          {!showOverview ? (
            <CourseList program={certification} navigation={navigation} />
          ) : (
            <OverviewDetails
              learningItem={certification}
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
  activitiesContainer: {
    flex: 3,
    padding: 0
  }
});

export default CertificationDetails;
