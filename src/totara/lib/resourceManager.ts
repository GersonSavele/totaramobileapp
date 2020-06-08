/**
 *
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
 */

/**
 * Resource manager has the responsibility of downloading, unzipping and deleting stored files/folder in the device phone
 * It handles this files using react-native-fs and react-native-zip-archive
 * It MUST NOT HANDLE any specific business related file
 * It MUST NOT HANDLE any async storage operation
 * */
import { unzip, subscribe } from "react-native-zip-archive";

import {
  DownloadBeginCallbackResult,
  downloadFile,
  DownloadProgressCallbackResult,
  unlink,
  resumeDownload,
  exists
} from "react-native-fs";
import { Resource } from "@totara/types";
import { store } from "../store";
import { ResourceState, ResourceType } from "@totara/types/Resource";
import { uuid } from "@totara/lib/tools";

const updateStore = (payload) => {
  store.dispatch({
    type: "UPDATE_RESOURCE",
    payload: payload
  });
};

const onDownloadBegin = (id: string, res: DownloadBeginCallbackResult) => {
  updateStore({
    id: id,
    jobId: res.jobId,
    state: ResourceState.Downloading,
    sizeInBytes: res.contentLength,
    bytesDownloaded: 0
  });
};

const onDownloadProgress = (
  id: string,
  res: DownloadProgressCallbackResult
) => {
  updateStore({
    id: id,
    jobId: res.jobId,
    state: ResourceState.Downloading,
    bytesDownloaded: res.bytesWritten
  });
};

/**
 *
 * @param apiKey
 * @param id
 * @param name
 * @param resourceUrl
 * @param targetPathFile - it is full path of temporary download file
 * @param targetExtractPath - unzip path location of the file
 */
type downloadProps = {
  apiKey: string;
  customId: string;
  type: ResourceType;
  name: string;
  resourceUrl: string;
  targetPathFile: string;
  targetExtractPath: string;
};

const download = ({
  apiKey,
  customId,
  type,
  name,
  resourceUrl,
  targetPathFile,
  targetExtractPath
}: downloadProps) => {
  const id = uuid();

  const downloaderOptions = {
    fromUrl: resourceUrl,
    toFile: targetPathFile,
    begin: (res) => {
      onDownloadBegin(id, res);
    },
    progress: (res) => {
      onDownloadProgress(id, res);
    },
    background: true,
    progressDivider: 20,
    headers: { Authorization: `Bearer ${apiKey}` }
  };

  const _downloadFile = downloadFile(downloaderOptions);
  //DISPATCH TO REDUX
  store.dispatch({
    type: "ADD_RESOURCE",
    payload: {
      id: id,
      customId: customId,
      type: type,
      jobId: _downloadFile.jobId,
      name: name
    } as Resource
  });

  //download
  _downloadFile.promise
    .then((response) => {
      if (response.statusCode === 200) {
        updateStore({
          id: id,
          state: ResourceState.Completed
        });

        subscribe(({ progress, filePath }) => {
          // the filePath is always empty on iOS for zipping.
          console.log(`progress: ${progress}\nprocessed at: ${filePath}`);
        });

        return unzip(targetPathFile, targetExtractPath);
      } else {
        updateStore({
          id: id,
          state: ResourceState.Errored
        });
      }
    })
    .then((unzipped) => {
      updateStore({
        id: id,
        unzipPath: unzipped
      });
      return exists(targetPathFile);
    })
    .then((fileExists) => {
      if (fileExists) return unlink(targetPathFile);
    });
  return _downloadFile.jobId;
};

const deleteResource = (ids: string[]) => {
  const list = store.getState().resourceReducer.resources;
  const filtered = list.filter((x) => ids.indexOf(x.id) >= 0 && x.unzipPath);
  return Promise.all(
    filtered.map(async (x) => {
      if (await exists(x.unzipPath)) {
        return unlink(x.unzipPath);
      }
    })
  );
};

const resumeDownloads = () => {
  const resources = store.getState().resourceReducer.resources;
  const statesForResume = [
    ResourceState.Added,
    ResourceState.Errored,
    ResourceState.Downloading
  ];
  const filteredJobId = resources
    .filter((resource) =>
      statesForResume.some((state) => state === resource.state)
    )
    .map((resource) => resource.jobId);

  filteredJobId.forEach((id) => {
    resumeDownload(id);
  });
};

const ResourceManager = {
  download,
  deleteResource,
  resumeDownloads
};

export default ResourceManager;
