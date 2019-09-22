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
 * @author Tharaka Dushmantha <tharaka.dushmantha@totaralearning.com
 */

import React from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-navigation";
import { resizeByScreenSize } from "@totara/theme";
import { ifIphoneX } from 'react-native-iphone-x-helper'

const TransparentView = ({children} : Props) =>{
    return (
        <SafeAreaView style={styles.transparentViewStyle}>
           <View style={styles.containerStyle}>
            {children}
           </View>
        </SafeAreaView>
    );
}

type Props = {
    children? : Element
 }

const styles = StyleSheet.create({
    containerStyle: {
        flex:1,
        padding: 5,
        borderRadius: 4,
        position: "absolute",
        right: resizeByScreenSize(16, 16, 20, 20),
        left: resizeByScreenSize(16, 16,20, 20),
        ...ifIphoneX({
            top: resizeByScreenSize(72, 72, 72, 72),
            bottom: resizeByScreenSize(72, 72, 72, 72),
        }, {
            top: resizeByScreenSize(32, 32, 32, 32),
            bottom: resizeByScreenSize(32, 32, 32, 32),
        }),
        backgroundColor: "#FFF"
    },
    transparentViewStyle: {
        flex: 1,
        position: "absolute",
        right: 0,
        top: 0,
        bottom: 0,
        left: 0, 
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    }
});

export default TransparentView;