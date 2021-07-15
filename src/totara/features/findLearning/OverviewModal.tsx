
import { useNavigation } from "@react-navigation/native";
import { ImageWrapper, PrimaryButton, TertiaryButton } from "@totara/components";
import { fontWeights, margins, paddings } from "@totara/theme/constants";
import { TotaraTheme } from "@totara/theme/Theme";
import React, { useLayoutEffect } from "react";
import { StyleSheet, Text, View, ImageSourcePropType, Image, ScrollView } from "react-native";
import { Images } from "@resources/images";
import { translate } from "@totara/locale";
import { HeaderBackButton } from '@react-navigation/stack';

const { textHeadline, textMedium, textRegular, colorNeutral3 } = TotaraTheme;

const overviewStyles = StyleSheet.create({
  root: {
    flex: 1,
    padding: paddings.paddingXL
  },

  banner: {
    aspectRatio: 2 / 1, justifyContent: "center",
    alignItems: 'center', display: 'flex'
  },

  defaultImage: { borderWidth: 1, borderColor: colorNeutral3, flex: 1, width: '100%', aspectRatio: 2 / 1, justifyContent: 'center', alignItems: 'center' },

  title: {
    marginTop: margins.marginL,
    ...textMedium,
    fontWeight: fontWeights.fontWeightBold
  },
  course: {
    marginTop: margins.marginL,
    ...textRegular
  },

  enrolment: {
    marginTop: margins.marginL,
    backgroundColor: colorNeutral3,
    alignItems: 'center',
    padding: paddings.paddingXL
  },

  enrolmentStatus: {
    ...textHeadline
  },

  enrolmentAction: {
    marginTop: margins.marginL
  },

  descriptionContainer: {
    flex: 1,
    marginTop: margins.marginL,
    marginBottom: margins.marginL
  },
  description: {
    ...textRegular
  },
});

const ImageElement = ({ imageSrc }: { imageSrc?: string }) => {
  const defaultImage = Images.defaultCourses;
  return (

    imageSrc && imageSrc.length > 0 ? (
      <ImageWrapper url={imageSrc} />
    ) : (
      <View style={overviewStyles.defaultImage}>
        <Image source={defaultImage as ImageSourcePropType} resizeMode={"contain"} />
      </View>
    )
  );
};


/** THIS COMPONENT WILL HANDLE GRAPHQL DATA */
export const OverviewModal = () => {

  return <OverviewModalContent
    isGuestAccessEnabled={false}
    isSelfEnrolmentEnabled={false}
    isUserEnrolled={false}
    isPrivilegedUser={true} />
}


const OverviewModalContent = ({
  isGuestAccessEnabled,
  isSelfEnrolmentEnabled,
  isUserEnrolled,
  isPrivilegedUser
}: {
  isGuestAccessEnabled: boolean,
  isSelfEnrolmentEnabled: boolean,
  isUserEnrolled: boolean,
  isPrivilegedUser: boolean
}) => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: (props) => (
        <HeaderBackButton
          {...props}
          onPress={() => {
            navigation.goBack();
          }}
        />
      ),
      headerRight: () => {
        //will close this modal and redirect the user to the user with no need to enrol (privileged user, ie: admin)
        return isPrivilegedUser && <TertiaryButton text={translate("find_learning_overview.go_to_course")}
          onPress={() => {
            navigation.goBack();
          }}
        />
      }
    });
  }, [navigation]);

  const enrolmentStatusText = isUserEnrolled ? translate("find_learning_overview.you_are_enrolled") : (
    isGuestAccessEnabled || isSelfEnrolmentEnabled ? translate("find_learning_overview.you_can_enrol") : translate("find_learning_overview.you_are_not_enrolled")
  );

  return <View style={overviewStyles.root}>

    <View style={overviewStyles.banner}>
      <ImageElement imageSrc={undefined} />
    </View>

    <Text style={overviewStyles.title}>Master your calendar</Text>

    <Text style={overviewStyles.course}>{translate("find_learning_overview.course")}</Text>

    <View style={overviewStyles.enrolment}>
      <Text style={overviewStyles.enrolmentStatus}>{enrolmentStatusText}</Text>

      {(isGuestAccessEnabled || isUserEnrolled || isSelfEnrolmentEnabled || isPrivilegedUser) && <View>
        <PrimaryButton style={overviewStyles.enrolmentAction} text={translate("find_learning_overview.go_to_course")}
          onPress={() => {
            //will handle go to the course and open the enrolment options when necessary
            navigation.goBack();
          }} />
      </View>}
    </View>

    <ScrollView style={overviewStyles.descriptionContainer}>
      <Text style={overviewStyles.description}>
        Mussum Ipsum, cacilds vidis litro abertis. Delegadis gente finis, bibendum egestas augue arcu ut est. Diuretics paradis num copo é motivis de denguis. Posuere libero varius. Nullam a nisl ut ante blandit hendrerit. Aenean sit amet nisi. Vehicula non. Ut sed ex eros. Vivamus sit amet nibh non tellus tristique interdum. Mussum Ipsum, cacilds vidis litro abertis. Delegadis gente finis, bibendum egestas augue arcu ut est. Diuretics paradis num copo é motivis de denguis. Posuere libero varius. Nullam a nisl ut ante blandit hendrerit. Aenean sit amet nisi. Vehicula non. Ut sed ex eros. Vivamus sit amet nibh non tellus tristique interdum. Mussum Ipsum, cacilds vidis litro abertis. Delegadis gente finis, bibendum egestas augue arcu ut est. Diuretics paradis num copo é motivis de denguis. Posuere libero varius. Nullam a nisl ut ante blandit hendrerit. Aenean sit amet nisi. Vehicula non. Ut sed ex eros. Vivamus sit amet nibh non tellus tristique interdum.
      </Text>
    </ScrollView>

  </View >
}

