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

import {
  Visitor,
  Node,
  WekaRoot,
  WekaParagraph,
  WekaList,
  WekaEmoji,
  WekaText,
  WekaOrderList,
  WekaBulletList,
  WekaHeading
} from "./WekaUtils";
import { textAttributes } from "@totara/theme/constants";
/*
@ Class : this class use for node tree operator and implementing abstract method of visitor interface
*/
class ToShortSummary implements Visitor<string> {
  visitWekaBulletList(element: WekaBulletList): string {
    return element?.content
      ?.map((item) => {
        return "\u2022 " + item?.accept(this);
      })
      .filter(String)
      .join("\n")
      .toString()
      .trim();
  }
  visitWekaOrderList(element: WekaOrderList): string {
    return element?.content
      ?.map((item, index) => {
        return (index + 1).toString() + ". " + item?.accept(this);
      })
      .filter(String)
      .join("\n")
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
      ?.map((item) => {
        return item?.accept(this);
      })
      .filter(String)
      .join("")
      .toString()
      .trim();
  }
  visitWekaText(element: WekaText): string {
    return element.text;
  }
  all(content: Node[]): string {
    let stringArray = content?.map((item) => {
      return item?.accept(this);
    });
    return stringArray.filter(String).join("\n").toString().trim();
  }
}

export { ToShortSummary };
