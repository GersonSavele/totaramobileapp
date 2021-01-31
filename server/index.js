const { startGraphQLServer } = require("../e2e/graphql/index");

const { defaultCoreId, defaultCoreDate, defaultString, defaultID } = require("../e2e/graphql/mocks/scalars");
const { defaultScorm } = require("../e2e/graphql/mocks/scorm");
const { defaultCurrentLearning, defaultCurrentLearningList } = require("../e2e/graphql/mocks/currentLearning");
const { defaultCourseDetails } = require("../e2e/graphql/mocks/courseDetails");
const { defaultMobileMe } = require("../e2e/graphql/mocks/me");

const customMocks = {
  ...defaultID,
  ...defaultScorm,
  ...defaultCoreId,
  ...defaultCoreDate,
  ...defaultString,
  ...defaultMobileMe,
  ...defaultCurrentLearning,
  ...defaultCourseDetails
};

async function start() {
  await startGraphQLServer(customMocks);
}

start();
