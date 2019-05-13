"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.typeDefs = exports.resolvers = undefined;

var _templateObject = _taggedTemplateLiteral(["\nscalar DateTime\n\n# for now:\n# type are not yet based on totara valid types, it is just on the icons used\n# status is not based on totara values\ntype Activity {\n  id: ID!\n  type: String!\n  itemName: String!\n  summary: String  \n  status: String  \n}\n\ntype Course {\n  id: ID!\n  type: String!\n  shortname: String!\n  fullname: String\n  summary: String\n  progressPercentage: Float\n  groupCount: Int\n  status: String  \n  sections: [Section]\n}\n\ntype NextSet {\n  operator: String!\n  nextID: ID!  \n}\n\ntype CourseSet {\n  id: ID!\n  label: String!  \n  courses: [Course!]!\n  nextSet: NextSet\n}\n\ntype Program {\n  id: ID!\n  type: String!\n  shortname: String!\n  fullname: String\n  summary: String\n  dueDateState: String\n  dueDate: DateTime\n  progressPercentage: Float\n  groupCount: Int\n  courseSet: [CourseSet!]!  \n}\n\ntype Certification {\n  id: ID!\n  type: String!\n  shortname: String!\n  fullname: String\n  summary: String\n  dueDateState: String\n  dueDate: DateTime\n  progressPercentage: Float\n  groupCount: Int\n  courseSet: [CourseSet!]!\n}\n\n\n\n# grouping doesn't really exists on totara, this is more a flat one and based on labels, etc.  For now we are making an\n# assumption that server would be able to deduce grouping for its data. Then there is course formats, etc.\ntype Section {\n  sectionName: String!\n  status: String  \n  data: [Activity]\n}\n\ntype LearningItem {\n  id: ID!\n  type: String!\n  shortname: String!\n  fullname: String\n  summary: String\n  dueDateState: String\n  dueDate: DateTime\n  progressPercentage: Float \n  groupCount: Int\n  status: String  \n}\n\ntype Query {\n  currentLearning: [LearningItem]\n  course(id: ID!): Course\n  program(id: ID!): Program  \n}\n\n"], ["\nscalar DateTime\n\n# for now:\n# type are not yet based on totara valid types, it is just on the icons used\n# status is not based on totara values\ntype Activity {\n  id: ID!\n  type: String!\n  itemName: String!\n  summary: String  \n  status: String  \n}\n\ntype Course {\n  id: ID!\n  type: String!\n  shortname: String!\n  fullname: String\n  summary: String\n  progressPercentage: Float\n  groupCount: Int\n  status: String  \n  sections: [Section]\n}\n\ntype NextSet {\n  operator: String!\n  nextID: ID!  \n}\n\ntype CourseSet {\n  id: ID!\n  label: String!  \n  courses: [Course!]!\n  nextSet: NextSet\n}\n\ntype Program {\n  id: ID!\n  type: String!\n  shortname: String!\n  fullname: String\n  summary: String\n  dueDateState: String\n  dueDate: DateTime\n  progressPercentage: Float\n  groupCount: Int\n  courseSet: [CourseSet!]!  \n}\n\ntype Certification {\n  id: ID!\n  type: String!\n  shortname: String!\n  fullname: String\n  summary: String\n  dueDateState: String\n  dueDate: DateTime\n  progressPercentage: Float\n  groupCount: Int\n  courseSet: [CourseSet!]!\n}\n\n\n\n# grouping doesn't really exists on totara, this is more a flat one and based on labels, etc.  For now we are making an\n# assumption that server would be able to deduce grouping for its data. Then there is course formats, etc.\ntype Section {\n  sectionName: String!\n  status: String  \n  data: [Activity]\n}\n\ntype LearningItem {\n  id: ID!\n  type: String!\n  shortname: String!\n  fullname: String\n  summary: String\n  dueDateState: String\n  dueDate: DateTime\n  progressPercentage: Float \n  groupCount: Int\n  status: String  \n}\n\ntype Query {\n  currentLearning: [LearningItem]\n  course(id: ID!): Course\n  program(id: ID!): Program  \n}\n\n"]);

