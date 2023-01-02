import {StatusBar} from 'expo-status-bar';
import {
    Alert,
    Appearance,
    Modal,
    Platform,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import React, {useRef, useState} from "react";
const seedrandom = require('seedrandom');
import darkMode from "./themes/darkMode";
import lightMode from "./themes/lightMode";
import TileRow from "./components/TileRow";
import wordsList from "./words";

let styles;

const defaultGuess = {
    0: "",
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
}

function getRandomWord(words) {
    // Get the current date
    const currentDate = new Date();
    // Get the current day of the month (1-31)
    const currentDay = currentDate.getDate();
    // Get the current year (YYYY)
    const currentYear = currentDate.getFullYear();
    // Get the current month (0-11)
    const currentMonth = currentDate.getMonth();
    // Use the current day, year, and month as seeds for the random number generator
    const seed = currentDay + '-' + currentYear + '-' + currentMonth;
    const random = seedrandom(seed);
    // Get a random index from the array
    const randomIndex = Math.floor(random() * words.length);
    // Return the word at the random index
    return words[randomIndex];
}

function getActiveWord() {
    return getRandomWord(wordsList);
}

export default function App() {
    const [guess, setGuess] = React.useState(defaultGuess)
    const [guessIndex, setGuessIndex] = React.useState(0)
    const [activeWord, setActiveWord] = React.useState(getActiveWord())
    const [modalVisible, setModalVisible] = useState(false);
    const [modalText, setModalText] = useState("lipsum");

    const guessMemo = React.useMemo(() => guess, [guess]);

    function rowError(guessIndex) {
        
    }

    function win() {
        setGuessIndex(guessIndex + 1)
        setTimeout(() => {
            alert("You won!")
        }, 500)

    }

    const handleKeyPress = (letter) => {

        if (guess[guessIndex].length > 5){
            return;
        }

        let newState = {... guess};
        if (letter === "⌫"){
            newState[guessIndex] = newState[guessIndex].slice(0, -1);
            setGuess(newState);
            return;
        }

        if (letter === "ENTER"){
            if (guess[guessIndex].length !== 5){
                rowError(guessIndex)
                return;
            }

            if (!wordsList.includes(guess[guessIndex].toLowerCase())){
                console.warn("Not in words list!")
                return;
            }

            if (guess[guessIndex].toLowerCase().trim() === activeWord.toLowerCase().trim()){
                win();
                return;
            }
            setGuessIndex(guessIndex + 1);
            return;
        }

        if (guess[guessIndex].length > 4){
            return;
        }

        newState[guessIndex] += letter;
        setGuess(newState);
    }

    const mainViewRef = useRef(null);

    const [theme, setTheme] = useState(Appearance.getColorScheme());
    Appearance.addChangeListener((scheme) => {
        console.log(scheme)
        setTheme(scheme.colorScheme)
    });
    styles = theme === "dark" ? darkMode : lightMode;
    const title = "Woordle";
    return (
        <SafeAreaView style={styles.main}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.container} ref={mainViewRef}>
                <TileRow
                    guess={guessMemo[0]}
                    styles={styles}
                    word={activeWord}
                    guessed={guessIndex > 0}>
                </TileRow>
                <TileRow
                    guess={guessMemo[1]}
                    styles={styles}
                    word={activeWord}
                    guessed={guessIndex > 1}>
                </TileRow>
                <TileRow
                    guess={guessMemo[2]}
                    styles={styles}
                    word={activeWord}
                    guessed={guessIndex > 2}>
                </TileRow>
                <TileRow
                    guess={guessMemo[3]}
                    styles={styles}
                    word={activeWord}
                    guessed={guessIndex > 3}>
                </TileRow>
                <TileRow
                    guess={guessMemo[4]}
                    styles={styles}
                    word={activeWord}
                    guessed={guessIndex > 4}>
                </TileRow>
                <TileRow
                    guess={guessMemo[5]}
                    styles={styles}
                    word={activeWord}
                    guessed={guessIndex > 5}>
                </TileRow>
                <StatusBar style="auto"/>
            </View>
            <Keyboard onKeyPress={handleKeyPress}></Keyboard>
        </SafeAreaView>
    );

}
const KeyboardRow = ({letters, onKeyPress}) => (
    <View style={styles.keyboardRow}>
        {letters.map(letter => (
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => onKeyPress(letter)}
                key={letter.toString()}
            >
                <View style={styles.key} >
                    <Text style={styles.keyLetter}>{letter}</Text>
                </View>
            </TouchableOpacity>
        ))}
    </View>
)

const Keyboard = ({onKeyPress}) => {
    const row1 = ["A", "Z", "E", "R", "T", "Y", "U", "I", "O", "P"]
    const row2 = ["Q", "S", "D", "F", "G", "H", "J", "K", "L"]
    const row3 = ["W", "X", "C", "V", "B", "N", "M", "⌫"]

    return (
        <View style={styles.keyboard}>
            <KeyboardRow letters={row1} onKeyPress={onKeyPress}/>
            <KeyboardRow letters={row2} onKeyPress={onKeyPress}/>
            <KeyboardRow letters={row3} onKeyPress={onKeyPress}/>
            <View style={styles.keyboardRow}>
                <TouchableOpacity onPress={() => onKeyPress("ENTER")}>
                    <View style={styles.key}>
                        <Text style={styles.keyLetter}>ENTER</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}
