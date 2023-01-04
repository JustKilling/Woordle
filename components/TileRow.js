import React from "react";
import {View} from "react-native";
import Tile from "./Tile";

function countLetter(word, letter) {
    let count = 0;
    for (let i = 0; i < word.length; i++) {
        if (word[i] === letter) {
            count++;
        }
    }
    return count;
}

function TileRow({guess, ...props}) {
    const COLOR = {
        DEFAULT: props.styles.tile,
        ABSENT: props.styles.tileAbsent,
        GUESSED: props.styles.tileGuessed,
        CORRECT: props.styles.tileCorrect
    }
    const coloring = {
        0: COLOR.DEFAULT,
        1: COLOR.DEFAULT,
        2: COLOR.DEFAULT,
        3: COLOR.DEFAULT,
        4: COLOR.DEFAULT,
    }
    if (props.guessed) {
        let word = props.word;
        let occurrences = {}
        let correctOccurrences = {};
        let guessedIndexes = {};
        for (let i = 0; i < word.length; i++) {
            let letter = guess[i] ? guess[i].toLowerCase() : "";
            if (!correctOccurrences[letter]) {
                correctOccurrences[letter] = 0;
            }
            if (letter.toLowerCase() === word[i].toLowerCase()) {
                coloring[i] = COLOR.CORRECT;
                correctOccurrences[letter]++;
            } else if (word.includes(letter.toLowerCase())) {
                if (guessedIndexes[letter]) {
                    guessedIndexes[letter].push(i);
                } else {
                    guessedIndexes[letter] = [];
                    occurrences[letter] = 0;
                    guessedIndexes[letter].push(i);
                }
                occurrences[letter]++;
            } else {
                coloring[i] = COLOR.ABSENT;
            }
        }
        for (const guessedIndex in guessedIndexes) {
            guessedIndexes[guessedIndex].forEach((index, i) => {

                let letter = guess[index].toLowerCase();
                let amountInWord = countLetter(word, guess[index].toLowerCase());
                let guessesLeft = amountInWord - correctOccurrences[letter];
                if (i < guessesLeft) {
                    coloring[index] = COLOR.GUESSED;
                } else {
                    coloring[index] = COLOR.ABSENT;
                }
                // console.log(`
                // index: ${index}
                // guessesLeft: ${guessesLeft}
                // amountInWord: ${amountInWord}
                // correct: ${correctOccurrences[letter]}
                // `)
            })
        }


    }


    return (
        <View style={props.styles.row}>
            <Tile coloring={coloring} index={0} guess={guess} styles={props.styles} guessed={props.guessed}></Tile>
            <Tile coloring={coloring} index={1} guess={guess} styles={props.styles} guessed={props.guessed}></Tile>
            <Tile coloring={coloring} index={2} guess={guess} styles={props.styles} guessed={props.guessed}></Tile>
            <Tile coloring={coloring} index={3} guess={guess} styles={props.styles} guessed={props.guessed}></Tile>
            <Tile coloring={coloring} index={4} guess={guess} styles={props.styles} guessed={props.guessed}></Tile>
        </View>

    )
}

export default TileRow;