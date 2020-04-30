/**
 * This file is part of Totara Mobile
 *
 * Copyright (C) 2019 onwards Totara Learning Solutions LTD
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @author Jun Yamog <jun.yamog@totaralearning.com>
 *
 */

import { Text, TouchableOpacity, View, FlatList } from "react-native";
import React, { useState, useContext } from "react";
import { normalize, ThemeContext } from "@totara/theme";
import {
  Section,
  Activity,
  ActivityType,
  CompletionStatus,
} from "@totara/types";
// @ts-ignore no types published yet for fortawesome react-native, they do have it react so check in future and remove this ignore
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { ActivityRestrictionView } from "@totara/components/currentLearning/courseDetails";
import { AppliedTheme } from "@totara/theme/Theme";
import { ActivitySheetContext } from "@totara/activities/ActivitySheet";
import { TextTypeLabel } from "./activityLabel/types";
import ActivityContentIcon from "./ActivityContentIcon";
import { activityStyles } from "@totara/theme/activityList";

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

const ActivityList = ({ sections, refetch }: ActivityListProps) => {
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
        }}
      >
        {available === true ? (
          <CellExpandUI show={show} title={title} />
        ) : (
          <SectionDataNotAvailable {...section} />
        )}
      </TouchableOpacity>
      {show && <ActivityListBody data={activities} refetch={refetch} />}
    </View>
  ) : null;
};

const SectionDataNotAvailable = ({ title, availablereason }: Section) => {
  const [theme] = useContext(ThemeContext);
  const [show, setShow] = useState(false);
  const onClose = () => {
    setShow(!show);
  };
  return (
    <View>
      <TouchableOpacity
        style={activityStyles.headerViewContainer}
        onPress={onClose}
      >
        <Text
          numberOfLines={1}
          style={{
            ...theme.textH3,

            fontWeight: "bold",
            color: theme.colorNeutral6,
            flex: 3,
            fontSize: normalize(22),
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            ...theme.textH3,
            ...activityStyles.notAvailableText,
            color: theme.colorNeutral6,
            backgroundColor: theme.colorNeutral2,
            flex: 1,
          }}
        >
          Not available
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

const CellExpandUI = ({ show, title }: CellExpandUIProps) => {
  const [theme] = useContext(ThemeContext);
  return (
    <View style={activityStyles.headerViewContainer}>
      <Text
        numberOfLines={1}
        style={{ ...theme.textH3, fontWeight: "bold", fontSize: normalize(22) }}
      >
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
            {item.completionstatus === CompletionStatus.unknown ||
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

const ActivityUnLock = ({ item, theme, refetch }: ActivityProps) => {
  return item.modtype == "label" ? (
    <View style={{ backgroundColor: theme.colorSecondary1 }}>
      <TextTypeLabel label={item} theme={theme}></TextTypeLabel>
    </View>
  ) : (
    <View
      style={{
        ...activityStyles.accordionListWrap,
        backgroundColor: theme.colorAccent,
      }}
    >
      <View>
        <ActivitySheetContext.Consumer>
          {({ setCurrentActivity, setOnClose }) => {
            return (
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => {
                  setCurrentActivity(item as ActivityType);
                  setOnClose(refetch!);
                }}
              >
                <View style={activityStyles.activityBodyContainer}>
                  <ActivityContentIcon
                    completion={item.completion}
                    completionStatus={item.completionstatus}
                    theme={theme}
                    available={item.available}
                  ></ActivityContentIcon>
                  <View style={activityStyles.activityContainer}>
                    <Text
                      numberOfLines={1}
                      style={{
                        ...activityStyles.bodyName,
                        color: theme.colorNeutral8,
                        textAlign: "center",
                      }}
                    >
                      {item.name.trim()}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        </ActivitySheetContext.Consumer>
        <View
          style={{
            ...activityStyles.activityBodySeparator,
            backgroundColor: theme.colorNeutral8,
          }}
        ></View>
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
    <View
      style={{
        ...activityStyles.accordionListWrap,
        backgroundColor: theme.colorAccent,
      }}
    >
      <View>
        <TouchableOpacity style={{ flex: 1 }} onPress={onClose}>
          <View style={activityStyles.activityBodyContainer}>
            <ActivityContentIcon
              completion={item.completion}
              completionStatus={item.completionstatus}
              theme={theme}
              available={item.available}
            ></ActivityContentIcon>
            <View style={activityStyles.activityContainer}>
              <Text
                numberOfLines={1}
                style={{
                  ...activityStyles.bodyName,
                  color: theme.colorNeutral8,
                }}
              >
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
        <View
          style={{
            ...activityStyles.activityBodySeparator,
            backgroundColor: theme.colorNeutral8,
          }}
        ></View>
      </View>
    </View>
  );
};

export default ActivityList;
