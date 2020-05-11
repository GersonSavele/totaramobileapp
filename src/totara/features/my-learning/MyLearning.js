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
 * @author Jun Yamog <jun.yamog@totaralearning.com
 *
 */

import React, { useContext } from "react";
import {Text, View } from "react-native";
import { Content, Spinner } from "native-base";
import { useQuery } from "@apollo/react-hooks";
import { ThemeContext } from "@totara/theme";
import { translate } from "@totara/locale";
import LearningItemCarousel from "./LearningItemCarousel";
import { query } from "./api";
import { Log } from "@totara/lib";
import { GeneralErrorModal } from "@totara/components";
import NoCurrentLearning from "./NoCurrentLearning";
import {
  headerViewWrap,
  headerViewTitleWrap,
  headerViewSubTitleWrap,
  contentWrap,
  spinnerContainer,
} from "@totara/theme/myLearning";
const MyLearning = () => {
  const { loading, error, data } = useQuery(query);
  const [theme] = useContext(ThemeContext);
  if (loading)
    return (
      <Content contentContainerStyle={spinnerContainer()}>
        <Spinner color={theme.textColorDark} animating={loading} />
      </Content>
    );
  if (error) {
    Log.error("Error getting current learning", error);
    return <GeneralErrorModal siteUrl="" />;
  }
  if (data) {
    const currentLearning = data.currentLearning;
    return (
      <View style={theme.viewContainer}>
        <View style={headerViewWrap(theme)}>
          <Text style={headerViewTitleWrap(theme)}>
            {translate("my-learning.action_primary")}
          </Text>
          <Text style={headerViewSubTitleWrap(theme)}>
            {translate("my-learning.primary_info", {
              count:
                currentLearning && currentLearning.length
                  ? currentLearning.length
                  : 0,
            })}
          </Text>
        </View>
        <View style={contentWrap()}>
          {currentLearning && currentLearning.length > 0 ? (
            <LearningItemCarousel currentLearning={currentLearning} />
          ) : (
            <NoCurrentLearning />
          )}
        </View>
      </View>
    );
  }
};

export default MyLearning;
