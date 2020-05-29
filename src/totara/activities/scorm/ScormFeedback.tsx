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
