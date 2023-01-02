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
import asyncStorage from "@react-native-async-storage/async-storage/src/AsyncStorage";
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
const guessKey = "@guess";
const initialStats = {
    wordToday: getRandomWord(wordsList),
    nextWordDate: getTimeUntilNextWord(),
    lastWin: new Date(new Date().setDate(new Date() - 1)),
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
    guessIndex: 0

}
let stats = initialStats;


function getTimeUntilNextWord() {
    const tomorrow = new Date();
    const currentDate = new Date();
    tomorrow.setDate(currentDate.getDate() + 1);

    return currentDate;
}

let daskfl = "";

function getRandomWord(words) {
    if (daskfl) return daskfl;
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
    daskfl = words[randomIndex];
    return daskfl;
}

function getActiveWord() {
    return getRandomWord(wordsList);
}

async function getStats() {
    try {
        const jsonValue = await AsyncStorage.getItem(statsKey)
        return jsonValue != null ? JSON.parse(jsonValue) : stats
    } catch (e) {
        // read error
    }
}

const setStats = async (value) => {
    try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem(statsKey, jsonValue)
    } catch (e) {
        // save error
    }
}

function isToday(date) {
    const today = new Date();

    return today.getFullYear() === date.getFullYear() &&
        today.getMonth() === date.getMonth() &&
        today.getDate() === date.getDate();

}

function getTimeUntilNextDay() {
    const currentDate = new Date();
    const nextDay = new Date(currentDate);
    nextDay.setDate(nextDay.getDate() + 1);
    nextDay.setHours(0, 0, 0, 0);
    const timeUntilNextDay = nextDay.getTime() - currentDate.getTime();
    const hours = Math.floor(timeUntilNextDay / 1000 / 60 / 60);
    const minutes = Math.floor((timeUntilNextDay / 1000 / 60) % 60);
    const seconds = Math.floor((timeUntilNextDay / 1000) % 60);
    const hoursString = hours.toString().padStart(2, '0');
    const minutesString = minutes.toString().padStart(2, '0');
    const secondsString = seconds.toString().padStart(2, '0');
    return `${hoursString}:${minutesString}:${secondsString}`;
}


function hasWonToday(stats) {
    if (!stats) return false;
    return isToday(new Date(stats.lastWin))
}

