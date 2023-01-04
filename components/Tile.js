import React from "react";
import {Text, View} from "react-native";

function Tile({styles, index, guess, coloring}) {
    let letter = guess[index] ? guess[index].toLowerCase() : "";

    return (
        <View style={coloring[index]}>
            <Text style={styles.tileText}>{letter.toUpperCase()}</Text>
        </View>
    )
}

export default Tile;