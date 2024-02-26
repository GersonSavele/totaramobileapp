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
import React, { useEffect } from "react";
// @ts-ignore no types published yet for fortawesome react-native, they do have it react so check in future and remove this ignore
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useMutation } from "@apollo/client";
import { get, isEmpty } from "lodash";
import { useNavigation } from "@react-navigation/native";
import TextContent from "./TextContent";
import CompletionIcon from "./CompletionIcon";
import activitiesStyles from "./activitiesStyles";
import { TotaraTheme } from "@totara/theme/Theme";
import { Section, Activity } from "@totara/types";
import { useSession } from "@totara/core";
import { DescriptionFormat } from "@totara/types/LearningItem";
import { GeneralErrorModal } from "@totara/components";
import { translate } from "@totara/locale";
import { completionStatus, completionTrack } from "@totara/features/constants";
import { ActivityModType } from "@totara/lib/constants";
import { navigateTo, NAVIGATION } from "@totara/lib/navigation";
import { activitySelfComplete, fetchResource, updateStateViewResource } from "../course/api";
import listViewStyles from "@totara/theme/listView";
import { CL_TEST_IDS } from "@totara/lib/testIds";
import { showMessage } from "@totara/lib";
import { decodeHtmlCharCodes } from "@totara/lib/tools";
import { WekaContent } from "@totara/components/weka/WekaContent";
import { margins } from "@totara/theme/constants";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

const { SCORM_ROOT, SCORM_STACK_ROOT, WEBVIEW_ACTIVITY } = NAVIGATION;
type ActivitiesProps = {
  sections: [Section];
  courseRefreshCallBack: () => {};
  expandedSectionIds: number[];
  completionEnabled: boolean;
  onSetExpandedSectionIds: Function;
  isSingleActivity: boolean;
  showCriteriaList: (any) => void;
};

