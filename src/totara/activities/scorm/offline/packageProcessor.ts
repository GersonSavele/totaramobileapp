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

import * as RNFS from "react-native-fs";
import { isEmpty } from "lodash";
const xpath = require("xpath");
const dom = require("xmldom").DOMParser;

import { Sco, Package } from "@totara/types/Scorm";

const getScormPackageData = (packagPath: string) => {
  const manifestFilePath = `${packagPath}/imsmanifest.xml`;
  return RNFS.readFile(manifestFilePath).then((xmlcontent) => {
    if (!isEmpty(xmlcontent)) {
      const xmlData = new dom().parseFromString(xmlcontent);
      const scosList = getScosDataForPackage(xmlData);
      const defaultSco = getInitialScormLoadData(xmlData);
      if (!isEmpty(scosList))
        return { scos: scosList, defaultSco: defaultSco } as Package;
    }
  });
};

/**
 * Based on the schema of SCORM 1.2 manifest file, it can be found here
 * https://scorm.com/wp-content/assets/SchemaDefinitionFiles/SCORM%201.2%20Schema%20Definition/imsmanifest.xml
 *
 * @param manifestDom
 */
const getScosDataForPackage = (manifestDom: any) => {
  const resultOrganisations = xpath.evaluate(
    // "//*[local-name(.)='organizations']/*[local-name()='organization']",
    "//*[local-name(.)='organizations']/*[local-name()='organization']",
    manifestDom, // contextNode
    null, // namespaceResolver
    xpath.XPathResult.ANY_TYPE, // resultType
    null // result
  );
  let organizationNode;
  let scos: [Sco?] = [];
  while ((organizationNode = resultOrganisations.iterateNext())) {
    const organizationId = organizationNode.getAttribute("identifier");
    const itemResult = xpath.evaluate(
      ".//*[local-name(.)='item']/@identifier",
      organizationNode,
      null,
      xpath.XPathResult.ANY_TYPE,
      null
    );
    let itemNode;
    while ((itemNode = itemResult.iterateNext())) {
      const itemId = itemNode.nodeValue;
      const valLaunchUrl = getDefaultScoLaunchUrl(
        manifestDom,
        itemNode.nodeValue
      );
      if (itemId && valLaunchUrl && organizationId) {
        const sco: Sco = {
          id: itemId,
          organizationId: organizationId,
          launchSrc: valLaunchUrl
        };
        scos.push(sco);
      }
    }
  }
  return scos;
};

const getInitialScormLoadData = (manifestDom: any) => {
  const defaultOrgizationsNode = xpath.select(
    "//*[local-name(.)='organizations']/*[local-name(.)='organization']/@identifier",
    manifestDom
  );
  let defaultOrgizationId: string | undefined;
  if (!isEmpty(defaultOrgizationsNode)) {
    if (defaultOrgizationsNode.length === 1) {
      defaultOrgizationId = defaultOrgizationsNode[0].nodeValue;
    } else {
      const defaultOrgNode = xpath.select(
        "//*[local-name(.)='organizations']/@default",
        manifestDom
      );
      if (!isEmpty(defaultOrgNode) && !isEmpty(defaultOrgNode[0].nodeValue)) {
        const tempDefaultOrg = defaultOrgNode[0].nodeValue;
        for (let i = 0; i < defaultOrgizationsNode.length; i++) {
          if (defaultOrgizationsNode[i].nodeValue === tempDefaultOrg) {
            defaultOrgizationId = tempDefaultOrg;
            break;
          }
        }
      }
      if (!defaultOrgizationId) {
        defaultOrgizationId = defaultOrgizationsNode[0].nodeValue;
      }
    }
  }
  let defaultScoId: string | undefined;
  let defaultLaunchSrc: string | undefined;
  if (!isEmpty(defaultOrgizationId)) {
    const firstScoOnDefaultOrgNode = xpath.select(
      "//*[local-name(.)='organizations']/*[local-name(.)='organization' and @identifier='" +
        defaultOrgizationId +
        "']/*[local-name(.)='item'][1]",
      manifestDom
    );
    if (firstScoOnDefaultOrgNode && firstScoOnDefaultOrgNode.length === 1) {
      defaultScoId = firstScoOnDefaultOrgNode[0].getAttribute("identifier");
      defaultLaunchSrc = getDefaultScoLaunchUrl(manifestDom, defaultScoId!);
    }
  }
  return {
    id: defaultScoId,
    organizationId: defaultOrgizationId,
    launchSrc: defaultLaunchSrc
  };
};

const getDefaultScoLaunchUrl = (manifestDom: any, scoId: string) => {
  const scoNode = xpath.select(
    "//*[local-name(.)='item' and @identifier ='" + scoId + "']",
    manifestDom
  );
  if (scoNode.length === 1) {
    const resouceId = scoNode[0].getAttribute("identifierref");
    const queryString = scoNode[0].getAttribute("parameters");
    const resourceNode = xpath.select(
      "//*[local-name(.)='resources']/*[local-name(.)='resource' and @identifier ='" +
        resouceId +
        "']",
      manifestDom
    );
    if (
      resourceNode &&
      resourceNode.length === 1 &&
      resourceNode[0].getAttribute("href")
    ) {
      return `${resourceNode[0].getAttribute("href")}${queryString}`;
    }
  }
};

export { getScormPackageData };
