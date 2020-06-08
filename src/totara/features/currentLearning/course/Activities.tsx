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
import ActivityRestrictionView from "./ActivityRestrictionView";
import { AppliedTheme } from "@totara/theme/Theme";
import TextTypeLabel from "./TextTypeLabel";
import ContentIconWrapper from "./ContentIconWrapper";
import {
  sectionDataNotAvailableTitle,
  sectionDataNotAvailable,
  sectionDataAvailableTitle,
  activityContainerWrap,
  unLockActivityTextWrap,
  lockActivityTextWrap,
  activityBodyWrap,
  styles
} from "@totara/theme/activities";
import { ThemeContext } from "@totara/theme";
import { Section, Activity } from "@totara/types";
import { Separator } from "@totara/components";
import { translate } from "@totara/locale";
import {
  completionStatus,
  NAVIGATION_SCORM_STACK_ROOT
} from "@totara/lib/constants";
import { navigateTo } from "@totara/lib/navigation";
import { NavigationContext } from "react-navigation";

type ActivityListProps = {
  sections: [Section];
  courseRefreshCallBack: () => {};
  expandAllActivities: boolean;
};

const Activities = ({
  sections,
  courseRefreshCallBack,
  expandAllActivities
}: ActivityListProps) => {
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

const SectionItem = ({
  section,
  courseRefreshCallBack,
  expandAllActivities
}: SectionItemProps) => {
  //every item need to have its own state
  const [show, setShow] = useState(expandAllActivities);
  const activities = section.data as Array<Activity>;
  const { title, available } = section;
  const [theme] = useContext(ThemeContext);
  useEffect(() => {
    setShow(expandAllActivities);
  }, [expandAllActivities]);

  const onExpand = () => {
    setShow(!show);
  };

  return activities && activities.length != 0 ? (
    <View style={{ backgroundColor: theme.colorSecondary1 }}>
      <TouchableOpacity onPress={onExpand}>
        {available === true ? (
          <ExpandableSectionHeader show={show} title={title} />
        ) : (
          <RestrictionSectionHeader {...section} />
        )}
      </TouchableOpacity>
      {show && (
        <Row data={activities} courseRefreshCallBack={courseRefreshCallBack} />
      )}
    </View>
  ) : null;
};

const RestrictionSectionHeader = ({ title, availablereason }: Section) => {
  const [theme] = useContext(ThemeContext);
  const [show, setShow] = useState(false);
  const onClose = () => {
    setShow(!show);
  };
  return (
    <View>
      <TouchableOpacity style={styles.sectionViewWrap} onPress={onClose}>
        <Text numberOfLines={1} style={sectionDataNotAvailableTitle(theme)}>
          {title}
        </Text>
        <Text style={sectionDataNotAvailable(theme)}>
          {translate("course.course_activity_section.not_available")}
        </Text>
      </TouchableOpacity>
      {show && (
        <ActivityRestrictionView
          description={availablereason == null ? "" : availablereason}
          onClose={onClose}
        />
      )}
    </View>
  );
};

const ExpandableSectionHeader = ({
  title,
  show
}: {
  show: boolean;
  title: string;
}) => {
  const [theme] = useContext(ThemeContext);
  return (
    <View style={styles.sectionViewWrap}>
      <Text numberOfLines={1} style={sectionDataAvailableTitle(theme)}>
        {title}
      </Text>
      {show ? (
        <FontAwesomeIcon
          icon={faChevronUp}
          color={theme.colorNeutral5}
          size={16}
        />
      ) : (
        <FontAwesomeIcon
          icon={faChevronDown}
          color={theme.colorNeutral5}
          size={16}
        />
      )}
    </View>
  );
};

type ActivityContentProps = {
  data?: Array<Activity>;
  courseRefreshCallBack: () => {};
};

const Row = ({ data, courseRefreshCallBack }: ActivityContentProps) => {
  const [theme] = useContext(ThemeContext);
  return (
    <View>
      {data!.map((item: Activity, key: number) => {
        return (
          <View key={key}>
            {item.completionstatus === completionStatus.unknown ||
            item.completionstatus === null ||
            item.available === false ? (
              <RowLock item={item} theme={theme} key={key} />
            ) : (
              <RowUnLock
                item={item}
                theme={theme}
                courseRefreshCallBack={courseRefreshCallBack}
                key={key}
              />
            )}
          </View>
        );
      })}
    </View>
  );
};

type ActivityProps = {
  item: Activity;
  theme: AppliedTheme;
  courseRefreshCallBack?: () => {};
};

const RowUnLock = ({ item, theme }: ActivityProps) => {
  const navigation = useContext(NavigationContext);
  return item.modtype == "label" ? (
    <View style={{ backgroundColor: theme.colorSecondary1 }}>
      <TextTypeLabel label={item} theme={theme}></TextTypeLabel>
    </View>
  ) : (
    <View style={activityContainerWrap(theme)}>
      <View>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => {
            switch (item.modtype) {
              case "scorm": {
                navigateTo({
                  navigate: navigation.navigate,
                  routeId: NAVIGATION_SCORM_STACK_ROOT,
                  props: {
                    id: item.instanceid.toString(),
                    title: item.name
                  }
                });
              }
            }
          }}>
          <View style={styles.activityBodyContainer}>
            <ContentIconWrapper
              completion={item.completion}
              status={item.completionstatus}
              theme={theme}
              available={item.available}></ContentIconWrapper>
            <View style={styles.activityContainer}>
              <Text numberOfLines={1} style={unLockActivityTextWrap(theme)}>
                {item.name.trim()}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <Separator />
      </View>
    </View>
  );
};

const RowLock = ({ item, theme }: ActivityProps) => {
  const [show, setShow] = useState(false);
  const onClose = () => {
    setShow(!show);
  };
  return (
    <View style={activityContainerWrap(theme)}>
      <View>
        <TouchableOpacity style={{ flex: 1 }} onPress={onClose}>
          <View style={activityBodyWrap()}>
            <ContentIconWrapper
              completion={item.completion}
              status={item.completionstatus}
              theme={theme}
              available={item.available}></ContentIconWrapper>
            <View style={styles.activityContainer}>
              <Text numberOfLines={1} style={lockActivityTextWrap(theme)}>
                {item.name}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        {show && (
          <ActivityRestrictionView
            description={
              item.availablereason == null ? "" : item.availablereason
            }
            onClose={onClose}
          />
        )}
        <Separator />
      </View>
    </View>
  );
};

export default Activities;
