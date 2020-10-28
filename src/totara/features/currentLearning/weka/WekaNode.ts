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

 interface WekaNode{
   accept(v: Visitor<Element>): Element
   content? : [WekaText]
 }

 interface Visitor<T>{
  visitWekaParagraph(element: WekaParagraph): T
  visitWekaText(element: WekaText): T
  visitWekaRoot(element: WekaRoot): T
 }

 class ToText implements Visitor<string>{
  visitWekaRoot(element: WekaRoot): string {
    return this.all(element.nodes);
  }
  visitWekaParagraph(element: WekaParagraph): string {
    return this.all(element.nodes);
  }
  visitWekaText(element: WekaText): string {
    return element.text;
  }
  all(nodes: WekaNode[]): any {
   return  nodes.map(( node ) => {
    return node.content && node.content.map(( wekaText ) => {
       return this.visitWekaText(wekaText);
     }).toString();
    }).join("\n").toString()
  }
 }

 class WekaParagraph implements WekaNode{
  nodes: WekaNode[];
  constructor(nodes: WekaNode[]){
    this.nodes=nodes;
  }
  accept(v: Visitor<Element>): Element {
    return v.visitWekaParagraph(this);
  }
}
 class WekaRoot implements WekaNode{
  nodes: WekaNode[];
  constructor(nodes: WekaNode[]){
    this.nodes=nodes;
  }
  accept(v: Visitor<Element>): Element {
    return v.visitWekaRoot(this);
  }
}

// class WekaOderList implements WekaNode{
//   nodes: WekaNode[];
//   constructor(nodes: WekaNode[]){
//     this.nodes=nodes;
//   }
//   accept() {
//     throw new Error("Method not implemented.");
//   }
// }

// class WekaListItem implements WekaNode{
//   nodes: WekaNode[];
//   constructor(nodes: WekaNode[]){
//     this.nodes=nodes;
//   }
//   accept() {
//     throw new Error("Method not implemented.");
//   }
// }

class WekaText implements WekaNode{
  text: string;
  type: string;
  constructor(text, type){
    this.text = text;
    this.type = type;
  }
  accept(v: Visitor<Element>): Element {
    return v.visitWekaText(this);
  }
}

const mapTypeToNode = {
  [WekaEditorType.paragraph]: (content) => {
    return new WekaParagraph(jsonObjectToWekaNodes(content));
  },

  // [WekaEditorType.orderedList]: (content) => {
  //   return new WekaOderList(jsonObjectToWekaNodes(content));
  // },

  // [WekaEditorType.listItem]: (content) => {
  //   return new WekaListItem(jsonObjectToWekaNodes(content));
  // },

  [WekaEditorType.text]: (item) => {
    return new WekaText(item.text, item.type);
  }
};

const jsonObjectToWekaNodes = (data): WekaNode[] => {
  return Array.isArray(data) ? data.map((item: any ) => {
    const { type, content, attrs } = item;
    if (type === WekaEditorType.text){
      return mapTypeToNode[type](item, attrs);
    }
    return content && mapTypeToNode[type] ? mapTypeToNode[type](content) : null;
  }) : []
}

const wrappedWekaNodes = (nodes: WekaNode[]): WekaRoot => {
  return new WekaRoot(nodes);
}

export { ToText, wrappedWekaNodes };
export default jsonObjectToWekaNodes;