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
import { unzip } from 'react-native-zip-archive';
import { Platform } from "react-native";

const downloadSCORMPackage = (apiKey: string, courseId: string, scormId: string, resourceUrl: string) => {
  const offlineSCORMPackageName = getOfflineSCORMPackageName(courseId, scormId);
  const downloadingFilePath = `${SCORMPackageDownloadPath}/${offlineSCORMPackageName}.zip`;
  const downloaderOptions = { 
    fromUrl: resourceUrl, 
    toFile: downloadingFilePath, 
    background: true, 
    progressDivider: 10, 
    headers: { Authorization: `Bearer ${apiKey}`}
  };

  return RNFS.downloadFile(downloaderOptions).promise;
}

const unzipSCORMPackageToServer = (courseId: string, scormId: string) => {
  const offlineSCORMPackageName = getOfflineSCORMPackageName(courseId, scormId);
  const downloadedFilePath = `${SCORMPackageDownloadPath}/${offlineSCORMPackageName}.zip`;
  const destinationUnzip = `${SCORMWebPlayerPath}/${offlineSCORMPackageName}`;

  return unzip(downloadedFilePath, destinationUnzip);
}

const initializeSCORMWebplayer = () => {
  return RNFS.mkdir(SCORMWebPlayerPath).then(() => {
    const getPackageContent = () => (Platform.OS === "android") ? RNFS.readDirAssets(SCORMPlayerPackagePath) : RNFS.readDir(SCORMPlayerPackagePath);
    return getPackageContent().then(result => {
        if (result && result.length) {
          let promisesToCopyFiles = [];
          for (let i = 0; i < result.length; i++) {
            const itemPathFrom = result[i].path;
            const itemPathTo = `${SCORMWebPlayerPath}/${result[i].name}`;
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

const getOfflineSCORMPackageName = (courseId: string, scormId: string) => `OfflineSCORM_${courseId}_${scormId}`;
const SCORMPackageDownloadPath = `${RNFS.DocumentDirectoryPath}`;
const SCORMWebPlayerPath = `${RNFS.DocumentDirectoryPath}/html`; 
const SCORMPlayerPackagePath = Platform.OS === 'android' ? 'html' : RNFS.MainBundlePath + '/html';


export { initializeSCORMWebplayer, downloadSCORMPackage, unzipSCORMPackageToServer, SCORMWebPlayerPath, getOfflineSCORMPackageName }
//TODO - remove following code
/*
------- usage ----
downloadSCORMPackage("2", "13", "http://10.0.8.139/totara/mobile/pluginfile.php/110/mod_scorm/package/1/complexscorm.zip")
  .then(response => { 
    console.log('Package downloaded with response: ',response);  
    if (response.statusCode === 200) {
      return unzipSCORMPackageToServer("2", "13").then(unzipPath => console.log("unzip path: ", unzipPath));
    } else {
      throw new Error(`Invalid response code ${response.statusCode}`);
    }
  });

  initializeSCORMWebplayer().then(copied => {
    console.log("copied...", copied);
  }).catch(e => console.log("Its error>>>>> ", e));
*/