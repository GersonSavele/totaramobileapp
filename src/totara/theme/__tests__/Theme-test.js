/**
 * This file is part of Totara Mobile
 *
 * Copyright (C) 2019 onwards Totara Learning Solutions LTD
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @author: Kamala Tennakoon <kamala.tennakoon@totaralearning.com>
 */

import { applyTheme } from "../Theme";

describe("Set default and custom theme", () => {
  it("All theme colors and dependant styles should be applied with new theme", () => {
    const newCustomizeTheme = {
      urlLogo: "http://urlLogo.png",
      colorText: "colorText",
      colorPrimary: "colorPrimary",
      colorAccent: "colorAccent",
      colorSecondary1: "colorSecondary1",
      colorSecondary2: "colorSecondary2",
      colorSecondary3: "colorSecondary3",
      colorSecondary4: "colorSecondary4",

      colorInfo: "colorInfo",
      colorSuccess: "colorSuccess",
      colorWarning: "colorWarning",
      colorAlert: "colorAlert",
      colorHighlight: "colorHighlight",

      colorNeutral1: "colorNeutral1",
      colorNeutral2: "colorNeutral2",
      colorNeutral3: "colorNeutral3",
      colorNeutral4: "colorNeutral4",
      colorNeutral5: "colorNeutral5",
      colorNeutral6: "colorNeutral6",
      colorNeutral7: "colorNeutral7",
      colorNeutral8: "colorNeutral8",

      textColorDark: "textColorDark",
      textColorSecondary: "textColorSecondary",
      textColorLight: "textColorLight",
      textColorSubdued: "textColorSubdued",
      textColorDisabled: "textColorDisabled",

      navigationHeaderTintColor: "navigationHeaderTintColor"
    };

    const newTheme = applyTheme(newCustomizeTheme);

    expect(newTheme.colorPrimary).toBe("colorPrimary");
    expect(newTheme.colorText).toBe("colorText");
    expect(newTheme.tabBarActiveTintColor).toBe("colorPrimary");

    expect(newTheme.colorAccent).toBe("colorAccent");
    expect(newTheme.viewContainer.backgroundColor).toBe("colorAccent");
    expect(newTheme.colorSecondary1).toBe("colorSecondary1");
    expect(newTheme.colorSecondary2).toBe("colorSecondary2");
    expect(newTheme.colorSecondary3).toBe("colorSecondary3");
    expect(newTheme.colorSecondary4).toBe("colorSecondary4");

    expect(newTheme.colorInfo).toBe("colorInfo");
    expect(newTheme.colorSuccess).toBe("colorSuccess");
    expect(newTheme.colorWarning).toBe("colorWarning");
    expect(newTheme.colorAlert).toBe("colorAlert");
    expect(newTheme.colorHighlight).toBe("colorHighlight");

    expect(newTheme.colorNeutral1).toBe("colorNeutral1");
    expect(newTheme.colorNeutral2).toBe("colorNeutral2");
    expect(newTheme.colorNeutral3).toBe("colorNeutral3");
    expect(newTheme.colorNeutral4).toBe("colorNeutral4");
    expect(newTheme.colorNeutral5).toBe("colorNeutral5");
    expect(newTheme.tabBarInactiveTintColor).toBe("colorNeutral5");

    // expect(newTheme.textColorDark).toBe("textColorDark");
    // expect(newTheme.textH1.color).toBe("textColorDark");
    // expect(newTheme.textH2.color).toBe("textColorDark");
    // expect(newTheme.textH3.color).toBe("textColorDark");
    // expect(newTheme.textH4.color).toBe("textColorDark");
    //
    // //expect(newTheme.textB1.color).toBe("textColorDark");
    // expect(newTheme.textB2.color).toBe("textColorDark");
    // expect(newTheme.textB3.color).toBe("textColorDark");
    //
    // expect(newTheme.textSmall.color).toBe("textColorDark");
    // expect(newTheme.textLabel.color).toBe("textColorDark");

    expect(newTheme.textColorSecondary).toBe("textColorSecondary");
    expect(newTheme.textColorLight).toBe("textColorLight");
    expect(newTheme.textColorSubdued).toBe("textColorSubdued");
    expect(newTheme.textColorDisabled).toBe("textColorDisabled");

    expect(newTheme.navigationHeaderTintColor).toBe(
      "navigationHeaderTintColor"
    );
  });

  it("Advanced setting for tabbar theme without apply general theme", () => {
    const newCustomizeTheme = {
      colorPrimary: "colorPrimary",
      colorText: "colorText",
      colorNeutral5: "colorNeutral5",
      tabBarInactiveTintColor: "tabBarInactiveTintColor",
      tabBarActiveTintColor: "tabBarActiveTintColor"
    };
    const newTheme = applyTheme(newCustomizeTheme);
    expect(newTheme.colorPrimary).toBe("colorPrimary");
    expect(newTheme.colorText).toBe("colorText");
    expect(newTheme.tabBarActiveTintColor).toBe("tabBarActiveTintColor");

    expect(newTheme.colorNeutral5).toBe("colorNeutral5");
    expect(newTheme.tabBarInactiveTintColor).toBe("tabBarInactiveTintColor");
  });
});
