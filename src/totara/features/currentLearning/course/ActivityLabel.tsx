/**
 * This file is part of Totara Enterprise.
 *
 * Copyright (C) 2020 onwards Totara Learning Solutions LTD
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

import React, { ReactNode } from "react";
import { StyleSheet, View, Text } from "react-native";
import { map } from "lodash";
import { TotaraTheme } from "@totara/theme/Theme";
import VideoController from "./VideoController";
import { Image } from "react-native-animatable";
import { textAttributes, margins, borderRadius, fontWeights } from "@totara/theme/constants";
import TextTypeLabel from "./activityLabel";

const { marginL, marginS, marginXS, marginM, margin2XL } = margins;

type ActivityLabelProps = {
  label: any;
};
type LabelConfigProps = {
  label?: any;
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

const ActivityLabel = ({ label = {} }: ActivityLabelProps) => {
  return <View style={styles.container}>{itemsExtract(label)}</View>;
};

const itemsExtract = (label: any = {}) => {
  return !label.content ? (
    <View style={styles.labelWrap}>
      <LabelConfiguration label={label} />
    </View>
  ) : (
    map(label.content, (nestedLabel: any = {}, index: number) => {
      return Array.isArray(nestedLabel.content) && nestedLabel.content.length ? (
        <LabelConfiguration key={index} label={label} index={index}>
          {itemsExtract(nestedLabel)}
        </LabelConfiguration>
      ) : (
        <View key={index} style={styles.labelWrap}>
          <LabelConfiguration key={index} label={nestedLabel} />
        </View>
      );
    })
  );
};

const LabelConfiguration = ({ label = {}, children, index }: LabelConfigProps) => {
  switch (label.type) {
    case "attachment":
      return <AttachmentTypeLabel label={label} />;
    case "text":
      return <TextTypeLabel label={label} />;
    case "paragraph":
      return <View>{children}</View>;
    case "doc":
      return <View>{children}</View>;
    case "video":
    case "link_block":
    case "link_media":
      return <VideoTypeLabel label={label} />;
    case "image": {
      return <ImageTypeLabel image={label.attrs.image} />;
    }
    case "bullet_list": {
      return <BulletListTypeLabel>{children}</BulletListTypeLabel>;
    }
    case "list_item": {
      return <ListItemTypeLabel>{children}</ListItemTypeLabel>;
    }
    case "ordered_list": {
      return (
        <OderListTypeLabel label={label} index={index}>
          {children}
        </OderListTypeLabel>
      );
    }
    case "emoji": {
      return <EmojiTypeLabel label={label} />;
    }
    case "hashtag": {
      return <HashingTypeLabel label={label} />;
    }
    case "mention": {
      return <MentionTypeLabel label={label} />;
    }
    case "ruler": {
      return <RulerTypeLabel label={label} />;
    }
    case "heading": {
      return <HeadingTypeLabel>{children}</HeadingTypeLabel>;
    }
    case "audio": {
      return <AudioTypeLabel label={label} />;
    }
    default:
      return null;
  }
};

const AttachmentTypeLabel = ({ label = {} }: ActivityLabelProps) => {
  return (
    <View style={{ marginBottom: margins.marginM }}>
      <ImageTypeLabel image={label.attrs.filename} />
    </View>
  );
};

const VideoTypeLabel = ({ label = {} }: ActivityLabelProps) => {
  return (
    <View>
      <View style={{ marginBottom: margins.marginXS }}>
        <View>
          <Text numberOfLines={2} style={styles.videoTitle}>
            {label.attrs.title}
          </Text>
        </View>
        <View style={styles.videoContainer}>
          <VideoController url={label.attrs.url} />
        </View>
        <View>
          <Text style={styles.videoDescription}>{label.attrs.description}</Text>
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
      />
    </View>
  );
};

const AudioTypeLabel = ({ label = {} }: ActivityLabelProps) => {
  return (
    <View style={styles.textWrapViewContainer}>
      <Text style={styles.labelText}>{label.type}</Text>
    </View>
  );
};

const BulletListTypeLabel = ({ children }: LabelConfigProps) => {
  return (
    <View style={styles.listContainer}>
      <Text style={styles.bulletList}>•</Text>
      {children}
    </View>
  );
};

const OderListTypeLabel = ({ children, index }: LabelConfigProps) => {
  return (
    <View style={styles.listContainer}>
      <Text style={styles.orderNumberListText}>{index! + 1}.</Text>
      {children}
    </View>
  );
};

const ListItemTypeLabel = ({ children }: ChildProps) => {
  return <View>{children}</View>;
};

const EmojiTypeLabel = ({ label }: any = {}) => {
  let emo = String.fromCodePoint(parseInt(textAttributes.short_code_prefix + label.attrs.shortcode));
  return (
    <View style={styles.textWrapViewContainer}>
      <Text style={styles.labelText}>{emo}</Text>
    </View>
  );
};

const HashingTypeLabel = ({ label = {} }: LabelConfigProps) => {
  return (
    <View style={styles.textWrapViewContainer}>
      <Text style={styles.labelText}>{label.attrs.text}</Text>
    </View>
  );
};

const HeadingTypeLabel = ({ children }: ChildProps) => {
  return <View>{children}</View>;
};

const MentionTypeLabel = ({ label = {} }: LabelConfigProps) => {
  return (
    <View style={styles.textWrapViewContainer}>
      <Text style={styles.labelText}>{label.attrs.display}</Text>
    </View>
  );
};

const RulerTypeLabel = ({ label = {} }: LabelConfigProps) => {
  return (
    <View style={styles.textWrapViewContainer}>
      <Text style={styles.labelText}>{label.type}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: marginL,
    marginVertical: marginXS,
    justifyContent: "center"
  },
  labelWrap: {
    marginVertical: marginXS,
    justifyContent: "center"
  },
  labelText: {
    textAlign: "left",
    ...TotaraTheme.textRegular
  },
  textLabeWrap: {
    justifyContent: "center"
  },
  videoTitle: {
    ...TotaraTheme.textRegular,
    fontWeight: fontWeights.fontWeightBold,
    marginBottom: margin2XL
  },
  videoContainer: {
    height: 200,
    width: 380,
    borderRadius: borderRadius.borderRadiusM
  },
  videoDescription: {
    ...TotaraTheme.textRegular,
    marginTop: margin2XL
  },
  listContainer: {
    flexDirection: "row",
    marginRight: marginM,
    justifyContent: "flex-start"
  },
  orderNumberListText: {
    marginRight: marginM,
    marginVertical: marginM,
    ...TotaraTheme.textRegular
  },
  textWrapViewContainer: {
    justifyContent: "center",
    marginBottom: margin2XL
  },
  imageContainer: {
    height: 200,
    width: 380,
    borderRadius: borderRadius.borderRadiusM,
    alignItems: "center",
    justifyContent: "center"
  },
  bulletList: {
    color: TotaraTheme.colorNeutral6,
    marginRight: marginM,
    marginTop: marginS
  }
});

export default ActivityLabel;
