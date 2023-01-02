import {StatusBar} from 'expo-status-bar';
import {
    Alert,
    Appearance, Button,
    Modal,
    Platform,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import React, {useEffect, useRef, useState} from "react";

const seedrandom = require('seedrandom');
import darkMode from "./themes/darkMode";
import lightMode from "./themes/lightMode";
import TileRow from "./components/TileRow";
import wordsList from "./words";
import AsyncStorage from "@react-native-async-storage/async-storage";
//import asyncStorageNative from "@react-native-async-storage/async-storage/src/AsyncStorage.native";

let styles;

const defaultGuess = {
    0: "",
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
}

const statsKey = "@stats";

const stats = {
    wordToday: getRandomWord(wordsList),
    nextWordDate: getTimeUntilNextWord(),
    lastWin: new Date().setDate(new Date() - 1),
    currentStreak: 0,
    maxStreak: 0,
    gamesWon: 0,
    gamesPlayed: 0,
    guesses: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        fail: 0,
    },
}

function getTimeUntilNextWord() {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);
    return currentDate;
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

const getStats = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(statsKey)
        return jsonValue != null ? JSON.parse(jsonValue) : null
    } catch(e) {
        // read error
    }
}
const setStats = async (value) => {
    try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem(statsKey, jsonValue)
    } catch(e) {
        // save error
    }
}

export default function App() {
    const [guess, setGuess] = React.useState(defaultGuess)
    const [guessIndex, setGuessIndex] = React.useState(0)
    const [activeWord, setActiveWord] = React.useState(getActiveWord())
    const [modalVisible, setModalVisible] = useState(true);
    const [modalText, setModalText] = useState("lipsum");

    const guessMemo = React.useMemo(() => guess, [guess]);

    function rowError(guessIndex) {

    }

    function win() {
        setGuessIndex(guessIndex + 1)
        setTimeout(() => {
            setModalVisible(true)
        }, 500)

        // Update the stats object
        stats.lastWin = new Date();
        stats.currentStreak += 1;
        stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
        stats.gamesWon += 1;
        stats.gamesPlayed += 1;
        stats.winPercentage = stats.gamesWon / stats.gamesPlayed * 100;

        setStats(stats).then(r => r);
    }

    function loss() {
        setGuessIndex(guessIndex + 1)

        setTimeout(() => {
            alert("You lost!")
        }, 500)
    }

    const handleKeyPress = (letter) => {

        if (guess[guessIndex].length > 5) {
            return;
        }

        let newState = {...guess};
        if (letter === "⌫") {
            newState[guessIndex] = newState[guessIndex].slice(0, -1);
            setGuess(newState);
            return;
        }

        if (letter === "ENTER") {
            if (guess[guessIndex].length !== 5) {
                rowError(guessIndex)
                return;
            }

            if (!wordsList.includes(guess[guessIndex].toLowerCase())) {
                console.warn("Not in words list!")
                return;
            }

            if (guess[guessIndex].toLowerCase().trim() === activeWord.toLowerCase().trim()) {
                win();
                return;
            }

            if (guessIndex === Object.keys(defaultGuess).length - 1) {
                loss();
            }

            setGuessIndex(guessIndex + 1);
            return;
        }

        if (guess[guessIndex].length > 4) {
            return;
        }

        newState[guessIndex] += letter;
        setGuess(newState);
    }

    const [theme, setTheme] = useState(Appearance.getColorScheme());
    Appearance.addChangeListener((scheme) => {
        setTheme(scheme.colorScheme)
    });
    styles = theme === "dark" ? darkMode : lightMode;
    const title = "Woordle";
    return (
        <SafeAreaView style={styles.main}>
            <View style={styles.modal}>
                <Text style={styles.text}>test</Text>
            </View>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.container}>
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
                <View style={styles.key}>
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
