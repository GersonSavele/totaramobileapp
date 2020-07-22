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

import { getScormPackageData } from "../offline/packageProcessor";

const packagePath = "/packagePath";
const firstOrg = {
  id: "item_1",
  launchSrc: "index_lms.html",
  organizationId: "adapt_scorm"
};
const secondOrg = {
  id: "second_item_1",
  launchSrc: "second_index_lms.html",
  organizationId: "second_adapt_scorm"
};
const xmlData = ({ defatultOrgId, nextOrg }) =>
  `<?xml version="1.0" encoding="UTF-8"?>
  <manifest identifier="adapt_manifest" version="1" xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2" xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd http://www.imsglobal.org/xsd/imsmd_rootv1p2p1 imsmd_rootv1p2p1.xsd http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">
  <metadata>
  <schema>ADL SCORM</schema>
  <schemaversion>1.2</schemaversion>
  <lom xmlns="http://www.imsglobal.org/xsd/imsmd_rootv1p2p1" xsi:schemaLocation="http://www.imsglobal.org/xsd/imsmd_rootv1p2p1 imsmd_rootv1p2p1.xsd">
    <general>
      <title>
        <langstring xml:lang="x-none"><![CDATA[C003_A015_12 Anatomy of a report]]></langstring>
      </title>
      <description>
        <langstring xml:lang="x-none"><![CDATA[]]></langstring>
       </description>
      </general>
    </lom>
  </metadata>
  <organizations ${defatultOrgId && `default="${defatultOrgId}"`}>
    <organization identifier="${firstOrg.organizationId}">
      <title><![CDATA[C003_A015_12 Anatomy of a report]]></title>
      <item identifier="${firstOrg.id}" isvisible="true" identifierref="res1">
        <title><![CDATA[C003_A015_12 Anatomy of a report]]></title>
      </item>
    </organization>
    ${
      nextOrg &&
      `<organization identifier="${nextOrg.organizationId}"> 
        <title><![CDATA[C003_A015_13 Anatomy of a report]]></title>
        <item identifier="${nextOrg.id}" isvisible="true" identifierref="second_res1">
          <title><![CDATA[C003_A015_13 Anatomy of a report]]></title>
        </item>
      </organization>`
    }
    
  </organizations>
  <resources>
    <resource identifier="res1" type="webcontent" href="${
      firstOrg.launchSrc
    }" adlcp:scormtype="sco">
     <file href="${firstOrg.launchSrc}"/>
    </resource>
    ${
      nextOrg &&
      `<resource identifier="second_res1" type="webcontent" href="${nextOrg.launchSrc}" adlcp:scormtype="sco">
        <file href="${nextOrg.launchSrc}"/>
      </resource>
    `
    }  </resources>
  </manifest>`;
const expectedData = ({ nextOrg = undefined }) => {
  if (nextOrg) {
    return { defaultSco: firstOrg, scos: [firstOrg, secondOrg] };
  }
  return { defaultSco: firstOrg, scos: [firstOrg] };
};
const imsManifestPath = packagePath + "/imsmanifest.xml";

describe("getScormPackageData", () => {
  it("should return correct object for valid menifest xml content", async () => {
    const configInput = {
      nextOrg: secondOrg,
      defatultOrgId: firstOrg.organizationId
    };
    RNFS.readFile.mockImplementation(() => {
      return Promise.resolve(xmlData(configInput));
    });
    const result = await getScormPackageData(packagePath);
    expect(RNFS.readFile).toHaveBeenCalledWith(imsManifestPath);
    expect(result).toMatchObject(expectedData(configInput));
  });

  it("should not return any data for invalid menifest xml content", async () => {
    RNFS.readFile.mockImplementation(() => {
      return Promise.resolve("");
    });
    const resultBlank = await getScormPackageData(packagePath);
    expect(RNFS.readFile).toHaveBeenCalledWith(imsManifestPath);
    expect(resultBlank).toBeUndefined();

    RNFS.readFile.mockImplementation(() => {
      return Promise.resolve();
    });
    const resultUndefined = await getScormPackageData(packagePath);
    expect(RNFS.readFile).toHaveBeenCalledWith(imsManifestPath);
    expect(resultUndefined).toBeUndefined();
  });

  it("should throw an error for file read error", async () => {
    const errorMessage = "This is xml read error";
    RNFS.readFile.mockImplementation(() => {
      return Promise.reject(errorMessage);
    });
    try {
      getScormPackageData(packagePath);
    } catch (e) {
      expect(e).toBe(errorMessage);
    }
  });

  it("should return correct object for valid menifest xml content without default organization", async () => {
    const configInput = {
      nextOrg: secondOrg
    };
    RNFS.readFile.mockImplementation(() => {
      return Promise.resolve(xmlData(configInput));
    });
    const result = await getScormPackageData(packagePath);
    expect(RNFS.readFile).toHaveBeenCalledWith(imsManifestPath);
    expect(result).toMatchObject(expectedData(configInput));
  });

  it("should return single sco for valid menifest xml content with one orgainzation in the organizations without default organization", async () => {
    const configInput = {};
    RNFS.readFile.mockImplementation(() => {
      return Promise.resolve(xmlData(configInput));
    });
    const result = await getScormPackageData(packagePath);
    expect(RNFS.readFile).toHaveBeenCalledWith(imsManifestPath);
    expect(result).toMatchObject(expectedData(configInput));
  });
});
