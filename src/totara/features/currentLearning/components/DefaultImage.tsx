import { Image, ImageSourcePropType, ImageStyle, StyleProp, StyleSheet, View } from "react-native";
import { learningItemEnum } from "@totara/features/currentLearning/constants";
import { Images } from "@resources/images";
import React from "react";
import { TotaraTheme } from "@totara/theme/Theme";
import { margins } from "@totara/theme/constants";

type DefaultImageProps = {
  itemType: learningItemEnum;
  style?: StyleProp<ImageStyle>;
};

const defaultImages = {
  [learningItemEnum.Course]: Images.defaultCourses,
  [learningItemEnum.Program]: Images.defaultProgram,
  [learningItemEnum.Certification]: Images.defaultCertifications
};

const DefaultImage = ({ itemType, style }: DefaultImageProps) => {
  const defaultImage = defaultImages[itemType];
  return (
    <View style={[styles.imageContainer, style]}>
      <Image style={[styles.imageWrap, style]} source={defaultImage as ImageSourcePropType} resizeMode={"contain"} />
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    backgroundColor: TotaraTheme.colorNeutral3
  },
  imageWrap: {
    flex: 1,
    margin: margins.marginM,
    alignSelf: "center",
    resizeMode: "contain"
  }
});

export default DefaultImage;
