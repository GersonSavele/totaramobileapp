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

import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import ImageView from "react-native-image-viewing";
import { WebView } from "react-native-webview";
import { NavigationContext } from "react-navigation";
import { AuthContext } from "@totara/core";
import { AUTHORIZATION } from "@totara/lib/constants";
import { textAttributes, margins, fontWeights, fontStyle, marksType } from "@totara/theme/constants";
import { WekaEditorType } from "../constants";
import styles from "./wekaEditorStyle";
import { TotaraTheme } from "@totara/theme/Theme";
import { ImageWrapper } from "@totara/components";
import { getHostnameFromRegex, getUrlLastComponentFromRegex } from "@totara/lib/tools";
import { navigateTo, NAVIGATION } from "@totara/lib/navigation";
const { WEBVIEW_ACTIVITY } = NAVIGATION;

enum HostName {
  youtube = "www.youtube.com",
  vimeo = "vimeo.com"
}

const vimeoUrlPrefix = "https://player.vimeo.com/video/";

type WekaEditorProps = {
  content: any;
};
type EditorConfigProps = {
  content?: any;
  index?: number;
  attrs?: any;
};

const WekaEditor = ({ content = {} }: WekaEditorProps) => {
  return (
    <View style={styles.container}>
      <ContentExtract content={JSON.parse(content)} />
    </View>
  );
};

const ContentExtract = ({ content = [] }: any) => {
  return !content ? (
    <View style={styles.docWrap}>
      <Configuration content={content} />
    </View>
  ) : (
    content.content.map((nestedContent: any = {}, index: number) => {
      return <Configuration key={index} content={nestedContent} attrs={content.attrs} />;
    })
  );
};

const Configuration = ({ content = {}, attrs }: EditorConfigProps) => {
  switch (content.type) {
    case WekaEditorType.heading:
    case WekaEditorType.paragraph:
      return <TextContentWrapper content={content} />;
    case WekaEditorType.listItem:
      return <ListItem content={content} />;
    case WekaEditorType.text:
      return <TextView content={content} attrs={attrs} />;
    case WekaEditorType.attachment:
      return <Attachment content={content} />;
    case WekaEditorType.video:
    case WekaEditorType.linkBlock:
    case WekaEditorType.linkMedia:
      return <LinkMedia content={content} />;
    case WekaEditorType.image:
      return <ImageViewerWrapper content={content} />;
    case WekaEditorType.bulletList:
      return <BulletList content={content} />;
    case WekaEditorType.orderedList:
      return <OderList content={content} />;
    case WekaEditorType.emoji: {
      return <Emoji content={content} />;
    }
    case WekaEditorType.mention: {
      return <Mention content={content} />;
    }
    case WekaEditorType.ruler: {
      return <Ruler />;
    }
    case WekaEditorType.hashtag: {
      return <Hashtag content={content} />;
    }
    default:
      return null;
  }
};

const TextContentWrapper = ({ content = {} }: EditorConfigProps) => {
  return (
    <Text style={styles.textContainerWrapper}>
      {content.content &&
        content.content.map((nestedContent: any = {}, index: number) => {
          return <Configuration key={index} content={nestedContent} attrs={content.attrs} />;
        })}
    </Text>
  );
};

const TextView = ({ attrs = {}, content = {} }: EditorConfigProps) => {
  const [visible, setIsVisible] = useState(false);
  const onRequestClose = () => setIsVisible(!visible);
  const fontWeight =
    attrs.level === 1
      ? { ...TotaraTheme.textH3, color: TotaraTheme.colorNeutral8 }
      : attrs.level == 2
      ? { ...TotaraTheme.textHeadline, color: TotaraTheme.colorNeutral8 }
      : { ...TotaraTheme.textRegular, color: TotaraTheme.colorNeutral8 };

  const fontItalic =
    content.marks &&
    content.marks.map((marks: any = {}) => {
      return marks.type === marksType.italic && { fontStyle: fontStyle.fontStyleItalic };
    });
  const fontBold =
    content.marks &&
    content.marks.map((marks: any = {}) => {
      return marks.type === marksType.bold && { fontWeight: fontWeights.fontWeightBold };
    });
  const link =
    content.marks &&
    content.marks.map((marks: any = {}) => {
      return marks.type === marksType.link && { marks };
    });
  return (
    <Text>
      <Text
        style={[fontWeight, fontItalic, fontBold, link && link[0] && styles.textLink]}
        onPress={link && onRequestClose}>
        {content.text}
      </Text>
      {visible && link && link[0] && navigateWebView(link[0].marks.attrs.href, onRequestClose)}
    </Text>
  );
};

const OderList = ({ content = {} }: EditorConfigProps) => {
  return (
    <View style={{ flexDirection: "column" }}>
      {content.content &&
        content.content.map((nestedContent: any = {}, index: number) => {
          return (
            <View style={styles.listContainer} key={index}>
              <Text style={styles.list}>{index! + 1}.</Text>
              <Configuration key={index} content={nestedContent} attrs={content.attrs} />
            </View>
          );
        })}
    </View>
  );
};

