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

export enum ResourceState {
  Added,
  Errored,
  Waiting,
  Downloading,
  Completed,
  Deleted
}

export interface Resource {
  id: string;
  jobId: number;
  name: string;
  sizeInBytes: number;
  resourceUrl: string;
  hash: string;
  unzipPath: string;
  bytesDownloaded: number;
  state?: ResourceState;
  selected: boolean; //FOR VIEW STATE CONTROL
}
