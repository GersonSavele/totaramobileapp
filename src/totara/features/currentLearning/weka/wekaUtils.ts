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

import { WekaEditorType } from "../constants";

interface Visitor<T> {
  visitWekaRoot(element: WekaRoot): T;
  visitWekaParagraph(element: WekaParagraph): T;
  visitWekaList(element: WekaList): T;
  visitWekaBulletList(element: WekaBulletList): T;
  visitWekaOrderList(element: WekaOrderList): T;
  visitWekaEmoji(element: WekaEmoji): T;
  visitHeader(element: WekaHeading): T;
  visitWekaText(element: WekaText): T;
}

interface Node {
  accept(v: Visitor<Element>): Element;
  content?: Node[];
}

class WekaNode implements Node {
  content: Node[];
  constructor(content: Node[]) {
    this.content = content;
  }
  accept(v: Visitor<Element>): Element {
    return v;
  }
}

class WekaRoot extends WekaNode implements Node {
  accept(v: Visitor<Element>): Element {
    return v.visitWekaRoot(this);
  }
}

class WekaParagraph extends WekaNode implements Node {
  accept(v: Visitor<Element>): Element {
    return v.visitWekaParagraph(this);
  }
}

class WekaBulletList extends WekaNode implements Node {
  accept(v: Visitor<Element>): Element {
    return v.visitWekaBulletList(this);
  }
}

class WekaOrderList extends WekaNode implements Node {
  accept(v: Visitor<Element>): Element {
    return v.visitWekaOrderList(this);
  }
}

class WekaHeading extends WekaNode implements Node {
  accept(v: Visitor<Element>): Element {
    return v.visitHeader(this);
  }
}

class WekaList extends WekaNode implements Node {
  accept(v: Visitor<Element>): Element {
    return v.visitWekaList(this);
  }
}

class WekaEmoji implements Node {
  shortCode: string;
  constructor(shortcode) {
    this.shortCode = shortcode;
  }
  accept(v: Visitor<Element>): Element {
    return v.visitWekaEmoji(this);
  }
}

class WekaText implements Node {
  text: string;
  attrs: any;
  constructor(text, attrs) {
    this.text = text;
    this.attrs = attrs;
  }
  accept(v: Visitor<Element>): Element {
    return v.visitWekaText(this);
  }
}

const mapTypeToNode = {
  [WekaEditorType.paragraph]: (content) => {
    return new WekaParagraph(jsonObjectToWekaNodes(content));
  },

  [WekaEditorType.bulletList]: (content) => {
    return new WekaBulletList(jsonObjectToWekaNodes(content));
  },

  [WekaEditorType.orderedList]: (content) => {
    return new WekaOrderList(jsonObjectToWekaNodes(content));
  },

  [WekaEditorType.listItem]: (content) => {
    return new WekaList(jsonObjectToWekaNodes(content));
  },

  [WekaEditorType.emoji]: (shortcode) => {
    return new WekaEmoji(shortcode);
  },

  [WekaEditorType.text]: (item) => {
    return new WekaText(item.text, item.type);
  },

  [WekaEditorType.heading]: (content) => {
    return new WekaHeading(jsonObjectToWekaNodes(content));
  }
};

const jsonObjectToWekaNodes = (data: any): Node[] => {
  const dataArray = Array.isArray(data.content) ? data.content : data;
  return (
    dataArray &&
    dataArray.map((item: any) => {
      const { type, content, attrs } = item;
      if (type === WekaEditorType.text) {
        return mapTypeToNode[type](item, attrs);
      }
      if (type === WekaEditorType.emoji) {
        return mapTypeToNode[type](attrs.shortcode);
      }
      return content && mapTypeToNode[type] ? mapTypeToNode[type](content) : null;
    })
  );
};

const wrappedWekaNodes = (nodes: Node[]): WekaRoot => {
  const res = new WekaRoot(nodes);
  return res;
};

// Disable eslint for interface so we can export without warnings.
export {
  // eslint-disable-next-line no-undef
  Visitor,
  // eslint-disable-next-line no-undef
  Node,
  wrappedWekaNodes,
  jsonObjectToWekaNodes,
  WekaRoot,
  WekaParagraph,
  WekaText,
  WekaList,
  WekaEmoji,
  WekaOrderList,
  WekaBulletList,
  WekaHeading
};
