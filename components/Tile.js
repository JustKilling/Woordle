import React from "react";
import {Text, View} from "react-native";

function Tile({styles, index, guess, coloring, guessed}) {
    let letter = guess[index] ? guess[index].toLowerCase() : "";

    return (
        <View style={coloring[index]}>
            <Text style={ guessed ? styles.tileGuessedText : styles.tileText}>{letter.toUpperCase()}</Text>
        </View>
    )
}

export default Tile;