import React from "react";
import {Text, View} from "react-native";

function Tile({styles, index, guess, word, guessed}) {

    const letter = guess[index];
    const wordLetter = word[index];

    let tileStyle = styles.tile;
    let textStyle = styles.tileText;
    if (guessed){
        if(letter.toLowerCase() === wordLetter){
            tileStyle = styles.tileCorrect;
        }else if(word.includes(letter)){
            tileStyle = styles.tileGuessed;
        }else{
            tileStyle = styles.tileAbsent;
        }
    }

    return (
        <View style={tileStyle}>
            <Text style={textStyle}>{letter}</Text>
        </View>
    )
}
export default Tile;