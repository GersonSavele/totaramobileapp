'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.typeDefs = exports.resolvers = undefined;

var _templateObject = _taggedTemplateLiteral(['\nscalar DateTime\n\ntype Activity {\n  id: ID!\n  type: String!\n  itemName: String!\n  status: String  \n}\n\ntype ActivityGroup {\n  groupName: String!\n  data: [Activity]\n}\n\ntype LearningItem {\n  id: ID!\n  type: String!\n  shortname: String!\n  fullname: String\n  summary: String\n  dueDateState: String\n  dueDate: DateTime\n  progressPercentage: Float \n  groupCount: Int\n  activityGroups: [ActivityGroup]  \n}\n\ntype Query {\n   currentLearning: [LearningItem]\n}\n\n'], ['\nscalar DateTime\n\ntype Activity {\n  id: ID!\n  type: String!\n  itemName: String!\n  status: String  \n}\n\ntype ActivityGroup {\n  groupName: String!\n  data: [Activity]\n}\n\ntype LearningItem {\n  id: ID!\n  type: String!\n  shortname: String!\n  fullname: String\n  summary: String\n  dueDateState: String\n  dueDate: DateTime\n  progressPercentage: Float \n  groupCount: Int\n  activityGroups: [ActivityGroup]  \n}\n\ntype Query {\n   currentLearning: [LearningItem]\n}\n\n']);

var _graphqlIsoDate = require('graphql-iso-date');

var _apolloServer = require('apollo-server');

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var typeDefs = (0, _apolloServer.gql)(_templateObject);

var learningItems = [{
  id: 1,
  type: 'Certification',
  shortname: "course1",
  fullname: "Hierarchies and Job Assignments",
  summary: "The workplace learning we need is often dependent on our role and where we work. And in an LMS, being able to assign learning based on this information allows you to automate learning assignment, and check that the right people are doing the right learning for them. In Totara Learn, this is where hierarchies come in.",
  dueDateState: "danger",
  dueDate: new Date(2019, 1, 25),
  progressPercentage: 60.5,
  groupCount: 20,
  activityGroups: [{
    groupName: "Introduction",
    data: [{
      id: 1,
      itemName: 'Setting up a hierarchy',
      type: 'video',
      status: 'done'
    }, {
      id: 2,
      itemName: 'Adding job assignments',
      type: 'tasks'
    }, {
      id: 3,
      itemName: 'Importing hierarchies via HR import',
      type: 'film',
      status: 'done'
    }]
  }, {
    groupName: "Further Study",
    data: [{
      id: 4,
      itemName: 'News Forum',
      type: 'comments'
    }, {
      id: 5,
      itemName: 'Course Forum',
      type: 'comments'
    }, {
      id: 6,
      itemName: 'Introduction to seminar management',
      type: 'film'
    }, {
      id: 7,
      itemName: 'Show me: Creating a seminar activity',
      type: 'external-link-alt'
    }, {
      id: 8,
      itemName: 'Show me: Creating seminar events and sessions',
      type: 'film'
    }]
  }, {
    groupName: "Summary",
    data: [{
      id: 9,
      itemName: 'Flipped Learning: Five ways Totara can be used to support it',
      type: 'video'
    }, {
      id: 10,
      itemName: 'Case study: ERGO Insurance',
      type: 'external-link-alt'
    }]
  }]
}, {
  id: 2,
  type: 'Program',
  shortname: "program1",
  fullname: "How to Create Reports",
  summary: "Welcome to this course on reporting in Totara Learn. Do any of these situations sound familiar? The good news is that Totara Learn has a variety of inbuilt reports, and gives you the chance to create your own custom reports, using our report builder. In this course, you’ll explore your options for reporting in Totara Learn",
  dueDateState: "warning",
  dueDate: new Date(2019, 3, 2),
  progressPercentage: 10,
  groupCount: 5,
  activityGroups: [{
    groupName: "Introduction",
    data: [{
      id: 1,
      itemName: 'Setting up a hierarchy',
      type: 'video'
    }, {
      id: 2,
      itemName: 'Adding job assignments',
      type: 'tasks'
    }, {
      id: 3,
      itemName: 'Importing hierarchies via HR import',
      type: 'film'
    }]
  }, {
    groupName: "Further Study",
    data: [{
      id: 4,
      itemName: 'News Forum',
      type: 'comments'
    }, {
      id: 5,
      itemName: 'Course Forum',
      type: 'comments'
    }, {
      id: 6,
      itemName: 'Introduction to seminar management',
      type: 'film'
    }, {
      id: 7,
      itemName: 'Show me: Creating a seminar activity',
      type: 'external-link-alt'
    }, {
      id: 8,
      itemName: 'Show me: Creating seminar events and sessions',
      type: 'film'
    }]
  }, {
    groupName: "Summary",
    data: [{
      id: 9,
      itemName: 'Flipped Learning: Five ways Totara can be used to support it',
      type: 'video'
    }, {
      id: 10,
      itemName: 'Case study: ERGO Insurance',
      type: 'external-link-alt'
    }]
  }]
}, {
  id: 3,
  type: 'Course',
  shortname: "cert1",
  fullname: "Creating users in Totara Learn",
  summary: "Users are the people who are going to interact with your Totara Learn system; whether they are learners, managers, trainers,administrators or something in between. So it’s easy to understand why you want to add users to your LMS. But how do you go about doing so? You’ve got two main options you’re likely to use. You can create users manually, or you can create multiple users at the same time using HR Import. In this course, you’ll learn how to do both.",
  dueDateState: undefined,
  dueDate: undefined,
  progressPercentage: 99,
  groupCount: 150,
  activityGroups: [{
    groupName: "Introduction",
    data: [{
      id: 1,
      itemName: 'Setting up a hierarchy',
      type: 'video'
    }, {
      id: 2,
      itemName: 'Adding job assignments',
      type: 'tasks'
    }, {
      id: 3,
      itemName: 'Importing hierarchies via HR import',
      type: 'film'
    }]
  }, {
    groupName: "Further Study",
    data: [{
      id: 4,
      itemName: 'News Forum',
      type: 'comments'
    }, {
      id: 5,
      itemName: 'Course Forum',
      type: 'comments'
    }, {
      id: 6,
      itemName: 'Introduction to seminar management',
      type: 'film'
    }, {
      id: 7,
      itemName: 'Show me: Creating a seminar activity',
      type: 'external-link-alt'
    }, {
      id: 8,
      itemName: 'Show me: Creating seminar events and sessions',
      type: 'film'
    }]
  }, {
    groupName: "Summary",
    data: [{
      id: 9,
      itemName: 'Flipped Learning: Five ways Totara can be used to support it',
      type: 'video'
    }, {
      id: 10,
      itemName: 'Case study: ERGO Insurance',
      type: 'external-link-alt'
    }]
  }]
}];

var resolvers = {
  DateTime: _graphqlIsoDate.GraphQLDateTime,
  Query: {
    currentLearning: function currentLearning() {
      return learningItems;
    }
  }
};

exports.resolvers = resolvers;
exports.typeDefs = typeDefs;

