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
import { View, Modal, TouchableOpacity, SectionList, Text, FlatList } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import _ from "lodash";
import { TotaraTheme } from "@totara/theme/Theme";
import BottomSheet from "reanimated-bottom-sheet";
import listViewStyles from "@totara/theme/listView";
import { Criteria } from "@totara/types";
import criteriaSheetStyle from "./criteriaSheetStyle";
import { iconSizes } from "@totara/theme/constants";

type Props = {
  title: string;
  criteriaList?: [Criteria] | [string];
  onClose: () => void;
  isOverview?: boolean;
};

const ListItem = ({ item, isOverview }: any) => {
  let description = isOverview && item.requirement!.replace(/(<([^>]+)>)/gi, "");
  {
    /* // requirement and status return with URL and should replace the url and tags */
  }
  if (
    isOverview &&
    item.status!.replace(/(<([^>]+)>)/gi, "") !== undefined &&
    item.status!.replace(/(<([^>]+)>)/gi, "") !== ""
  ) {
    description += " | " + item.status!.replace(/(<([^>]+)>)/gi, "");
  }
  return isOverview ? (
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
      <View style={listViewStyles.thinSeparator} />
    </View>
  ) : (
    <View>
      <Text numberOfLines={3} style={criteriaSheetStyle.availableReasonTextWrap}>
        {item}
      </Text>
      <View style={listViewStyles.thinSeparator} />
    </View>
  );
};

const SectionHeader = ({ title }: { title: string }) => {
  return (
    <View style={criteriaSheetStyle.container}>
      <Text numberOfLines={1} style={criteriaSheetStyle.nameViewWrap}>
        {title}
      </Text>
    </View>
  );
};

type ContentProps = {
  criteriaList?: [Criteria] | [string];
  isOverview: boolean;
};

const BottomSheetContent = ({ criteriaList, isOverview }: ContentProps) => {
  const criteriaSectionList: any = [];
  const groupedCriteriaList = _.groupBy(criteriaList, "type");
  Object.entries(groupedCriteriaList).map(([key, value]) => {
    criteriaSectionList.push({ title: key, data: value });
  });

  return isOverview ? (
    <View style={criteriaSheetStyle.listContent}>
      <SectionList
        style={criteriaSheetStyle.renderListWrap}
        sections={criteriaSectionList}
        renderItem={({ item }) => <ListItem item={item} isOverview={isOverview} />}
        renderSectionHeader={({ section }) => <SectionHeader title={section.title} />}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  ) : (
    <View style={criteriaSheetStyle.listContent}>
      <FlatList
        data={criteriaList as [string]}
        renderItem={({ item }) => <ListItem item={item} isOverview={isOverview} />}
        keyExtractor={(_, index) => index.toString()}
      />
    </View>
  );
};

type BottomSheetHeaderProps = {
  onClose: () => void;
  title: string;
};

const BottomSheetHeader = ({ onClose, title }: BottomSheetHeaderProps) => {
  return (
    <View style={criteriaSheetStyle.headerViewWrap}>
      <View style={criteriaSheetStyle.headerInnerViewWrap}>
        <TouchableOpacity style={criteriaSheetStyle.headerCloseButtonWrap} onPress={onClose}>
          <FontAwesomeIcon icon="times" size={iconSizes.sizeM} color={TotaraTheme.textColorDisabled} />
        </TouchableOpacity>
        <View style={criteriaSheetStyle.headerViewIndicatorWrap}>
          <View style={criteriaSheetStyle.indicatorWrap}></View>
        </View>
      </View>
      <Text style={criteriaSheetStyle.listHeader}>{title}</Text>
    </View>
  );
};

const CriteriaSheet = ({ criteriaList, onClose, isOverview = false, title }: Props) => {
  const bottomDrawerRef = useRef<any>(null);

  useEffect(() => {
    bottomDrawerRef.current.snapTo(0);
  }, [bottomDrawerRef]);

  return (
    <Modal transparent={true}>
      <View style={criteriaSheetStyle.transparentView}>
        <BottomSheet
          snapPoints={["95%", "50%", "50%"]}
          renderContent={() => <BottomSheetContent criteriaList={criteriaList} isOverview={isOverview} />}
          renderHeader={() => <BottomSheetHeader onClose={onClose} title={title} />}
          ref={bottomDrawerRef}
          enabledGestureInteraction={true}
          enabledBottomInitialAnimation={true}
        />
      </View>
    </Modal>
  );
};

export default CriteriaSheet;
