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
import React, { useState, useContext } from "react";
// @ts-ignore no types published yet for fortawesome react-native, they do have it react so check in future and remove this ignore
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { NavigationContext } from "react-navigation";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useMutation } from "@apollo/react-hooks";
import { get, remove } from "lodash";

import CriteriaSheet from "../components/CriteriaSheet";
import ActivityTextContent from "./ActivityTextContent";
import CompletionIcon from "./CompletionIcon";
import activitiesStyles from "./activitiesStyles";
import { TotaraTheme } from "@totara/theme/Theme";
import { Section, Activity, AppState } from "@totara/types";
import { AuthContext } from "@totara/core";
import { GeneralErrorModal } from "@totara/components";
import { translate } from "@totara/locale";
import { completionStatus, completionTrack } from "../constants";
import { ActivityModType } from "@totara/lib/constants";
import { navigateTo, NAVIGATION } from "@totara/lib/navigation";
import { activitySelfComplete, fetchResource } from "../course/api";
import listViewStyles from "@totara/theme/listView";

const { SCORM_ROOT, WEBVIEW_ACTIVITY } = NAVIGATION;
type ActivitiesProps = {
  sections: [Section];
  courseRefreshCallBack: () => {};
  expandedSections: Section[];
  completionEnabled: boolean;
  onSetExpandedSections: Function;
};

const Activities = ({
  sections,
  courseRefreshCallBack,
  expandedSections,
  completionEnabled,
  onSetExpandedSections
}: ActivitiesProps) => {
  return (
    <FlatList
      data={sections}
      renderItem={({ item }) => {
        return (
          <SectionItem
            section={item}
            courseRefreshCallBack={courseRefreshCallBack}
            expandedSections={expandedSections}
            completionEnabled={completionEnabled}
            onSetExpandedSections={onSetExpandedSections}
          />
        );
      }}
    />
  );
};

type SectionItemProps = {
  courseRefreshCallBack: () => {};
  section: Section;
  expandedSections: Section[];
  completionEnabled: boolean;
  onSetExpandedSections: Function;
};

const SectionItem = ({
  section,
  courseRefreshCallBack,
  expandedSections,
  completionEnabled,
  onSetExpandedSections
}: SectionItemProps) => {
  //every item need to have its own state
  const activities = section.data as Array<Activity>;
  const { title, available, availableReason, summary } = section;

  const isExpanded = expandedSections?.indexOf(section) >= 0;

  const onExpand = (isExpanded: boolean) => {
    const existingExpandedSections = [...expandedSections];
    if (isExpanded) {
      remove(existingExpandedSections, (item) => section === item);
    } else {
      existingExpandedSections.push(section);
    }
    onSetExpandedSections(existingExpandedSections);
  };

  return (
    activities && (
      <View style={{ backgroundColor: TotaraTheme.colorSecondary1 }}>
        <TouchableOpacity onPress={() => onExpand(isExpanded)}>
          {available && activities.length > 0 && <ExpandableSectionHeader show={isExpanded} title={title} />}
          {!available && availableReason && availableReason.length > 0 && (
            <RestrictionSectionHeader title={title} availableReason={availableReason} />
          )}
        </TouchableOpacity>
        {isExpanded && (
          <ActivityList
            data={activities}
            courseRefreshCallBack={courseRefreshCallBack}
            sectionSummary={summary}
            completionEnabled={completionEnabled}
          />
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
  completionEnabled: boolean;
};

const ActivityList = ({ data, courseRefreshCallBack, sectionSummary, completionEnabled }: ActivityListProps) => {
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
              <ListItemUnlock
                item={item}
                courseRefreshCallBack={courseRefreshCallBack}
                key={key}
                completionEnabled={completionEnabled}
              />
            )}
          </View>
        );
      })}
    </View>
  );
};

type ListUnLockProps = {
  item: Activity;
  courseRefreshCallBack?: () => {};
  completionEnabled: boolean;
};

const ListItemUnlock = ({ item, courseRefreshCallBack, completionEnabled }: ListUnLockProps) => {
  const navigation = useContext(NavigationContext);

  const {
    authContextState: { appState }
  } = useContext(AuthContext);

  const { apiKey, host } = appState as AppState;

  const [selfComplete, { data, error: errorSelfComplete, loading: loadingSelfComplete }] = useMutation(
    activitySelfComplete
  );
  if (data) {
    courseRefreshCallBack!();
  }
  const isLabel = item.modtype === ActivityModType.label;
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
      <View
        style={
          isLabel
            ? [activitiesStyles.itemContentWrapper]
            : [activitiesStyles.itemContentWrapper, { alignItems: "center" }]
        }>
        {completionEnabled && (
          <View style={isLabel && activitiesStyles.labelSelfCompletionIcon}>
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
          </View>
        )}
        <TouchableOpacity
          style={activitiesStyles.itemTouchableContent}
          disabled={isLabel}
          onPress={() => {
            switch (item.modtype) {
              case ActivityModType.scorm: {
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
              case ActivityModType.label: {
                break;
              }
              case ActivityModType.resource: {
                fetchResource({
                  instanceId: item.instanceid,
                  apiKey,
                  host
                }).then((resourceData) => {
                  const resource = get(resourceData, "data.resource");
                  if (resource) {
                    const { mimetype, fileurl } = resource;
                    navigateTo({
                      navigate: navigation.navigate,
                      routeId: WEBVIEW_ACTIVITY,
                      props: {
                        activity: item,
                        fileurl,
                        mimetype,
                        apiKey,
                        backAction: courseRefreshCallBack
                      }
                    });
                  }
                });
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
          <View style={[activitiesStyles.itemContentWrapper, activitiesStyles.itemLockContentWrapper]}>
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
