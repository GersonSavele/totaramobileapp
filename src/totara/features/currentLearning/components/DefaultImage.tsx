import { Image, ImageSourcePropType, ImageStyle, StyleProp, StyleSheet, View } from "react-native";
import { learningItemEnum } from "@totara/features/currentLearning/constants";
import { Images } from "@resources/images";
import React from "react";
import { TotaraTheme } from "@totara/theme/Theme";

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
    <View style={styles.imageContainer}>
      <Image style={[styles.imageWrap, style && style]} source={defaultImage as ImageSourcePropType} />
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
    alignSelf: "center",
    resizeMode: "contain"
  }
});

export default DefaultImage;
