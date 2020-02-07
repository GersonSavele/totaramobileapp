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
import React, { useState, useContext, useEffect } from "react";
import { ContentIcon } from "@totara/components";
import { normalize, ThemeContext } from "@totara/theme";
import { ActivitySheetConsumer } from "@totara/activities";
import { Section, Activity } from "@totara/types";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import ActivityRestrictionView from "./ActivityRestrictionView";
import { AppliedTheme } from "@totara/theme/Theme";


type ActivityProps = {
  item: Activity;
  theme : AppliedTheme;
}

type BuildContentProps = {
  completion?: string;
  completionStatus?: string;
  theme : AppliedTheme;
};

type CellExpandUIProps = {
  show: boolean;
  title: string;
};

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
  const activities = section.data as Array<Activity>;
  const { title } = section;
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          setShow(!show);
        }}
      >
        {activities && activities.length != 0 ? (
          <CellExpandUI show={show} title={title} />
        ) : (
          <SectionDataNotAvailable {...section} />
        )}
      
      </TouchableOpacity>
      {show && <ActivityListBody data={section.data}></ActivityListBody>}
    </View>
  );
};

<<<<<<< HEAD

=======
>>>>>>> MOB-367 features: Implemented course overview UI
const SectionDataNotAvailable = ({ title, availablereason }: Section) => {
  const [theme] = useContext(ThemeContext);
  const [show, setShow] = useState(false);
  const onClose = () => {
    setShow(!show);
  }
  return (
    <View >
      <TouchableOpacity
        style={styles.headerViewContainer}
        onPress={onClose}>
        <Text
          style={[
            theme.textH3,
            { fontWeight: "bold", color: theme.colorNeutral6 }
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
            }
          ]}
        >
          Not available
        </Text>
      </TouchableOpacity>
<<<<<<< HEAD
      {show && <ActivityRestrictionView description={availablereason == null ? "" : availablereason} onClose = {onClose}/>}
=======
      {show && <ActivityRestrictionView description={availablereason!} />}
>>>>>>> MOB-367 features: Implemented course overview UI
    </View>
  );
};

const CellExpandUI = ({ show, title }: CellExpandUIProps) => {
  const [theme] = useContext(ThemeContext);
  return (
    <View style={styles.headerViewContainer}>
      <Text style={[theme.textH3, { fontWeight: "bold" }]}>{title}</Text>
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
  );
}

const BuildContent = ({ completion, completionStatus, theme }: BuildContentProps) => {
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
                <ActivityLock item={item} theme = {theme}/>
              ) : (
                <ActivityUnLock item={item} theme = {theme}/>
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

const ActivityUnLock = ({item, theme }: ActivityProps) => {
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
                  completionStatus={item.completionstatus as string} theme = {theme}
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

const ActivityLock = ({item, theme }: ActivityProps) => {
  const [show, setShow] = useState(false);
  const onClose = () => {
    setShow(!show);
  }
  return (
    <View>
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={onClose}>
        <View style={styles.activityBodyContainer}>
          <BuildContent
            completion={item.completion as string}
            completionStatus={item.completionstatus as string} theme = {theme}
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
<<<<<<< HEAD
      {show && <ActivityRestrictionView description={item.availablereason  == null ? "" : item.availablereason} onClose = {onClose}/>}
=======
      {show && <ActivityRestrictionView description={item.availablereason!} />}
>>>>>>> MOB-367 features: Implemented course overview UI
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
  },
  notAvailableText : {
    fontWeight: "500",
    borderRadius: 8,
    margin: 4,
    fontSize: normalize(11),
    paddingRight: 4,
    paddingLeft: 4
  }
});

export default ActivityList;
