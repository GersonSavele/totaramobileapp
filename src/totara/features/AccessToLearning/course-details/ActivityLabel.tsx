/**
 * This file is part of Totara Mobile
 *
 * Copyright (C) 2019 onwards Totara Learning Solutions LTD
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @author Tharaka Dushmantha <tharaka.dushmantha@totaralearning.com>
 *
 *
 */
import { StyleSheet, Text, View } from "react-native";
import React, { ReactNode } from "react";

import { normalize } from "@totara/theme";
import { AppliedTheme } from "@totara/theme/Theme";
<<<<<<< HEAD
import { labelDoc } from "../mock-data";
=======
import {
  labelText,
  labelParagraph,
  labelDoc,
  labelImage,
  labelVideo,
  labelAttachments,
  labelBulletList,
  labelEmoji,
  labelHashtag,
  labelHeading,
  labelLinkBlock,
  labelLinkMedia,
  labelMention,
  labelOrderedList
} from "../mock-data";
>>>>>>> MOB-437 features: Course Activity Label
import { VideoController } from "./Components";
import { Image } from "react-native-animatable";

type ActivityLabelProps = {
<<<<<<< HEAD
  label: any;
  theme: AppliedTheme;
};
type LabelConfigProps = {
  label?: any;
=======
  labelType: any;
  theme: AppliedTheme;
};
type LabelConfigProps = {
  labelType?: any;
>>>>>>> MOB-437 features: Course Activity Label
  theme: AppliedTheme;
  index?: number;
  children?: ReactNode;
};
type ImageLabelType = {
  image: string;
  children?: ReactNode;
};

type ChildProps = {
  children: ReactNode;
};

<<<<<<< HEAD
const ActivityLabel = ({ label, theme }: ActivityLabelProps) => {
  const value = itemsExtract(labelDoc, theme);
  return <View style={styles.container}>{value}</View>;
};