var _graphqlIsoDate = require("graphql-iso-date");

var _apolloServer = require("apollo-server");

var _coreJs = require("core-js");

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var typeDefs = (0, _apolloServer.gql)(_templateObject);

var courses = [{
  id: 3,
  type: "Course",
  shortname: "cert1",
  fullname: "Creating users in Totara Learn V11",
  summary: "Users are the people who are going to interact with your Totara Learn system; whether they are learners, managers, trainers,administrators or something in between. So it’s easy to understand why you want to add users to your LMS. But how do you go about doing so? You’ve got two main options you’re likely to use. You can create users manually, or you can create multiple users at the same time using HR Import. In this course, you’ll learn how to do both.",
  dueDateState: undefined,
  dueDate: undefined,
  progressPercentage: 90,
  groupCount: 150,
  status: "active",
  sections: [{
    sectionName: "Ask us",
    data: [{
      id: 100,
      itemName: "News forum",
      summary: undefined,
      type: "comments",
      status: "done"
    }, {
      id: 102,
      itemName: "Course forum",
      type: "comments",
      summary: undefined,
      status: "active"
    }]
  }, {
    sectionName: "Skill up",
    data: [{
      id: 3,
      itemName: "The problem",
      type: "comments",
      summary: "Users are the people who are going to interact with your Totara Learn system; whether they are learners, managers, trainers, administrators or something in between.",
    }, {
      id: 4,
      itemName: "Adding users to Totara Learn",
      type: "box-open",
      summary: "In this brief tutorial, you’ll find out about your options for adding users in Totara Learn and the process of using HR import.",
      status: undefined
    }, {
      id: 5,
      itemName: "Show me: Adding a user",
      summary: undefined,
      type: "film"
    }, {
      id: 6,
      itemName: "Show me: Adding users via HR import ",
      summary: undefined,
      type: "film"
    }]
  }, {
    sectionName: "Have a go",
    status: "hidden",
    data: [{
      id: 7,
      itemName: "Help me",
      summary: "You might find the following pages in our help documentation useful as you work through the activities in this section. User accounts  |  HR import",
      type: "external-link-alt"
    }, {
      id: 8,
      itemName: "Try me",
      summary: "In this mandatory activity, you’ll be asked to demonstrate your ability to add a user in a simulated system environment. If you want to practice in advance, feel free to access one of our Academy sandboxes.",
      type: "external-link-alt"
    }, {
      id: 9,
      itemName: "Add a user manually",
      summary: "In this next mandatory activity, you’ll be asked to use HR import to add a group of users to a Totara Learn system. Why not practice in one of the Academy sandboxes first?",
      type: "box-open"
    }, {
      id: 10,
      itemName: "Add a group of users via HR import",
      summary: undefined,
      type: "box-open"
    }, {
      id: 11,
      itemName: "HR import best practice wiki",
      summary: "We’ve started this wiki which contains our Totara team’s tips on how to get the most out of HR import. Have a read, and feel free to add your own  suggestions now or in the future as you become more familiar with HR import.",
      type: "box-open"
    }]
  }, {
    sectionName: "Prove it",
    data: [{
      id: 12,
      itemName: "Course quiz",
      summary: "Feeling like an expert in creating users in Totara Learn? Then it’s time to show us what you know. Take the quiz but be careful; you’ve got two attempts and you’ll need a score of 90% to pass.",
      type: 'film'
    }]
  }, {
    sectionName: "Tell us what you think",
    data: [{
      id: 13,
      itemName: "Feedback form",
      summary: "Please spend a minute providing your feedback on this course.",
      type: "external-link-alt"
    }]
  }, {
    sectionName: "Resources",
    data: [{
      id: 14,
      itemName: "Example HR import file 1.3KB",
      type: "cloud-download-alt"
    }, {
      id: 15,
      itemName: "Case study: Moving Picture Company",
      type: "cloud-download-alt"
    }, {
      id: 16,
      itemName: "Case study: Hampshire Trust Bank",
      type: "cloud-download-alt"
    }, {
      id: 17,
      itemName: "ECase study: Kia Sweden",
      type: "cloud-download-alt"
    }, {
      id: 18,
      itemName: "Case study: New Zealand Customs Service",
      type: "cloud-download-alt"
    }]
  }]
}];

