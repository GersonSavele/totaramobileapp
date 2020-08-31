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
import { View, Text } from "react-native";
import { map } from "lodash";
import VideoController from "./VideoController";
import { textAttributes, margins } from "@totara/theme/constants";
import TextContent from "./ActivityTextContent";
import { WekaEditorType } from "../constants";
import { ImageWrapper } from "@totara/components";
import styles from "./activityLabelStyle";

type ActivityLabelProps = {
  label: any;
};
type LabelConfigProps = {
  label?: any;
  index?: number;
  children?: ReactNode;
};
type ImageLabelType = {
  url: string;
  children?: ReactNode;
};

type ChildProps = {
  children: ReactNode;
};

const ActivityLabel = ({ label = {} }: ActivityLabelProps) => {
  return <View style={styles.container}>{itemsExtract(JSON.parse(label))}</View>;
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
    case WekaEditorType.attachment:
      return <Attachment label={label} />;
    case WekaEditorType.text:
      return <TextContent label={label.text}></TextContent>;
    case WekaEditorType.paragraph:
      return <View>{children}</View>;
    case WekaEditorType.doc:
      return <View>{children}</View>;
    case WekaEditorType.video:
    case WekaEditorType.linkBlock:
    case WekaEditorType.linkMedia:
      return <Video label={label} />;
    case WekaEditorType.image: {
      return <ImageWrapper url={label.attrs.url} style={styles.imageContainer} />;
    }
    case WekaEditorType.bulletList: {
      return <BulletList>{children}</BulletList>;
    }
    case WekaEditorType.listItem: {
      return <ListItem>{children}</ListItem>;
    }
    case WekaEditorType.orderedList: {
      return (
        <OderList label={label} index={index}>
          {children}
        </OderList>
      );
    }
    case WekaEditorType.emoji: {
      return <Emoji label={label} />;
    }
    case WekaEditorType.hashtag: {
      return <Hashing label={label} />;
    }
    case WekaEditorType.mention: {
      return <Mention label={label} />;
    }
    case WekaEditorType.ruler: {
      return <Ruler label={label} />;
    }
    case WekaEditorType.heading: {
      return <Heading>{children}</Heading>;
    }
    case WekaEditorType.audio: {
      return <Audio label={label} />;
    }
    default:
      return null;
  }
};

const Attachment = ({ label = {} }: ActivityLabelProps) => {
  return <ImageWrapper url={label.attrs.url} style={styles.imageContainer} />;
};

const Video = ({ label = {} }: ActivityLabelProps) => {
  return (
    <View>
      <View style={{ marginBottom: margins.marginXS }}>
        {label.attrs.title && (
          <Text numberOfLines={2} style={styles.videoTitle}>
            {label.attrs.title}
          </Text>
        )}
        <View style={styles.videoContainer}>
          <VideoController url={label.attrs.url} />
        </View>
        <Text style={styles.videoDescription}>{label.attrs.description}</Text>
      </View>
    </View>
  );
};

const Audio = ({ label = {} }: ActivityLabelProps) => {
  return (
    <View style={styles.textWrapViewContainer}>
      <Text style={styles.labelText}>{label.type}</Text>
    </View>
  );
};

const BulletList = ({ children }: LabelConfigProps) => {
  return (
    <View style={styles.listContainer}>
      <Text style={styles.list}>•</Text>
      {children}
    </View>
  );
};

const OderList = ({ children, index }: LabelConfigProps) => {
  return (
    <View style={styles.listContainer}>
      <Text style={styles.list}>{index! + 1}.</Text>
      {children}
    </View>
  );
};

const ListItem = ({ children }: ChildProps) => {
  return <View>{children}</View>;
};

const Emoji = ({ label }: any = {}) => {
  let emo = String.fromCodePoint(parseInt(textAttributes.short_code_prefix + label.attrs.shortcode));
  return (
    <View style={styles.textWrapViewContainer}>
      <Text style={styles.labelText}>{emo}</Text>
    </View>
  );
};

const Hashing = ({ label = {} }: LabelConfigProps) => {
  return (
    <View style={styles.textWrapViewContainer}>
      <Text style={styles.labelText}>{label.attrs.text}</Text>
    </View>
  );
};

const Heading = ({ children }: ChildProps) => {
  return <View>{children}</View>;
};

const Mention = ({ label = {} }: LabelConfigProps) => {
  return (
    <View style={styles.textWrapViewContainer}>
      <Text style={styles.labelText}>{label.attrs.display}</Text>
    </View>
  );
};

const Ruler = ({ label = {} }: LabelConfigProps) => {
  return (
    <View style={styles.textWrapViewContainer}>
      <Text style={styles.labelText}>{label.type}</Text>
    </View>
  );
};

export default ActivityLabel;
