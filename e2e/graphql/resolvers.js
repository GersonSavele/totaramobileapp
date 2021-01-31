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
 */

const { ApolloServer, gql, MockList } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    totara_mobile_current_learning: [totara_mobile_learning_item]
  }

  type totara_mobile_learning_item {
    id: String
    itemtype: String
    itemcomponent: String
    shortname: String
    fullname: String
    summary: String
    description: String
    progress: String
    url_view: String
    duedate: String
    duedate_state: String
    mobile_coursecompat: Boolean
    mobile_image: String
    description_format: String
  }
`;
const resolvers = {
  Query: () => ({
    totara_mobile_current_learning: () => new MockList([4, 12])
  })
};

module.exports = {
  typeDefs,
  resolvers
};
