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

import renderer from "react-test-renderer";
import React from "react";
import wait from "waait";
import { CourseCompleted } from "../CourseDetails"


const course_not_complete = {
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

const course_complete = {
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

    ],
    completion: {
      id: 8,
      statuskey: "complete",
      progress: 0,
      timecompleted: null,
      gradefinal: 8,
      grademax: 100
    }
}

const navigation = jest.fn()

describe("Course Activities are completed, once user has completed all activities should be showed completion modal to navigate home screen", () => {
    it("Test result : launching modal once user has completed all activities", async () => {
      const component = renderer.create(
       <CourseCompleted navigation = {navigation} course = {course_complete}/>
      );
      await wait(0); // wait for response
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot(); // check info modal screen once user has completed activities 
    });  

    it("Test result : user still need to complete activity, then user can see the activity list screen, therefor condition return null", async () => {
        const component = renderer.create(
         <CourseCompleted navigation = {navigation} course = {course_not_complete}/>
        );
        await wait(0); // wait for response
        const tree = component.toJSON();
        expect(tree).toBeNull(); 
      });  
  });


