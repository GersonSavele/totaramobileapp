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

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList
} from "react-native";
import React, { useState, useContext } from "react";
import { ContentIcon } from "@totara/components";
import { normalize, ThemeContext } from "@totara/theme";
import { ActivitySheetConsumer } from "@totara/activities";
import { Section, Activity } from "@totara/types";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import ActivityRestrictionView from "./ActivityRestrictionView";

const ActivityList = ({ sections }: { sections: [Section] }) => {
  return (
    <FlatList
      data={sections}
      renderItem={({ item }) => {
        return <ActivityUI section={item} />;
      }}
    />
  );
};

const ActivityUI = ({ section }: { section: Section }) => {
  const [show, setShow] = useState(false);
  const [theme] = useContext(ThemeContext);
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          setShow(!show);
        }}
      >
        <View style={styles.headerViewContainer}>
          <ActivityListHeader {...section} />
          {show ? (
            <FontAwesomeIcon
              icon={"caret-up"}
              color={theme.colorNeutral5}
              size={16}
            />
          ) : (
            <FontAwesomeIcon
              icon={"caret-down"}
              color={theme.colorNeutral5}
              size={16}
            />
          )}
        </View>
      </TouchableOpacity>
      {show && <ActivityListBody data={section.data}></ActivityListBody>}
    </View>
  );
};

type BuildContentProps = {
  completion?: string;
  completionStatus?: string;
};

const BuildContent = ({ completion, completionStatus }: BuildContentProps) => {
  const [theme] = useContext(ThemeContext);

  if (
    completion == "tracking_automatic" &&
    completionStatus == "complete_pass"
  ) {
    return (
      <ContentIcon
        icon={"check"}
        iconSize={15}
        size={30}
        backgroundColor={theme.colorSuccess}
        iconColor={theme.colorAccent}
        borderColor={theme.colorSuccess}
        isDashedCircle={false}
      />
    );
  } else if (
    completion == "tracking_automatic" &&
    completionStatus == "incomplete"
  ) {
    return (
      <ContentIcon
        icon={"check"}
        iconSize={15}
        size={30}
        backgroundColor={theme.colorAccent}
        iconColor={theme.colorNeutral5}
        borderColor={theme.colorNeutral5}
        isDashedCircle={false}
      />
    );
  } else if (completionStatus == "complete_fail") {
    return (
      <ContentIcon
        icon={"times"}
        iconSize={15}
        size={30}
        backgroundColor={theme.colorAlert}
        iconColor={theme.colorAccent}
        borderColor={theme.colorAlert}
        isDashedCircle={false}
      />
    );
  } else if (completion == "tracking_none" || completionStatus == "unknown") {
    return (
      <ContentIcon
        icon={"lock"}
        iconSize={15}
        size={30}
        backgroundColor={theme.colorNeutral5}
        iconColor={theme.colorAccent}
        borderColor={theme.colorNeutral5}
        isDashedCircle={false}
      />
    );
  } else if (
    completion == "tracking_manual" &&
    completionStatus == "complete"
  ) {
    return (
      <ContentIcon
        icon={"check"}
        iconSize={15}
        size={30}
        backgroundColor={theme.colorAccent}
        iconColor={theme.colorSuccess}
        borderColor={theme.colorSuccess}
        isDashedCircle={true}
      />
    );
  } else if (
    completion == "tracking_manual" &&
    completionStatus == "incomplete"
  ) {
    return (
      <ContentIcon
        icon={"check"}
        iconSize={15}
        size={30}
        backgroundColor={theme.colorAccent}
        iconColor={theme.colorNeutral5}
        borderColor={theme.colorNeutral5}
        isDashedCircle={true}
      />
    );
  } else {
    return null;
  }
};

const ActivityListBody = ({ data }: { data?: Array<Activity> }) => {
  const [theme] = useContext(ThemeContext);

  if (data && data.length != 0) {
    return (
      <View
        style={[styles.accordionListWrap, { borderColor: theme.colorNeutral3 }]}
      >
        {data.map((item: Activity, key: number) => {
          return (
            <View key={key}>
              {item.completion == "tracking_none" ||
              item.completionstatus == "unknown" ? (
                <ActivityLock item={item} />
              ) : (
                <ActivityUnLock item={item} />
              )}

              {data.length - 1 === key ? null : (
                <View
                  style={[
                    styles.activityBodySeparator,
                    { backgroundColor: theme.colorNeutral3 }
                  ]}
                ></View>
              )}
            </View>
          );
        })}
      </View>
    );
  } else {
    return null;
  }
};

const ActivityUnLock = ({ item }: { item: Activity }) => {
  const [theme] = useContext(ThemeContext);
  return (
    <View>
      <ActivitySheetConsumer>
        {({ setCurrentActivity }) => {
          return (
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => setCurrentActivity(item)}
            >
              <View style={styles.activityBodyContainer}>
                <BuildContent
                  completion={item.completion as string}
                  completionStatus={item.completionstatus as string}
                ></BuildContent>
                <View style={styles.activityBodyUnLockContainer}>
                  <Text
                    numberOfLines={1}
                    style={[styles.bodyType, { color: theme.colorNeutral6 }]}
                  >
                    {item.modtype.toUpperCase()}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={[styles.bodyName, { color: theme.textColorDark }]}
                  >
                    {item.name}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      </ActivitySheetConsumer>
    </View>
  );
};

const restrictionView = () => {
  return (
    <ActivityRestrictionView
      title=""
      description=""
      imageType="complete_action"
      visible={true}
    />
  );
};

const ActivityLock = ({ item }: { item: Activity }) => {
  const [theme] = useContext(ThemeContext);
  return (
    <View>
      <TouchableOpacity style={{ flex: 1 }} onPress={() => restrictionView}>
        <View style={styles.activityBodyContainer}>
          <BuildContent
            completion={item.completion as string}
            completionStatus={item.completionstatus as string}
          ></BuildContent>
          <View style={styles.activityBodyLockContainer}>
            <Text
              numberOfLines={1}
              style={[
                styles.bodyType,
                { color: theme.colorNeutral6, opacity: 0.5 }
              ]}
            >
              {item.modtype.toUpperCase()}
            </Text>
            <Text
              numberOfLines={1}
              style={[
                styles.bodyName,
                { color: theme.textColorDark, opacity: 0.5 }
              ]}
            >
              {item.name}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const ActivityListHeader = ({ title }: Section) => {
  const [theme] = useContext(ThemeContext);
  return (
    <View>
      <Text style={[theme.textH3, { fontWeight: "bold" }]}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  bodyName: {
    alignSelf: "flex-start",
    flex: 3,
    fontSize: normalize(17),
    fontWeight: "normal"
  },
  bodyType: {
    alignSelf: "flex-start",
    flex: 2,
    fontSize: normalize(11),
    fontWeight: "600"
  },
  headerViewContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 50,
    marginLeft: 16,
    marginRight: 16,
    alignItems: "center"
  },
  accordionListWrap: {
    flexDirection: "column",
    marginLeft: 16,
    marginRight: 16,
    borderRadius: 4,
    borderWidth: 1
  },
  activityBodyContainer: {
    height: 60,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: 8
  },
  activityBodyLockContainer: {
    height: 45,
    justifyContent: "center",
    flexDirection: "column",
    flex: 5,
    margin: 16
  },
  activityBodyUnLockContainer: {
    height: 45,
    justifyContent: "center",
    flexDirection: "column",
    flex: 5,
    margin: 16
  },
  activityBodySeparator: {
    height: 0.5
  }
});

export default ActivityList;
