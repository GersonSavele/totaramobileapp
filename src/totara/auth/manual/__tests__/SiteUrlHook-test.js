/**
 * This file is part of Totara Enterprise.
 *
 * Copyright (C) 2019 onwards Totara Learning Solutions LTD
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

import { useSiteUrl } from "../SiteUrlHook";
import { renderHook } from "@testing-library/react-hooks";
import { act } from "react-test-renderer";

describe("SiteUrlHook", () => {
  it("should be an error if blank address", () => {
    const { result } = renderHook(
      ({ siteUrl, onSiteUrlSuccess }) => useSiteUrl({ siteUrl: siteUrl, onSiteUrlSuccess: onSiteUrlSuccess }),
      { initialProps: { siteUrl: undefined } }
    );

    act(() => {
      result.current.onSubmit("");
    });

    expect(result.current.siteUrlState).toMatchObject({
      inputSiteUrlStatus: "invalidUrl"
    });
  });

  it("should be an error for invalid address", () => {
    const invalidUrl = "dafl";
    const { result } = renderHook(
      ({ siteUrl, onSiteUrlSuccess }) => useSiteUrl({ siteUrl: siteUrl, onSiteUrlSuccess: onSiteUrlSuccess }),
      { initialProps: { siteUrl: invalidUrl } }
    );

    act(() => {
      result.current.onSubmit(invalidUrl);
    });

    expect(result.current.siteUrlState).toMatchObject({
      inputSiteUrlStatus: "invalidUrl"
    });
  });

  // it("should be a success for a valid address", () => {
  //   const validUrl = "https://abc.com";
  //   const successMock = jest.fn((data) => {
  //     expect(data).toBe(validUrl);
  //   });
  //   const { result } = renderHook(
  //     ({ siteUrl, onSiteUrlSuccess }) => useSiteUrl({ siteUrl: siteUrl, onSiteUrlSuccess: onSiteUrlSuccess }),
  //     {
  //       initialProps: {
  //         siteUrl: validUrl,
  //         onSiteUrlSuccess: successMock
  //       }
  //     }
  //   );

  //   act(() => {
  //     result.current.onSubmit(validUrl);
  //   });

  //   expect(result.current.siteUrlState).toMatchObject({
  //     inputSiteUrlStatus: "success",
  //     inputSiteUrl: validUrl
  //   });
  // });

  it("should use the initial address if it is present with a protocol", () => {
    const validUrl = "https://abc.com";
    const successMock = jest.fn((data) => {
      expect(data).toBe(validUrl);
    });
    const { result } = renderHook(
      ({ siteUrl, onSiteUrlSuccess }) => useSiteUrl({ siteUrl: siteUrl, onSiteUrlSuccess: onSiteUrlSuccess }),
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
      ({ siteUrl, onSiteUrlSuccess }) => useSiteUrl({ siteUrl: siteUrl, onSiteUrlSuccess: onSiteUrlSuccess }),
      { initialProps: { siteUrl: "abc.com", onSiteUrlSuccess: successMock } }
    );

    expect(result.current.siteUrlState).toMatchObject({
      inputSiteUrl: "abc.com"
    });
  });

  // it("should add the protocol when it not present and address is valid", () => {
  //   const validUrl = "https://abc.com";
  //   const successMock = jest.fn((data) => {
  //     expect(data).toBe(validUrl);
  //   });
  //   const { result } = renderHook(
  //     ({ siteUrl, onSiteUrlSuccess }) => useSiteUrl({ siteUrl: siteUrl, onSiteUrlSuccess: onSiteUrlSuccess }),
  //     { initialProps: { siteUrl: "abc.com", onSiteUrlSuccess: successMock } }
  //   );

  //   act(() => {
  //     result.current.onSubmit(validUrl);
  //   });

  //   expect(result.current.siteUrlState).toMatchObject({
  //     inputSiteUrl: validUrl
  //   });
  // });

  it("should change address while changing", () => {
    const { result } = renderHook(
      ({ siteUrl, onSiteUrlSuccess }) => useSiteUrl({ siteUrl: siteUrl, onSiteUrlSuccess: onSiteUrlSuccess }),
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
