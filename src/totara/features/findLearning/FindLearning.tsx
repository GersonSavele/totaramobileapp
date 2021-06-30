/**
 * This file is part of Totara Enterprise.
 *
 * Copyright (C) 2021 onwards Totara Learning Solutions LTD
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
import React, { useState, useContext } from "react";
import { FlatList, Platform, SafeAreaView, Text, View } from "react-native";
import { SearchBar } from "react-native-elements";

import { fullFlex } from "@totara/lib/styles/base";
import { findLearningStyles } from "./findLearningStyles";
import { ThemeContext } from "@totara/theme";
import { translate } from "@totara/locale";
import { PLATFORM_ANDROID, PLATFORM_IOS } from "@totara/lib/constants";

const mockSearchResult: any = [
  {
    title: "(AND ONLY) Simple Test Programme"
  },
  {
    title: "(BETA) Audiences in Totara"
  },
  {
    title: "Become A Learning Machine 2.0: Read 300 Books This Year"
  },
  {
    title: "Hypnosis: Learn Self Hypnosis For Personal Development"
  },
  {
    title: "Productivity Masterclass: How To Powerfully Get Things Done "
  },
  {
    title: "The Complete SQL Bootcamp "
  },
  {
    title: "Deep Learning: Hands-On Artificial Neural Networks"
  },
  {
    title: "Data Science: Real-Life Data Science Exercises Included "
  },
  {
    title: "Blockchain: Learn How To Build Your First Blockchain "
  },
  {
    title: "NLP Personal Transformation (NLP for Personal Development)"
  },
  {
    title: "Coaching Skills Mastery (NLP Life Coaching) "
  },
  {
    title: "Management Skills: Productivity "
  },
  {
    title: "Leadership: Practical Leadership Skills "
  },
  {
    title: "Certified Lean Management Professional "
  },
  {
    title: "How to Manage & Influence Your Virtual Team "
  },
  {
    title: "Virtual Assistant: Find, Hire, Train, and Manage "
  },
  {
    title: "Machine Learning: Hands-On Python & R In Data Science"
  },
  {
    title: "Blockchain: Learn How To Build Your First Blockchain "
  }
];

export const FindLearning = () => {
  const [searchResult, setSearchResult] = useState();
  const [findLeaningText, setFindLearningText] = useState<string>("");

  const onSearch = () => {
    if (findLeaningText) {
      setSearchResult(mockSearchResult);
    } else {
      setSearchResult(undefined);
    }
  };

  const onChangeText = (text) => {
    setFindLearningText(text);
  };
  const learningItem = (item: any, index: number) => {
    return <LearningItem item={item} index={index} />;
  };

  return (
    <SafeAreaView style={fullFlex}>
      <SearchBar
        placeholder={translate("find_learning.search")}
        onChangeText={onChangeText}
        value={findLeaningText}
        onSubmitEditing={onSearch}
        platform={Platform.OS === PLATFORM_ANDROID ? PLATFORM_ANDROID : PLATFORM_IOS}
        onCancel={onSearch}
        returnKeyType="search"
      />
      <FlatList
        style={fullFlex}
        data={searchResult}
        renderItem={({ item, index }) => {
          return learningItem(item, index);
        }}
        alwaysBounceVertical={false}
        numColumns={2}
        keyExtractor={(_, index) => index.toString()}
      />
    </SafeAreaView>
  );
};
const LearningItem = ({ item, index }: { item: any; index: number }) => {
  const [theme] = useContext(ThemeContext);
  return (
    <View key={index} style={{ ...findLearningStyles.tileWrapper, backgroundColor: theme.colorNeutral2 }}>
      <Text style={findLearningStyles.itemTitle}>{item.title}</Text>
    </View>
  );
};
