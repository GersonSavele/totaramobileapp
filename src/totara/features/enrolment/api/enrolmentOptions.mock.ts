import { enrolmentOptionsQuery } from "@totara/features/enrolment/api";
import { GraphQLError } from "graphql";

export const enrolmentOptionsMock = [
  {
    request: {
      query: enrolmentOptionsQuery,
      variables:{
        courseid: 1,
        userid: 1,
      }
    },
    result: {
      data: {
        enrolmentInfo: {
          isComplete: false,
          isEnrolled: false,
          guestAccess: true,
          canEnrol: true,
          privileged: true,
          enrolmentOptions:[
            {
              id: 1,
              type: 'guest',
              roleName: '',
              customName: '',
              sortOrder: '',
              passwordRequired: true
            },
            {
              id: 2,
              type: 'self',
              roleName: 'Learner',
              customName: '',
              sortOrder: '',
              passwordRequired: true
            },
            {
              id: 3,
              type: 'self',
              roleName: 'Trainer',
              customName: '',
              sortOrder: '',
              passwordRequired: true
            },
          ],
          __typename: 'enrolment_options'
        }
      }
    }
  },
];

export const enrolmentOptionsMockError = [
  {
    request: {
      query: enrolmentOptionsQuery,
      variables:{
        courseid: 1,
        userid: 1,
      }
    },
    result: {
      errors: [new GraphQLError("Error!")]
    }
  }
];