import React from "react";
import {Text, View} from "react-native";

function Tile({styles, index, guess, word, guessed}) {
    let letter = guess[index] ? guess[index].toLowerCase() : "";
    const wordLetter = word[index].toLowerCase();

    let tileStyle = styles.tile;
    let textStyle = styles.tileText;

    if (guessed) {
        if (letter === wordLetter) {
            tileStyle = styles.tileCorrect;
        } else if (word.includes(letter)) {
            // If the word includes the letter, calculate the number of occurrences
            // and correct occurrences of the letter in the word and guess strings
            let occurrences = 0;
            let correctOccurrences = 0;

            for (let i = 0; i < word.length; i++) {
                let loopLetter = word[i];
                if (loopLetter.toLowerCase() === letter.toLowerCase()) {
                    occurrences++;
                    if (loopLetter.toLowerCase() === guess[i].toLowerCase()) {
                        correctOccurrences++;
                    }
                }
            }
            // Calculate the current occurrence of the letter in the guess string
            let currentOccurrence = 0;
            for (let i = 0; i <= index; i++) {
                if (letter === guess[i].toLowerCase()) {
                    currentOccurrence++;
                }
            }
            // Set the tile style to either tileGuessed or tileAbsent
            tileStyle = currentOccurrence <= occurrences - correctOccurrences ?
                styles.tileGuessed : styles.tileAbsent;
        } else {
            // If the word does not include the letter, set the tile style to tileAbsent
            tileStyle = styles.tileAbsent;
        }
    }


    return (
        <View style={tileStyle}>
            <Text style={textStyle}>{letter.toUpperCase()}</Text>
        </View>
    )
}

export default Tile;