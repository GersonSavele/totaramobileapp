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

import BottomSheet from '@gorhom/bottom-sheet';
import Icon from '@totara/components/Icon';
import { TEST_IDS } from '@totara/lib/testIds';
import { iconSizes } from '@totara/theme/constants';
import listViewStyles from '@totara/theme/listView';
import { TotaraTheme } from '@totara/theme/Theme';
import type { Criteria } from '@totara/types';
import { groupBy } from 'lodash';
import React, { useCallback, useMemo, useRef } from 'react';
import { FlatList, SectionList, Text, TouchableOpacity, View } from 'react-native';

import criteriaSheetStyle from './criteriaSheetStyle';

type Props = {
  title: string;
  criteriaList?: [Criteria] | [string];
  onClose: () => void;
  isOverview?: boolean;
  index?: number;
};

const ListItem = ({ item, isOverview }: any) => {
  // requirement and status return with URL and should replace the url and tags.
  const REGEX = /(<([^>]+)>)/gi;
  let description = isOverview && item.requirement!.replace(REGEX, '');
  isOverview &&
    item.status!.replace(REGEX, '') !== undefined &&
    item.status!.replace(REGEX, '').length > 0 &&
    (description += ' | ' + item.status!.replace(REGEX, ''));

  return isOverview ? (
    <View style={criteriaSheetStyle.renderOuterViewWrap}>
      <View style={criteriaSheetStyle.renderInnerViewWrap}>
        <View style={{ flex: 2 }}>
          <Text numberOfLines={1} style={criteriaSheetStyle.criteriaText}>
            {/* // item criteria return with URL and should replace the url and tags */}
            {item.criteria!.replace(REGEX, '')}
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
  criteriaList?: [Criteria] | [string] | [];
};

// TODO: Deeper exploration into sorting out the types on this
const BottomSheetContent = ({ criteriaList = [] }: ContentProps) => {
  if (criteriaList[0] && criteriaList[0]['__typename'] !== undefined) {
    const groupedCriteriaList = groupBy(criteriaList, 'type');
    const criteriaSectionList = Object.entries(groupedCriteriaList).map(([key, value]) => {
      return { title: key, data: value };
    });
    return (
      <View style={criteriaSheetStyle.listContent}>
        <SectionList
          style={criteriaSheetStyle.renderListWrap}
          sections={criteriaSectionList as []}
          renderItem={({ item }) => <ListItem item={item} isOverview={true} />}
          renderSectionHeader={({ section }) => {
            // @ts-ignore
            return <SectionHeader title={section.title} />;
          }}
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }
  return (
    <View style={criteriaSheetStyle.listContent}>
      <FlatList
        data={criteriaList as [string]}
        renderItem={({ item }) => <ListItem item={item} isOverview={false} />}
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
      <View>
        <TouchableOpacity
          style={criteriaSheetStyle.headerCloseButtonWrap}
          onPress={onClose}
          testID={TEST_IDS.CLICK_CLOSE}>
          <Icon name="times" size={iconSizes.sizeM} color={TotaraTheme.colorNeutral5} />
        </TouchableOpacity>
      </View>
      <View>
        <Text style={criteriaSheetStyle.listHeader} numberOfLines={2}>
          {title}
        </Text>
      </View>
    </View>
  );
};

const CriteriaSheet = ({ criteriaList, onClose, title, index = -1 }: Props) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => ['25%', '75%'], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const handleClosePress = () => {
    bottomSheetRef.current?.close();
    onClose();
  };

  return (
    // Note: BottomSheet does NOT work being wrapped by <View/>
    <>
      <BottomSheet
        ref={bottomSheetRef}
        index={index}
        enablePanDownToClose={false}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}>
        <BottomSheetHeader onClose={handleClosePress} title={title} />
        {criteriaList && <BottomSheetContent criteriaList={criteriaList} />}
      </BottomSheet>
    </>
  );
};

export default CriteriaSheet;
