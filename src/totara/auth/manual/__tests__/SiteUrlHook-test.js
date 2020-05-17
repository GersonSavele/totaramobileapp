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

import { useSiteUrl } from "../SiteUrlHook";
import { renderHook } from "@testing-library/react-hooks";
import { act } from "react-test-renderer";

describe("SiteUrlHook", () => {
  it("should be an error if blank address", () => {
    const { result } = renderHook(
      ({ siteUrl, onSiteUrlSuccess }) =>
        useSiteUrl({ siteUrl: siteUrl, onSiteUrlSuccess: onSiteUrlSuccess }),
      { initialProps: { siteUrl: undefined } }
    );

    act(() => {
      result.current.onSubmit("");
    });

    expect(result.current.siteUrlState).toMatchObject({
      inputSiteUrlStatus: "error"
    });
  });

  it("should be an error for invalid address", () => {
    const invalidUrl = "dafl";
    const { result } = renderHook(
      ({ siteUrl, onSiteUrlSuccess }) =>
        useSiteUrl({ siteUrl: siteUrl, onSiteUrlSuccess: onSiteUrlSuccess }),
      { initialProps: { siteUrl: invalidUrl } }
    );

    act(() => {
      result.current.onSubmit(invalidUrl);
    });

    expect(result.current.siteUrlState).toMatchObject({
      inputSiteUrlStatus: "error"
    });
  });

  it("should be a success for a valid address", () => {
    const validUrl = "https://abc.com";
    const successMock = jest.fn((data) => {
      expect(data).toBe(validUrl);
    });
    const { result } = renderHook(
      ({ siteUrl, onSiteUrlSuccess }) =>
        useSiteUrl({ siteUrl: siteUrl, onSiteUrlSuccess: onSiteUrlSuccess }),
      {
        initialProps: {
          siteUrl: validUrl,
          onSiteUrlSuccess: successMock
        }
      }
    );

    act(() => {
      result.current.onSubmit(validUrl);
    });

    expect(result.current.siteUrlState).toMatchObject({
      inputSiteUrlStatus: "success",
      inputSiteUrl: validUrl
    });
  });

  it("should use the initial address if it is present with a protocol", () => {
    const validUrl = "https://abc.com";
    const successMock = jest.fn((data) => {
      expect(data).toBe(validUrl);
    });
    const { result } = renderHook(
      ({ siteUrl, onSiteUrlSuccess }) =>
        useSiteUrl({ siteUrl: siteUrl, onSiteUrlSuccess: onSiteUrlSuccess }),
      {
        initialProps: {
          siteUrl: validUrl,
          onSiteUrlSuccess: successMock
        }
      }
    );

    expect(result.current.siteUrlState).toMatchObject({
      inputSiteUrl: validUrl
    });
  });

  it("should use the initial address as it is without a protocol", () => {
    const validUrl = "https://abc.com";
    const successMock = jest.fn((data) => {
      expect(data).toBe(validUrl);
    });
    const { result } = renderHook(
      ({ siteUrl, onSiteUrlSuccess }) =>
        useSiteUrl({ siteUrl: siteUrl, onSiteUrlSuccess: onSiteUrlSuccess }),
      { initialProps: { siteUrl: "abc.com", onSiteUrlSuccess: successMock } }
    );

    expect(result.current.siteUrlState).toMatchObject({
      inputSiteUrl: "abc.com"
    });
  });

  it("should add the protocol when it not present and address is valid", () => {
    const validUrl = "https://abc.com";
    const successMock = jest.fn((data) => {
      expect(data).toBe(validUrl);
    });
    const { result } = renderHook(
      ({ siteUrl, onSiteUrlSuccess }) =>
        useSiteUrl({ siteUrl: siteUrl, onSiteUrlSuccess: onSiteUrlSuccess }),
      { initialProps: { siteUrl: "abc.com", onSiteUrlSuccess: successMock } }
    );

    act(() => {
      result.current.onSubmit(validUrl);
    });

    expect(result.current.siteUrlState).toMatchObject({
      inputSiteUrl: validUrl
    });
  });

  it("should change address while changing", () => {
    const { result } = renderHook(
      ({ siteUrl, onSiteUrlSuccess }) =>
        useSiteUrl({ siteUrl: siteUrl, onSiteUrlSuccess: onSiteUrlSuccess }),
      { initialProps: { siteUrl: undefined } }
    );

    act(() => {
      result.current.onChangeInputSiteUrl("pqr.com");
    });

    expect(result.current.siteUrlState).toMatchObject({
      inputSiteUrl: "pqr.com"
    });
  });
});
