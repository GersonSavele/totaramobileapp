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
 * @author: Kamala Tennakoon <kamala.tennakoon@totaralearning.com>
 */

import React, { useContext, useState, useEffect, useRef } from "react";
import { StyleSheet, Text } from "react-native";
import * as Animatable from "react-native-animatable";

import { ThemeContext, gutter } from "@totara/theme";

type Props = {
  message: string;
  isShow: boolean;
};

const FormError = ({ message, isShow }: Props) => {
  const [theme] = useContext(ThemeContext);
  const [animationType, setAnimationType] = useState();

  const styles = StyleSheet.create({
    container: {
      position: "absolute",
      top: 0,
      left: -1 * gutter,
      right: -1 * gutter,
      padding: 8,
      backgroundColor: theme.colorAlert,
      zIndex: 1,
      opacity: 0
    }
  });

  const refTimer = useRef<NodeJS.Timeout>();

  const errorCleanup = () => {
    if (isShow) {
      refTimer.current = setTimeout(() => {
        setAnimationType("fadeOutUp");
      }, 5000);
    }
  };

  useEffect(() => {
    if (refTimer.current) {
      clearTimeout(refTimer.current);
      setAnimationType(isShow ? "fadeInDown" : "fadeOutUp");
    } else if (isShow) {
      setAnimationType("fadeInDown");
    }
  }, [isShow]);

  return (
    <Animatable.View
      animation={animationType}
      style={styles.container}
      onAnimationEnd={animationType && errorCleanup}
    >
      <Text style={[theme.textSmall, { color: theme.textColorLight }]}>
        {message}
      </Text>
    </Animatable.View>
  );
};

export default FormError;
