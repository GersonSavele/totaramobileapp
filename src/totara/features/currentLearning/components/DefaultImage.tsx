import { Image, ImageSourcePropType, ImageStyle, StyleProp, StyleSheet } from "react-native";
import { learningItemEnum } from "@totara/features/currentLearning/constants";
import { Images } from "@resources/images";
import React from "react";

type DefaultImageProps = {
  itemType: learningItemEnum;
  style?: StyleProp<ImageStyle>;
};

const DefaultImage = ({ itemType, style }: DefaultImageProps) => {
  switch (itemType) {
    case learningItemEnum.Course:
      return <Image style={[styles.imageWrap, style && style]} source={Images.defaultCourses as ImageSourcePropType} />;
    case learningItemEnum.Program:
      return <Image style={[styles.imageWrap, style && style]} source={Images.defaultProgram as ImageSourcePropType} />;
    case learningItemEnum.Certification:
      return (
        <Image
          style={[styles.imageWrap, style && style]}
          source={Images.defaultCertifications as ImageSourcePropType}
        />
      );
    default:
      return null;
  }
};

const styles = StyleSheet.create({
  imageWrap: {
    flex: 1
  }
});

export default DefaultImage;
