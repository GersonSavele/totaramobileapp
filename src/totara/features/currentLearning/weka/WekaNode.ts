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



 class WekaNode{

 }



 class WekaParagraph implements WekaNode{
  accept(v: Visitor<Element>) {
    return v.visitWekaParagraph(this);
  }
  nodes: WekaNode[];
  constructor(nodes: WekaNode[]){
    this.nodes=nodes;
  }
}

const mapTypeToNode = {

  [WekaEditorType.paragraph]: (content) => {
    return new WekaParagraph(jsonObjectToWekaNodes(content));
  },

  [WekaEditorType.text]: (item, attrs) => {
    return new WekaText(item, attrs);
  }
};

const jsonObjectToWekaNodes = (data): WekaNode[] => {
  return data.map((item: DataItem = { type: WekaEditorType.empty }) => {
    const { type, content, attrs } = item;
    if (type === WekaEditorType.text){
      return mapTypeToNode[type](item, attrs);
    }
    return content && mapTypeToNode[type] ? mapTypeToNode[type](content) : null;
  })
}


export default WekaParagraph;