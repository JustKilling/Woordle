import React from "react";
import {Platform, StyleSheet} from "react-native";

const textColor = "#fff";
const defaultBackColor = Platform.OS === "android" ? "#252525" : "#121212"
const keyColor = "#818384"
const correctColor = "#538d4e"
const guessedColor = "#b59f3b"
const absentColor = "#3a3a3c"
const modalColor = "#373737"
const darkMode = StyleSheet.create({
    main: {
        height: "100%",
        backgroundColor: defaultBackColor,
    },
    container: {
        flex: 1,
        backgroundColor: defaultBackColor,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 50,
        textAlign: "center",
        color: textColor,
        paddingTop: Platform.OS === "android" ? 50 : 0
    },
    text: {
        color: textColor,
        userSelect: "none"
    },
    tileText: {
        color: textColor,
        fontSize: 25,
        fontWeight: "bold"
    },
    row: {
        flexDirection: "row",
        justifyContent: "center"
    },
    tile: {
        borderColor: textColor,
        borderWidth: 2,
        padding: 2,
        width: 50,
        height: 50,
        margin: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    tileCorrect: {
        borderColor: correctColor,
        backgroundColor: correctColor,
        borderWidth: 2,
        padding: 2,
        width: 50,
        height: 50,
        margin: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    tileGuessed: {
        borderColor: guessedColor,
        backgroundColor: guessedColor,
        borderWidth: 2,
        padding: 2,
        width: 50,
        height: 50,
        margin: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    tileAbsent: {
        borderColor: absentColor,
        backgroundColor: absentColor,
        borderWidth: 2,
        padding: 2,
        width: 50,
        height: 50,
        margin: 5,
        alignItems: "center",
        justifyContent: "center"
    },
    keyboardRow: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 10,
    },
    key: {
        backgroundColor: keyColor,
        padding: 10,
        margin: 3,
        borderRadius: 5,
    },
    keyLetter: {
        color: textColor,
        fontSize: 15
    }
})
export default darkMode;