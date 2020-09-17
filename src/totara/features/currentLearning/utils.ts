import { includes } from "lodash";

const extractTargetId = (id) => {
  return includes(id, "_") ? id.split("_")[1] : id;
};

export { extractTargetId };
