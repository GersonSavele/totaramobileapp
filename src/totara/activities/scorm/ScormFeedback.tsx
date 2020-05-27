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
import { useApolloClient } from "@apollo/react-hooks";

import { ActivityType } from "@totara/types";
import ScormFeedbackModal from "./components/ScormFeedbackModal";
import { getOfflineLastActivityResult } from "@totara/lib/scorm";
import { Grade } from "@totara/types/Scorm";

type Props = {
  activity: ActivityType;
  onClose: () => void;
  onPrimary: () => void;
  attempt: number;
  isOnline: boolean;
  gradeMethod: Grade;
  completionScoreRequired?: number;
};

const ScormFeedback = ({
  activity,
  onClose,
  onPrimary,
  attempt,
  isOnline,
  gradeMethod,
  completionScoreRequired
}: Props) => {
  const apolloClient = useApolloClient();

  if (isOnline) {
    // TODO - Need to confirm online workflow

    // const { loading, error, data, refetch } = useQuery(scormFeedbackQuery, {
    //   variables: { scormid: activity.instanceid }
    // });
    // if (loading) {
    //   return (
    //     <View style={{ position: "absolute", flex: 1 }}>
    //       <Loading />
    //     </View>
    //   );
    // }
    // if (error) {
    //   return <LoadingError onRefreshTap={refetch} />;
    // }
    // console.log("(data && data.scorm)", data && data.scorm);
    // if (data && data.scorm) {
    //   return (
    //     <ScormFeedbackModal
    //       grade={"0"}
    //       score={"10%"}
    //       method={"0"}
    //       onClose={onClose}
    //       onPrimary={onPrimary}
    //     />
    //   );
    // } else {
    //   return <LoadingError onRefreshTap={refetch} />;
    // }
    return null;
  } else {
    const lastActivityResult = getOfflineLastActivityResult(
      activity.instanceid.toString(),
      apolloClient
    );

    if (
      lastActivityResult &&
      parseInt(lastActivityResult.attempt) === attempt
    ) {
      return (
        <ScormFeedbackModal
          gradeMethod={gradeMethod}
          score={lastActivityResult.gradereported}
          completionScoreRequired={completionScoreRequired}
          onClose={onClose}
          onPrimary={onPrimary}
        />
      );
    } else {
      return null;
    }
  }
};

export default ScormFeedback;
