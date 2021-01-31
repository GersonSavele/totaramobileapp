const date = {
  Date: () => new Date()
};

const defaultString = {
  String: () => "John Doe"
};

const defaultCoreId = {
  core_id: () => "8"
};
const defaultCoreDate = {
  core_date: () => new Date()
};
const defaultID = {
  ID: () => "8"
};

module.exports = {
  date,
  defaultString,
  defaultCoreId,
  defaultCoreDate,
  defaultID
};
