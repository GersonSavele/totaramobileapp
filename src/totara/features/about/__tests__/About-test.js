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

import { render } from "@testing-library/react-native";
import React from "react";
import AboutStack from "@totara/features/about/AboutStack";
import About from "@totara/features/about/About";
import { createAppContainer } from "react-navigation";

const renderWithNavigation = () => {
  const App = createAppContainer(AboutStack);
  return {
    ...render(<App />)
  };
};

describe("About", () => {
  test("Should render with AboutStack", async() => {
    const { container } = renderWithNavigation();
    expect(container).toBeTruthy();
  });

  test("Should render About view", async() => {
    const { container } = render(<About />);
    expect(container).toBeTruthy();
  });
});