var moreCourses = [{
  id: 4,
  type: "Course",
  shortname: "cert1",
  fullname: "Site Administrator Program",
  summary: "The Site Administrator program for Totara Learn version 11 covers everything you need to know to be a Site Administrator for your Totara Learn site. Comprised of smaller feature-focused courses, you can work through the program in any order. Completing each course counts towards the completion of the program; complete them all and we’ll award you your Totara Learn Site Administrator’s badge.",
  dueDateState: undefined,
  dueDate: undefined,
  progressPercentage: undefined,
  groupCount: 150,
  status: "active",
  sections: [{
    sectionName: "Ask us",
    data: [{
      id: 1,
      itemName: "News forum",
      summary: undefined,
      type: "comments"
    }, {
      id: 2,
      itemName: "Course forum",
      type: "comments",
      summary: undefined
    }]
  }, {
    sectionName: "Skill up",
    data: [{
      id: 3,
      itemName: "The problem",
      type: "comments",
      summary: "Users are the people who are going to interact with your Totara Learn system; whether they are learners, managers, trainers, administrators or something in between."
    }, {
      id: 4,
      itemName: "Adding users to Totara Learn",
      type: "box-open",
      summary: "In this brief tutorial, you’ll find out about your options for adding users in Totara Learn and the process of using HR import.",
      status: undefined
    }, {
      id: 5,
      itemName: "Show me: Adding a user",
      summary: undefined,
      type: "film"
    }, {
      id: 6,
      itemName: "Show me: Adding users via HR import ",
      summary: undefined,
      type: "film"
    }]
  }, {
    sectionName: "Have a go",
    data: [{
      id: 7,
      itemName: "Help me",
      summary: "You might find the following pages in our help documentation useful as you work through the activities in this section. User accounts  |  HR import",
      type: "external-link-alt"
    }, {
      id: 8,
      itemName: "Try me",
      summary: "In this mandatory activity, you’ll be asked to demonstrate your ability to add a user in a simulated system environment. If you want to practice in advance, feel free to access one of our Academy sandboxes.",
      type: "external-link-alt"
    }, {
      id: 9,
      itemName: "Add a user manually",
      summary: "In this next mandatory activity, you’ll be asked to use HR import to add a group of users to a Totara Learn system. Why not practice in one of the Academy sandboxes first?",
      type: "box-open"
    }, {
      id: 10,
      itemName: "Add a group of users via HR import",
      summary: undefined,
      type: "box-open"
    }, {
      id: 11,
      itemName: "HR import best practice wiki",
      summary: "We’ve started this wiki which contains our Totara team’s tips on how to get the most out of HR import. Have a read, and feel free to add your own  suggestions now or in the future as you become more familiar with HR import.",
      type: "box-open"
    }]
  }, {
    sectionName: "Prove it",
    data: [{
      id: 12,
      itemName: "Course quiz",
      summary: "Feeling like an expert in creating users in Totara Learn? Then it’s time to show us what you know. Take the quiz but be careful; you’ve got two attempts and you’ll need a score of 90% to pass.",
      type: 'film'
    }]
  }, {
    sectionName: "Tell us what you think",
    data: [{
      id: 13,
      itemName: "Feedback form",
      summary: "Please spend a minute providing your feedback on this course.",
      type: "external-link-alt"
    }]
  }, {
    sectionName: "Resources",
    data: [{
      id: 14,
      itemName: "Example HR import file 1.3KB",
      type: "cloud-download-alt"
    }, {
      id: 15,
      itemName: "Case study: Moving Picture Company",
      type: "cloud-download-alt"
    }, {
      id: 16,
      itemName: "Case study: Hampshire Trust Bank",
      type: "cloud-download-alt"
    }, {
      id: 17,
      itemName: "ECase study: Kia Sweden",
      type: "cloud-download-alt"
    }, {
      id: 18,
      itemName: "Case study: New Zealand Customs Service",
      type: "cloud-download-alt"
    }]
  }]
}];

