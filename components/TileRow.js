import React from "react";
import {Text, View} from "react-native";
import Tile from "./Tile";

function TileRow({ guess, ...props }) {

    return (
        <View style={props.styles.row}>
            <Tile index={0} guess={guess} styles={props.styles} word={props.word} guessed={props.guessed}></Tile>
            <Tile index={1} guess={guess} styles={props.styles} word={props.word} guessed={props.guessed}></Tile>
            <Tile index={2} guess={guess} styles={props.styles} word={props.word} guessed={props.guessed}></Tile>
            <Tile index={3} guess={guess} styles={props.styles} word={props.word} guessed={props.guessed}></Tile>
            <Tile index={4} guess={guess} styles={props.styles} word={props.word} guessed={props.guessed}></Tile>
        </View>

    )
}
export default TileRow;