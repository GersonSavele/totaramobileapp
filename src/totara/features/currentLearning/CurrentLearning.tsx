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
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { useQuery } from "@apollo/react-hooks";
import { ThemeContext } from "@totara/theme";
import { translate } from "@totara/locale";
import { NavigationEvents } from "react-navigation";
import LearningItemCarousel from "./learningItems/LearningItemCarousel";
import NoCurrentLearning from "./learningItems/NoCurrentLearning";
import query from "./api";
import { LoadingError, NetworkStatus, Loading } from "@totara/components";
import { currentLearningStyles } from "./currentLearningStyles";

const CurrentLearning = () => {
  const { loading, error, data, refetch } = useQuery(query);
  const [theme] = useContext(ThemeContext);
  const onContentRefresh = () => {
    refetch();
  };
  if (loading) return <Loading />;
  if (error) {
    return <LoadingError onRefreshTap={onContentRefresh} />;
  }
  if (data) {
    const currentLearning = data.currentLearning;
    return (
      <View style={[theme.viewContainer, { flex: 1 }]}>
        <NavigationEvents onWillFocus={onContentRefresh} />
        <View style={currentLearningStyles.headerViewWrap}>
          <Text style={currentLearningStyles.headerViewTitleWrap}>
            {translate("current_learning.action_primary")}
          </Text>
          <Text style={currentLearningStyles.headerViewSubTitleWrap}>
            {translate("current_learning.primary_info", {
              count:
                currentLearning && currentLearning.length
                  ? currentLearning.length
                  : 0
            })}
          </Text>
        </View>

        <View style={[currentLearningStyles.contentWrap]}>
          <NetworkStatus />
          {currentLearning && currentLearning.length > 0 ? (
            <LearningItemCarousel
              currentLearning={currentLearning}
              loading={loading}
              onRefresh={onContentRefresh}
            />
          ) : (
            <View
              style={{
                flex: 1
              }}>
              <ScrollView
                refreshControl={
                  <RefreshControl
                    refreshing={loading}
                    onRefresh={onContentRefresh}
                  />
                }
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  flexGrow: 1,
                  justifyContent: "center"
                }}>
                <NoCurrentLearning testID={"test_NoCurrentLearning"} />
              </ScrollView>
            </View>
          )}
        </View>
      </View>
    );
  }
};

export default CurrentLearning;
