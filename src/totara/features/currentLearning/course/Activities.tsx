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

import { Text, TouchableOpacity, View, FlatList } from "react-native";
import React, { useState, useContext, useEffect } from "react";
// @ts-ignore no types published yet for fortawesome react-native, they do have it react so check in future and remove this ignore
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { NavigationContext } from "react-navigation";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useMutation } from "@apollo/react-hooks";
import CriteriaSheet from "../CriteriaSheet";
import ActivityTextContent from "./ActivityTextContent";
import CompletionIcon from "./CompletionIcon";
import activitiesStyles from "./activitiesStyles";
import { TotaraTheme } from "@totara/theme/Theme";
import { Section, Activity } from "@totara/types";
import { GeneralErrorModal } from "@totara/components";
import { translate } from "@totara/locale";
import { activityModType, completionStatus, completionTrack } from "../constants";
import { navigateTo, NAVIGATION } from "@totara/lib/navigation";
import { activitySelfComplete } from "../course/api";
import listViewStyles from "@totara/theme/listView";

const { SCORM_ROOT, WEBVIEW_ACTIVITY } = NAVIGATION;
type ActivitiesProps = {
  sections: [Section];
  courseRefreshCallBack: () => {};
  expandAllActivities: boolean;
};

const Activities = ({ sections, courseRefreshCallBack, expandAllActivities }: ActivitiesProps) => {
  return (
    <FlatList
      data={sections}
      renderItem={({ item }) => {
        return (
          <SectionItem
            section={item}
            courseRefreshCallBack={courseRefreshCallBack}
            expandAllActivities={expandAllActivities}
          />
        );
      }}
    />
  );
};

type SectionItemProps = {
  courseRefreshCallBack: () => {};
  section: Section;
  expandAllActivities: boolean;
};

const SectionItem = ({ section, courseRefreshCallBack, expandAllActivities }: SectionItemProps) => {
  //every item need to have its own state

  const [show, setShow] = useState(expandAllActivities);
  const activities = section.data as Array<Activity>;
  const { title, available, availableReason, summary } = section;
  useEffect(() => {
    setShow(expandAllActivities);
  }, [expandAllActivities]);

  const onExpand = () => {
    setShow(!show);
  };

  return (
    activities && (
      <View style={{ backgroundColor: TotaraTheme.colorSecondary1 }}>
        <TouchableOpacity onPress={onExpand}>
          {available && activities.length > 0 && <ExpandableSectionHeader show={show} title={title} />}
          {!available && availableReason && availableReason.length > 0 && (
            <RestrictionSectionHeader title={title} availableReason={availableReason} />
          )}
        </TouchableOpacity>
        {show && (
          <ActivityList data={activities} courseRefreshCallBack={courseRefreshCallBack} sectionSummary={summary} />
        )}
      </View>
    )
  );
};

const RestrictionSectionHeader = ({ title, availableReason }: { availableReason: [string]; title: string }) => {
  const [show, setShow] = useState(false);
  const onClose = () => {
    setShow(!show);
  };
  return (
    <View>
      <TouchableOpacity style={activitiesStyles.sectionView} onPress={onClose}>
        <Text numberOfLines={1} style={activitiesStyles.sectionTitle}>
          {title}
        </Text>
        <Text style={activitiesStyles.sectionNotAvailable}>
          {translate("course.course_activity_section.not_available")}
        </Text>
      </TouchableOpacity>
      {show && (
        <CriteriaSheet
          title={translate("course.course_criteria.bottom_sheet_header")}
          criteriaList={availableReason}
          onClose={onClose}
        />
      )}
    </View>
  );
};

type ExpandableSectionHeaderProps = {
  show: boolean;
  title: string;
};

const ExpandableSectionHeader = ({ title, show }: ExpandableSectionHeaderProps) => {
  return (
    <View>
      <View style={activitiesStyles.sectionView}>
        <Text numberOfLines={1} style={activitiesStyles.sectionTitle}>
          {title}
        </Text>
        {show ? (
          <FontAwesomeIcon icon={faChevronUp} color={TotaraTheme.colorNeutral5} size={16} />
        ) : (
          <FontAwesomeIcon icon={faChevronDown} color={TotaraTheme.colorNeutral5} size={16} />
        )}
      </View>
    </View>
  );
};