const BulletList = ({ content = {} }: EditorConfigProps) => {
  return (
    <ListWrapper content={content}>
      <Text style={styles.list}>•</Text>
    </ListWrapper>
  );
};

const ListItem = ({ content = {} }: EditorConfigProps) => {
  return <ListWrapper content={content} />;
};

const ListWrapper = ({ content = {}, children }: any) => {
  return (
    <View style={{ flexDirection: "column" }}>
      {content.content &&
        content.content.map((nestedContent: any = {}, index: number) => {
          return (
            <View style={styles.listContainer} key={index}>
              {children}
              <Configuration key={index} content={nestedContent} attrs={content.attrs} />
            </View>
          );
        })}
    </View>
  );
};

const Emoji = ({ content = {} }: EditorConfigProps) => {
  let emoji = String.fromCodePoint(parseInt(textAttributes.short_code_prefix + content.attrs.shortcode));
  return <Text style={styles.emoji}>{emoji}</Text>;
};

// To Do : Mention is not working as expected behavior, it should link with user profile when user click on mention name
const Mention = ({ content = {} }: EditorConfigProps) => {
  return <Text style={styles.textLink}>{content.attrs.display}</Text>;
};

// To Do: Hashtag can appear only, it could not be tapped
const Hashtag = ({ content = {} }: EditorConfigProps) => {
  return <Text style={styles.textLink}>{content.attrs.text}</Text>;
};

const Ruler = () => {
  return <View style={styles.ruler} />;
};

const Attachment = ({ content = {} }: EditorConfigProps) => {
  const [visible, setIsVisible] = useState(false);
  const onRequestClose = () => setIsVisible(!visible);
  return (
    content.content &&
    content.content.map((nestedContent: any = {}, index: number) => {
      return (
        <TouchableOpacity style={styles.attachmentTouchable} key={index} onPress={onRequestClose}>
          <Text style={styles.attachmentFileName}>{nestedContent.attrs.filename}</Text>
          {visible && navigateWebView(nestedContent.attrs.url, onRequestClose)}
        </TouchableOpacity>
      );
    })
  );
};

const navigateWebView = (url, onRequestClose) => {
  const navigation = useContext(NavigationContext);
  const {
    authContextState: { appState }
  } = useContext(AuthContext);

  const apiKey = appState!.apiKey;
  return navigateTo({
    navigate: navigation.navigate,
    routeId: WEBVIEW_ACTIVITY,
    props: {
      uri: url,
      apiKey,
      backAction: onRequestClose
    }
  });
};

const ImageViewerWrapper = ({ content = {} }: EditorConfigProps) => {
  const [visible, setIsVisible] = useState(false);
  const onRequestClose = () => setIsVisible(!visible);
  const {
    authContextState: { appState }
  } = useContext(AuthContext);
  const apiKey = appState!.apiKey;
  const images = [
    {
      uri: content.attrs.url,
      headers: {
        [AUTHORIZATION]: `Bearer ${apiKey}`
      }
    }
  ];
  return (
    <TouchableOpacity style={styles.imageContainer} onPress={onRequestClose}>
      <ImageWrapper url={content.attrs.url} style={styles.imageContainer} />
      {visible && <ImageView images={images} imageIndex={0} visible={visible} onRequestClose={onRequestClose} />}
    </TouchableOpacity>
  );
};

const LinkMedia = ({ content = {} }: EditorConfigProps) => {
  return (
    <View>
      <View style={{ marginBottom: margins.marginXS }}>
        {content.attrs.title && (
          <Text numberOfLines={2} style={styles.linkMediaTitle}>
            {content.attrs.title}
          </Text>
        )}
        <View style={styles.linkMediaContainer}>
          <WebViewWrapper url={content.attrs.url} />
        </View>
        <Text style={styles.linkMediaDescription}>{content.attrs.description}</Text>
      </View>
    </View>
  );
};

const WebViewWrapper = ({ url = "" }: { url: string }) => {
  const hostName = getHostnameFromRegex(url);
  // App only support for youtube and vimeo video insert link, and there is configuration for make a full screen video
  hostName === HostName.youtube && (url = url.split("watch?v=").join("embed/"));
  hostName === HostName.vimeo && (url = vimeoUrlPrefix + getUrlLastComponentFromRegex(url));
  const {
    authContextState: { appState }
  } = useContext(AuthContext);
  const apiKey = appState!.apiKey;
  return (
    <WebView
      style={styles.webViewWrapper}
      javaScriptEnabled={true}
      domStorageEnabled={false}
      originWhitelist={["*"]}
      allowsInlineMediaPlayback={true}
      source={{
        uri: url,
        headers: {
          [AUTHORIZATION]: `Bearer ${apiKey}`
        }
      }}
    />
  );
};

export default WekaEditor;
