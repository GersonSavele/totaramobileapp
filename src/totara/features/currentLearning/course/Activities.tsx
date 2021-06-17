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
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useMutation } from "@apollo/react-hooks";
import { get, isEmpty } from "lodash";
import { useNavigation } from "@react-navigation/native";
import CriteriaSheet from "../components/CriteriaSheet";
import ActivityTextContent from "./ActivityTextContent";
import CompletionIcon from "./CompletionIcon";
import activitiesStyles from "./activitiesStyles";
import { TotaraTheme } from "@totara/theme/Theme";
import { Section, Activity, AppState } from "@totara/types";
import { AuthContext, useSession } from "@totara/core";
import { DescriptionFormat } from "@totara/types/LearningItem";
import { GeneralErrorModal } from "@totara/components";
import { translate } from "@totara/locale";
import { completionStatus, completionTrack } from "../constants";
import { ActivityModType } from "@totara/lib/constants";
import { navigateTo, NAVIGATION } from "@totara/lib/navigation";
import { activitySelfComplete, fetchResource, updateStateViewResource } from "../course/api";
import listViewStyles from "@totara/theme/listView";
import { CL_TEST_IDS } from "@totara/lib/testIds";
import { showMessage } from "@totara/lib";
import { wrappedWekaNodes, jsonObjectToWekaNodes } from "../weka/wekaUtils";
import { ToFullSummary } from "../weka/treeOperations";
import { decodeHtmlCharCodes } from "@totara/lib/tools";

const { SCORM_ROOT, SCORM_STACK_ROOT, WEBVIEW_ACTIVITY } = NAVIGATION;
type ActivitiesProps = {
  sections: [Section];
  courseRefreshCallBack: () => {};
  expandedSectionIds: number[];
  completionEnabled: boolean;
  onSetExpandedSectionIds: Function;
  isSingleActivity: boolean;
};

const Activities = ({
  sections,
  courseRefreshCallBack,
  expandedSectionIds,
  completionEnabled,
  onSetExpandedSectionIds,
  isSingleActivity
}: ActivitiesProps) => {
  const navigation = useNavigation();

  useEffect(() => navigation.addListener("focus", courseRefreshCallBack), [navigation]);
  return (
    <FlatList
      data={sections}
      testID={CL_TEST_IDS.LIST}
      renderItem={({ item }) => {
        return (
          <SectionItem
            section={item}
            courseRefreshCallBack={courseRefreshCallBack}
            expandedSectionIds={expandedSectionIds}
            completionEnabled={completionEnabled}
            onSetExpandedSectionIds={onSetExpandedSectionIds}
            isSingleActivity={isSingleActivity}
          />
        );
      }}
    />
  );
};

type SectionItemProps = {
  courseRefreshCallBack: () => {};
  section: Section;
  expandedSectionIds: number[];
  completionEnabled: boolean;
  onSetExpandedSectionIds: Function;
  isSingleActivity: boolean;
  testID?: string;
};

