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
 * @author Jun Yamog <jun.yamog@totaralearning.com
 */

import { useWebviewFlow, steps } from "../WebviewFlow";
import { renderHook, act } from '@testing-library/react-hooks'

describe("useWebviewFlow", () => {
  it("should setupSecret uri and go to next step", () => {

    const { result } = renderHook(() => useWebviewFlow());

    act(() => {
      result.current.onSuccessfulUri("https://success.com");
    });

    expect(result.current.step).toBe(steps.webviewLogin);
    expect(result.current.setupSecret).toMatchObject({
      uri: "https://success.com",
      secret: undefined
    })
  });

  it("should be on step done when url and secret is valid", () => {
    const onLoginSuccess = jest.fn((setupSecret) => {
      expect(setupSecret.uri).toBe("https://success.com");
      expect(setupSecret.secret).toBe("theSecret");
    });

    const { result } = renderHook(({onLoginSuccess}) => useWebviewFlow({onLoginSuccess: onLoginSuccess}), {initialProps: {onLoginSuccess: onLoginSuccess}});

    act(() => {
      result.current.onSuccessfulUri("https://success.com");
    });

    act( () => {
      result.current.onSuccessfulSecret("theSecret");
    });

    expect(result.current.step).toBe(steps.done);
    expect(onLoginSuccess).toBeCalledTimes(1);
  })

});