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
 * @author @author Tharaka Dushmantha <tharaka.dushmantha@totaralearning.com>
 *
 *
 */

import React, { useContext, ReactNode } from "react";
import {
  Text,
  TouchableOpacity,
  View
} from "react-native";

import ParallaxScrollView from "./ParallaxScrollView";
import { CardElement, ImageElement } from "@totara/components";
import { normalize } from "@totara/theme";
import { ThemeContext } from "@totara/theme";
import { Certification, Program, Course } from "@totara/types";
import { NavigationParams } from "react-navigation";
import { headerViewStyles } from "./styles"



type HeaderViewProps = {
  details: Certification | Program | Course;
  navigation: NavigationParams;
  children: ReactNode;
  tabBarLeft: string;
  tabBarRight: string;
  onPress: () => void;
  showOverview: boolean;
  badgeTitle : string
};

const HeaderView = ({
  navigation,
  details,
  children,
  tabBarLeft,
  tabBarRight,
  onPress,
  showOverview,
  badgeTitle
}: HeaderViewProps) => {
  const [theme] = useContext(ThemeContext);
  const renderNavigationTitle = () => {
    return (
      <View style={{ backgroundColor: theme.colorNeutral2 }}>
        <CardElement item={details} cardStyle={headerViewStyles.itemCard}>
          <View
            style={[
              headerViewStyles.LearningTypeLabelWrap,
              { borderColor: theme.colorNeutral6 }
            ]}
          >
            <Text
              style={[headerViewStyles.programLabelText, { color: theme.colorNeutral6 }]}
            >
            {badgeTitle}
            </Text>
          </View>
        </CardElement>
      </View>
    );
  };

  const renderNavigationTab = () => {
    return (
      <View
        style={[
          headerViewStyles.tabBarContainer,
          { backgroundColor: theme.colorNeutral2 }
        ]}
      >
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
            onPress={onPress}
          >
            <Text
              style={
                showOverview
                  ? [theme.textB3, { fontWeight: "400" }]
                  : [
                      theme.textB3,
                      { color: theme.colorNeutral6, fontWeight: "400" }
                    ]
              }
            >
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
            onPress={onPress}
          >
            <Text
              style={
                !showOverview
                  ? [theme.textB3, { fontWeight: "400" }]
                  : [
                      theme.textB3,
                      {
                        color: theme.colorNeutral6,
                        fontWeight: "400"
                      }
                    ]
              }
            >
              {tabBarRight}
            </Text>
          </TouchableOpacity>
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
        ]}
      >
        <ImageElement item={details} imageStyle={headerViewStyles.itemImage} />
      </View>
    );
  };

  return (
    <View style={headerViewStyles.container}>
      <ParallaxScrollView
        parallaxHeaderHeight={normalize(300)}
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
        }}
      >
        {children}
      </ParallaxScrollView>
    </View>
  );
};



export default HeaderView;
