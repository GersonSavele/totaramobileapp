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
import { Section, Activity, ActivityType } from "@totara/types";
// @ts-ignore no types published yet for fortawesome react-native, they do have it react so check in future and remove this ignore
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { ActivityRestrictionView } from "@totara/components/currentLearning/courseDetails";
import { AppliedTheme } from "@totara/theme/Theme";
import ActivityLabel from "./ActivityLabel";
import { ActivitySheetContext } from "@totara/activities/ActivitySheet";
// To Do : refetch props should be removed from going nested component(MOB-381)

type ActivityProps = {
  item: Activity;
  theme: AppliedTheme;
  refetch?: () => {};
};

type BuildContentProps = {
  completion?: string;
  completionStatus?: string;
  available: boolean;
  theme: AppliedTheme;
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
        return <ActivityUI section={item} refetch={refetch}/>
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
      <TouchableOpacity style={styles.headerViewContainer} onPress={onClose}>
        <Text
          numberOfLines={1}
          style={[
            theme.textH3,
            {
              fontWeight: "bold",
              color: theme.colorNeutral6,
              flex: 3,
              fontSize: normalize(17)
            }
          ]}
        >
          {title}
        </Text>
        <Text
          style={[
            theme.textH3,
            styles.notAvailableText,
            {
              color: theme.colorNeutral6,
              backgroundColor: theme.colorNeutral2,
              flex: 1
            }
          ]}
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
    <View style={styles.headerViewContainer}>
      <Text
        numberOfLines={1}
        style={[theme.textH3, { fontWeight: "bold", fontSize: normalize(17) }]}
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

const BuildContent = ({
  completion,
  completionStatus,
  theme
}: BuildContentProps) => {
  if (
    completion === "tracking_automatic" &&
    (completionStatus === "complete_pass" || completionStatus === "complete")
  ) {
    return (
      <View style={{ marginRight: 16 }}>
        <ContentIcon
          icon={"check"}
          iconSize={15}
          size={30}
          backgroundColor={theme.colorSuccess}
          iconColor={theme.colorAccent}
          borderColor={theme.colorSuccess}
          isDashedCircle={false}
        />
      </View>
    );
  } else if (
    completion === "tracking_automatic" &&
    completionStatus === "incomplete"
  ) {
    return (
      <View style={{ marginRight: 16 }}>
        <ContentIcon
          icon={"check"}
          iconSize={15}
          size={30}
          backgroundColor={theme.colorAccent}
          iconColor={theme.colorNeutral5}
          borderColor={theme.colorNeutral5}
          isDashedCircle={false}
        />
      </View>
    );
  } else if (completionStatus === "complete_fail") {
    return (
      <View style={{ marginRight: 16 }}>
        <ContentIcon
          icon={"times"}
          iconSize={15}
          size={30}
          backgroundColor={theme.colorAlert}
          iconColor={theme.colorAccent}
          borderColor={theme.colorAlert}
          isDashedCircle={false}
        />
      </View>
    );
  } else if (
    completion === "tracking_manual" &&
    (completionStatus === "complete_pass" || completionStatus === "complete")
  ) {
    return (
      <View style={{ marginRight: 16 }}>
        <ContentIcon
          icon={"check"}
          iconSize={15}
          size={30}
          backgroundColor={theme.colorAccent}
          iconColor={theme.colorSuccess}
          borderColor={theme.colorSuccess}
          isDashedCircle={true}
        />
      </View>
    );
  } else if (
    completion === "tracking_manual" &&
    completionStatus === "incomplete"
  ) {
    return (
      <View style={{ marginRight: 16 }}>
        <ContentIcon
          icon={"check"}
          iconSize={15}
          size={30}
          backgroundColor={theme.colorAccent}
          iconColor={theme.colorNeutral5}
          borderColor={theme.colorNeutral5}
          isDashedCircle={true}
        />
      </View>
    );
  } else {
    return null;
  }
};

const ActivityListBody = ({ data, refetch }: ActivityListBodyProps) => {
  const [theme] = useContext(ThemeContext);
  return (
    <View>
      {data!.map((item: Activity, key: number) => {
        return (
          <View key={key}>
            {item.completionstatus === "unknown" ||
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
      <ActivityLabel label={item} theme={theme}></ActivityLabel>
    </View>
  ) : (
    <View
      style={[styles.accordionListWrap, { backgroundColor: theme.colorAccent }]}
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
                <View style={styles.activityBodyContainer}>
                  <BuildContent
                    completion={item.completion as string}
                    completionStatus={item.completionstatus as string}
                    theme={theme}
                    available={item.available}
                  ></BuildContent>
                  <View style={styles.activityContainer}>
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.bodyName,
                        { color: theme.colorNeutral8, textAlign: "center" }
                      ]}
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
          style={[
            styles.activityBodySeparator,
            { backgroundColor: theme.colorNeutral8 }
          ]}
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
      style={[styles.accordionListWrap, { backgroundColor: theme.colorAccent }]}
    >
      <View>
        <TouchableOpacity style={{ flex: 1 }} onPress={onClose}>
          <View style={styles.activityBodyContainer}>
            <ContentIcon
              icon={"lock"}
              iconSize={15}
              size={30}
              backgroundColor={theme.colorNeutral5}
              iconColor={theme.colorAccent}
              borderColor={theme.colorNeutral5}
              isDashedCircle={false}
            />
            <View style={[styles.activityContainer, { marginLeft: 16 }]}>
              <Text
                numberOfLines={1}
                style={[styles.bodyName, { color: theme.colorNeutral8 }]}
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
          style={[
            styles.activityBodySeparator,
            { backgroundColor: theme.colorNeutral8 }
          ]}
        ></View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bodyName: {
    alignSelf: "flex-start",
    fontSize: normalize(17),
    fontWeight: "500",
    justifyContent: "center"
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
    flexDirection: "column"
  },
  activityBodyContainer: {
    height: 60,
    justifyContent: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: 16
  },
  activityContainer: {
    height: 45,
    justifyContent: "center",
    marginRight: 16
  },
  activityBodySeparator: {
    height: 0.5,
    opacity: 0.2,
    marginLeft: 16,
    marginRight: 16
  },
  notAvailableText: {
    fontWeight: "500",
    borderRadius: 12,
    margin: 4,
    fontSize: normalize(11),
    paddingRight: 4,
    paddingLeft: 4,
    textAlign: "center"
  }
});

export { ActivityList, ActivityUI };
