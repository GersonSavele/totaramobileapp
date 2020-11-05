import { includes } from "lodash";
import { learningItemEnum } from "@totara/features/currentLearning/constants";
import {
  sortBy} from "lodash";

const extractTargetId = (id) => {
  return includes(id, "_") ? id.split("_")[1] : id;
};

const sortByDueDateThenTypeThenFullName = (toBeSorted) => {

  const typesForSorting = {
    [learningItemEnum.Certification]: 1,
    [learningItemEnum.Program]: 2,
    [learningItemEnum.Course]: 3,
  }

  const withItemTypeMapped = toBeSorted.map(x=>{
    return {
      ...x,
      itemTypeMapped: typesForSorting[x.itemtype]
    }
  });

  return sortBy(withItemTypeMapped, ['duedate', 'itemTypeMapped', 'fullname']);
};

export { extractTargetId, sortByDueDateThenTypeThenFullName };