export default function App() {
    const [guess, setGuess] = React.useState(defaultGuess)


    React.useEffect(()=>{
        const getGuessData = async function () {
            try {
                const jsonValue = await AsyncStorage.getItem(guessKey)
                return jsonValue != null ? JSON.parse(jsonValue) : defaultGuess
            } catch (e) {
                // read error
            }
        }
        getGuessData().then(d => setGuess(d))
        getStats().then(s => stats = s)
    }, [])

    React.useEffect(() => {
        const setGuessData = async () => {
            try {
                console.warn(guess)
                const jsonValue = JSON.stringify(guess)
                await AsyncStorage.setItem(guessKey, jsonValue)
            } catch (e) {
                // read error
            }
        }
        setGuessData();
        setStats(stats)
    })

    const [guessIndex, setGuessIndex] = React.useState(0)
    const [activeWord, setActiveWord] = React.useState(getActiveWord())
    const [timeNextWord, setTimeNextWord] = React.useState(getTimeUntilNextDay())
    const [modalVisible, setModalVisible] = useState(false);
    const [modalText, setModalText] = useState("lipsum");

    const guessMemo = React.useMemo(() => guess, [guess]);

    useEffect(() => {
        getStats().then((s) => {
            stats = s ? s : initialStats;
            if (hasWonToday(stats)) {
                setModalVisible(true)
            }
        })
    }, [])

    function rowError(guessIndex) {

    }

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeNextWord(getTimeUntilNextDay());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    function win() {
        let prevGuessIndex = guessIndex;
        prevGuessIndex++;
        setGuessIndex(prevGuessIndex)

        setTimeout(() => {
            setModalVisible(true)
        }, 100)

        // Update the stats object
        stats.lastWin = new Date();
        stats.currentStreak += 1;
        stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
        stats.gamesWon += 1;
        stats.gamesPlayed += 1;
        stats.winPercentage = stats.gamesWon / stats.gamesPlayed * 100;
        let index = (guessIndex + 1).toString();
        stats.guesses[index] = stats.guesses[index] + 1;
        setStats(stats).then(r => r);
    }

    function loss() {
        let prevGuessIndex = guessIndex;
        prevGuessIndex++;
        setGuessIndex(prevGuessIndex)

        setTimeout(() => {
            setModalVisible(true)
        }, 100)

        // Update the stats object
        stats.currentStreak = 0;
        stats.gamesPlayed += 1;
        stats.winPercentage = stats.gamesWon / stats.gamesPlayed * 100;
        stats.guesses["fail"] = stats.guesses["fail"] + 1

        setStats(stats).then(r => r);

    }

    const handleKeyPress = (letter) => {


        if (stats && hasWonToday(stats)) {
            return;
        }


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
            <Modal visible={modalVisible} transparent={true} style={styles.modal}>
                <View style={styles.modalView}>
                    <View style={styles.modalFinal}>

                        <View style={{
                            position: "absolute",
                            right: 10,
                            top: 10
                        }}>
                            <TouchableOpacity onPress={() => {
                                setModalVisible(false)
                            }} style={{height: 50, alignItems: 'center', justifyContent: 'center'}}>
                                <Text style={[styles.modalText, {fontSize: 32}]}>✖</Text>
                            </TouchableOpacity>
                        </View>


                        <Text style={styles.modalText}>Je bent {hasWonToday(stats) ? "gewonnen!" : "verloren :("}</Text>
                        <Text style={styles.modalText}>Het woord was:</Text>
                        <Text style={styles.modalWord}>{activeWord.toUpperCase()}</Text>

                        <Text style={styles.modalText}>Volgende WOORDLE in:</Text>
                        <Text style={styles.modalWord}>{timeNextWord ? timeNextWord.toString() : ""}</Text>

                        <Text style={styles.modalBold}>STATISTIEK</Text>
                        <View style={styles.table}>
                            <View style={styles.tableColumn}>
                                <Text style={styles.tableText}>{stats.gamesPlayed}</Text>
                                <Text style={styles.tableTextSmall}>Gespeeld</Text>
                            </View>
                            <View style={styles.tableColumn}>
                                <Text
                                    style={styles.tableText}>{stats.winPercentage ? stats.winPercentage.toFixed() : 0}</Text>
                                <Text style={styles.tableTextSmall}>Win %</Text>
                            </View>
                            <View style={styles.tableColumn}>
                                <Text style={styles.tableText}>{stats.currentStreak}</Text>
                                <Text style={styles.tableTextSmall}>Huidige streak</Text>
                            </View>
                            <View style={styles.tableColumn}>
                                <Text style={styles.tableText}>{stats.maxStreak}</Text>
                                <Text style={styles.tableTextSmall}>Max streak</Text>
                            </View>
                        </View>

                        <Text style={styles.modalBold}>VERDELING</Text>
                        <Text style={styles.modalText}>
                            {stats ? `1: ${stats.guesses["1"]}
2: ${stats.guesses["2"]}
3: ${stats.guesses["3"]}
4: ${stats.guesses["4"]}
5: ${stats.guesses["5"]}
6: ${stats.guesses["6"]}
fail: ${stats.guesses.fail}` : ""}
                        </Text>
                    </View>
                </View>
            </Modal>
            <View style={styles.main}>
                <Text style={styles.title}>{title}</Text>
                <View style={styles.container}>
                    <TileRow
                        guess={guessMemo[0]}
                        styles={styles}
                        word={activeWord}
                        guessed={guessIndex > 0 || hasWonToday()}>
                    </TileRow>
                    <TileRow
                        guess={guessMemo[1]}
                        styles={styles}
                        word={activeWord}
                        guessed={guessIndex > 1 || hasWonToday()}>
                    </TileRow>
                    <TileRow
                        guess={guessMemo[2]}
                        styles={styles}
                        word={activeWord}
                        guessed={guessIndex > 2 || hasWonToday()}>
                    </TileRow>
                    <TileRow
                        guess={guessMemo[3]}
                        styles={styles}
                        word={activeWord}
                        guessed={guessIndex > 3 || hasWonToday()}>
                    </TileRow>
                    <TileRow
                        guess={guessMemo[4]}
                        styles={styles}
                        word={activeWord}
                        guessed={guessIndex > 4 || hasWonToday()}>
                    </TileRow>
                    <TileRow
                        guess={guessMemo[5]}
                        styles={styles}
                        word={activeWord}
                        guessed={guessIndex > 5 || hasWonToday()}>
                    </TileRow>
                    <StatusBar style="auto"/>
                </View>
                <Keyboard onKeyPress={handleKeyPress}></Keyboard>
            </View>
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
