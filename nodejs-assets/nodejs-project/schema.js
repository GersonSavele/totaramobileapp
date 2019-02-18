"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.schema = undefined;

var _graphqlTools = require("graphql-tools");

var typeDefs = "\n\ntype Course {\n    id: ID!\n    shortname: String!\n    fullname: String\n    description: String\n}\n\ntype Query {\n   courses: [Course] \n}\n\n";

var _courses = [
  { id: 1, shortname: "course1", fullname: "Hierarchies and Job Assignments", description: "This is a space for anyone taking the course to ask questions of the Academy team or other learners. We encourage you to use the course forum as much as you can. If you have a question post it here so that everyone will benefit from seeing the answer. Please start a new thread for each new question."},
  { id: 2, shortname: "course2", fullname: "How to Create Reports", description: "This is a space for anyone taking the course to ask questions of the Academy team or other learners. We encourage you to use the course forum as much as you can. If you have a question post it here so that everyone will benefit from seeing the answer. Please start a new thread for each new question."},
  { id: 3, shortname: "course3", fullname: "Creating users in Totara Learn", description: "This is a space for anyone taking the course to ask questions of the Academy team or other learners. We encourage you to use the course forum as much as you can. If you have a question post it here so that everyone will benefit from seeing the answer. Please start a new thread for each new question."}
];
var nextId = 0;

var mocks = {
    Query: function Query() {
        return {
            courses: function courses() {
                return _courses;
            }
        };
    }
};

var schema = (0, _graphqlTools.makeExecutableSchema)({ typeDefs: typeDefs });
(0, _graphqlTools.addMockFunctionsToSchema)({ schema: schema, mocks: mocks });

exports.schema = schema;

