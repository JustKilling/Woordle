import React from "react";
import {Platform, StyleSheet} from "react-native";
const textColor = "#000";
const defaultBackColor = "#fff"

const lightMode = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: defaultBackColor,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title:{
        fontSize: 50,
        textAlign: "center",
        color: textColor,
        paddingTop: Platform.OS === "android" ? 20 : 0
    },
    text:{
        color: textColor
    },
})
export default lightMode;