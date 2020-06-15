import React, { useContext, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ImageSourcePropType,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { NavigationActions, NavigationContext } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { useDispatch, useSelector } from "react-redux";

import { ThemeContext } from "@totara/theme";
import totaraNavigationOptions from "@totara/components/NavigationOptions";
import headerStyles from "@totara/theme/headers";
import { translate } from "@totara/locale";
import NetworkStatus from "@totara/components/NetworkStatus";
import { RootState } from "@totara/reducers";
import { Resource } from "@totara/types";

import { Images } from "@resources/images";
import { paddings } from "@totara/theme/constants";
import { TotaraTheme } from "@totara/theme/Theme";
import ResourceManager from "@totara/lib/resourceManager";
import listViewStyles from "@totara/theme/listView";
import DownloadItem from "./DownloadItem";
import { navigateTo } from "@totara/lib/navigation";
import { NAVIGATION_SCORM_ROOT } from "@totara/lib/constants"; //TODO: REMOVE IT WHEN scorm is done

const Downloads = () => {
  const [theme] = useContext(ThemeContext);
  const navigation = useContext(NavigationContext);

  const resourceDispatcher = useDispatch();
  const resourcesList = useSelector(
    (state: RootState) => state.resourceReducer.resources
  );

  const [selectable, setSelectable] = useState(false);
  const [selectList, setSelectList] = useState<string[]>([]);

  useEffect(() => {
    const onCancelTapListener = navigation.addListener(
      "onCancelTap",
      onCancelTap
    );
    const onDeleteTapListener = navigation.addListener(
      "onDeleteTap",
      onDeleteTap
    );
    return () => {
      onCancelTapListener.remove();
      onDeleteTapListener.remove();
    };
  });

  useEffect(() => {
    headerDispatch(selectable);
  }, [selectable]);

  const headerDispatch = (showActions: boolean) => {
    const setParamsAction = NavigationActions.setParams({
      params: {
        showActions: showActions
      },
      key: "Downloads"
    });
    navigation.dispatch(setParamsAction);
  };

  //EVENTS
  const onItemLongPress = (item: Resource) => {
    if (!selectable) {
      setSelectable(true);
    }
    toggleSelected(item);
  };

  const onItemPress = (item: Resource) => {
    toggleSelected(item);

    navigateTo({
      navigate: navigation.navigate,
      routeId: NAVIGATION_SCORM_ROOT,
      props: {
        id: item.customId,
        title: item.name
      }
    });
  };

  const onCancelTap = () => {
    unSelectAll();
    setSelectable(false);
  };

  const onDeleteTap = () => {
    ResourceManager.deleteResource(selectList).finally(() => {
      resourceDispatcher({
        type: "DELETE_RESOURCE",
        payload: {
          ids: selectList
        }
      });
      unSelectAll();
      setSelectable(false);
    });
  };
  //EVENTS

  //ACTIONS
  const unSelectAll = () => {
    setSelectList([]);
  };

  const toggleSelected = (item: Resource) => {
    const exists = selectList.some((x) => x === item.id);
    if (!exists) setSelectList([...selectList, item.id]);
    else {
      setSelectList([...selectList.filter((x) => x !== item.id)]);
    }
  };
  //ACTIONS

  const isSelected = (item: Resource) => {
    return selectList.some((x) => x === item.id);
  };

  return (
    <View style={theme.viewContainer}>
      <View style={[headerStyles.navigationHeader, { flexDirection: "row" }]}>
        <Text
          style={[theme.textH1, { color: theme.navigationHeaderTintColor }]}>
          {translate("downloads.title")}
        </Text>
      </View>
      <NetworkStatus />
      <View style={{ flex: 1 }}>
        {resourcesList.length == 0 ? (
          <View style={styles.noContent}>
            <Image source={Images.noDownloads as ImageSourcePropType} />
            <Text style={[theme.textH2, { fontWeight: "bold" }]}>
              {translate("downloads.empty")}
            </Text>
          </View>
        ) : (
          <FlatList
            contentContainerStyle={listViewStyles.contentContainerStyle}
            data={resourcesList}
            keyExtractor={(resourceItem) => resourceItem.id}
            ItemSeparatorComponent={() => (
              <View style={listViewStyles.itemSeparator} />
            )}
            renderItem={(data: ListRenderItemInfo<Resource>) => (
              <DownloadItem
                item={data.item}
                selected={isSelected(data.item)}
                selectable={selectable}
                onItemPress={onItemPress}
                onItemLongPress={onItemLongPress}
              />
            )}
          />
        )}
      </View>
    </View>
  );
};

const DownloadsStack = createStackNavigator(
  {
    Downloads: {
      screen: Downloads,
      navigationOptions: ({ navigation }) => ({
        headerLeft: navigation.getParam("showActions") && (
          <TouchableOpacity
            onPress={() => {
              // @ts-ignore
              navigation.emit("onCancelTap");
            }}
            style={{ paddingLeft: paddings.paddingL }}>
            <Text style={TotaraTheme.textH3}>Cancel</Text>
          </TouchableOpacity>
        ),
        headerRight: navigation.getParam("showActions") && (
          <TouchableOpacity
            onPress={() => {
              // @ts-ignore
              navigation.emit("onDeleteTap");
            }}
            style={{ paddingRight: paddings.paddingL }}>
            <Text
              style={[
                TotaraTheme.textH3,
                { color: TotaraTheme.colorDestructive }
              ]}>
              Delete
            </Text>
          </TouchableOpacity>
        )
      })
    }
  },
  {
    initialRouteName: "Downloads",
    initialRouteKey: "Downloads",
    defaultNavigationOptions: totaraNavigationOptions({})
  }
);

const styles = StyleSheet.create({
  noContent: {
    height: "100%",
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }
});

export default DownloadsStack;
