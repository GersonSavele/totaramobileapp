/**
 * This file is part of Totara Mobile
 *
 * Copyright (C) 2019 onwards Totara Learning Solutions LTD
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @author Tharaka Dushmantha <tharaka.dushmantha@totaralearning.com>
 *
 *
 */

import { MockedProvider } from "@apollo/react-testing";
import renderer from "react-test-renderer";
import React from "react";
import wait from "waait";
import { CourseDetails } from "../CourseDetails"
import { coreCourse } from "../api";

const response = {
  course: {
    id: "4",
    fullname: "Software Developers",
    shortname: "Onboarding",
    summary:
      "More than just an LMS in your pocket, the _mLearn Totara App_ is\nproductivity, evidence gathering, content delivery and creation tool for\nlearning on the go.\n\nUpload media and submit evidence of learning, receive important\nnotifications, search and enrol in courses, task notifications for managers\nand approve training requests in-app.\n\nCapable of being fully branded to your clients' requirements, the mLearn\nTotara App gives you constant online and offline access to all your\nlearning content. \n\n",
    startdate: "2019-11-29T00:00:00+1300",
    enddate: "2020-11-28T00:00:00+1300",
    lang: "",
    imageSrc:
      "http://10.0.8.183/pluginfile.php/81/course/images/1582600201/image",
    sections: [
      {
        id: "13",
        title: "General",
        available: true,
        availablereason: "",
        data: [
          {
            id: "4",
            modtype: "forum",
            name: "Announcement",
            available: true,
            availablereason: "",
            viewurl: "http://10.0.8.183/mod/forum/view.php?id=4",
            completion: "tracking_none",
            completionstatus: "incomplete",
            showdescription: false,
            description: "General news and announcements",
            gradefinal: null,
            gradepercentage: 0
          },
          {
            id: "8",
            modtype: "forum",
            name: "Course introduction",
            available: true,
            availablereason: "",
            viewurl: "http://10.0.8.183/mod/forum/view.php?id=8",
            completion: "tracking_none",
            completionstatus: "incomplete",
            showdescription: false,
            description: "General news and announcements",
            gradefinal: null,
            gradepercentage: 0
          },
          {
            id: "7",
            modtype: "forum",
            name: "Introduction to seminar management",
            available: true,
            availablereason: "",
            viewurl: "http://10.0.8.183/mod/forum/view.php?id=7",
            completion: "tracking_none",
            completionstatus: "incomplete",
            showdescription: false,
            description: "General news and announcements",
            gradefinal: null,
            gradepercentage: 0
          },
          {
            id: "6",
            modtype: "scorm",
            name: "Creating a seminar activity",
            available: true,
            availablereason: "",
            viewurl: "http://10.0.8.183/mod/scorm/view.php?id=6",
            completion: "tracking_manual",
            completionstatus: "complete",
            showdescription: false,
            description: "",
            gradefinal: 8,
            gradepercentage: 8
          },
          {
            id: "9",
            modtype: "wiki",
            name: "Creating seminar events and section headings",
            available: true,
            availablereason: "",
            viewurl: "http://10.0.8.183/mod/wiki/view.php?id=9",
            completion: "tracking_manual",
            completionstatus: "complete",
            showdescription: false,
            description: "",
            gradefinal: null,
            gradepercentage: 0
          },
          {
            id: "10",
            modtype: "wiki",
            name: "Site level setting",
            available: true,
            availablereason: "",
            viewurl: "http://10.0.8.183/mod/wiki/view.php?id=10",
            completion: "tracking_manual",
            completionstatus: "complete",
            showdescription: false,
            description: "",
            gradefinal: null,
            gradepercentage: 0
          },
          {
            id: "11",
            modtype: "wiki",
            name: "Creating a seminar",
            available: true,
            availablereason: "",
            viewurl: "http://10.0.8.183/mod/wiki/view.php?id=11",
            completion: "tracking_manual",
            completionstatus: "complete",
            showdescription: false,
            description: "",
            gradefinal: null,
            gradepercentage: 0
          }
        ]
      },
      {
        id: "14",
        title: "Ask us",
        available: true,
        availablereason: "",
        data: []
      },
      {
        id: "15",
        title: "Skill up",
        available: true,
        availablereason: "",
        data: []
      },
      {
        id: "16",
        title: "Have a go",
        available: true,
        availablereason: "",
        data: []
      },
      {
        id: "17",
        title: "Tell us what you think about the new team structure",
        available: true,
        availablereason: "",
        data: []
      },
      {
        id: "23",
        title: "Resources",
        available: true,
        availablereason: "",
        data: []
      }
    ],
    completion: {
      id: 8,
      statuskey: "notyetstarted",
      progress: 0,
      timecompleted: null,
      gradefinal: 8,
      grademax: 100
    }
  }
};

const mocks = [
  {
    request: {
      query: coreCourse
    },
    result: {
      data: response
    }
  }
];

const mocksError = [
  {
    request: {
      query: coreCourse
    },
    error: new Error("Error")
  }
];
const courseId = () => {
  return "4"
 }
const navigation = { getParam: courseId };

describe("Course API, Apollo MockedProvider should test three state such as loading, final and error ", () => {
    it("Test result : Render loading state initially and return no component", () => {
      const component = renderer.create(
        <MockedProvider mocks={[]} addTypename={false}>
          <CourseDetails navigation = {navigation}/>
        </MockedProvider>
      );
      const tree = component.toJSON();
      expect(tree).toBeNull();
    });
  
    it("Test result : Once get a course API data from graphQL, it will call to the nested component", async () => {
      const component = renderer.create(
        <MockedProvider mocks={mocks} addTypename={false}>
          <CourseDetails navigation = {navigation}/>
        </MockedProvider>
      );
      await wait(0); // wait for response
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  
    it("Test result : Set mock-error response and return Error UI", async () => {
      const component = renderer.create(
        <MockedProvider mocks={mocksError} addTypename={false}>
         <CourseDetails navigation = {navigation}/>
        </MockedProvider>
      );
      await wait(0); // wait for response
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });