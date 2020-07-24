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

import React, { useContext, useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { useQuery } from "@apollo/react-hooks";
import { ThemeContext } from "@totara/theme";
import { translate } from "@totara/locale";
import { NavigationEvents } from "react-navigation";
import CurrentLearningCarousel from "./learningItems/CurrentLearningCarousel";
import CurrentLearningListView from "./learningItems/CurrentLearningListView";
import NoCurrentLearning from "./learningItems/NoCurrentLearning";
import query from "./api";
import { LoadingError, NetworkStatus, Loading } from "@totara/components";
import { currentLearningStyles } from "./currentLearningStyles";
import { paddings } from "@totara/theme/constants";
import { Switch, SwitchOption } from "@totara/components/Switch";
import { Icons } from "@resources/icons";
import { NavigationStackProp } from "react-navigation-stack";

enum ListingOrientation {
  Carousel,
  ListView
}

type CurrentLearningProps = {
  navigation: NavigationStackProp;
};

const CurrentLearning = ({ navigation }: CurrentLearningProps) => {
  const { loading, error, data, refetch } = useQuery(query);
  const [theme] = useContext(ThemeContext);
  const [listingOrientation, setListingOrientation] = useState<ListingOrientation>(ListingOrientation.Carousel);

  const onContentRefresh = () => {
    refetch();
  };
  if (loading) return <Loading />;
  if (error) {
    return <LoadingError onRefreshTap={onContentRefresh} />;
  }

  const toggleListingOrientation = () => {
    if (listingOrientation === ListingOrientation.Carousel) {
      setListingOrientation(ListingOrientation.ListView);
    } else setListingOrientation(ListingOrientation.Carousel);
  };

  if (data) {
    const currentLearning = data.currentLearning;
    return (
      <View style={[theme.viewContainer, { flex: 1 }]}>
        <NavigationEvents onWillFocus={onContentRefresh} />
        <View style={currentLearningStyles.headerViewWrap}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
            <Text style={currentLearningStyles.headerViewTitleWrap}>
              {translate("current_learning.action_primary")}
            </Text>
            <View
              style={{
                alignSelf: "flex-end",
                paddingRight: paddings.paddingXL
              }}>
              <Switch>
                <SwitchOption
                  icon={Icons.iconCarousel}
                  selected={listingOrientation === ListingOrientation.Carousel}
                  onPress={toggleListingOrientation}
                />
                <SwitchOption
                  icon={Icons.iconList}
                  selected={listingOrientation === ListingOrientation.ListView}
                  onPress={toggleListingOrientation}
                />
              </Switch>
            </View>
          </View>
          <Text style={currentLearningStyles.headerViewSubTitleWrap}>
            {translate("current_learning.primary_info", {
              count: currentLearning && currentLearning.length ? currentLearning.length : 0
            })}
          </Text>
        </View>

        <View style={[currentLearningStyles.contentWrap]}>
          <NetworkStatus />
          {currentLearning && currentLearning.length > 0 ? (
            listingOrientation === ListingOrientation.Carousel ? (
              <CurrentLearningCarousel
                currentLearning={currentLearning}
                loading={loading}
                onRefresh={onContentRefresh}
              />
            ) : (
              <CurrentLearningListView
                currentLearning={currentLearning}
                loading={loading}
                onRefresh={onContentRefresh}
                navigation={navigation}
              />
            )
          ) : (
            <View
              style={{
                flex: 1
              }}>
              <ScrollView
                refreshControl={<RefreshControl refreshing={loading} onRefresh={onContentRefresh} />}
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