type ActivityListProps = {
  data?: Array<Activity>;
  courseRefreshCallBack: () => {};
  sectionSummary: string;
};

const ActivityList = ({ data, courseRefreshCallBack, sectionSummary }: ActivityListProps) => {
  return (
    <View>
      <View style={activitiesStyles.activityList}>
        <ActivityTextContent label={sectionSummary} />
      </View>
      {data!.map((item: Activity, key: number) => {
        return (
          <View key={key}>
            {item.completionstatus === completionStatus.unknown || item.completionstatus === null || !item.available ? (
              <ListItemLock item={item} key={key} />
            ) : (
              <ListItemUnlock item={item} courseRefreshCallBack={courseRefreshCallBack} key={key} />
            )}
          </View>
        );
      })}
    </View>
  );
};

const ListItemUnlock = ({ item, courseRefreshCallBack }: { item: Activity; courseRefreshCallBack?: () => {} }) => {
  const navigation = useContext(NavigationContext);
  const [selfComplete, { data, error: errorSelfComplete, loading: loadingSelfComplete }] = useMutation(
    activitySelfComplete
  );
  if (data) {
    courseRefreshCallBack!();
  }
  const isLabel = item.modtype === activityModType.label;

  const onClickSelfComplete = () => {
    selfComplete({
      variables: {
        cmid: item.id,
        complete: item.completionstatus === completionStatus.incomplete
      }
    });
  };
  return (
    <View
      style={{
        backgroundColor: !isLabel ? TotaraTheme.colorAccent : TotaraTheme.colorSecondary1
      }}>
      <View style={activitiesStyles.itemContentWrapper}>
        {item.completion === completionTrack.trackingManual ? (
          <TouchableOpacity onPress={onClickSelfComplete}>
            <CompletionIcon
              loading={loadingSelfComplete}
              completion={item.completion}
              status={item.completionstatus}
              available={item.available}
            />
          </TouchableOpacity>
        ) : (
          <CompletionIcon
            loading={loadingSelfComplete}
            completion={item.completion}
            status={item.completionstatus}
            available={item.available}
          />
        )}
        <TouchableOpacity
          style={activitiesStyles.itemTouchableContent}
          onPress={() => {
            switch (item.modtype) {
              case activityModType.scorm: {
                navigateTo({
                  navigate: navigation.navigate,
                  routeId: SCORM_ROOT,
                  props: {
                    id: item.instanceid.toString(),
                    title: item.name
                  }
                });
                break;
              }
              case activityModType.label: {
                break;
              }
              default: {
                navigateTo({
                  navigate: navigation.navigate,
                  routeId: WEBVIEW_ACTIVITY,
                  props: {
                    activity: item,
                    backAction: courseRefreshCallBack
                  }
                });
              }
            }
          }}>
          {isLabel ? <ActivityTextContent label={item.description!} /> : <ListItem item={item} />}
        </TouchableOpacity>
      </View>
      {!isLabel && <View style={listViewStyles.thinSeparator} />}
      {errorSelfComplete && <GeneralErrorModal primaryActionCustomText={translate("general.ok")} />}
    </View>
  );
};

const ListItemLock = ({ item }: { item: Activity }) => {
  const [show, setShow] = useState(false);
  const onClose = () => {
    setShow(!show);
  };
  return (
    <View>
      <View style={activitiesStyles.listItemLockContainer}>
        <TouchableOpacity style={activitiesStyles.itemTouchableContent} onPress={onClose}>
          <View style={[activitiesStyles.itemContentWrapper, { opacity: 0.25 }]}>
            <CompletionIcon completion={item.completion} status={item.completionstatus} available={item.available} />
            <ListItem item={item} />
          </View>
        </TouchableOpacity>
        {show && (
          <CriteriaSheet
            title={translate("course.course_criteria.bottom_sheet_header")}
            criteriaList={item.availablereason}
            onClose={onClose}
          />
        )}
      </View>
      <View style={listViewStyles.thinSeparator} />
    </View>
  );
};

const ListItem = ({ item }: { item: Activity }) => {
  return (
    <View style={activitiesStyles.itemTextContainer}>
      <Text numberOfLines={1} style={activitiesStyles.itemTitle}>
        {item.name.trim()}
      </Text>
    </View>
  );
};

export default Activities;
