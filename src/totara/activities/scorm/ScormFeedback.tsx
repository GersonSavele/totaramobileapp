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
import { withNavigation } from "react-navigation";
import { NavigationStackProp } from "react-navigation-stack";
import { NAVIGATION_SCORM_ROOT } from "@totara/lib/constants";

type FeedbackParams = {
  id: string;
  onClose: () => void;
  onPrimary: () => void;
  attempt: number;
  isOnline: boolean;
  gradeMethod: Grade;
  completionScoreRequired?: number;
};

type FeedbackProps = {
  navigation: NavigationStackProp<FeedbackParams>;
};

const ScormFeedback = ({ navigation }: FeedbackProps) => {
  const { id, attempt, gradeMethod, completionScoreRequired } = navigation.state
    .params as FeedbackParams;
  const apolloClient = useApolloClient();

  // TODO - need to remove after complete Online feedback
  // if (isOnline) {
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
  // return null;
  // } else {
  const lastActivityResult = getOfflineLastActivityResult(id, apolloClient);
  const goToSummary = () =>
    navigation.navigate({ routeName: NAVIGATION_SCORM_ROOT });

  if (lastActivityResult && parseInt(lastActivityResult.attempt) === attempt) {
    return (
      <ScormFeedbackModal
        gradeMethod={gradeMethod}
        score={lastActivityResult.gradereported}
        completionScoreRequired={completionScoreRequired}
        onClose={goToSummary}
        onPrimary={goToSummary}
      />
    );
  } else {
    return (
      <ScormFeedbackModal
        gradeMethod={0}
        score={10}
        onClose={goToSummary}
        onPrimary={goToSummary}
      />
    );
  }

  // }
};

export default withNavigation(ScormFeedback);
