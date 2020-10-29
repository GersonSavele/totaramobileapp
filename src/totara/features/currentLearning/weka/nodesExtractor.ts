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

import { Visitor, Node, WekaRoot, WekaParagraph, WekaHeading, WekaText} from "./WekaUtils";

class ToText implements Visitor<string>{
  visitWekaRoot(element: WekaRoot): string {
    return this.all(element.content);
  }
  visitWekaParagraph(element: WekaParagraph): string {
    return this.all(element.content);
  }
  visitHeader(element: WekaHeading): string {
    return this.all(element.content);
  }
  visitWekaText(element: WekaText): string {
    return element.text;
  }
  all(content: Node[]): any {
   return content && content.map(( item ) => {
    return item && item.accept(this);
    }).join("\n").toString()
  }
 }

 export {ToText}