var allCourses = moreCourses.concat(courses);

var coursesLocked = [{
  id: 5,
  type: 'Course',
  shortname: "cert1",
  fullname: "Reports",
  summary: "It's vital to be able to report on the learning taking place in your business.",
  dueDateState: undefined,
  dueDate: undefined,
  status: "hidden",
  groupCount: 150,
  sections: [{
    sectionName: "Introduction",
    data: [{
      id: 1,
      itemName: 'Setting up a hierarchy',
      type: 'video'
    }, {
      id: 2,
      itemName: 'Adding job assignments',
      type: 'tasks',
      status: 'done'
    }, {
      id: 3,
      itemName: 'Importing hierarchies via HR import',
      type: 'film',
      status: 'active'
    }]
  }, {
    sectionName: "Further Study",
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
    sectionName: "Summary",
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
  id: 6,
  type: 'Course',
  shortname: "cert1",
  fullname: "Seminar Management",
  summary: "Do you run live events online or offline? If so, this course is for you. Enrol in this course to explore how to",
  dueDateState: undefined,
  dueDate: undefined,
  status: "hidden",
  groupCount: 150,
  sections: [{
    sectionName: "Introduction",
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
    sectionName: "Further Study",
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
    sectionName: "Summary",
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

var certifications = [{
  id: 1,
  type: 'Certification',
  shortname: "course1",
  fullname: "Hierarchies and Job Assignments",
  summary: "The workplace learning we need is often dependent on our role and where we work. And in an LMS, being able to assign learning based on this information allows you to automate learning assignment, and check that the right people are doing the right learning for them. In Totara Learn, this is where hierarchies come in.",
  dueDateState: "danger",
  dueDate: new Date(2019, 1, 25),
  progressPercentage: 60,
  groupCount: 20,
  courseSet: [{
    id: 10,
    label: "Getting Started",
    courses: courses.concat(moreCourses),
    nextSet: {
      operator: "then",
      nextID: 11
    }
  }, {
    id: 11,
    label: "Building Content",
    courses: coursesLocked,
    nextSet: {
      operator: "and",
      nextID: 11
    }
  }, {
    id: 12,
    label: "Making Reports",
    courses: moreCourses
  }]
}];

var programes = certifications.concat([{
  id: 2,
  type: 'Program',
  shortname: "program1",
  fullname: "How to Create Reports",
  summary: "Welcome to this course on reporting in Totara Learn. Do any of these situations sound familiar? The good news is that Totara Learn has a variety of inbuilt reports, and gives you the chance to create your own custom reports, using our report builder. In this course, you’ll explore your options for reporting in Totara Learn",
  dueDateState: "warning",
  dueDate: new Date(2019, 4, 2),
  progressPercentage: 10,
  groupCount: 5,
  courseSet: [{
    id: 10,
    label: "Getting Started",
    courses: courses.concat(moreCourses),
    nextSet: {
      operator: "then",
      nextID: 11
    }
  }, {
    id: 11,
    label: "Building Content",
    courses: coursesLocked,
    nextSet: {
      operator: "and",
      nextID: 11
    }
  }, {
    id: 12,
    label: "Making Reports",
    courses: moreCourses
  }]
}]);

var learningItems = programes.concat(courses);

var resolvers = {
  DateTime: _graphqlIsoDate.GraphQLDateTime,
  Query: {
    currentLearning: function currentLearning() {
      return learningItems;
    },
    course: function course(root, _ref) {
      var id = _ref.id;
      return allCourses.find(function (course) {
        return course.id == id;
      });
    },
    program: function program(root, _ref2) {
      var id = _ref2.id;
      return programes.find(function (program) {
        return program.id == id;
      });
    }
  }
};

exports.resolvers = resolvers;
exports.typeDefs = typeDefs;

