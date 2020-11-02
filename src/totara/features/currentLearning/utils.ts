import { includes } from "lodash";
import { learningItemEnum } from "@totara/features/currentLearning/constants";

const extractTargetId = (id) => {
  return includes(id, "_") ? id.split("_")[1] : id;
};

const sortByDueDateThenTypeThenFullName = (toBeSorted) => {
  return toBeSorted.sort((a, b) => {
    if (a.duedate != null && (b.duedate === null || a.duedate < b.duedate)) return -1;
    if (a.duedate != null && (b.duedate === null || a.duedate > b.duedate)) return 1;
    if (
      a.itemtype === learningItemEnum.Certification &&
      (b.itemtype === learningItemEnum.Program || b.itemtype === learningItemEnum.Course)
    )
      return -1;
    if (a.itemtype === learningItemEnum.Program) {
      if (b.itemtype === learningItemEnum.Course) return -1;
      else if (b.itemtype === learningItemEnum.Certification) return 1;
    }
    if (
      a.itemtype === learningItemEnum.Course &&
      (b.itemtype === learningItemEnum.Certification || b.itemtype === learningItemEnum.Program)
    )
      return 1;
    if (a.fullname < b.fullname) return -1;
    if (a.fullname > b.fullname) return 1;
    else return 0;
  });
};

export { extractTargetId, sortByDueDateThenTypeThenFullName };
