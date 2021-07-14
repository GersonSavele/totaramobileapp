
import { useNavigation } from "@react-navigation/native";
import { ImageWrapper } from "@totara/components";
import { margins, paddings } from "@totara/theme/constants";
import { TotaraTheme } from "@totara/theme/Theme";
import React, { useLayoutEffect } from "react";
import { Button, StyleSheet, Text, View, Platform, ImageSourcePropType, Image } from "react-native";
import { Images } from "@resources/images";

const { textH2, textRegular, colorNeutral1, colorNeutral2, colorNeutral3, colorNeutral6 } = TotaraTheme;

const overviewStyles = StyleSheet.create({
  root: {
    backgroundColor: colorNeutral2,
    flex: 1,
  },

  header: {
    paddingTop: paddings.paddingXL,
    paddingLeft: paddings.paddingXL
  },

  title: {
    ...textH2,
  },

  tabContainer: { paddingTop: paddings.paddingL, display: 'flex', flexDirection: 'row' },
  tabItem: { borderBottomColor: colorNeutral6, borderBottomWidth: 2, paddingBottom: paddings.paddingS },
  tabItemTitle: {
    ...textRegular
  },

  bodyContainer: { backgroundColor: colorNeutral1, flex: 1, padding: paddings.paddingXL },
  banner: { height: 200, justifyContent: "center", alignItems: 'center', display: 'flex' },

  description: {
    paddingTop: paddings.paddingL,
    ...textRegular
  },


  enrolmentStatusContainer: { backgroundColor: colorNeutral1, height: 100, width: '100%', display: 'flex' },
  enrolmentStatusDivider: {
    height: 1, backgroundColor: colorNeutral3,
    marginLeft: margins.marginM, marginRight: margins.marginM,
  },
  enrolmentStatusSubContainer: { display: 'flex', flex: 1, justifyContent: 'center' },
  enrolmentStatusDescription: { fontSize: 20, alignSelf: 'center', fontWeight: 'bold' }
});



const ImageElement = ({ imageSrc }: { imageSrc?: string }) => {
  const defaultImage = Images.defaultCourses;
  return (
    <View>
      {imageSrc && imageSrc.length > 0 ? (
        <ImageWrapper url={imageSrc} />
      ) : (
        <Image source={defaultImage as ImageSourcePropType} resizeMode={"contain"} />
      )}
    </View>
  );
};

export const OverviewModal = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: colorNeutral2,
      },
      headerLeft: () => {
        const isIOS = Platform.OS === "ios";
        return isIOS && <Button onPress={() => { navigation.goBack() }} title="Done" />
      },
    });
  }, [navigation]);

  return <View style={overviewStyles.root}>

    <View style={overviewStyles.header}>
      <Text style={overviewStyles.title}>Master your calendar</Text>

      <View style={overviewStyles.tabContainer}>
        <View style={overviewStyles.tabItem}>
          <Text style={overviewStyles.tabItemTitle}>OVERVIEW</Text>
        </View>
      </View>
    </View>


    <View style={overviewStyles.bodyContainer}>
      <View style={overviewStyles.banner}>
        <ImageElement imageSrc={undefined} />
      </View>
      <Text style={overviewStyles.description}>
        Mussum Ipsum, cacilds vidis litro abertis. Delegadis gente finis, bibendum egestas augue arcu ut est. Diuretics paradis num copo é motivis de denguis. Posuere libero varius. Nullam a nisl ut ante blandit hendrerit. Aenean sit amet nisi. Vehicula non. Ut sed ex eros. Vivamus sit amet nibh non tellus tristique interdum.
      </Text>
    </View>

    <View style={overviewStyles.enrolmentStatusContainer}>
      <View style={overviewStyles.enrolmentStatusDivider} />
      <View style={overviewStyles.enrolmentStatusSubContainer}>
        <Text style={overviewStyles.enrolmentStatusDescription}>
          You can enrol in this course
        </Text>
      </View>
    </View>
  </View >
}

