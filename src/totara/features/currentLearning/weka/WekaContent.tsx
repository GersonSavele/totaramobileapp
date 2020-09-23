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
import { AuthContext } from "@totara/core";
import { AUTHORIZATION } from "@totara/lib/constants";
import { textAttributes, margins, fontWeights, fontStyles, marksTypes } from "@totara/theme/constants";
import { WekaEditorType } from "../constants";
import styles from "./wekaContentStyle";
import { TotaraTheme } from "@totara/theme/Theme";
import { ImageWrapper } from "@totara/components";
import { getHostnameFromRegex, getUrlLastComponentFromRegex } from "@totara/lib/tools";
import { NAVIGATION } from "@totara/lib/navigation";
import { AppState } from "@totara/types";
const { WEBVIEW_ACTIVITY } = NAVIGATION;
import NavigationService from "@totara/lib/navigationService";

enum HostName {
  youtube = "www.youtube.com",
  vimeo = "vimeo.com"
}

const VIMEO_URL_PREFIX = "https://player.vimeo.com/video/";

let color = {
  backGroundColor: "",
  textColor: TotaraTheme.colorNeutral8
};

const navigateWebView = (url, onRequestClose) => {
  const {
    authContextState: { appState }
  } = useContext(AuthContext);

  const { apiKey } = appState as AppState;
  const props = { uri: url, apiKey, backAction: onRequestClose };
  return NavigationService.navigate(WEBVIEW_ACTIVITY, props);
};

type WekaContentProps = {
  content: any;
  backGroundColor?: string;
  textColor?: string;
};
type ConfigProps = {
  content?: any;
  index?: number;
  attrs?: any;
  children?: (index: number) => void;
};

