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

// To Do : refetch props should be removed from going nested component(MOB-381)

type ActivityProps = {
  item: Activity;
  theme: AppliedTheme;
  refetch?: () => {};
};

type CellExpandUIProps = {
  show: boolean;
  title: string;
};

type ActivityListProps = {
  sections: [Section];
  refetch: () => {};
};

type ActivityUIProps = {
  refetch: () => {};
  section: Section;
};

type ActivityListBodyProps = {
  data?: Array<Activity>;
  refetch: () => {};
};

const Activities = ({ sections, refetch }: ActivityListProps) => {
  return (
    <FlatList
      data={sections}
      renderItem={({ item }) => {
        return <ActivityUI section={item} refetch={refetch} />;
      }}
    />
  );
};

const ActivityUI = ({ section, refetch }: ActivityUIProps) => {
  const [show, setShow] = useState(false);
  const activities = section.data as Array<Activity>;
  const { title, available } = section;
  const [theme] = useContext(ThemeContext);
  return activities && activities.length != 0 ? (
    <View style={{ backgroundColor: theme.colorSecondary1 }}>
      <TouchableOpacity
        onPress={() => {
          setShow(!show);
        }}>
        {available === true ? (
          <ExpandableSection show={show} title={title} />
        ) : (
          <RestrictionSection {...section} />
        )}
      </TouchableOpacity>
      {show && <ActivityListBody data={activities} refetch={refetch} />}
    </View>
  ) : null;
};

const RestrictionSection = ({ title, availablereason }: Section) => {
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

const ExpandableSection = ({ show, title }: CellExpandUIProps) => {
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

const ActivityListBody = ({ data, refetch }: ActivityListBodyProps) => {
  const [theme] = useContext(ThemeContext);
  return (
    <View>
      {data!.map((item: Activity, key: number) => {
        return (
          <View key={key}>
            {item.completionstatus === completionStatus.unknown ||
            item.completionstatus === null ||
            item.available === false ? (
              <ActivityLock item={item} theme={theme} key={key} />
            ) : (
              <ActivityUnLock
                item={item}
                theme={theme}
                refetch={refetch}
                key={key}
              />
            )}
          </View>
        );
      })}
    </View>
  );
};

const ActivityUnLock = ({ item, theme }: ActivityProps) => {
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

const ActivityLock = ({ item, theme }: ActivityProps) => {
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