const itemsExtract = (label: any, theme: AppliedTheme) => {
  if (!label.content || label.content == undefined) {
    return (
      <View style={styles.labelWrap}>
        <LabelConfiguration label={label} theme={theme} />
      </View>
    );
  } else {
    return label.content.map((nestedLabel: any, index: number) => {
      if (Array.isArray(nestedLabel.content) && nestedLabel.content.length) {
        return (
          <LabelConfiguration
            key={index}
            label={label}
            index={index}
            theme={theme}
          >
            {itemsExtract(nestedLabel, theme)}
=======
const ActivityLabel = ({ labelType, theme }: ActivityLabelProps) => {
  // To Do:- This is dummy data for testing, once we have real data in "item" have to remove this array and random select data
  const array = [
    labelText,
    labelParagraph,
    labelDoc,
    labelImage,
    labelVideo,
    labelAttachments,
    labelBulletList,
    labelEmoji,
    labelHashtag,
    labelHeading,
    labelLinkBlock,
    labelLinkMedia,
    labelMention,
    labelOrderedList
  ];
  const items = array[Math.floor(Math.random() * array.length)];

  const value = itemsExtract(items, theme);
  return <View style={styles.container}>{value}</View>;
};

const itemsExtract = (labelType: any, theme: AppliedTheme) => {
  if (!labelType.content || labelType.content == undefined) {
    return (
      <View style={styles.labelWrap}>
        <LabelConfiguration labelType={labelType} theme={theme} />
      </View>
    );
  } else {
    return labelType.content.map((nestedLabelType: any, index: number) => {
      if (
        Array.isArray(nestedLabelType.content) &&
        nestedLabelType.content.length
      ) {
        return (
          <LabelConfiguration
            key={index}
            labelType={labelType}
            index={index}
            theme={theme}
          >
            {itemsExtract(nestedLabelType, theme)}
>>>>>>> MOB-437 features: Course Activity Label
          </LabelConfiguration>
        );
      }
      return (
        <View key={index} style={styles.labelWrap}>
<<<<<<< HEAD
          <LabelConfiguration key={index} label={nestedLabel} theme={theme} />
=======
          <LabelConfiguration
            key={index}
            labelType={nestedLabelType}
            theme={theme}
          />
>>>>>>> MOB-437 features: Course Activity Label
        </View>
      );
    });
  }
};

const LabelConfiguration = ({
<<<<<<< HEAD
  label,
  children,
  index,
  theme,
}: LabelConfigProps) => {
  switch (label.type) {
    case "attachment":
      return (
        <AttachmentTypeLabel label={label} theme={theme}></AttachmentTypeLabel>
      );
    case "text":
      return <TextTypeLabel label={label} theme={theme}></TextTypeLabel>;
=======
  labelType,
  children,
  index,
  theme
}: LabelConfigProps) => {
  switch (labelType.type) {
    case "attachment":
      return (
        <AttachmentTypeLabel
          labelType={labelType}
          theme={theme}
        ></AttachmentTypeLabel>
      );
    case "text":
      return (
        <TextTypeLabel labelType={labelType} theme={theme}></TextTypeLabel>
      );
>>>>>>> MOB-437 features: Course Activity Label
    case "paragraph":
      return <View>{children}</View>;
    case "doc":
      return <View>{children}</View>;
    case "video":
    case "link_block":
    case "link_media":
<<<<<<< HEAD
      return <VideoTypeLabel label={label} theme={theme}></VideoTypeLabel>;
    case "image": {
      return <ImageTypeLabel image={label.attrs.image}></ImageTypeLabel>;
=======
      return (
        <VideoTypeLabel
          labelType={labelType}
          theme={theme}
        ></VideoTypeLabel>
      );
    case "image": {
      return <ImageTypeLabel image={labelType.attrs.image}></ImageTypeLabel>;
>>>>>>> MOB-437 features: Course Activity Label
    }
    case "bullet_list": {
      return (
        <BulletListTypeLabel theme={theme}>{children}</BulletListTypeLabel>
      );
    }
    case "list_item": {
      return <ListItemTypeLabel>{children}</ListItemTypeLabel>;
    }
    case "ordered_list": {
      return (
<<<<<<< HEAD
        <OderListTypeLabel label={label} index={index} theme={theme}>
=======
        <OderListTypeLabel labelType={labelType} index={index} theme={theme}>
>>>>>>> MOB-437 features: Course Activity Label
          {children}
        </OderListTypeLabel>
      );
    }
    case "emoji": {
<<<<<<< HEAD
      return <EmojiTypeLabel label={label}></EmojiTypeLabel>;
    }
    case "hashtag": {
      return <HashingTypeLabel label={label} theme={theme}></HashingTypeLabel>;
    }
    case "mention": {
      return <MentionTypeLabel label={label} theme={theme}></MentionTypeLabel>;
    }
    case "ruler": {
      return <RulerTypeLabel label={label} theme={theme}></RulerTypeLabel>;
=======
      return <EmojiTypeLabel labelType={labelType}></EmojiTypeLabel>;
    }
    case "hashtag": {
      return (
        <HashingTypeLabel
          labelType={labelType}
          theme={theme}
        ></HashingTypeLabel>
      );
    }
    case "mention": {
      return (
        <MentionTypeLabel
          labelType={labelType}
          theme={theme}
        ></MentionTypeLabel>
      );
    }
    case "ruler": {
      return (
        <RulerTypeLabel labelType={labelType} theme={theme}></RulerTypeLabel>
      );
>>>>>>> MOB-437 features: Course Activity Label
    }
    case "heading": {
      return <HeadingTypeLabel>{children}</HeadingTypeLabel>;
    }
    case "audio": {
<<<<<<< HEAD
      return <AudioTypeLabel label={label} theme={theme}></AudioTypeLabel>;
=======
      return <AudioTypeLabel labelType={labelType} theme = {theme}></AudioTypeLabel>;
>>>>>>> MOB-437 features: Course Activity Label
    }
    default:
      return null;
  }
};

<<<<<<< HEAD
const AttachmentTypeLabel = ({ label }: ActivityLabelProps) => {
  return (
    <View style={{ marginBottom: 8 }}>
      <ImageTypeLabel image={label.attrs.filename}></ImageTypeLabel>
=======
const AttachmentTypeLabel = ({ labelType }: ActivityLabelProps) => {
  return (
    <View style={{ marginBottom: 8 }}>
      <ImageTypeLabel image={labelType.attrs.filename}></ImageTypeLabel>
>>>>>>> MOB-437 features: Course Activity Label
    </View>
  );
};

<<<<<<< HEAD
const TextTypeLabel = ({ label, theme }: ActivityLabelProps) => {
  var fontWeight, fontStyle;
  if (Array.isArray(label.marks) && label.marks.length) {
    label.marks.map((mark: any) => {
=======
const TextTypeLabel = ({ labelType, theme }: ActivityLabelProps) => {
  var fontWeight, fontStyle;
  if (Array.isArray(labelType.marks) && labelType.marks.length) {
    labelType.marks.map((mark: any) => {
>>>>>>> MOB-437 features: Course Activity Label
      if (mark.type == "bold") {
        fontWeight = "bold";
      } else if (mark.type == "strong") {
        fontWeight = "700";
      } else if (mark.type == "em") {
        fontStyle = "italic";
      }
    });
  }
  return (
    <View style={styles.textLabeWrap}>
      <Text
        style={[
          styles.labelText,
          {
            fontWeight: fontWeight,
            color: theme.colorNeutral6,
<<<<<<< HEAD
            fontStyle: fontStyle,
          },
        ]}
      >
        {label.text}
=======
            fontStyle: fontStyle
          }
        ]}
      >
        {labelType.text}
>>>>>>> MOB-437 features: Course Activity Label
      </Text>
    </View>
  );
};

<<<<<<< HEAD
const VideoTypeLabel = ({ label, theme }: ActivityLabelProps) => {
=======
const VideoTypeLabel = ({ labelType, theme }: ActivityLabelProps) => {
>>>>>>> MOB-437 features: Course Activity Label
  return (
    <View>
      <View style={{ marginBottom: 4 }}>
        <View>
          <Text
            numberOfLines={2}
<<<<<<< HEAD
            style={[
              styles.videoTitle,
              theme.textH4,
              { color: theme.colorNeutral6 },
            ]}
          >
            {label.attrs.title}
          </Text>
        </View>
        <View style={styles.videoContainer}>
          <VideoController url={label.attrs.url} />
=======
            style={[styles.videoTitle, { color: theme.colorNeutral6 }]}
          >
            {labelType.attrs.title}
          </Text>
        </View>
        <View style={styles.videoContainer}>
          <VideoController url= {labelType.attrs.url} />
>>>>>>> MOB-437 features: Course Activity Label
        </View>
        <View>
          <Text
            style={[
              styles.videoDescription,
              {
<<<<<<< HEAD
                color: theme.colorNeutral6,
              },
            ]}
          >
            {label.attrs.description}
=======
                color: theme.colorNeutral6
              }
            ]}
          >
            {labelType.attrs.description}
>>>>>>> MOB-437 features: Course Activity Label
          </Text>
        </View>
      </View>
    </View>
  );
};

const ImageTypeLabel = ({ image }: ImageLabelType) => {
  return (
    <View>
      <Image
        style={styles.imageContainer}
        source={{
<<<<<<< HEAD
          uri: image,
=======
          uri: image
>>>>>>> MOB-437 features: Course Activity Label
        }}
      ></Image>
    </View>
  );
};
<<<<<<< HEAD
const AudioTypeLabel = ({ label, theme }: ActivityLabelProps) => {
=======
const AudioTypeLabel = ({ labelType, theme }: ActivityLabelProps) => {
>>>>>>> MOB-437 features: Course Activity Label
  return (
    <View style={styles.textWrapViewContainer}>
      <Text
        style={[
          styles.labelText,
<<<<<<< HEAD
          { fontWeight: "normal", color: theme.colorNeutral6 },
        ]}
      >
        {label.type}
      </Text>
    </View>
  );
};
=======
          { fontWeight: "normal", color: theme.colorNeutral6 }
        ]}
      >
        {labelType.type}
      </Text>
    </View>
  );
}
>>>>>>> MOB-437 features: Course Activity Label

const BulletListTypeLabel = ({ children, theme }: LabelConfigProps) => {
  return (
    <View style={styles.listContainer}>
<<<<<<< HEAD
      <Text
        style={{ color: theme.colorNeutral6, marginRight: 8, marginTop: 6 }}
      >
        •
      </Text>
=======
      <Text style={{ color: theme.colorNeutral6, marginRight: 8, marginTop:6 }}>•</Text>
>>>>>>> MOB-437 features: Course Activity Label
      {children}
    </View>
  );
};

const OderListTypeLabel = ({ children, index, theme }: LabelConfigProps) => {
  return (
    <View style={styles.listContainer}>
      <Text
        style={[
          styles.orderNumberListText,
          {
<<<<<<< HEAD
            color: theme.colorNeutral6,
          },
=======
            color: theme.colorNeutral6
          }
>>>>>>> MOB-437 features: Course Activity Label
        ]}
      >
        {index! + 1}.
      </Text>
      {children}
    </View>
  );
};

const ListItemTypeLabel = ({ children }: ChildProps) => {
  return <View>{children}</View>;
};

<<<<<<< HEAD
const EmojiTypeLabel = ({ label }: any) => {
  let emo = String.fromCodePoint(parseInt("0x" + label.attrs.shortcode));
=======
const EmojiTypeLabel = ({ labelType }: any) => {
  let emo = String.fromCodePoint(parseInt("0x" + labelType.attrs.shortcode));
>>>>>>> MOB-437 features: Course Activity Label
  return (
    <View style={styles.textWrapViewContainer}>
      <Text style={styles.labelText}>{emo}</Text>
    </View>
  );
};

<<<<<<< HEAD
const HashingTypeLabel = ({ label, theme }: LabelConfigProps) => {
=======
const HashingTypeLabel = ({ labelType, theme }: LabelConfigProps) => {
>>>>>>> MOB-437 features: Course Activity Label
  return (
    <View style={styles.textWrapViewContainer}>
      <Text
        style={[
          styles.labelText,
<<<<<<< HEAD
          { fontWeight: "normal", color: theme.colorNeutral6 },
        ]}
      >
        {label.attrs.text}
=======
          { fontWeight: "normal", color: theme.colorNeutral6 }
        ]}
      >
        {labelType.attrs.text}
>>>>>>> MOB-437 features: Course Activity Label
      </Text>
    </View>
  );
};

const HeadingTypeLabel = ({ children }: ChildProps) => {
  return <View>{children}</View>;
};

<<<<<<< HEAD
const MentionTypeLabel = ({ label, theme }: LabelConfigProps) => {
=======
const MentionTypeLabel = ({ labelType, theme }: LabelConfigProps) => {
>>>>>>> MOB-437 features: Course Activity Label
  return (
    <View style={styles.textWrapViewContainer}>
      <Text
        style={[
          styles.labelText,
<<<<<<< HEAD
          { fontWeight: "normal", color: theme.colorNeutral6 },
        ]}
      >
        {label.attrs.display}
=======
          { fontWeight: "normal", color: theme.colorNeutral6 }
        ]}
      >
        {labelType.attrs.display}
>>>>>>> MOB-437 features: Course Activity Label
      </Text>
    </View>
  );
};

<<<<<<< HEAD
const RulerTypeLabel = ({ label, theme }: LabelConfigProps) => {
=======
const RulerTypeLabel = ({ labelType, theme }: LabelConfigProps) => {
>>>>>>> MOB-437 features: Course Activity Label
  return (
    <View style={styles.textWrapViewContainer}>
      <Text
        style={[
          styles.labelText,
<<<<<<< HEAD
          { fontWeight: "normal", color: theme.colorNeutral6 },
        ]}
      >
        {label.type}
=======
          { fontWeight: "normal", color: theme.colorNeutral6 }
        ]}
      >
        {labelType.type}
>>>>>>> MOB-437 features: Course Activity Label
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: 16,
    marginRight: 16,
    marginTop: 2,
    marginBottom: 2,
<<<<<<< HEAD
    justifyContent: "center",
  },
  labelWrap: {
    marginVertical: 4,
    justifyContent: "center",
  },
  labelText: {
    textAlign: "left",
    fontSize: normalize(17),
    lineHeight: 22,
  },
  textLabeWrap: {
    justifyContent: "center",
  },
  videoTitle: {
    fontWeight: "bold",
    marginBottom: 16,
=======
    justifyContent: "center"
  },
  labelWrap: {
    marginVertical: 4,
    justifyContent: "center"
  },
  labelText: {
    textAlign: "left",
    fontSize: 17,
    lineHeight: 22
  },
  textLabeWrap: {
    justifyContent: "center"
  },
  videoTitle: {
    fontSize: 17,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 22,
    marginBottom: 16
>>>>>>> MOB-437 features: Course Activity Label
  },
  videoContainer: {
    height: normalize(200),
    width: normalize(380),
<<<<<<< HEAD
    borderRadius: normalize(12),
  },
  videoDescription: {
    fontSize: normalize(17),
    fontWeight: "normal",
    marginTop: 16,
    fontStyle: "normal",
    lineHeight: 22,
=======
    borderRadius: normalize(12)
  },
  videoDescription: {
    fontSize: 17,
    fontWeight: "normal",
    marginTop: 16,
    fontStyle: "normal",
    lineHeight: 22
>>>>>>> MOB-437 features: Course Activity Label
  },
  listContainer: {
    flexDirection: "row",
    marginRight: 8,
<<<<<<< HEAD
    justifyContent: "flex-start",
=======
    justifyContent: 'flex-start',
>>>>>>> MOB-437 features: Course Activity Label
  },
  orderNumberListText: {
    marginRight: 8,
    marginBottom: 8,
    fontSize: normalize(17),
<<<<<<< HEAD
    marginTop: 6,
  },
  textWrapViewContainer: {
    justifyContent: "center",
    marginBottom: 16,
=======
    marginTop: 6
  },
  textWrapViewContainer: {
    justifyContent: "center",
    marginBottom: 16
>>>>>>> MOB-437 features: Course Activity Label
  },
  imageContainer: {
    height: normalize(200),
    width: normalize(380),
    borderRadius: normalize(12),
    alignItems: "center",
<<<<<<< HEAD
    justifyContent: "center",
  },
=======
    justifyContent: "center"
  }
>>>>>>> MOB-437 features: Course Activity Label
});

export default ActivityLabel;
