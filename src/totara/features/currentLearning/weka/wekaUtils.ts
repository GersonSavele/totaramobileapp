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

export interface Visitor<T>{
  visitWekaRoot(element: WekaRoot): T
  visitWekaParagraph(element: WekaParagraph): T
  visitWekaText(element: WekaText): T
  visitHeader(element: WekaHeading): T
 }

 export interface Node{
   accept(v: Visitor<Element>): Element 
   content? : Node[]
 }
 
 class WekaNode implements Node {
  content: Node[];
  constructor(content: Node[]){
    this.content=content;
  }
  accept(v: Visitor<Element>): Element {
    return v;
  }
 }

 class WekaRoot extends WekaNode implements Node{
  accept(v: Visitor<Element>): Element {
    return v.visitWekaRoot(this);
  }
}

 class WekaParagraph extends WekaNode implements Node{
  accept(v: Visitor<Element>): Element {
    return v.visitWekaParagraph(this);
  }
}

class WekaHeading extends WekaNode implements Node{
  accept(v: Visitor<Element>): Element {
    return v.visitHeader(this);
  }
}

class WekaText implements Node{
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

    [WekaEditorType.heading]: (content) => {
    return new WekaHeading(jsonObjectToWekaNodes(content));
  },

  [WekaEditorType.text]: (item) => {
    return new WekaText(item.text, item.type);
  }
};

const jsonObjectToWekaNodes = (data): Node[] => {
  const dataArray = Array.isArray(data.content) ? data.content : data
    return dataArray && dataArray.map((item: any ) => {
      const { type, content, attrs } = item;
      if (type === WekaEditorType.text){
        return mapTypeToNode[type](item, attrs);
      }
      return content && mapTypeToNode[type] ? mapTypeToNode[type](content) : null;
    });
}

const wrappedWekaNodes = (nodes: Node[]): WekaRoot => {
  const res = new WekaRoot(nodes);
  return res;
}

export {  wrappedWekaNodes, jsonObjectToWekaNodes, WekaRoot, WekaParagraph, WekaHeading, WekaText };