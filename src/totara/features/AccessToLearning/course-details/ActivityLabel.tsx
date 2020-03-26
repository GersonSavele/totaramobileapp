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
import { VideoController } from "./Components";
import { Image } from "react-native-animatable";

type ActivityLabelProps = {
  labelType: any;
  theme: AppliedTheme;
};
type LabelConfigProps = {
  labelType?: any;
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
          </LabelConfiguration>
        );
      }
      return (
        <View key={index} style={styles.labelWrap}>
          <LabelConfiguration
            key={index}
            labelType={nestedLabelType}
            theme={theme}
          />
        </View>
      );
    });
  }
};

const LabelConfiguration = ({
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
    case "paragraph":
      return <View>{children}</View>;
    case "doc":
      return <View>{children}</View>;
    case "video":
    case "link_block":
    case "link_media":
      return (
        <VideoTypeLabel
          labelType={labelType}
          theme={theme}
        ></VideoTypeLabel>
      );
    case "image": {
      return <ImageTypeLabel image={labelType.attrs.image}></ImageTypeLabel>;
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
        <OderListTypeLabel labelType={labelType} index={index} theme={theme}>
          {children}
        </OderListTypeLabel>
      );
    }
    case "emoji": {
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
    }
    case "heading": {
      return <HeadingTypeLabel>{children}</HeadingTypeLabel>;
    }
    case "audio": {
      return <AudioTypeLabel labelType={labelType} theme = {theme}></AudioTypeLabel>;
    }
    default:
      return null;
  }
};

const AttachmentTypeLabel = ({ labelType }: ActivityLabelProps) => {
  return (
    <View style={{ marginBottom: 8 }}>
      <ImageTypeLabel image={labelType.attrs.filename}></ImageTypeLabel>
    </View>
  );
};

const TextTypeLabel = ({ labelType, theme }: ActivityLabelProps) => {
  var fontWeight, fontStyle;
  if (Array.isArray(labelType.marks) && labelType.marks.length) {
    labelType.marks.map((mark: any) => {
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
            fontStyle: fontStyle
          }
        ]}
      >
        {labelType.text}
      </Text>
    </View>
  );
};

const VideoTypeLabel = ({ labelType, theme }: ActivityLabelProps) => {
  return (
    <View>
      <View style={{ marginBottom: 4 }}>
        <View>
          <Text
            numberOfLines={2}
            style={[styles.videoTitle, { color: theme.colorNeutral6 }]}
          >
            {labelType.attrs.title}
          </Text>
        </View>
        <View style={styles.videoContainer}>
          <VideoController url= {labelType.attrs.url} />
        </View>
        <View>
          <Text
            style={[
              styles.videoDescription,
              {
                color: theme.colorNeutral6
              }
            ]}
          >
            {labelType.attrs.description}
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
          uri: image
        }}
      ></Image>
    </View>
  );
};
const AudioTypeLabel = ({ labelType, theme }: ActivityLabelProps) => {
  return (
    <View style={styles.textWrapViewContainer}>
      <Text
        style={[
          styles.labelText,
          { fontWeight: "normal", color: theme.colorNeutral6 }
        ]}
      >
        {labelType.type}
      </Text>
    </View>
  );
}

const BulletListTypeLabel = ({ children, theme }: LabelConfigProps) => {
  return (
    <View style={styles.listContainer}>
      <Text style={{ color: theme.colorNeutral6, marginRight: 8, marginTop:6 }}>•</Text>
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
            color: theme.colorNeutral6
          }
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

const EmojiTypeLabel = ({ labelType }: any) => {
  let emo = String.fromCodePoint(parseInt("0x" + labelType.attrs.shortcode));
  return (
    <View style={styles.textWrapViewContainer}>
      <Text style={styles.labelText}>{emo}</Text>
    </View>
  );
};

const HashingTypeLabel = ({ labelType, theme }: LabelConfigProps) => {
  return (
    <View style={styles.textWrapViewContainer}>
      <Text
        style={[
          styles.labelText,
          { fontWeight: "normal", color: theme.colorNeutral6 }
        ]}
      >
        {labelType.attrs.text}
      </Text>
    </View>
  );
};

const HeadingTypeLabel = ({ children }: ChildProps) => {
  return <View>{children}</View>;
};

const MentionTypeLabel = ({ labelType, theme }: LabelConfigProps) => {
  return (
    <View style={styles.textWrapViewContainer}>
      <Text
        style={[
          styles.labelText,
          { fontWeight: "normal", color: theme.colorNeutral6 }
        ]}
      >
        {labelType.attrs.display}
      </Text>
    </View>
  );
};

const RulerTypeLabel = ({ labelType, theme }: LabelConfigProps) => {
  return (
    <View style={styles.textWrapViewContainer}>
      <Text
        style={[
          styles.labelText,
          { fontWeight: "normal", color: theme.colorNeutral6 }
        ]}
      >
        {labelType.type}
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
  },
  videoContainer: {
    height: normalize(200),
    width: normalize(380),
    borderRadius: normalize(12)
  },
  videoDescription: {
    fontSize: 17,
    fontWeight: "normal",
    marginTop: 16,
    fontStyle: "normal",
    lineHeight: 22
  },
  listContainer: {
    flexDirection: "row",
    marginRight: 8,
    justifyContent: 'flex-start',
  },
  orderNumberListText: {
    marginRight: 8,
    marginBottom: 8,
    fontSize: normalize(17),
    marginTop: 6
  },
  textWrapViewContainer: {
    justifyContent: "center",
    marginBottom: 16
  },
  imageContainer: {
    height: normalize(200),
    width: normalize(380),
    borderRadius: normalize(12),
    alignItems: "center",
    justifyContent: "center"
  }
});

export default ActivityLabel;
