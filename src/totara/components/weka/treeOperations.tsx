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

import { textAttributes } from '@totara/theme/constants';
import type { ReactNode } from 'react';
import React from 'react';
import { Text, View } from 'react-native';

import type {
  Node,
  Visitor,
  WekaAttachment,
  WekaBulletList,
  WekaEmoji,
  WekaHeading,
  WekaImage,
  WekaLinkMedia,
  WekaList,
  WekaOrderList,
  WekaParagraph,
  WekaRoot,
  WekaText,
  WekaVideo
} from './wekaUtils';
const BULLET_POINT_UNICODE = '\u2022';
import { margins } from '@totara/theme/constants';

import Attachment from './Attachment';
import EmbeddedMedia from './EmbeddedMedia';
import ImageViewerWrapper from './ImageViewerWrapper';
import LinkMedia from './LinkMedia';
import TextContentWrapper from './TextContentWrapper';
import styles from './wekaStyle';

const { marginS } = margins;

/*
@ Class : this class use for node tree operator and implementing abstract method of visitor interface
*/
class ToShortSummary implements Visitor<string> {
  visitWekaVideo(): string {
    return '';
  }
  visitWekaRuler(): string {
    return '';
  }
  visitWekaAttachment(): string {
    return '';
  }
  visitWekaLinkMedia(): string {
    return '';
  }
  visitWekaImage(): string {
    return '';
  }
  visitWekaBulletList(element: WekaBulletList): string {
    return element?.content
      ?.map(item => {
        return `${BULLET_POINT_UNICODE} ${item?.accept(this)}`;
      })
      .filter(String)
      .join('\n')
      .toString()
      .trim();
  }
  visitWekaOrderList(element: WekaOrderList): string {
    return element?.content
      ?.map((item, index) => {
        return (index + 1).toString() + '. ' + item?.accept(this);
      })
      .filter(String)
      .join('\n')
      .toString()
      .trim();
  }
  visitHeader(element: WekaHeading): string {
    return this.all(element.content);
  }
  visitWekaList(element: WekaList): string {
    return this.all(element.content);
  }
  visitWekaEmoji(element: WekaEmoji): string {
    return String.fromCodePoint(parseInt(textAttributes.short_code_prefix + element.shortCode));
  }
  visitWekaRoot(element: WekaRoot): string {
    return this.all(element.content);
  }
  visitWekaParagraph(element: WekaParagraph): string {
    return element?.content
      ?.map(item => {
        return item?.accept(this);
      })
      .filter(String)
      .join('')
      .toString()
      .trim();
  }
  visitWekaText(element: WekaText): string {
    return element.text;
  }
  all(content: Node<Object>[]): string {
    let stringArray = content?.map(item => {
      return item?.accept(this);
    });
    return stringArray.filter(String).join('\n').toString().trim();
  }
}

class ToFullSummary implements Visitor<Object> {
  visitWekaVideo(element: WekaVideo): Object {
    return <EmbeddedMedia content={element.content} title="Video" />;
  }

  visitWekaRuler(): Object {
    return <View style={styles.ruler} />;
  }

  visitWekaAttachment(element: WekaAttachment): Object {
    return <Attachment content={element.content} />;
  }

  visitWekaLinkMedia(element: WekaLinkMedia): Object {
    return <LinkMedia content={{ attrs: element.attrs }} />;
  }

  visitWekaList(element: WekaList): Object {
    return this.all(element.content);
  }

  visitWekaBulletList(element: WekaBulletList): Object {
    return element?.content?.map((item, index) => {
      return this.listItem({ mark: BULLET_POINT_UNICODE, component: item?.accept(this), key: `${index}` });
    });
  }

  visitWekaOrderList(element: WekaOrderList): Object {
    return element?.content?.map((item, index) => {
      return this.listItem({ mark: `${index + 1}.`, component: item?.accept(this), key: `${index}` });
    });
  }

  listItem({ mark, component, key }: { mark: string; component?: Object; key?: string }): Object {
    return (
      <View style={styles.listItemWrapper} key={key}>
        <Text style={styles.listItem}>{mark}</Text>
        <View style={styles.listItemContent}>{component as ReactNode}</View>
      </View>
    );
  }

  visitWekaEmoji(element: WekaEmoji): Object {
    let emoji = String.fromCodePoint(parseInt(textAttributes.short_code_prefix + element.shortCode));
    return <Text style={styles.emoji}>{emoji}</Text>;
  }

  visitHeader(element: WekaHeading): Object {
    return (
      <Text style={{ marginBottom: marginS }}>
        {element.content?.map((item, index) => {
          return <Text key={`${index}`}> {item?.accept(this) as ReactNode}</Text>;
        })}
      </Text>
    );
  }

  visitWekaImage(element: WekaImage): Object {
    return <ImageViewerWrapper fileName={element.fileName} url={element.url} />;
  }

  visitWekaParagraph(element: WekaParagraph): Object {
    const paragraph = element?.content?.map((item, index) => {
      return <Text key={`${index}`}>{item?.accept(this) as ReactNode}</Text>;
    });
    return <Text style={{ marginBottom: marginS }}>{paragraph}</Text>;
  }

  visitWekaText(element: WekaText): Object {
    return <TextContentWrapper attrs={element.attrs} text={element.text} marks={element.marks} />;
  }

  visitWekaRoot(element: WekaRoot): Object {
    return this.all(element.content);
  }

  all(content: Node<Object>[]): Object {
    return (
      <View>
        {content?.map((item, index) => {
          return <View key={`${index}`}>{item?.accept(this) as ReactNode}</View>;
        })}
      </View>
    );
  }
}

export { ToFullSummary, ToShortSummary };
