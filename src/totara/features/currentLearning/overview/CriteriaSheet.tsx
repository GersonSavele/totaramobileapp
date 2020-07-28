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

import React, { useRef, useEffect } from "react";
import { View, Modal, TouchableOpacity, SectionList, Text } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import _ from "lodash";
import { TotaraTheme } from "@totara/theme/Theme";
import BottomSheet from "reanimated-bottom-sheet";
import { Separator } from "@totara/components";
import { translate } from "@totara/locale";
import { Criteria } from "@totara/types";
import criteriaSheetStyle from "./criteriaSheetStyle";

type Props = {
  criteriaList?: [Criteria];
  onClose: () => void;
};

const CriteriaSheet = ({ criteriaList, onClose }: Props) => {
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
      <View style={criteriaSheetStyle.container}>
        <Text numberOfLines={1} style={criteriaSheetStyle.nameViewWrap}>
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
      <View style={criteriaSheetStyle.renderOuterViewWrap}>
        <View style={criteriaSheetStyle.renderInnerViewWrap}>
          <View style={{ flex: 2 }}>
            <Text numberOfLines={1} style={criteriaSheetStyle.criteriaText}>
              {/* // item criteria return with URL and should replace the url and tags */}
              {item.criteria!.replace(/(<([^>]+)>)/gi, "")}
            </Text>
            <Text numberOfLines={1} style={criteriaSheetStyle.requirementText}>
              {description}
            </Text>
          </View>
        </View>
        <Separator />
      </View>
    );
  };

  const renderBottomSheetHeader = () => {
    return (
      <View style={criteriaSheetStyle.headerViewWrap}>
        <View style={criteriaSheetStyle.headerInnerViewWrap}>
          <TouchableOpacity
            style={criteriaSheetStyle.headerCloseButtonWrap}
            onPress={onClose}>
            <FontAwesomeIcon
              icon="times"
              size={20}
              color={TotaraTheme.textColorDisabled}
            />
          </TouchableOpacity>
          <View style={criteriaSheetStyle.headerViewIndicatorWrap}>
            <View style={criteriaSheetStyle.indicatorWrap}></View>
          </View>
        </View>
        <View style={criteriaSheetStyle.container}>
          <Text
            style={{ ...TotaraTheme.textH3, fontWeight: "bold", fontSize: 22 }}>
            {translate("course.course_criteria.title")}
          </Text>
        </View>
      </View>
    );
  };

  const renderContent = () => {
    return (
      <View style={{ backgroundColor: TotaraTheme.colorAccent }}>
        <SectionList
          style={criteriaSheetStyle.renderListWrap}
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
      <View style={criteriaSheetStyle.transparentView}>
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
