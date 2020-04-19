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

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Dimensions
} from "react-native";
import React, { useContext } from "react";
import { normalize, ThemeContext } from "@totara/theme";
import { AddBadge } from "@totara/components";
import { translate } from "@totara/locale";

type OverviewProps = {
  progress :number,
  gradeFinal: number,
  gradeMax : number,
  summary : string,
  summaryTypeTitle : string
}

type SummaryProps = {
  summary : string,
  summaryTypeTitle : string
}

type ItemProps = {
  id : number,
  title: string,
  description: string,
  value : number
}

const OverviewDetails = ({ progress, gradeFinal, gradeMax, summary, summaryTypeTitle }: OverviewProps) => {
  const [theme] = useContext(ThemeContext);

const renderItem = ({ item }:  { item : ItemProps}) => {
    const itemStyle = StyleSheet.create({
      container: {
        borderRadius: normalize(10),
        shadowColor: theme.colorNeutral8,
        shadowOpacity: 0.16,
        shadowRadius: normalize(14),
        backgroundColor: theme.colorNeutral1,
        borderWidth: 0.5,
        borderColor: theme.colorNeutral2,
        marginBottom: normalize(16),
        marginTop: normalize(16),
        shadowOffset: {
          width: 0,
          height: 10
        }
      },
      content: {
        borderRadius: normalize(10),
        overflow: "hidden",
        flexDirection: "row",
        justifyContent: "center"
      },
      carouselTextContainer: {
        justifyContent: "center",
        flexDirection: "column",
        flex: 5,
        margin: 16,
        maxWidth: Dimensions.get("window").width * 0.6
      }
    });

    return (
      <TouchableOpacity style={itemStyle.container} activeOpacity={1.0}>
        <View style={itemStyle.content}>
          <View
            style={{
              marginLeft: 16,
              alignContent: "center",
              justifyContent: "center"
            }}
          >
            {item.id == 1 ? (
              <ProgressCircle value={item.value}></ProgressCircle>
            ) : (
              <Text style={[theme.textH2, { fontWeight: "bold" }]}>
                {item.value != null ? item.value.toString() : "0"}
              </Text>
            )}
          </View>
          <View style={itemStyle.carouselTextContainer}>
            <Text numberOfLines={1} style={[theme.textH4]}>
              {item.title}
            </Text>
            <Text
              numberOfLines={1}
              style={[theme.textB3, { color: theme.colorNeutral6 }]}
            >
              {item.description}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

let progressStatus = translate("course_overview_progress.progress_status_init");
let userProgress = 0;

    if (progress && progress > 50) {
      progressStatus = translate(
        "course_overview_progress.progress_status_final"
      );
      userProgress = progress;
    } else if (
      progress &&
      progress < 50 &&
      progress != 0
    ) {
      progressStatus = translate(
        "course_overview_progress.progress_status_mid"
      );
      userProgress = progress;
    }
  

  const item = [
    {
      id: 1,
      title: translate("course_overview_progress.title"),
      description: progressStatus,
      value: userProgress
    },
    {
      id: 2,
      title: translate("course_overview_grade.title"),
      description:
        translate("course_overview_grade.progress_status") +
        (gradeMax != 0 ? gradeMax.toString() : "0"),
      value: gradeFinal
    }
  ];

  return (
    <View>
      <View>
        <FlatList
          style={{ flexGrow: 1 }}
          horizontal={true}
          contentContainerStyle={{ padding: 16 }}
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ margin: 6 }} />}
          data={item}
          keyExtractor={item => item.title.toString()}
          renderItem={renderItem}
        />
      </View>
      <View
        style={{
          backgroundColor: theme.colorNeutral3,
          height: 0.5,
          margin: 10
        }}
      />
      <View style={{ flex: 4 }}>
        <CourseSummary summary={summary} summaryTypeTitle = {summaryTypeTitle}/>
      </View>
    </View>
  );
};

const CourseSummary = ({ summary, summaryTypeTitle }: SummaryProps) => {
  const [theme] = useContext(ThemeContext);
  return (
    <View style={{ marginLeft: 16, marginRight: 8 }}>
      <View style={{ marginTop: 8 }}>
        <Text numberOfLines={1} style={theme.textH3}>
          {/* {translate("course_overview.course_summery")} */}
        {summaryTypeTitle}
        </Text>
      </View>
      <View style={{ marginTop: 16 }}>
        <Text style={[theme.textB3, { color: theme.colorNeutral6 }]}>
          {summary}
        </Text>
      </View>
    </View>
  );
};

const ProgressCircle = ({ value }: { value: number }) => {
  return (
    <View style={styles.badgeContainer}>
      <AddBadge status={value} size={normalize(24)}></AddBadge>
    </View>
  );
};

const styles = StyleSheet.create({
  badgeContainer: {
    marginLeft: normalize(32),
    marginBottom: normalize(32)
  }
});

export default OverviewDetails;
