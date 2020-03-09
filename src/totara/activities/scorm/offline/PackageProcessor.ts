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

import * as RNFS from 'react-native-fs';
const xpath = require('xpath');
const dom = require('xmldom').DOMParser;

import { Sco } from "@totara/types/Scorm";


export const getScormPackageData = (path: string, packagName: string) => {
    const manifestFilePath = `${path}/${packagName}/imsmanifest.xml`;
    return RNFS.readFile(manifestFilePath)
        .then(xmlcontent => {
            const xmlData = new dom().parseFromString(xmlcontent);
            const scosList = getScosDataForPackage(xmlData);
            const defaultSco = getInitialScormLoadData(xmlData);
            return {scos: scosList, defaultSco: defaultSco};
        });
};

const getScosDataForPackage = (manifestDom: any) => {
    const resultOrganisations = xpath.evaluate(
        // "//*[local-name(.)='organizations' and namespace-uri(.)='http://www.imsproject.org/xsd/imscp_rootv1p1p2']/*[local-name()='organization']/*[local-name()='item']/@identifier", // xpathExpression
        "//*[local-name(.)='organizations']/*[local-name()='organization']/@identifier",
        manifestDom, // contextNode
        null, // namespaceResolver
        xpath.XPathResult.ANY_TYPE, // resultType
        null, // result
    );

    let organizationNode = resultOrganisations.iterateNext();
    let scos = [];
    while (organizationNode) {
        const itemResult = xpath.evaluate("//*[local-name(.)='item']/@identifier", organizationNode, null, xpath.XPathResult.ANY_TYPE, null);
        let itemNode = itemResult.iterateNext();
        while (itemNode) {
            const valLaunchUrl = getDefaultScoLaunchUrl(manifestDom, itemNode.nodeValue);
            const sco: Sco = {id: itemNode.nodeValue, organizationId:  organizationNode.nodeValue, launchSrc: valLaunchUrl};
            scos.push(sco);
            itemNode = itemResult.iterateNext();
        }
        organizationNode = resultOrganisations.iterateNext();
    }
    return scos;
};

const getInitialScormLoadData = (manifestDom: any) => {
    const defaultOrgizationsNode = xpath.select("//*[local-name(.)='organizations']/*[local-name(.)='organization']/@identifier", manifestDom);
    let defaultOrgizationId: string | null = null;
    if (defaultOrgizationsNode && defaultOrgizationsNode.length > 0) {
        if (defaultOrgizationsNode.length === 1) {
            defaultOrgizationId = defaultOrgizationsNode[0].nodeValue;
        } else {
            const defaultOrgNode = xpath.select("//*[local-name(.)='organizations']/@default", manifestDom);
            if (defaultOrgNode.length === 1 && defaultOrgNode[0].nodeValue) {
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
    let defaultScoId: string | null = null;
    let defaultLaunchSrc: string | null = null;
    if (defaultOrgizationId !== null) {
        const firstScoOnDefaultOrgNode = xpath.select("//*[local-name(.)='organizations']/*[local-name(.)='organization' and @identifier='"+defaultOrgizationId+"']/*[local-name(.)='item'][1]", manifestDom);
        if (firstScoOnDefaultOrgNode && firstScoOnDefaultOrgNode.length === 1) {
            defaultScoId = firstScoOnDefaultOrgNode[0].getAttribute('identifier');
            defaultLaunchSrc = getDefaultScoLaunchUrl(manifestDom, defaultScoId!);
        }
    }
    return {id: defaultScoId, organizationId: defaultOrgizationId, launchSrc: defaultLaunchSrc};
};

const getDefaultScoLaunchUrl = (manifestDom: any, scoId: string)  => {
    const scoNode = xpath.select("//*[local-name(.)='item' and @identifier ='"+scoId+"']", manifestDom);
    if (scoNode.length === 1) {
        const resouceId = scoNode[0].getAttribute('identifierref');
        const queryString = scoNode[0].getAttribute('parameters');
        const resourceNode = xpath.select("//*[local-name(.)='resources']/*[local-name(.)='resource' and @identifier ='"+resouceId+"']", manifestDom);
        if (resourceNode && resourceNode.length === 1 && resourceNode[0].getAttribute('href') ) {
            return `${resourceNode[0].getAttribute('href')}${queryString}`;
        }
    }
    return null;
};