import React from "react";
import {Text, View} from "react-native";

function Tile({styles, index, guess, word, guessed}) {

    let letter = guess[index] ? guess[index].toLowerCase() : "";

    const wordLetter = word[index].toLowerCase();

    let tileStyle = styles.tile;
    let textStyle = styles.tileText;
    if (guessed){
        if (letter === wordLetter) {
            tileStyle = styles.tileCorrect;
        } else {
            tileStyle = word.includes(letter) ? styles.tileGuessed : styles.tileAbsent;
        }
    }

    return (
        <View style={tileStyle}>
            <Text style={textStyle}>{letter.toUpperCase()}</Text>
        </View>
    )
}
export default Tile;