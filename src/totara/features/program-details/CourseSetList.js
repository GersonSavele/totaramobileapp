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
 * @author Jun Yamog <jun.yamog@totaralearning.com
 */

import {FlatList, StyleSheet} from "react-native";
import React from "react";
import PropTypes from "prop-types";
import CourseSet from "./CourseSet";

class CourseSetList extends React.Component {

  renderCourseSet = ({item}) => <CourseSet {...item}/>;

  render() {
    const {courseSet} = this.props;
    return(
    <FlatList
                 data={courseSet}
                 renderItem={this.renderCourseSet}
                 keyExtractor={(item, index) => item.id.toString() + index}/>
    );
  }
}

CourseSetList.propTypes = {
  courseSet: PropTypes.array.isRequired
};

const styles = StyleSheet.create({
});

export default CourseSetList;