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
 *
 * @author: Kamala Tennakoon <kamala.tennakoon@totaralearning.com>
 */
import * as RNFS from "react-native-fs";
import { Platform } from "react-native";

import {
  initializeScormWebplayer,
  isScormPlayerInitialized
} from "../offline/fileHandler";

const mockSourceDirContent = ["file1.html", "file2.js", "file3.html"];
const errorMkDir = "Failed to create a new directory";
const errorUnlink = "Failed to delete a file";
const errorIsExistingFile = "Failed find the existing file";
const errorReadingDir = "Failed to get content of the directory";
const errorCoping = "Failed to copy the file";

const mockVoidPromise = (isSuccess, error) =>
  isSuccess
    ? jest.fn(() => Promise.resolve())
    : jest.fn(() => Promise.reject(new Error(error)));

const mockReturnPromise = (isSuccess, data, error) =>
  isSuccess
    ? jest.fn(() => Promise.resolve(data))
    : jest.fn(() => Promise.reject(new Error(error)));

const setupDefaultConfigeMock = ({
  platformOS,
  sourceDirContent = mockSourceDirContent,
  isSuccessMkDir = true,
  isSuccessExists = true,
  isSuccessUnlink = true,
  isSuccessReadDir = true,
  isSuccessCopy = true
}) => {
  Platform.OS = platformOS;
  RNFS.mkdir.mockImplementation(mockVoidPromise(isSuccessMkDir, errorMkDir));
  RNFS.unlink.mockImplementation(mockVoidPromise(isSuccessUnlink, errorUnlink));
  RNFS.exists.mockImplementation(
    mockReturnPromise(isSuccessExists, false, errorIsExistingFile)
  );
  if (Platform.OS === "android") {
    RNFS.readDirAssets.mockImplementation(
      mockReturnPromise(isSuccessReadDir, sourceDirContent, errorReadingDir)
    );
    RNFS.copyFileAssets.mockImplementation(
      mockVoidPromise(isSuccessCopy, errorCoping)
    );
  } else {
    RNFS.readDir.mockImplementation(
      mockReturnPromise(isSuccessReadDir, sourceDirContent, errorReadingDir)
    );
    RNFS.copyFile.mockImplementation(
      mockVoidPromise(isSuccessCopy, errorCoping)
    );
  }
};

