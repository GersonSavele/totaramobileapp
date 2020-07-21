import gql from "graphql-tag";

const queryUserLanguagePreference = gql`
  query totara_mobile_me {
    me: totara_mobile_me {
      user {
        id
        lang
      }
    }
  }
`;
const queryLanguageStrings = gql`
  query totara_mobile_language_strings($lang: String!) {
    json_string: totara_mobile_language_strings(lang: $lang)
    __typename
  }
`;

export { queryUserLanguagePreference, queryLanguageStrings };
