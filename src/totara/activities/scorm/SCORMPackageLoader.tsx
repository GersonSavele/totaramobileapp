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
import React, { useState, useEffect } from "react";
import { Text } from "react-native";

import {ScormActivity} from "@totara/types";
import { downloadSCORMPackage } from "./offline/SCORMFileHandler";
import { setSCORMPackageData } from "./offline/StorageHelper";

type Props = {
  activity: ScormActivity
}

export const SCORMPackageLoader = ({ activity }: Props) => {
  const [action, setAction] = useState("download");

  if(action === "download") {
    console.log("Action: ", action);
    setAction("Downloading...");
    downloadSCORMPackage("2", "13", "http://10.0.8.139/totara/mobile/pluginfile.php/110/mod_scorm/package/1/complexscorm.zip")
    .then(response => {
      if (response.statusCode === 200) {
        setAction("Downlaad completed...");
        return setSCORMPackageData("13", activity).then(()=> {
          setAction("Initial data saved.");
        })
      } else {
        throw new Error(`Invalid response code ${response.statusCode}`);
      }
    }).catch(e=> {
      setAction("Error: ", e);
    });
  }

  console.log("action: ", action);
  return (
  <Text>{action}</Text>
  )
};

export default SCORMPackageLoader;