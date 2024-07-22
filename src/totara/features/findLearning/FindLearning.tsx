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

// FIX: searchbar typescript bug
// @ts-nocheck

import { useLazyQuery } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { Images } from '@resources/images';
import { MessageBar } from '@totara/components';
import { learningItemEnum } from '@totara/features/constants';
import NativeAccessRestriction from '@totara/features/currentLearning/NativeAccessRestriction';
import { NAVIGATION } from '@totara/lib/navigation';
import { FINDLEARNING_TEST_IDS } from '@totara/lib/testIds';
import { translate } from '@totara/locale';
import type { CatalogItem, FindLearningPage } from '@totara/types/FindLearning';
import { isEmpty } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import type { ImageSourcePropType } from 'react-native';
import { FlatList, Image, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Icon from '../../components/Icon';
import { queryFindLearning, queryViewCatalog } from './api';
import { LearningItemTile, LearningItemTileSkeleton } from './components/LearningItemTile';
import { findLearningStyles } from './findLearningStyles';
import { formatPageData, onSearch } from './utils';

type FindLearningHeaderProps = {
  onChangeText: (text: string) => void;
  findLeaningText: string;
  onSearch: () => void;
  onCancel: () => void;
  count?: number;
  onFocusText: () => void;
  loading: boolean;
  showCancel?: boolean;
};

const FindLearningHeader = ({
  onChangeText,
  findLeaningText,
  onSearch,
  onCancel,
  count = 0,
  loading = false,
  showCancel = true
}: FindLearningHeaderProps) => {
  return (
    <View style={findLearningStyles.headerWrapper} testID={FINDLEARNING_TEST_IDS.HEADER}>
      <Text style={findLearningStyles.header}>{translate('find_learning.title')}</Text>
      <View style={findLearningStyles.searchBarContainer}>
        <View style={findLearningStyles.searchBar}>
          <View>
            <Icon name="magnifying-glass" style={{ padding: 5 }} />
          </View>
          <TextInput
            placeholder={translate('find_learning.search')}
            style={findLearningStyles.searchBar}
            onChangeText={onChangeText}
            value={findLeaningText}
            onSubmitEditing={onSearch}
            returnKeyType="search"
            testID={FINDLEARNING_TEST_IDS.SEARCH_TEXT_INPUT}
          />
          <View style={{ ...findLearningStyles.clearSearch, display: showCancel ? 'flex' : 'none' }}>
            <Pressable onPress={onCancel}>
              <Icon name="xmark" style={{ padding: 10 }} />
            </Pressable>
          </View>
        </View>
      </View>
      {!loading && (count || (count === 0 && !isEmpty(findLeaningText))) ? (
        <Text style={findLearningStyles.result} testID={FINDLEARNING_TEST_IDS.NO_OF_ITEMS}>
          {translate('find_learning.results', {
            count
          })}
        </Text>
      ) : null}
    </View>
  );
};

const FindLearning = () => {
  const [searchResult, setSearchResult] = useState<FindLearningPage>();
  const [searchData, setSearchData] = useState<{ key: string; pointer?: number }>({ key: '', pointer: 0 });

  const navigation = useNavigation();
  const filterQuery =
    isEmpty(searchData.key) && searchData.pointer !== undefined ? queryViewCatalog : queryFindLearning;

  const [onCallSearch, { loading, data, error }] = useLazyQuery(filterQuery, {
    fetchPolicy: 'no-cache'
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
      ...searchData,
      onSearchCallback: onCallSearch
    });
  }, [searchData.pointer]);

  const [showRestriction, setShowRestriction] = useState(false);
  const [urlViewTarget, setUrlViewTarget] = useState<string>('');

  const onItemTap = ({ item }: { item: CatalogItem }) => {
    const { itemid, title, mobileImage, summary, summaryFormat, viewUrl = '', itemType, native } = item;
    switch (itemType) {
      case learningItemEnum.Course: {
        if (native === false) {
          setUrlViewTarget(viewUrl);
          setShowRestriction(true);
        } else {
          //if native is undefined or true // comparing with undefined if the api is not compatible
          navigation.navigate(NAVIGATION.FIND_LEARNING_OVERVIEW, {
            itemid,
            title,
            mobileImage,
            summary,
            summaryFormat,
            viewUrl,
            itemType
          });
        }
        break;
      }
      case learningItemEnum.Resource:
      case learningItemEnum.Playlist: {
        navigation.navigate(NAVIGATION.FIND_LEARNING_WEBVIEW, {
          viewUrl,
          title:
            itemType == learningItemEnum.Resource
              ? translate('learning_items.resource')
              : itemType == learningItemEnum.Playlist && translate('learning_items.playlist')
        });
        break;
      }
      default: {
        break;
      }
    }
  };

  const onClose = () => {
    setShowRestriction(false);
  };

  const learningItem = useCallback(
    ({ item }: { item: CatalogItem }) => <LearningItemTile item={item} onItemTap={() => onItemTap({ item })} />,
    []
  );

  return (
    <SafeAreaView style={findLearningStyles.mainWrapper} edges={['top']}>
      <FlatList
        ListHeaderComponent={
          <>
            <FindLearningHeader
              onChangeText={text => {
                const newSearchData = { key: text };
                setSearchData(newSearchData);
              }}
              onSearch={() => {
                if (searchData.key !== '') {
                  setSearchResult(undefined);
                }
                const newSearchData = { ...searchData, pointer: 0 };
                setSearchData(newSearchData);
              }}
              onCancel={() => {
                if (searchData.key !== '') {
                  setSearchResult(undefined);
                }
                const newSearchData = { key: '', pointer: 0 };
                setSearchData(newSearchData);
              }}
              showCancel={searchData.key.length > 0}
              findLeaningText={searchData.key}
              count={searchResult?.maxCount}
              loading={loading}
              onFocusText={() => {
                setSearchData({ key: searchData.key });
              }}
            />
            {error && (
              <MessageBar mode={'alert'} text={translate('general.error_unknown')} icon={'exclamation-circle'} />
            )}
          </>
        }
        ListFooterComponent={loading ? <SkeletonLoading /> : null}
        contentContainerStyle={findLearningStyles.listWrapper}
        data={searchResult?.items}
        renderItem={learningItem}
        numColumns={2}
        keyExtractor={(_, index) => index.toString()}
        onEndReached={() =>
          searchResult &&
          !searchResult.finalPage &&
          setSearchData({ ...searchData, pointer: searchResult.pointer ?? 0 })
        }
        ListEmptyComponent={
          (!loading && searchData.key === '' && searchData.pointer === 0 && <NoFindLearning />) || null
        }
      />
      {showRestriction && <NativeAccessRestriction onClose={onClose} urlView={urlViewTarget} />}
    </SafeAreaView>
  );
};

const SkeletonLoading = () => {
  return (
    <View style={{ flexWrap: 'wrap', flexDirection: 'row' }}>
      {Array.from(Array(8)).map((_, i) => (
        <LearningItemTileSkeleton key={i} />
      ))}
    </View>
  );
};

const NoFindLearning = () => {
  return (
    <View style={findLearningStyles.noLearningItemContainer}>
      <Image source={Images.noCurrentLearning as ImageSourcePropType} />
      <Text style={findLearningStyles.noLearningItemsText}>{translate('find_learning.no_learning_items')}</Text>
    </View>
  );
};
export default FindLearning;
