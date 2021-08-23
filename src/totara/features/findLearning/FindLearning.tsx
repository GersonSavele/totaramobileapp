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
import React, { useState, useEffect, useCallback } from "react";
import { FlatList, Platform, Text, View } from "react-native";
import { SearchBar } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";

import { translate } from "@totara/locale";
import { PLATFORM_ANDROID, PLATFORM_IOS } from "@totara/lib/constants";
import { LearningItemTile, LearningItemTileSkeleton } from "./components/LearningItemTile";
import { findLearningStyles } from "./findLearningStyles";
import { useNavigation } from "@react-navigation/native";
import { NAVIGATION } from "@totara/lib/navigation";
import { useLazyQuery } from "@apollo/client";
import { queryFindLearning } from "./api";
import { CatalogItem, FindLearningPage } from "@totara/types/FindLearning";
import { FINDLEARNING_TEST_IDS } from "@totara/lib/testIds";
import { formatPageData, onSearch } from "./utils";

type FindLearningHeaderProps = {
  onChangeText: (text: string) => void;
  findLeaningText: string;
  onSearch: () => void;
  count?: number;
};

const FindLearningHeader = ({ onChangeText, findLeaningText, onSearch, count }: FindLearningHeaderProps) => {
  return (
    <View style={findLearningStyles.headerWrapper} testID={FINDLEARNING_TEST_IDS.HEADER}>
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
        testID={FINDLEARNING_TEST_IDS.SEARCH_TEXT_INPUT}
      />
      {count || count === 0 ? (
        <Text style={findLearningStyles.result} testID={FINDLEARNING_TEST_IDS.NO_OF_ITEMS}>
          {translate("find_learning.results", {
            value: count
          })}
        </Text>
      ) : null}
    </View>
  );
};

const FindLearning = () => {
  const [searchResult, setSearchResult] = useState<FindLearningPage>();
  const [searchData, setSearchData] = useState({ key: "", pointer: 0 });

  const navigation = useNavigation();

  const [onCallSearch, { loading, data }] = useLazyQuery(queryFindLearning, {
    fetchPolicy: "no-cache"
  });

  useEffect(() => {
    if (data?.catalogPage) {
      const currentPageData = formatPageData({ pageData: data?.catalogPage, previousPage: searchResult });
      setSearchResult(currentPageData);
    }
  }, [data]);

  useEffect(() => {
    setSearchResult(undefined);
  }, [searchData.key]);

  useEffect(() => {
    onSearch({
      pointer: searchData.pointer,
      findLearningText: searchData.key,
      resetSearchResult: setSearchResult,
      onSearchCallback: onCallSearch
    });
  }, [searchData.pointer]);

  const onItemTap = ({ item }: { item: CatalogItem }) => {
    const { itemid, title, mobileImage, summary, summaryFormat } = item;
    navigation.navigate(NAVIGATION.FIND_LEARNING_OVERVIEW, {
      itemid,
      title,
      mobileImage,
      summary,
      summaryFormat
    });
  };

  const learningItem = useCallback(
    ({ item }: { item: CatalogItem }) => <LearningItemTile item={item} onItemTap={() => onItemTap({ item })} />,
    []
  );

  return (
    <SafeAreaView style={findLearningStyles.mainWrapper} edges={["top"]}>
      <FlatList
        ListHeaderComponent={
          <FindLearningHeader
            onChangeText={(text) => setSearchData({ key: text, pointer: 0 })}
            onSearch={() => {
              setSearchResult(undefined);
              onSearch({
                pointer: searchData.pointer,
                findLearningText: searchData.key,
                resetSearchResult: setSearchResult,
                onSearchCallback: onCallSearch
              });
            }}
            findLeaningText={searchData.key}
            count={searchResult?.maxCount}
          />
        }
        ListFooterComponent={loading ? <SkeletonLoading /> : null}
        style={findLearningStyles.listWrapper}
        data={searchResult?.items}
        renderItem={learningItem}
        numColumns={2}
        keyExtractor={(_, index) => index.toString()}
        onEndReachedThreshold={0}
        onEndReached={() =>
          searchResult &&
          !searchResult.finalPage &&
          setSearchData({ ...searchData, pointer: searchResult.items?.length ?? 0 })
        }
      />
    </SafeAreaView>
  );
};

const SkeletonLoading = () => {
  return (
    <View style={{ flexWrap: "wrap", flexDirection: "row" }}>
      {Array.from(Array(8)).map((_, i) => (
        <LearningItemTileSkeleton key={i} />
      ))}
    </View>
  );
};

export default FindLearning;