const SectionItem = ({
  section,
  courseRefreshCallBack,
  expandedSectionIds,
  completionEnabled,
  onSetExpandedSectionIds,
  isSingleActivity,
  testID
}: SectionItemProps) => {
  //every item need to have its own state
  const activities = section.data as Array<Activity>;
  const { title, available, availableReason, summary, id, summaryformat } = section;
  const isExpanded = expandedSectionIds?.includes(id);

  const onExpand = (isExpanded: boolean, id: number) => {
    const existingExpandedSectionIds = [...expandedSectionIds];
    if (isExpanded) {
      const index = existingExpandedSectionIds.indexOf(id);
      if (index > -1) {
        existingExpandedSectionIds.splice(index, 1);
      }
    } else {
      existingExpandedSectionIds.push(id);
    }
    onSetExpandedSectionIds(existingExpandedSectionIds);
  };

  return (
    <View style={{ backgroundColor: TotaraTheme.colorSecondary1 }} testID={testID}>
      {!isSingleActivity && (
        <TouchableOpacity onPress={() => onExpand(isExpanded, id)} testID={`${CL_TEST_IDS.ACTIVITY_SECTION}${id}`}>
          {available && activities.length > 0 && <ExpandableSectionHeader show={isExpanded} title={title} />}
          {!available && availableReason && availableReason.length > 0 && (
            <RestrictionSectionHeader title={title} availableReason={availableReason} />
          )}
        </TouchableOpacity>
      )}
      {isExpanded && (
        <ActivityList
          data={activities}
          courseRefreshCallBack={courseRefreshCallBack}
          sectionSummary={summary}
          summaryFormat={summaryformat}
          completionEnabled={completionEnabled}
        />
      )}
    </View>
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
          {decodeHtmlCharCodes(title)}
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
          {decodeHtmlCharCodes(title)}
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
  summaryFormat: string;
  completionEnabled: boolean;
};

const ActivityList = ({
  data,
  courseRefreshCallBack,
  sectionSummary,
  completionEnabled,
  summaryFormat
}: ActivityListProps) => {
  return (
    <View>
      {summaryFormat === DescriptionFormat.jsonEditor ? (
        !isEmpty(sectionSummary) && (
          <View style={activitiesStyles.activityList}>
            <View>{wekaContent(JSON.parse(sectionSummary && (sectionSummary as any)))}</View>
          </View>
        )
      ) : (
        <View style={activitiesStyles.activityList}>
          <ActivityTextContent label={sectionSummary} />
        </View>
      )}
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

const wekaContent = (description: Object) => {
  const root = wrappedWekaNodes(jsonObjectToWekaNodes(description));
  return root.accept(new ToFullSummary());
};

type ListUnLockProps = {
  item: Activity;
  courseRefreshCallBack?: () => {};
  completionEnabled: boolean;
};

const ListItemUnlock = ({ item, courseRefreshCallBack, completionEnabled }: ListUnLockProps) => {
  const navigation = useNavigation();

  const session = useSession();
  const { host, apiKey } = session;

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
            <CompletionIcon
              loading={loadingSelfComplete}
              completion={item.completion}
              status={item.completionstatus}
              available={item.available}
              onPress={item.completion === completionTrack.trackingManual ? onClickSelfComplete : undefined}
            />
          </View>
        )}
        <TouchableOpacity
          style={activitiesStyles.itemTouchableContent}
          disabled={isLabel}
          onPress={() => {
            switch (item.modtype) {
              case ActivityModType.scorm: {
                navigation.navigate(SCORM_STACK_ROOT, {
                  screen: SCORM_ROOT,
                  params: {
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
                })
                  .then((resourceData) => {
                    const resource = get(resourceData, "data.resource");
                    if (resource) {
                      return updateStateViewResource({
                        apiKey,
                        host,
                        instanceId: item.id,
                        modtype: item.modtype
                      }).then((activityViewResponse) => {
                        const isLogged = get(activityViewResponse, "data.core_completion_activity_view", false);
                        if (!isLogged) {
                          console.warn("Activity logging failed");
                        }
                        return resource;
                      });
                    } else {
                      showMessage({ text: translate("course.activity.invalid_file_data") });
                      throw new Error("Invalid activity resource data");
                    }
                  })
                  .then((resource) => {
                    const { mimetype, fileurl } = resource;
                    navigateTo({
                      navigate: navigation.navigate,
                      routeId: WEBVIEW_ACTIVITY,
                      props: {
                        activity: item,
                        fileurl,
                        mimetype,
                        apiKey,
                        backAction: () => { },
                        title: item?.name
                      }
                    });
                  })
                  .catch((e) => {
                    console.warn(e);
                  });
                break;
              }
              default: {
                navigateTo({
                  navigate: navigation.navigate,
                  routeId: WEBVIEW_ACTIVITY,
                  props: {
                    activity: item,
                    backAction: () => { },
                    title: item?.name
                  }
                });
              }
            }
          }}
          testID={`${CL_TEST_IDS.ACTIVITY}${item.id}`}>
          {isLabel ? (
            item.descriptionformat && item.descriptionformat === DescriptionFormat.jsonEditor ? (
              <View>{wekaContent(JSON.parse(item.description as any))}</View>
            ) : (
              item.description && <ActivityTextContent label={item.description} />
            )
          ) : (
            <ListItem item={item} />
          )}
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
