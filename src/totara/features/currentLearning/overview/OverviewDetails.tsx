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
} from "react-native";
import React, { useContext, useState } from "react";
import { normalize, ThemeContext } from "@totara/theme";
import { AddBadge } from "@totara/components";
import { translate } from "@totara/locale";
import { CriteriaSheet } from "@totara/components/currentLearning";
import { Course, Program, Certification } from "@totara/types";
import  {detailsViewStyle} from "./styles"
type OverviewProps = {
  learningItem?: Course | Program | Certification;
  summaryTypeTitle: string;
};

type SummaryProps = {
  summary: string;
  summaryTypeTitle: string;
};

type DetailsProps = {
  id: number;
  title: string;
  value: number;
};

const OverviewDetails = ({ learningItem, summaryTypeTitle }: OverviewProps) => {
  const [theme] = useContext(ThemeContext);
  const [showCriteria, setShowCriteria] = useState(false);
  const [clickItem, setClickItem] = useState(0);

  const onClick = (id: number) => {
    setClickItem(id);
    if(id === 1)
    setShowCriteria(!showCriteria);
  };

  const onClose = () => {
    setShowCriteria(!showCriteria);
  };

  const renderItem = ({ item }: { item: DetailsProps }) => {
    return (
      <TouchableOpacity
        style={[detailsViewStyle.container, {shadowColor: theme.colorNeutral8, backgroundColor: theme.colorNeutral1, borderColor: theme.colorNeutral2}]}
        activeOpacity={1.0}
        onPress={() => onClick(item.id)}
      >
        <View style={detailsViewStyle.contentWrap}>
          <View style={detailsViewStyle.innerViewWrap}>
            {item.id == 1 ? (
              <ProgressCircle value={item.value}></ProgressCircle>
            ) : (
              <View style={{ flexDirection: "row" }}>
                <Text style={[theme.textH2, { fontWeight: "bold" }]}>
                  {item.value != null ? item.value.toString() : "0"}
                </Text>
                <Text
                  style={[
                    theme.textH4,
                   detailsViewStyle.gradeMaxTextWrap,
                  ]}
                >
                  {"/" + learningItem?.completion?.grademax}
                </Text>
              </View>
            )}
          </View>
          <View
            style={[detailsViewStyle.viewSeparator,{
              backgroundColor: theme.colorNeutral5, 
            }]}
          ></View>
          <View style={detailsViewStyle.carouselTextContainer}>
            <Text
              numberOfLines={1}
              style={[theme.textH4, { textAlign: "center" }]}
            >
              {item.title}
            </Text>
          </View>
        </View>
        {showCriteria && clickItem === 1 && learningItem?.criteria !== null &&(
          <CriteriaSheet
            criteriaList={learningItem!.criteria}
            onClose={onClose}
          ></CriteriaSheet>
        )}
      </TouchableOpacity>
    );
  };

  const overViewDetails = [
    {
      id: 1,
      title: translate("course.course_overview_progress.title"),
      value:
        learningItem?.completion?.progress !== undefined
          ? learningItem?.completion?.progress
          : 0,
    },
    {
      id: 2,
      title: translate("course.course_overview_grade.title"),
      value:
        learningItem?.completion?.gradefinal !== undefined
          ? learningItem?.completion?.gradefinal
          : 0,
    },
  ];

  return (
    <View>
      <View>
        <FlatList
          style={{ flexGrow: 1 }}
          horizontal={true}
          contentContainerStyle={{ padding: 16 }}
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => (
            <View style={detailsViewStyle.listItemSeparator} />
          )}
          data={overViewDetails}
          keyExtractor={(overViewDetails) => overViewDetails.id.toString()}
          renderItem={renderItem}
        />
      </View>
      <View
        style={[detailsViewStyle.summarySeparator,{
          backgroundColor: theme.colorNeutral3
        }]}
      />
      <View style={{ flex: 4 }}>
        <Summary
          summary={learningItem?.summary!}
          summaryTypeTitle={summaryTypeTitle}
        />
      </View>
    </View>
  );
};

const Summary = ({ summary, summaryTypeTitle }: SummaryProps) => {
  const [theme] = useContext(ThemeContext);
  return (
    <View
      style={detailsViewStyle.summaryContainer}
    >
      <View style={detailsViewStyle.summaryTitleWrap}>
        <Text numberOfLines={1} style={theme.textH3}>
          {/* {translate("course_overview.course_summery")} */}
          {summaryTypeTitle}
        </Text>
      </View>
      <View style={detailsViewStyle.summaryViewWrap}>
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
    marginBottom: normalize(32),
  },
});

export default OverviewDetails;
