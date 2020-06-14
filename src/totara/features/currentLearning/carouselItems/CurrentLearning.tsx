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

import React, { useContext } from "react";
import { Text, View } from "react-native";
import { useQuery } from "@apollo/react-hooks";
import { ThemeContext } from "@totara/theme";
import { translate } from "@totara/locale";
import { NavigationEvents } from "react-navigation";
// @ts-ignore no types
import LearningItemCarousel from "./LearningItemCarousel";
import NoCurrentLearning from "./NoCurrentLearning";
import query from "./api";
import { LoadingError, NetworkStatus, Loading } from "@totara/components";
import { viewStyles } from "../currentLearningStyles";

const CurrentLearning = () => {
  const onContentRefreshTap = () => {};

  const { loading, error, data, refetch } = useQuery(query);
  const [theme] = useContext(ThemeContext);
  const pullToRefresh = () => {
    refetch();
  };
  if (loading) return <Loading />;
  if (error) {
    return <LoadingError onRefreshTap={onContentRefreshTap} />;
  }
  if (data) {
    const currentLearning = data.currentLearning;
    return (
      <View style={theme.viewContainer}>
        <NavigationEvents onWillFocus={pullToRefresh} />
        <View style={viewStyles.headerViewWrap}>
          <Text style={viewStyles.headerViewTitleWrap}>
            {translate("current_learning.action_primary")}
          </Text>
          <Text style={viewStyles.headerViewSubTitleWrap}>
            {translate("current_learning.primary_info", {
              count:
                currentLearning && currentLearning.length
                  ? currentLearning.length
                  : 0
            })}
          </Text>
        </View>

        <View style={viewStyles.contentWrap}>
          <NetworkStatus />
          {currentLearning && currentLearning.length > 0 ? (
            <LearningItemCarousel
              currentLearning={currentLearning}
              loading={loading}
              onRefresh={pullToRefresh}
            />
          ) : (
            <NoCurrentLearning />
          )}
        </View>
      </View>
    );
  }
};

export default CurrentLearning;
