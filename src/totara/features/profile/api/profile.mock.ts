import { userOwnProfile } from "@totara/features/profile/api/index";
import { GraphQLError } from "graphql";

const profileMock = [
  {
    request: {
      query: userOwnProfile
    },
    result: {
      data: {
        profile: {
          __typename: "core_user",
          email: "totara.user@totaralearning.com",
          firstname: "Totara",
          id: "999",
          profileimage: "theme/image.php/basis/core/",
          surname: "User",
          username: "totarau"
        }
      }
    }
  }
];

const profileMockError = [
  {
    request: {
      query: userOwnProfile
    },
    result: {
      errors: [new GraphQLError("Error!")]
    }
  }
];

export { profileMock, profileMockError };
