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

import { Visitor, Node, WekaRoot, WekaParagraph, WekaList, WekaEmoji, WekaText } from "./WekaUtils";
/*
@ Class : this class use for node tree operator and implementing abstract method of visitor interface
*/
class ToShortSummary implements Visitor<string> {
  visitWekaList(element: WekaList): string {
    return this.allListItems(element.content);
  }
  visitWekaEmoji(element: WekaEmoji): string {
    return this.all(element.content);
  }
  visitWekaRoot(element: WekaRoot): string {
    return this.all(element.content);
  }
  visitWekaParagraph(element: WekaParagraph): string {
    return this.all(element.content);
  }
  visitWekaText(element: WekaText): string {
    return element.text;
  }
  all(content: Node[]): string {
    let stringArray =
      content &&
      content.map((item) => {
        return item && item.accept(this);
      });
    return stringArray.filter(String).join("\n").toString().trim();
  }
  allListItems(content: Node[]): string {
    let stringArray =
      content &&
      content.map((item) => {
        console.log("print 00000", item.accept(this));
        return (item && ("-- " + item.accept(this)));
      });
    return stringArray.filter(String).join("\n").toString().trim();
  }
}

export { ToShortSummary };