const WekaContent = ({ content = {}, backGroundColor, textColor }: WekaContentProps) => {
  if (backGroundColor) {
    color.backGroundColor = backGroundColor!;
  }
  if (textColor) {
    color.textColor = textColor!;
  }
  try {
    return (
      <View style={[styles.container, { backgroundColor: color.backGroundColor }]}>
        <ContentExtract content={JSON.parse(content)} />
      </View>
    );
  } catch (e) {
    return null;
  }
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

const Configuration = ({ content = {}, attrs }: ConfigProps) => {
  switch (content.type) {
    case WekaEditorType.heading:
    case WekaEditorType.paragraph:
      return <TextContentWrapper content={content} />;
    case WekaEditorType.listItem:
      return <ListItem content={content.content && content.content} />;
    case WekaEditorType.text:
      return <TextView content={content} attrs={attrs} />;
    case WekaEditorType.attachment:
      return <Attachment content={content.content && content.content} />;
    case WekaEditorType.video:
    case WekaEditorType.linkBlock:
    case WekaEditorType.linkMedia:
      return <LinkMedia content={content} />;
    case WekaEditorType.image:
      return <ImageViewerWrapper content={content} />;
    case WekaEditorType.bulletList:
      return <BulletList content={content.content && content.content} />;
    case WekaEditorType.orderedList:
      return <OderList content={content.content && content.content} />;
    case WekaEditorType.emoji:
      return <Emoji content={content} />;
    case WekaEditorType.mention:
      return <Link text={content.attrs.display} />;
    case WekaEditorType.hashtag:
      return <Link text={content.attrs.text} />;
    case WekaEditorType.ruler:
      return <Ruler />;
    default:
      return null;
  }
};

const TextContentWrapper = ({ content = {} }: ConfigProps) => {
  return (
    <Text style={styles.textContainerWrapper}>
      {content.content &&
        content.content.map((nestedContent: any = {}, index: number) => {
          return <Configuration key={index} content={nestedContent} attrs={content.attrs} />;
        })}
    </Text>
  );
};

const TextView = ({ attrs = {}, content = {} }: ConfigProps) => {
  const [visible, setIsVisible] = useState(false);
  const onRequestClose = () => setIsVisible(!visible);
  const font =
    attrs.level === 1
      ? { ...TotaraTheme.textHeadline, color: color.textColor }
      : attrs.level == 2
      ? { ...TotaraTheme.textMedium, color: color.textColor }
      : { ...TotaraTheme.textRegular, color: color.textColor };

  const fontItalic =
    content.marks &&
    content.marks.map((marks: any = {}) => {
      return marks.type === marksTypes.italic && { fontStyle: fontStyles.fontStyleItalic };
    });
  const fontBold =
    content.marks &&
    content.marks.map((marks: any = {}) => {
      return marks.type === marksTypes.bold && { fontWeight: fontWeights.fontWeightBold };
    });
  const link =
    content.marks &&
    content.marks.map((marks: any = {}) => {
      return marks.type === marksTypes.link && { marks };
    });

  return (
    <Text>
      <Text
        style={[font, fontItalic, fontBold, link && link[0] && styles.textLink]}
        testID="test_rich_text"
        onPress={link && onRequestClose}>
        {content.text}
      </Text>
      {visible && link && link[0] && navigateWebView(link[0].marks.attrs.href, onRequestClose)}
    </Text>
  );
};

const OderList = ({ content = {} }: ConfigProps) => {
  return (
    <ListWrapper content={content}>
      {(index) => <Text style={[styles.list, { color: color.textColor }]}>{index! + 1}.</Text>}
    </ListWrapper>
  );
};

const BulletList = ({ content = {} }: ConfigProps) => {
  return (
    <ListWrapper content={content}>
      {() => <Text style={[styles.list, { color: color.textColor }]}>•</Text>}
    </ListWrapper>
  );
};

const ListItem = ({ content = {} }: ConfigProps) => {
  return <ListWrapper content={content} />;
};

const ListWrapper = ({ content = {}, children }: ConfigProps) => {
  return (
    <View>
      {Array.isArray(content) &&
        content.map((nestedContent: any = {}, index: number) => {
          return (
            <View style={styles.listContainer} key={index} testID="test_list_content">
              {children && children(index)}
              <Configuration key={index} content={nestedContent} attrs={content.attrs} />
            </View>
          );
        })}
    </View>
  );
};

const Emoji = ({ content = {} }: ConfigProps) => {
  let emoji = String.fromCodePoint(parseInt(textAttributes.short_code_prefix + content.attrs.shortcode));
  return (
    <Text style={styles.emoji} testID={"test_emoji"}>
      {emoji}
    </Text>
  );
};

// To Do : MOB-754,  Mention is not working as expected behaviour, it should link with user profile when user click on mention name
// To Do : MOB-754, Hashtag can appear only, it could not be tapped
const Link = ({ text }: { text: string }) => {
  return <Text style={styles.textLink}>{text}</Text>;
};

const Ruler = () => {
  return <View style={styles.ruler} />;
};

const Attachment = ({ content = {} }: ConfigProps) => {
  const [visible, setIsVisible] = useState(false);
  const onRequestClose = () => setIsVisible(!visible);
  return content.map((nestedContent: any = {}, index: number) => {
    return (
      <TouchableOpacity style={styles.attachmentTouchable} key={index} onPress={onRequestClose}>
        <Text style={styles.attachmentFileName}>{nestedContent.attrs.filename}</Text>
        {/* To Do: Implementation of the attachment has not done yet */}
        {visible && navigateWebView(nestedContent.attrs.url, onRequestClose)}
      </TouchableOpacity>
    );
  });
};

const ImageViewerWrapper = ({ content = {} }: ConfigProps) => {
  const [visible, setIsVisible] = useState(false);
  const onRequestClose = () => setIsVisible(!visible);
  const {
    authContextState: { appState }
  } = useContext(AuthContext);

  const { apiKey } = appState as AppState;
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

const LinkMedia = ({ content = {} }: ConfigProps) => {
  const {
    authContextState: { appState }
  } = useContext(AuthContext);
  const { apiKey } = appState as AppState;
  return (
    <View>
      <View style={{ marginBottom: margins.marginXS }}>
        {content.attrs.title && (
          <Text numberOfLines={2} style={[styles.linkMediaTitle, { color: color.textColor }]} testID="test_media_title">
            {content.attrs.title}
          </Text>
        )}
        <View style={styles.linkMediaContainer} testID="test_media_content">
          <WebViewWrapper url={content.attrs.url} apiKey={apiKey} />
        </View>
        <Text style={[styles.linkMediaDescription, { color: color.textColor }]} testID="test_media_description">
          {content.attrs.description}
        </Text>
      </View>
    </View>
  );
};

type WebViewWrapperProps = {
  url: string;
  apiKey: string;
};

const WebViewWrapper = ({ url = "", apiKey }: WebViewWrapperProps) => {
  const hostName = getHostnameFromRegex(url);
  // App only support for youtube and vimeo video insert link, and there is configuration for make a full screen video
  hostName === HostName.youtube && (url = url.split("watch?v=").join("embed/"));
  hostName === HostName.vimeo && (url = VIMEO_URL_PREFIX + getUrlLastComponentFromRegex(url));

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
export { TextView, ContentExtract, ListWrapper, Emoji, LinkMedia, WebViewWrapper };
export default WekaContent;
