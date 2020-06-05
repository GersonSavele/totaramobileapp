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
 *
 */

import React, { useContext, ReactNode, useState, useEffect } from "react";
import { Text, TouchableOpacity, View, Alert, Modal } from "react-native";
import NetInfo from "@react-native-community/netinfo";

import ParallaxScrollView from "./ParallaxScrollView";
import { CardElement, ImageElement, Loading } from "@totara/components";
import { normalize } from "@totara/theme";
import { ThemeContext } from "@totara/theme";
import { CourseGroup, Course } from "@totara/types";
import { NavigationParams } from "react-navigation";
import { headerViewStyles } from "@totara/lib/styles/currentLearning";
import { translate } from "@totara/locale";

type HeaderViewProps = {
  details: CourseGroup | Course;
  navigation: NavigationParams;
  children: ReactNode;
  tabBarLeft: string;
  tabBarRight: string;
  onPress: () => void;
  showOverview: boolean;
  badgeTitle: string;
  image?: string;
};

const HeaderView = ({
  navigation,
  details,
  children,
  tabBarLeft,
  tabBarRight,
  onPress,
  showOverview,
  badgeTitle,
  image = ""
}: HeaderViewProps) => {
  const [theme] = useContext(ThemeContext);
  //To Do: Bug in NetInfo library, useNetInfo - isConnected initial state is false(phone and simulator):
  //https://github.com/react-native-community/react-native-netinfo/issues/295
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [isRefresh, setIsRefresh] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(
        (state.isConnected as boolean) && (state.isInternetReachable as boolean)
      );
    });
    return () => unsubscribe();
  }, []);

  const getConnectionInfo = () => {
    const timeValue = setTimeout(() => {
      NetInfo.fetch().then(() => {
        setIsRefresh(false);
        clearInterval(timeValue);
      });
    }, 5000);
  };

  const renderNavigationTitle = () => {
    return (
      <View style={{ backgroundColor: theme.colorNeutral2 }}>
        <CardElement item={details} cardStyle={headerViewStyles.itemCard}>
          <View
            style={[
              headerViewStyles.LearningTypeLabelWrap,
              { borderColor: theme.colorNeutral7 }
            ]}>
            <Text
              style={[
                headerViewStyles.programLabelText,
                { color: theme.colorNeutral7 }
              ]}>
              {badgeTitle}
            </Text>
          </View>
        </CardElement>
      </View>
    );
  };

  const renderNavigationTab = () => {
    return (
      <View style={[{ backgroundColor: theme.colorNeutral2 }]}>
        <View style={[headerViewStyles.tabBarContainer]}>
          <View style={headerViewStyles.tabNav}>
            <TouchableOpacity
              style={
                showOverview
                  ? [
                      headerViewStyles.tabSelected,
                      {
                        borderBottomColor: theme.colorNeutral7,
                        borderBottomWidth: 2
                      }
                    ]
                  : [headerViewStyles.tabSelected]
              }
              onPress={onPress}>
              <Text
                style={
                  showOverview
                    ? [theme.textB2, { fontWeight: "400" }]
                    : [
                        theme.textB2,
                        { color: theme.colorNeutral6, fontWeight: "400" }
                      ]
                }>
                {tabBarLeft}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                !showOverview
                  ? [
                      headerViewStyles.tabSelected,
                      {
                        borderBottomColor: theme.colorNeutral7,
                        borderBottomWidth: 2
                      }
                    ]
                  : [headerViewStyles.tabSelected]
              }
              onPress={onPress}>
              <Text
                style={
                  !showOverview
                    ? [theme.textB2, { fontWeight: "400" }]
                    : [
                        theme.textB2,
                        {
                          color: theme.colorNeutral6,
                          fontWeight: "400"
                        }
                      ]
                }>
                {tabBarRight}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const backgroundViewRender = () => {
    return (
      <View
        style={[
          headerViewStyles.headerContainer,
          { backgroundColor: theme.colorNeutral2 }
        ]}>
        <ImageElement
          item={details}
          imageStyle={headerViewStyles.itemImage}
          image={image}
        />
      </View>
    );
  };

  return (
    <View style={headerViewStyles.container}>
      <ParallaxScrollView
        parallaxHeaderHeight={normalize(260)}
        renderBackground={backgroundViewRender}
        tabBar={renderNavigationTab}
        titleBar={renderNavigationTitle}
        onChangeHeaderVisibility={(value: number) => {
          if (value > 0) {
            navigation!.setParams({
              opacity: value / 100 > 0.5 ? 1 : value / 100
            });
            navigation!.setParams({ title: details.fullname });
          } else if (-value / 100 > 1) {
            navigation!.setParams({
              opacity: (100 + value) / 100 > 0.5 ? 1 : (100 + value) / 100
            });
            navigation!.setParams({ title: details.fullname });
          } else {
            navigation!.setParams({ title: "" });
          }
        }}>
        {children}
        {!isConnected &&
          !isRefresh &&
          Alert.alert(
            translate("no_internet_alert.title"),
            translate("no_internet_alert.message"),
            [
              {
                text: translate("no_internet_alert.go_back"),
                onPress: () => {
                  navigation.goBack();
                }
              },
              {
                text: translate("no_internet_alert.refresh"),
                onPress: () => {
                  setIsRefresh(true);
                  getConnectionInfo();
                }
              }
            ],
            { cancelable: false }
          )}
        {isRefresh && (
          <Modal transparent={true} visible={isRefresh}>
            <View style={headerViewStyles.modalBackground}>
              <Loading />
            </View>
          </Modal>
        )}
      </ParallaxScrollView>
    </View>
  );
};

export default HeaderView;
