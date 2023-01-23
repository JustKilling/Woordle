import React from "react";
import {Platform, StyleSheet} from "react-native";

const textColor = "#000";
const defaultBackColor = Platform.OS === "android" ? "#ffffff" : "#ffffff"
const defaultBackColorAlpha = Platform.OS === "android" ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.7)"

const keyColor = "#d3d6da"
const guessedTextColor = "#ffffff"
const guessedColor = "#c9b458"
const correctColor = "#6aaa64"
const absentColor = "#787c7e"
const modalColor = "#ffffff"
const lightMode = StyleSheet.create({
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
    modalView: {
        display: "flex",
        height: "100%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor:defaultBackColorAlpha
    },
    modal: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    modalFinal: {
        backgroundColor: modalColor,
        margin: 50,
        padding: 50,
        paddingVertical: 20,
        shadowColor: textColor,
        shadowRadius: 10,
        shadowOpacity: "80%",
        shadowOffset: -20
    },
    modalText: {
        marginBottom: 10,
        color: textColor,
        fontSize: 20,
        textAlign: "center"
    },
    modalBold: {
        marginBottom: 10,
        color: textColor,
        fontSize: 20,
        textAlign: "center",
        fontWeight: "bold"
    },
    modalWord: {
        marginBottom: 10,
        color: textColor,
        fontWeight: "bold",
        fontSize: 20 * 1.5,
        textAlign: "center"
    },
    title: {
        fontSize: 50,
        textAlign: "center",
        color: textColor,
        fontWeight:"bold",
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
    tileGuessedText:{
        color: guessedTextColor,
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
    },
    keyGuessed: {
        backgroundColor: guessedColor,
        padding: 10,
        margin: 3,
        borderRadius: 5,
    },
    keyLetterGuessed: {
        color: textColor,
        fontSize: 15
    },
    keyCorrect: {
        backgroundColor: correctColor,
        padding: 10,
        margin: 3,
        borderRadius: 5,
    },
    keyLetterCorrect: {
        color: textColor,
        fontSize: 15
    },
    keyAbsent: {
        backgroundColor: absentColor,
        padding: 10,
        margin: 3,
        borderRadius: 5,
    },
    keyLetterAbsent: {
        color: textColor,
        fontSize: 15
    },
    table: {
        flex: 1,
        flexDirection: "row",
        alignItems: "flex-start",
        flexWrap: "wrap",
        justifyContent: "center"
    },
    tableColumn:{
        flexGrow: 1,
        margin: 10,
        marginTop: 0,
        alignItems: "center",
        justifyContent: "center"
    },
    tableText:{
        color: textColor,
        fontSize: 20,
        textAlign: "center",
        fontWeight: "bold",
    },
    tableTextSmall:{
        marginBottom: 10,
        color: textColor,
        fontSize: 15,
        textAlign: "center"
    }
})
export default lightMode;