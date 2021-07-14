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
import React, { useState } from "react";
import { FlatList, Platform, Text, View } from "react-native";
import { SearchBar } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";

import { translate } from "@totara/locale";
import { PLATFORM_ANDROID, PLATFORM_IOS } from "@totara/lib/constants";
import { LearningItemTile } from "./components/LearningItemTile";
import { margins, paddings } from "@totara/theme/constants";
import { TotaraTheme } from "@totara/theme/Theme";
import { findLearningStyles } from "./findLearningStyles";

const mockSearchResult: any = {
  max_count: 599,
  items: [
    {
      title: "(AND ONLY) Simple Test Programme",
      itemtype: "course",
      mobile_image:
        "https://www.businessinsider.in/thumb/msid-81769823,width-600,resizemode-4,imgsize-297676/tech/how-to/how-to-reverse-image-search-on-google-to-find-information-related-to-a-specific-photo/img60638be021887500193e8451.jpg"
    },
    {
      title: "(BETA) Audiences in Totara",
      itemtype: "course",
      mobile_image: "https://jooinn.com/images/square-4.jpg"
    },
    {
      title: "Become A Learning Machine 2.0: Read 300 Books This Year",
      itemtype: "course",
      mobile_image:
        "https://thumbs.dreamstime.com/z/words-tall-short-flashcard-cartoon-animal-characters-opposite-adjectives-explanation-card-flat-vector-illustration-179247227.jpg"
    },
    {
      title: "Hypnosis: Learn Self Hypnosis For Personal Development",
      itemtype: "course",
      mobile_image:
        "https://www.businessinsider.in/thumb/msid-81769823,width-600,resizemode-4,imgsize-297676/tech/how-to/how-to-reverse-image-search-on-google-to-find-information-related-to-a-specific-photo/img60638be021887500193e8451.jpg"
    },
    {
      title: "Productivity Masterclass: How To Powerfully Get Things Done ",
      itemtype: "course",
      mobile_image:
        "https://www.businessinsider.in/thumb/msid-81769823,width-600,resizemode-4,imgsize-297676/tech/how-to/how-to-reverse-image-search-on-google-to-find-information-related-to-a-specific-photo/img60638be021887500193e8451.jpg"
    },
    {
      title: "The Complete SQL Bootcamp ",
      itemtype: "course",
      mobile_image:
        "https://www.businessinsider.in/thumb/msid-81769823,width-600,resizemode-4,imgsize-297676/tech/how-to/how-to-reverse-image-search-on-google-to-find-information-related-to-a-specific-photo/img60638be021887500193e8451.jpg"
    },
    {
      title: "Deep Learning: Hands-On Artificial Neural Networks",
      itemtype: "course",
      mobile_image:
        "https://www.businessinsider.in/thumb/msid-81769823,width-600,resizemode-4,imgsize-297676/tech/how-to/how-to-reverse-image-search-on-google-to-find-information-related-to-a-specific-photo/img60638be021887500193e8451.jpg"
    },
    {
      title: "Data Science: Real-Life Data Science Exercises Included ",
      itemtype: "course",
      mobile_image:
        "https://www.businessinsider.in/thumb/msid-81769823,width-600,resizemode-4,imgsize-297676/tech/how-to/how-to-reverse-image-search-on-google-to-find-information-related-to-a-specific-photo/img60638be021887500193e8451.jpg"
    },
    {
      title: "Blockchain: Learn How To Build Your First Blockchain ",
      itemtype: "course",
      mobile_image:
        "https://www.businessinsider.in/thumb/msid-81769823,width-600,resizemode-4,imgsize-297676/tech/how-to/how-to-reverse-image-search-on-google-to-find-information-related-to-a-specific-photo/img60638be021887500193e8451.jpg"
    },
    {
      title: "NLP Personal Transformation (NLP for Personal Development)",
      itemtype: "course",
      mobile_image:
        "https://www.businessinsider.in/thumb/msid-81769823,width-600,resizemode-4,imgsize-297676/tech/how-to/how-to-reverse-image-search-on-google-to-find-information-related-to-a-specific-photo/img60638be021887500193e8451.jpg"
    },
    {
      title: "Coaching Skills Mastery (NLP Life Coaching) ",
      itemtype: "course",
      mobile_image:
        "https://www.businessinsider.in/thumb/msid-81769823,width-600,resizemode-4,imgsize-297676/tech/how-to/how-to-reverse-image-search-on-google-to-find-information-related-to-a-specific-photo/img60638be021887500193e8451.jpg"
    },
    {
      title: "Management Skills: Productivity ",
      itemtype: "playlist",
      mobile_image:
        "https://www.businessinsider.in/thumb/msid-81769823,width-600,resizemode-4,imgsize-297676/tech/how-to/how-to-reverse-image-search-on-google-to-find-information-related-to-a-specific-photo/img60638be021887500193e8451.jpg"
    },
    {
      title: "Leadership: Practical Leadership Skills ",
      itemtype: "course",
      mobile_image:
        "https://www.businessinsider.in/thumb/msid-81769823,width-600,resizemode-4,imgsize-297676/tech/how-to/how-to-reverse-image-search-on-google-to-find-information-related-to-a-specific-photo/img60638be021887500193e8451.jpg"
    },
    {
      title: "Certified Lean Management Professional ",
      itemtype: "programe",
      mobile_image:
        "https://www.businessinsider.in/thumb/msid-81769823,width-600,resizemode-4,imgsize-297676/tech/how-to/how-to-reverse-image-search-on-google-to-find-information-related-to-a-specific-photo/img60638be021887500193e8451.jpg"
    },
    {
      title: "How to Manage & Influence Your Virtual Team ",
      itemtype: "programe",
      mobile_image:
        "https://www.businessinsider.in/thumb/msid-81769823,width-600,resizemode-4,imgsize-297676/tech/how-to/how-to-reverse-image-search-on-google-to-find-information-related-to-a-specific-photo/img60638be021887500193e8451.jpg"
    },
    {
      title: "Virtual Assistant: Find, Hire, Train, and Manage ",
      itemtype: "course",
      mobile_image:
        "https://www.businessinsider.in/thumb/msid-81769823,width-600,resizemode-4,imgsize-297676/tech/how-to/how-to-reverse-image-search-on-google-to-find-information-related-to-a-specific-photo/img60638be021887500193e8451.jpg"
    },
    {
      title: "Machine Learning: Hands-On Python & R In Data Science",
      itemtype: "course",
      mobile_image:
        "https://www.businessinsider.in/thumb/msid-81769823,width-600,resizemode-4,imgsize-297676/tech/how-to/how-to-reverse-image-search-on-google-to-find-information-related-to-a-specific-photo/img60638be021887500193e8451.jpg"
    },
    {
      title: "Blockchain: Learn How To Build Your First Blockchain ",
      itemtype: "course",
      mobile_image:
        "https://www.businessinsider.in/thumb/msid-81769823,width-600,resizemode-4,imgsize-297676/tech/how-to/how-to-reverse-image-search-on-google-to-find-information-related-to-a-specific-photo/img60638be021887500193e8451.jpg"
    },
    {
      title: "Blockchain: Learn How To Build Your First Blockchain ",
      itemtype: "programe",
      mobile_image:
        "https://www.businessinsider.in/thumb/msid-81769823,width-600,resizemode-4,imgsize-297676/tech/how-to/how-to-reverse-image-search-on-google-to-find-information-related-to-a-specific-photo/img60638be021887500193e8451.jpg"
    }
  ]
};

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

  const learningItem = (item: any) => {
    return <LearningItemTile item={item} />;
  };

  return (
    <SafeAreaView style={findLearningStyles.mainWrapper} edges={["right", "top", "left"]}>
      <View style={findLearningStyles.headerWrapper}>
        <Text style={findLearningStyles.header}>{translate("find_learning.title")}</Text>
        <SearchBar
          placeholder={translate("find_learning.search")}
          onChangeText={onChangeText}
          value={findLeaningText}
          onSubmitEditing={onSearch}
          platform={Platform.OS === PLATFORM_ANDROID ? PLATFORM_ANDROID : PLATFORM_IOS}
          onCancel={onSearch}
          returnKeyType="search"
          showCancel={true}
          containerStyle={findLearningStyles.searchBarContainer}
          inputContainerStyle={findLearningStyles.searchBar}
          inputStyle={findLearningStyles.searchBar}
          rightIconContainerStyle={findLearningStyles.clearSearch}
        />
      </View>
      {searchResult ? (
        <>
          <Text style={findLearningStyles.result}>
            {translate("find_learning.results", {
              value: searchResult.max_count
            })}
          </Text>
          <FlatList
            style={findLearningStyles.listWrapper}
            data={searchResult.items}
            renderItem={({ item }) => {
              return learningItem(item);
            }}
            alwaysBounceVertical={false}
            numColumns={2}
            keyExtractor={(_, index) => index.toString()}
          />
        </>
      ) : null}
    </SafeAreaView>
  );
};
