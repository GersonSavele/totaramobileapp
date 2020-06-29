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
import { View, Modal, TouchableOpacity, Text } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import BottomSheet from "reanimated-bottom-sheet";
import { bottomSheetStyles } from "./currentLearningStyles";
import { TotaraTheme } from "@totara/theme/Theme";

type Props = {
  title?: string;
  onClose: () => void;
};

const Restriction = ({ title = "", onClose }: Props) => {
  const bottomDrawerRef = useRef<any>(null);

  useEffect(() => {
    bottomDrawerRef.current.snapTo(0);
  }, [bottomDrawerRef]);
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
              color={TotaraTheme.textColorDisabled}
            />
          </TouchableOpacity>
          <View style={bottomSheetStyles.headerViewIndicatorWrap}>
            <View style={bottomSheetStyles.indicatorWrap}></View>
          </View>
        </View>
      </View>
    );
  };

  const renderContent = () => {
    return (
      <View style={bottomSheetStyles.restrictionViewList}>
        <Text
          numberOfLines={3}
          style={bottomSheetStyles.availableReasonTextWrap}>
          {title}
        </Text>
      </View>
    );
  };

  return (
    <Modal transparent={true}>
      <View style={bottomSheetStyles.transparentView}>
        <View style={{ flex: 0.5 }}>
          <BottomSheet
            snapPoints={["50%", "30%", "30%"]}
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

export default Restriction;
