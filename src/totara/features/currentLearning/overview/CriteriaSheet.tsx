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
 *
 */

import React, { useContext, useRef, useEffect } from "react";
import { View, Modal, TouchableOpacity, SectionList, Text } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import _ from "lodash";
import { ThemeContext } from "@totara/theme";
import BottomSheet from "reanimated-bottom-sheet";

import { translate } from "@totara/locale";
import { Criteria } from "@totara/types";
import { bottomSheetStyles } from "../currentLearningStyles";

type Props = {
  criteriaList?: [Criteria];
  onClose: () => void;
};

const CriteriaSheet = ({ criteriaList, onClose }: Props) => {
  const [theme] = useContext(ThemeContext);
  const criteriaSectionList: any = [];
  const bottomDrawerRef = useRef<any>(null);

  useEffect(() => {
    bottomDrawerRef.current.snapTo(0);
  }, [bottomDrawerRef]);

  const groupedCriteriaList = _.groupBy(criteriaList, "type");
  Object.entries(groupedCriteriaList).map(([key, value]) => {
    criteriaSectionList.push({ title: key, data: value });
  });

  const renderSectionHeader = ({ section }: any) => {
    return (
      <View style={bottomSheetStyles.container}>
        <Text
          numberOfLines={1}
          style={{
            ...bottomSheetStyles.nameViewWrap,
            color: theme.colorNeutral8
          }}>
          {section.title}
        </Text>
      </View>
    );
  };

  const renderItem = ({ item }: any) => {
    let description = item.requirement!.replace(/(<([^>]+)>)/gi, "");
    {
      /* // requirement and status return with URL and should replace the url and tags */
    }
    if (
      item.status!.replace(/(<([^>]+)>)/gi, "") !== undefined &&
      item.status!.replace(/(<([^>]+)>)/gi, "") !== ""
    ) {
      description += " | " + item.status!.replace(/(<([^>]+)>)/gi, "");
    }
    return (
      <View style={bottomSheetStyles.renderOuterViewWrap}>
        <View style={bottomSheetStyles.renderInnerViewWrap}>
          <View style={{ flex: 2 }}>
            <Text
              numberOfLines={1}
              style={{
                ...bottomSheetStyles.criteriaText,
                color: theme.colorNeutral8
              }}>
              {/* // item criteria return with URL and should replace the url and tags */}
              {item.criteria!.replace(/(<([^>]+)>)/gi, "")}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                ...bottomSheetStyles.requirementText,
                color: theme.colorNeutral8
              }}>
              {description}
            </Text>
          </View>
        </View>
        <View
          style={{
            ...bottomSheetStyles.bodySeparator,
            backgroundColor: theme.colorNeutral8
          }}></View>
      </View>
    );
  };

  const renderBottomSheetHeader = () => {
    return (
      <View style={bottomSheetStyles.headerViewWrap}>
        <View style={bottomSheetStyles.headerInnerViewWrap}>
          <TouchableOpacity
            style={bottomSheetStyles.headerCloseButtonWrap}
            onPress={onClose}>
            <FontAwesomeIcon
              icon="times"
              size={20}
              color={theme.textColorDisabled}
            />
          </TouchableOpacity>
          <View style={bottomSheetStyles.headerViewIndicatorWrap}>
            <View style={bottomSheetStyles.indicatorWrap}></View>
          </View>
        </View>
        <View style={bottomSheetStyles.container}>
          <Text style={{ ...theme.textH3, fontWeight: "bold", fontSize: 22 }}>
            {translate("course.course_criteria.title")}
          </Text>
        </View>
      </View>
    );
  };

  const renderContent = () => {
    return (
      <View style={{ backgroundColor: theme.colorAccent }}>
        <SectionList
          style={bottomSheetStyles.renderListWrap}
          sections={criteriaSectionList}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  };

  return (
    <Modal transparent={true}>
      <View style={bottomSheetStyles.transparentView}>
        <BottomSheet
          snapPoints={["95%", "50%", "50%"]}
          renderContent={renderContent}
          renderHeader={renderBottomSheetHeader}
          ref={bottomDrawerRef}
          enabledGestureInteraction={true}
          enabledBottomInitialAnimation={true}
        />
      </View>
    </Modal>
  );
};

export default CriteriaSheet;