const Activities = ({
  sections,
  courseRefreshCallBack,
  expandedSectionIds,
  completionEnabled,
  onSetExpandedSectionIds,
  isSingleActivity,
  showCriteriaList
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
            showCriteriaList={() => showCriteriaList(item.availableReason)}
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
  showCriteriaList: () => void;
};

const SectionItem = ({
  section,
  courseRefreshCallBack,
  expandedSectionIds,
  completionEnabled,
  onSetExpandedSectionIds,
  isSingleActivity,
  testID,
  showCriteriaList
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
          {available && activities.length == 0 && (
            <NonExpandableSectionHeader summaryFormat={summaryformat} title={title} sectionSummary={summary} />
          )}
          {!available && availableReason && availableReason.length > 0 && (
            <RestrictionSectionHeader title={title} showCriteriaList={showCriteriaList} />
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
          showCriteriaList={showCriteriaList}
        />
      )}
    </View>
  );
};

type NonExpandableSectionHeaderProps = {
  title: string;
  sectionSummary: string;
  summaryFormat: string;
};

const NonExpandableSectionHeader = ({ title, sectionSummary, summaryFormat }: NonExpandableSectionHeaderProps) => {
  return (
    <View style={{ margin: margins.marginL }}>
      <Text numberOfLines={1} style={activitiesStyles.sectionTitle}>
        {decodeHtmlCharCodes(title)}
      </Text>
      <TextContentWrapper sectionSummary={sectionSummary} summaryFormat={summaryFormat} />
    </View>
  );
};

type TextContentWrapperProps = {
  sectionSummary: string;
  summaryFormat: string;
};

const TextContentWrapper = ({ sectionSummary, summaryFormat }: TextContentWrapperProps) => (
  <View style={{ flex: 1 }}>
    {summaryFormat === DescriptionFormat.jsonEditor ? (
      !isEmpty(sectionSummary) && (
        <View style={activitiesStyles.activityList}>
          <WekaContent content={sectionSummary} />
        </View>
      )
    ) : (
      <View style={activitiesStyles.activityList}>
        <TextContent label={sectionSummary} />
      </View>
    )}
  </View>
);

type RestHeaderProps = {
  title: string;
  showCriteriaList: () => void;
};

const RestrictionSectionHeader = ({ title, showCriteriaList }: RestHeaderProps) => {
  return (
    <View>
      <TouchableOpacity style={activitiesStyles.sectionView} onPress={showCriteriaList}>
        <Text numberOfLines={1} style={activitiesStyles.sectionTitle}>
          {decodeHtmlCharCodes(title)}
        </Text>
        <Text style={activitiesStyles.sectionNotAvailable}>
          {translate("course.course_activity_section.not_available")}
        </Text>
      </TouchableOpacity>
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
          <FontAwesomeIcon icon={faChevronUp as IconProp} color={TotaraTheme.colorNeutral5} size={16} />
        ) : (
          <FontAwesomeIcon icon={faChevronDown as IconProp} color={TotaraTheme.colorNeutral5} size={16} />
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
  showCriteriaList: () => void;
};

const ActivityList = ({
  data,
  courseRefreshCallBack,
  sectionSummary,
  completionEnabled,
  summaryFormat,
  showCriteriaList
}: ActivityListProps) => {
  return (
    <View>
      <TextContentWrapper sectionSummary={sectionSummary} summaryFormat={summaryFormat} />
      {data!.map((item: Activity) => {
        if (!item.available && isEmpty(item.availablereason)) return <View />;
        return (
          <View key={item.id}>
            {item.completionstatus === completionStatus.unknown || item.completionstatus === null || !item.available ? (
              <ListItemLock item={item} showCriteriaList={showCriteriaList} />
            ) : (
              <ListItemUnlock
                item={item}
                courseRefreshCallBack={courseRefreshCallBack}
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
  const navigation = useNavigation();

  const { host = "", apiKey = "" } = useSession();

  const [selfComplete, { data, error: errorSelfComplete, loading: loadingSelfComplete }] =
    useMutation(activitySelfComplete);
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
                  .then(resourceData => {
                    // @ts-ignore
                    const objResourceData = JSON.parse(resourceData);
                    const resource = get(objResourceData, "data.resource");
                    if (resource) {
                      return updateStateViewResource({
                        apiKey,
                        host,
                        instanceId: item.id,
                        modtype: item.modtype
                      }).then(activityViewResponse => {
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
                  .then(resource => {
                    const { mimetype, fileurl } = resource;
                    navigateTo({
                      navigate: navigation.navigate,
                      routeId: WEBVIEW_ACTIVITY,
                      props: {
                        activity: item,
                        fileurl,
                        mimetype,
                        apiKey,
                        backAction: () => {},
                        title: item?.name
                      }
                    });
                  })
                  .catch(e => {
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
                    backAction: () => {},
                    title: item?.name
                  }
                });
              }
            }
          }}
          testID={`${CL_TEST_IDS.ACTIVITY}${item.id}`}>
          {isLabel ? (
            item.description ? (
              item.descriptionformat && item.descriptionformat === DescriptionFormat.jsonEditor ? (
                <View style={{ paddingTop: margins.marginM }}>
                  <WekaContent content={item.description} />
                </View>
              ) : (
                item.description && <TextContent label={item.description} />
              )
            ) : (
              <View></View>
            )
          ) : (
            <ListItem text={item.name?.trim()} />
          )}
        </TouchableOpacity>
      </View>
      {!isLabel && <View style={listViewStyles.thinSeparator} />}
      {errorSelfComplete && <GeneralErrorModal primaryActionCustomText={translate("general.ok")} />}
    </View>
  );
};

type ListItemLockProps = { item: Activity; showCriteriaList: () => void };

const ListItemLock = ({ item, showCriteriaList }: ListItemLockProps) => {
  return (
    <View>
      <View style={activitiesStyles.listItemLockContainer}>
        <TouchableOpacity style={activitiesStyles.itemTouchableContent} onPress={showCriteriaList}>
          <View style={[activitiesStyles.itemContentWrapper, activitiesStyles.itemLockContentWrapper]}>
            <CompletionIcon completion={item.completion} status={item.completionstatus} available={item.available} />
            {item.descriptionformat === DescriptionFormat.jsonEditor && item.name?.trim() && (
              <ListItem text={item.name?.trim()} />
            )}
            {item.descriptionformat !== DescriptionFormat.jsonEditor && item.description?.trim() && (
              <ListItem text={item.description?.trim()} />
            )}
          </View>
        </TouchableOpacity>
      </View>
      <View style={listViewStyles.thinSeparator} />
    </View>
  );
};

const ListItem = ({ text }: { text: string }) => {
  return (
    <View style={activitiesStyles.itemTextContainer}>
      <Text numberOfLines={1} style={activitiesStyles.itemTitle}>
        {text}
      </Text>
    </View>
  );
};

export default Activities;
