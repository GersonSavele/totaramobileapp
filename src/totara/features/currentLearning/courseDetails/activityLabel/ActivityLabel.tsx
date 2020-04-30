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
import { map } from "lodash";
import { normalize } from "@totara/theme";
import { AppliedTheme } from "@totara/theme/Theme";
import { VideoController } from "@totara/components/currentLearning/courseDetails";
import { Image } from "react-native-animatable";
import { textAttributes, margins } from "@totara/theme/constants";
import { TextTypeLabel } from "./types";

type ActivityLabelProps = {
  label: any;
  theme: AppliedTheme;
};
type LabelConfigProps = {
  label?: any;
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

const ActivityLabel = ({ label = {}, theme }: ActivityLabelProps) => {
  return <View style={styles.container}>{itemsExtract(label, theme)}</View>;
};

const itemsExtract = (label: any = {}, theme: AppliedTheme) => {
  return !label.content ? (
    <View style={styles.labelWrap}>
      <LabelConfiguration label={label} theme={theme} />
    </View>
  ) : (
    map(label.content, (nestedLabel: any = {}, index: number) => {
      return Array.isArray(nestedLabel.content) &&
        nestedLabel.content.length ? (
        <LabelConfiguration
          key={index}
          label={label}
          index={index}
          theme={theme}
        >
          {itemsExtract(nestedLabel, theme)}
        </LabelConfiguration>
      ) : (
        <View key={index} style={styles.labelWrap}>
          <LabelConfiguration key={index} label={nestedLabel} theme={theme} />
        </View>
      );
    })
  );
};

const LabelConfiguration = ({
  label = {},
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
    case "paragraph":
      return <View>{children}</View>;
    case "doc":
      return <View>{children}</View>;
    case "video":
    case "link_block":
    case "link_media":
      return <VideoTypeLabel label={label} theme={theme}></VideoTypeLabel>;
    case "image": {
      return <ImageTypeLabel image={label.attrs.image}></ImageTypeLabel>;
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
        <OderListTypeLabel label={label} index={index} theme={theme}>
          {children}
        </OderListTypeLabel>
      );
    }
    case "emoji": {
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
    }
    case "heading": {
      return <HeadingTypeLabel>{children}</HeadingTypeLabel>;
    }
    case "audio": {
      return <AudioTypeLabel label={label} theme={theme}></AudioTypeLabel>;
    }
    default:
      return null;
  }
};

const AttachmentTypeLabel = ({ label = {} }: ActivityLabelProps) => {
  return (
    <View style={{ marginBottom: margins.marginM }}>
      <ImageTypeLabel image={label.attrs.filename}></ImageTypeLabel>
    </View>
  );
};

const VideoTypeLabel = ({ label = {}, theme }: ActivityLabelProps) => {
  return (
    <View>
      <View style={{ marginBottom: margins.marginXS }}>
        <View>
          <Text
            numberOfLines={2}
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
        </View>
        <View>
          <Text
            style={[
              styles.videoDescription,
              {
                color: theme.colorNeutral6,
              },
            ]}
          >
            {label.attrs.description}
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
          uri: image,
        }}
      ></Image>
    </View>
  );
};

const AudioTypeLabel = ({ label = {}, theme }: ActivityLabelProps) => {
  return (
    <View style={styles.textWrapViewContainer}>
      <Text
        style={[
          styles.labelText,
          { fontWeight: "normal", color: theme.colorNeutral6 },
        ]}
      >
        {label.type}
      </Text>
    </View>
  );
};

const BulletListTypeLabel = ({ children, theme }: LabelConfigProps) => {
  return (
    <View style={styles.listContainer}>
      <Text
        style={{
          color: theme.colorNeutral6,
          marginRight: margins.marginM,
          marginTop: margins.marginS,
        }}
      >
        •
      </Text>
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
            color: theme.colorNeutral6,
          },
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

const EmojiTypeLabel = ({ label }: any = {}) => {
  let emo = String.fromCodePoint(
    parseInt(textAttributes.short_code_prefix + label.attrs.shortcode)
  );
  return (
    <View style={styles.textWrapViewContainer}>
      <Text style={styles.labelText}>{emo}</Text>
    </View>
  );
};

const HashingTypeLabel = ({ label = {}, theme }: LabelConfigProps) => {
  return (
    <View style={styles.textWrapViewContainer}>
      <Text
        style={[
          styles.labelText,
          { fontWeight: "normal", color: theme.colorNeutral6 },
        ]}
      >
        {label.attrs.text}
      </Text>
    </View>
  );
};

const HeadingTypeLabel = ({ children }: ChildProps) => {
  return <View>{children}</View>;
};

const MentionTypeLabel = ({ label = {}, theme }: LabelConfigProps) => {
  return (
    <View style={styles.textWrapViewContainer}>
      <Text
        style={[
          styles.labelText,
          { fontWeight: "normal", color: theme.colorNeutral6 },
        ]}
      >
        {label.attrs.display}
      </Text>
    </View>
  );
};

const RulerTypeLabel = ({ label = {}, theme }: LabelConfigProps) => {
  return (
    <View style={styles.textWrapViewContainer}>
      <Text
        style={[
          styles.labelText,
          { fontWeight: "normal", color: theme.colorNeutral6 },
        ]}
      >
        {label.type}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: margins.marginL,
    marginVertical: margins.marginXS,
    justifyContent: "center",
  },
  labelWrap: {
    marginVertical: margins.marginXS,
    justifyContent: "center",
  },
  labelText: {
    textAlign: "left",
    fontSize: normalize(17),
  },
  textLabeWrap: {
    justifyContent: "center",
  },
  videoTitle: {
    fontWeight: "bold",
    marginBottom: margins.margin2XL,
  },
  videoContainer: {
    height: normalize(200),
    width: normalize(380),
    borderRadius: normalize(12),
  },
  videoDescription: {
    fontSize: normalize(17),
    fontWeight: "normal",
    marginTop: margins.margin2XL,
    fontStyle: "normal",
  },
  listContainer: {
    flexDirection: "row",
    marginRight: margins.marginM,
    justifyContent: "flex-start",
  },
  orderNumberListText: {
    marginRight: margins.marginM,
    marginVertical: margins.marginM,
    fontSize: normalize(17),
  },
  textWrapViewContainer: {
    justifyContent: "center",
    marginBottom: margins.margin2XL,
  },
  imageContainer: {
    height: normalize(200),
    width: normalize(380),
    borderRadius: normalize(12),
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ActivityLabel;
