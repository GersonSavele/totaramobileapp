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

import React from "react";
import * as Progress from "react-native-progress";

type ProgressCircleParam = {
  progress: number,
  size: number,
  progressColor?: string,
  color?: string,
  backgroundColor?: string
}

const ProgressCircle = ({size, progress, progressColor, color, backgroundColor}: ProgressCircleParam) => {

  return <Progress.Circle progress={progress/100}
  size={size}
  unfilledColor={(backgroundColor? backgroundColor : "#E6E6E6")}
  color={(progressColor? progressColor : "#4579b2")}
  thickness={3}
  borderWidth={0}
  formatText={() =>  progress+"%"}
  showsText={true}
  textStyle={{fontSize: 12, color: (color ? color: "#000")}}/>

};

export default ProgressCircle;