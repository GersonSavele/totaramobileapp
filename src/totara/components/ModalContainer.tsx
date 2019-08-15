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

const ModalContainer = ({children} : Props) =>{
    return (
        <View style = {styles.subContainerStyle}>
             <View style = {styles.wrapContainerStyle}>
                {children}
            </View>
        </View>
    );
}

type Props = {
    children? : Element
 }

const styles = StyleSheet.create({
    subContainerStyle: {
        flex: 1,
        flexDirection:"column",
        marginTop: "17%",
        marginLeft: "5%",
        marginRight: "5%",
        marginBottom:"17%",
        alignItems: 'center',
        justifyContent: 'center', 
        paddingHorizontal: 16,
        },
    wrapContainerStyle : {
        position: 'absolute',
        alignItems:"center"
    }
});

export default ModalContainer;