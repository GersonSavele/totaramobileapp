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
import { ActivityUI } from "../ActivityList"

const sections_available = [
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
            }
          ]
        }
    ]
    const sections_not_available = [
        {
          id: "13",
          title: "General",
          available: false,
          availablereason: "",
          data: []
        }
    ]

const refetch = jest.fn()


describe("Activity UI : testing if sections are available show expandable cell or otherwise stop expandable", () => {
    it("Test result :If sections are available show expandable list", async () => {
      const component = renderer.create(
       <ActivityUI section = {sections_available} refetch = {refetch}/>
      );
      await wait(0); // wait for response
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });  

    it("Test result : If sections are not available, not showing expandable list", async () => {
        const component = renderer.create(
            <ActivityUI section = {sections_not_available} refetch = {refetch}/>
        );
        await wait(0); // wait for response
        const tree = component.toJSON();
        expect(tree).toBeNull(); 
      });  
});