describe("initializeScormWebplayer", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should return array of promises copy files in the directory.", async () => {
    setupDefaultConfigeMock({ platformOS: "android" });
    let result;
    result = await initializeScormWebplayer();
    expect(result.length).toBe(mockSourceDirContent.length);

    setupDefaultConfigeMock({ platformOS: "ios" });
    result = await initializeScormWebplayer();
    expect(result.length).toBe(mockSourceDirContent.length);
  });

  it("should throw an error for creating directory, if it fails.", async () => {
    setupDefaultConfigeMock({ platformOS: "android", isSuccessMkDir: false });
    try {
      await initializeScormWebplayer();
    } catch (e) {
      expect(e.message).toBe(errorMkDir);
    }

    setupDefaultConfigeMock({ platformOS: "ios", isSuccessMkDir: false });
    try {
      await initializeScormWebplayer();
    } catch (e) {
      expect(e.message).toBe(errorMkDir);
    }
  });

  it("should throw an error for reading content of directory, if it fails", async () => {
    setupDefaultConfigeMock({ platformOS: "android", isSuccessReadDir: false });
    try {
      await initializeScormWebplayer();
    } catch (e) {
      expect(e.message).toBe(errorReadingDir);
    }

    setupDefaultConfigeMock({ platformOS: "ios", isSuccessReadDir: false });
    try {
      await initializeScormWebplayer();
    } catch (e) {
      expect(e.message).toBe(errorReadingDir);
    }
  });

  it("should throw an error for checking existing file, if it fails", async () => {
    setupDefaultConfigeMock({ platformOS: "android", isSuccessExists: false });
    try {
      await initializeScormWebplayer();
    } catch (e) {
      expect(e.message).toBe(errorIsExistingFile);
    }

    setupDefaultConfigeMock({ platformOS: "ios", isSuccessExists: false });
    try {
      await initializeScormWebplayer();
    } catch (e) {
      expect(e.message).toBe(errorIsExistingFile);
    }
  });
  it("should throw an error for coping file, if it fails", async () => {
    setupDefaultConfigeMock({ platformOS: "android", isSuccessCopy: false });
    try {
      await initializeScormWebplayer();
    } catch (e) {
      expect(e.message).toBe(errorCoping);
    }

    setupDefaultConfigeMock({ platformOS: "ios", isSuccessCopy: false });
    try {
      await initializeScormWebplayer();
    } catch (e) {
      expect(e.message).toBe(errorCoping);
    }
  });

  it("should throw an error if source directory is empty", async () => {
    // For empty directory content
    setupDefaultConfigeMock({ platformOS: "android", sourceDirContent: [] });
    try {
      await initializeScormWebplayer();
    } catch (e) {
      expect(e.message).toBe("Cannot find any content in the location (html)");
    }

    setupDefaultConfigeMock({ platformOS: "ios", sourceDirContent: [] });
    try {
      await initializeScormWebplayer();
    } catch (e) {
      expect(e.message).toBe(
        "Cannot find any content in the location (" +
          RNFS.MainBundlePath +
          "/html)"
      );
    }
    // For null directory content
    setupDefaultConfigeMock({ platformOS: "android", sourceDirContent: null });
    try {
      await initializeScormWebplayer();
    } catch (e) {
      expect(e.message).toBe("Cannot find any content in the location (html)");
    }

    setupDefaultConfigeMock({ platformOS: "ios", sourceDirContent: null });
    try {
      await initializeScormWebplayer();
    } catch (e) {
      expect(e.message).toBe(
        "Cannot find any content in the location (" +
          RNFS.MainBundlePath +
          "/html)"
      );
    }
  });

  it("should remove all existing files before copy, if there any existing files", async (done) => {
    setupDefaultConfigeMock({ platformOS: "android" });
    RNFS.exists.mockImplementation(jest.fn(() => Promise.resolve(true)));

    const resultAndroid = await initializeScormWebplayer();
    expect(RNFS.unlink).toHaveBeenCalledTimes(mockSourceDirContent.length);
    expect(resultAndroid.length).toBe(mockSourceDirContent.length);

    done();

    setupDefaultConfigeMock({ platformOS: "ios" });
    RNFS.exists.mockImplementation(jest.fn(() => Promise.resolve(true)));

    const resultIOS = await initializeScormWebplayer();
    expect(RNFS.unlink).toHaveBeenCalledTimes(mockSourceDirContent.length);
    expect(resultIOS.length).toBe(mockSourceDirContent.length);
    done();
  });
});
describe("isScormPlayerInitialized", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should return false for none existing files in the offline scorm player directory.", async () => {
    setupDefaultConfigeMock({ platformOS: "android" });
    let result;
    result = await isScormPlayerInitialized();
    expect(result).toStrictEqual(false);

    setupDefaultConfigeMock({ platformOS: "ios" });
    result = await isScormPlayerInitialized();
    expect(result).toStrictEqual(false);
  });

  it("should return true if all files existing files in the offline scorm player directory.", async () => {
    setupDefaultConfigeMock({ platformOS: "android" });
    RNFS.exists.mockImplementation(jest.fn(() => Promise.resolve(true)));
    let result;
    result = await isScormPlayerInitialized();
    expect(result).toStrictEqual(true);

    setupDefaultConfigeMock({ platformOS: "ios" });
    RNFS.exists.mockImplementation(jest.fn(() => Promise.resolve(true)));
    result = await isScormPlayerInitialized();
    expect(result).toStrictEqual(true);
  });
  it("should throw an error if source directory is empty", async () => {
    setupDefaultConfigeMock({ platformOS: "android" });
    RNFS.readDirAssets.mockImplementation(jest.fn(() => Promise.resolve([])));
    try {
      await isScormPlayerInitialized();
    } catch (e) {
      expect(e.message).toStrictEqual("No package content found.");
    }

    setupDefaultConfigeMock({ platformOS: "ios" });
    RNFS.readDir.mockImplementation(jest.fn(() => Promise.resolve([])));
    try {
      await isScormPlayerInitialized();
    } catch (e) {
      expect(e.message).toStrictEqual("No package content found.");
    }
  });
});
