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

import React from "react";
import { Text } from "react-native";
import { useQuery } from "@apollo/react-hooks";
import { scormQuery } from "@totara/activities/scorm/api";

import SCORMFeedbackModal from "../components/SCORMFeedbackModal";
import { ActivityType } from "@totara/types";

type Props = {
  activity: ActivityType;
  onClose: () => void;
  onPrimary: () => void;
};

const OnlineSCORMFeedback = ({ activity, onClose, onPrimary }: Props) => {
  const { loading, error, data } = useQuery(scormQuery, {
    variables: { scormid: activity.instanceid }
  });
  if (loading) {
    return <Text>Loading...</Text>;
  }
  if (error) {
    return <Text>Something went wrong, please try again later.</Text>;
  }
  if (data && data.scorm) {
    return (<SCORMFeedbackModal grade={data.scorm.calculatedGrade} score={data.scorm.calculatedGrade} method={"grade"} onClose={onClose} onPrimary={onPrimary} />);
  } else {
    return <Text>Something went wrong, please try again later.</Text>;
  }
};

export default OnlineSCORMFeedback;
