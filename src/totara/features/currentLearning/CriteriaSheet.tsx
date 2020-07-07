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

import React, { useRef, useEffect } from "react";
import { View, Modal, TouchableOpacity, Text, FlatList } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import BottomSheet from "reanimated-bottom-sheet";
import { criteriaSheetStyle } from "./currentLearningStyles";
import { TotaraTheme } from "@totara/theme/Theme";
import { Separator } from "@totara/components";
import { iconSizes } from "@totara/theme/constants";

type Props = {
  title: string;
  criteriaList?: [string];
  onClose: () => void;
};

const ListItem = ({ criteria }: { criteria: string }) => (
  <View>
    <Text numberOfLines={3} style={criteriaSheetStyle.availableReasonTextWrap}>
      {criteria}
    </Text>
    <Separator />
  </View>
);

const CriteriaSheet = ({ title = "", criteriaList = [""], onClose }: Props) => {
  const bottomDrawerRef = useRef<any>(null);
  useEffect(() => {
    bottomDrawerRef.current.snapTo(0);
  }, [bottomDrawerRef]);
  const renderBottomSheetHeader = () => {
    return (
      <View style={criteriaSheetStyle.headerViewWrap}>
        <View style={criteriaSheetStyle.headerInnerViewWrap}>
          <TouchableOpacity
            style={criteriaSheetStyle.headerCloseButtonWrap}
            onPress={onClose}>
            <FontAwesomeIcon
              icon="times"
              size={iconSizes.sizeM}
              color={TotaraTheme.textColorDisabled}
            />
          </TouchableOpacity>
          <View style={criteriaSheetStyle.headerViewIndicatorWrap}>
            <View style={criteriaSheetStyle.indicatorWrap}></View>
          </View>
        </View>
      </View>
    );
  };

  const renderContent = () => {
    return (
      <View style={criteriaSheetStyle.listContent}>
        <Text style={criteriaSheetStyle.listHeader}>{title}</Text>
        <FlatList
          data={criteriaList}
          renderItem={({ item }) => <ListItem criteria={item} />}
          keyExtractor={(_, index) => index.toString()}
        />
      </View>
    );
  };

  return (
    <Modal transparent={true}>
      <View style={criteriaSheetStyle.transparentView}>
        <View style={{ flex: 0.5 }}>
          <BottomSheet
            snapPoints={["70%", "50%", "50%"]}
            renderContent={renderContent}
            renderHeader={renderBottomSheetHeader}
            ref={bottomDrawerRef}
            enabledGestureInteraction={true}
            enabledBottomInitialAnimation={true}
          />
        </View>
      </View>
    </Modal>
  );
};

export default CriteriaSheet;
