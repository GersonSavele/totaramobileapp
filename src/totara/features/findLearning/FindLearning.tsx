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
import React, { useState, useCallback } from "react";
import { FlatList, Platform, Text, View } from "react-native";
import { SearchBar } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import { isEmpty } from "lodash";

import { translate } from "@totara/locale";
import { PLATFORM_ANDROID, PLATFORM_IOS } from "@totara/lib/constants";
import { LearningItemTile, LearningItemTileSkeleton } from "./components/LearningItemTile";
import { findLearningStyles } from "./findLearningStyles";
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { NAVIGATION } from "@totara/lib/navigation";
import { useLazyQuery } from "@apollo/client";
import { queryFindLearning } from "./api";
import { CatalogItem, FindLearningPage } from "@totara/types/FindLearning";

type FindLearningHeaderProps = {
  onChangeText: (text: string) => void;
  findLeaningText: string;
  onSearch: () => void;
  count?: number;
};

const FindLearningHeader = ({ onChangeText, findLeaningText, onSearch, count }: FindLearningHeaderProps) => {
  return (
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
      {count || count === 0 ? (
        <Text style={findLearningStyles.result}>
          {translate("find_learning.results", {
            value: count
          })}
        </Text>
      ) : null}
    </View>
  );
};

export const FindLearning = () => {
  const [searchResult, setSearchResult] = useState<FindLearningPage>();
  const [pointer, setPointer] = useState(0);
  const [findLeaningText, setFindLearningText] = useState<string>("");
  const navigation = useNavigation();
  const [onCallSearch, { loading, data }] = useLazyQuery(queryFindLearning, {
    fetchPolicy: "no-cache"
  });

  useEffect(() => {
    if (data?.catalogPage) {
      const currentPageData = formatPageData({ pageData: data?.catalogPage, previousResultItems: searchResult?.items });
      setSearchResult(currentPageData);
    }
  }, [data]);

  useEffect(() => {
    setPointer(0);
    setSearchResult(undefined);
  }, [findLeaningText]);

  useEffect(() => {
    onSearch();
  }, [pointer]);

  const formatPageData = ({
    pageData,
    previousResultItems
  }: {
    pageData: FindLearningPage;
    previousResultItems?: [CatalogItem?];
  }) => {
    if (previousResultItems) {
      return { ...pageData, items: [...previousResultItems, ...pageData.items] } as FindLearningPage;
    }
    return { ...pageData } as FindLearningPage;
  };

  const onSearch = () => {
    if (isEmpty(findLeaningText)) {
      setSearchResult(undefined);
      return;
    }
    onCallSearch({
      variables: {
        pointer: pointer,
        filter_data: {
          catalog_fts: findLeaningText
        }
      },
      notifyOnNetworkStatusChange: true
    });
  };

  const onItemTap = () => {
    navigation.navigate(NAVIGATION.FIND_LEARNING_OVERVIEW);
  };

  const learningItem = useCallback(
    ({ item }: { item: CatalogItem }) => <LearningItemTile item={item} onItemTap={onItemTap} />,
    []
  );

  const loadNextPage = () => {
    if (!searchResult?.finalPage && searchResult?.items) {
      setPointer(searchResult?.items?.length);
    }
  };

  return (
    <SafeAreaView style={findLearningStyles.mainWrapper} edges={["top"]}>
      <FlatList
        ListHeaderComponent={
          <FindLearningHeader
            onChangeText={setFindLearningText}
            onSearch={onSearch}
            findLeaningText={findLeaningText}
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
        onEndReached={loadNextPage}
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
