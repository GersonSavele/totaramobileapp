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
import { unzip } from "react-native-zip-archive";
import { Platform } from "react-native";

import { config } from "@totara/lib";
// import { downloadPackage } from "@totara/core/ResourceManager/DownloadHandler"
// import { DownloadProgressCallbackResult } from "react-native-fs"

const OfflineSCORMServerRoot = `${RNFS.DocumentDirectoryPath}/${config.rootOfflineScormPlayer}`;

// const downloadSCORMPackage = (apiKey: string, courseId: string, scormId: number, resourceUrl: string) => {
//   const offlineSCORMPackageName = getOfflineSCORMPackageName(courseId, scormId);
//   const downloadingFilePath = `${SCORMPackageDownloadPath}/${offlineSCORMPackageName}.zip`;
//   return downloadPackage(apiKey, resourceUrl, downloadingFilePath, onProgress);
// }

const unzipSCORMPackageToServer = (packageName: string, packageSource: string) => {
  const destinationUnzip = `${OfflineSCORMServerRoot}/${packageName}`;
  return unzip(packageSource, destinationUnzip).then(resultDestination => {
    if (resultDestination) {
      return packageName;
    } else {
      throw new Error("Cannot find unzipped location.");
    }
  });
};

const getPackageContent = () => (Platform.OS === "android") ? RNFS.readDirAssets(SCORMPlayerPackagePath) : RNFS.readDir(SCORMPlayerPackagePath);
  
const initializeSCORMWebplayer = () => {
  return RNFS.mkdir(OfflineSCORMServerRoot).then(() => {
    return getPackageContent().then(result => {
        if (result && result.length) {
          let promisesToCopyFiles = [];
          for (let i = 0; i < result.length; i++) {
            const itemPathFrom = result[i].path;
            const itemPathTo = `${OfflineSCORMServerRoot}/${result[i].name}`;
            const copyAssetsToPlayer =  () => (Platform.OS === "android") ? RNFS.copyFileAssets(itemPathFrom, itemPathTo) : RNFS.copyFile(itemPathFrom, itemPathTo);
            const promiseCopyItem =  RNFS.exists(itemPathTo).then(isExist => { 
              if (!isExist) { 
                return copyAssetsToPlayer();
              } else {
                return RNFS.unlink(itemPathTo).then(() => { 
                  return copyAssetsToPlayer()
                });
              }
            });
            promisesToCopyFiles.push(promiseCopyItem);
          }
          return Promise.all(promisesToCopyFiles);
        } else {
          throw new Error("Cannot find any content in the location ("+SCORMPlayerPackagePath+")");
        }
      })
    }
  );
};

const isSCORMPlayerInitialized = () => {
  return getPackageContent().then(result => {
    if (result && result.length) {
      let promisesToExistFiles = [];
      for (let i = 0; i < result.length; i++) {
        const itemPathTo = `${OfflineSCORMServerRoot}/${result[i].name}`;
        promisesToExistFiles.push(RNFS.exists(itemPathTo));
      }
      return Promise.all(promisesToExistFiles).then(resultExistsFiles => {
        if(resultExistsFiles && resultExistsFiles.length) {
          for(let index = 0; index < resultExistsFiles.length; index++) {
            if (!resultExistsFiles[index]) {
              return false;
            }
          }
          return true;
        } else {
          throw new Error("No files found.");
        }
      });
    } else {
      throw new Error("No package content found.");
    }
  });
};

const getOfflineSCORMPackageName = (courseId: string, scormId: number) => `OfflineSCORM_${courseId}_${scormId}`;
const SCORMPlayerPackagePath = Platform.OS === "android" ? "html" : RNFS.MainBundlePath + "/html";

export { initializeSCORMWebplayer, unzipSCORMPackageToServer, getOfflineSCORMPackageName, isSCORMPlayerInitialized, OfflineSCORMServerRoot };