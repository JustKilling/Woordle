import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import {StatusBar} from 'expo-status-bar';
import {
    Appearance,
    Modal,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import React, {useEffect, useState} from "react";

const seedrandom = require('seedrandom');
import darkMode from "./themes/darkMode";
import lightMode from "./themes/lightMode";
import TileRow from "./components/TileRow";
import wordsList from "./words";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
const initialStats = {
    wordToday: getRandomWord(wordsList),
    nextWordDate: getTimeUntilNextWord(),
    lastWin: new Date().setDate(new Date() - 1),
    lastPlayed: new Date().setDate(new Date() - 1),
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
    guessIndex: 0,
    guess: {
        0: "",
        1: "",
        2: "",
        3: "",
        4: "",
        5: "",
    }
}

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

function isToday(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return today.getTime() === date.getTime();
}

function getTimeUntilNextDay() {
    const currentDate = new Date();
    const nextDay = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
    nextDay.setHours(0, 0, 0, 0);
    const timeUntilNextDay = nextDay - currentDate;
    return new Date(timeUntilNextDay).toISOString().substr(11, 8);
}

function hasWonToday(stats) {
    if (!stats) {
        return false;
    }
    return isToday(new Date(stats.lastWin))
}

function hasPlayedToday(stats) {
    if (!stats.lastPlayed) {
        return false;
    }
    return isToday(new Date(stats.lastPlayed))
}

let keyboardStyleTypes = {}
export default function App() {
    const [theme, setTheme] = useState(Appearance.getColorScheme());
    Appearance.addChangeListener((scheme) => {
        setTheme(scheme.colorScheme)
    });
    styles = theme === "dark" ? darkMode : lightMode;
    keyboardStyleTypes = {
        default: {
            key: styles.key,
            letter: styles.keyLetter
        },
        absent: {
            key: styles.keyAbsent,
            letter: styles.keyLetterAbsent
        },
        correct: {
            key: styles.keyCorrect,
            letter: styles.keyLetterCorrect
        },
        guessed: {
            key: styles.keyGuessed,
            letter: styles.keyLetterGuessed
        }
    }
    const [keyBoardStyling, setKeyboardStyling] = React.useState({
        a: keyboardStyleTypes.default,
        b: keyboardStyleTypes.default,
        c: keyboardStyleTypes.default,
        d: keyboardStyleTypes.default,
        e: keyboardStyleTypes.default,
        f: keyboardStyleTypes.default,
        g: keyboardStyleTypes.default,
        h: keyboardStyleTypes.default,
        i: keyboardStyleTypes.default,
        j: keyboardStyleTypes.default,
        k: keyboardStyleTypes.default,
        l: keyboardStyleTypes.default,
        m: keyboardStyleTypes.default,
        n: keyboardStyleTypes.default,
        o: keyboardStyleTypes.default,
        p: keyboardStyleTypes.default,
        q: keyboardStyleTypes.default,
        r: keyboardStyleTypes.default,
        s: keyboardStyleTypes.default,
        t: keyboardStyleTypes.default,
        u: keyboardStyleTypes.default,
        v: keyboardStyleTypes.default,
        w: keyboardStyleTypes.default,
        x: keyboardStyleTypes.default,
        y: keyboardStyleTypes.default,
        z: keyboardStyleTypes.default,
        default: keyboardStyleTypes.default
    })
    const [stats, setStats] = React.useState(initialStats)
    React.useEffect(() => {
        async function getStatsData() {
            try {
                const jsonValue = await AsyncStorage.getItem(statsKey)
                setStats(jsonValue != null ? JSON.parse(jsonValue) : initialStats)
                return jsonValue != null ? JSON.parse(jsonValue) : initialStats;
            } catch (e) {
                // read error
            }
        }

        getStatsData().then((s) =>{
            if (hasPlayedToday(s)) {
                setModalVisible(true)
            } else {
                stats.guessIndex = 0;
                stats.nextWordDate = initialStats.nextWordDate;
                stats.wordToday = initialStats.wordToday;
                stats.guess = initialStats.guess;
            }
        })





    }, [])

    React.useEffect(() => {
        const setStatsData = async () => {
            try {
                const jsonValue = JSON.stringify(stats)
                await AsyncStorage.setItem(statsKey, jsonValue)
            } catch (e) {
                // read error
            }
        }
        setStatsData();
    }, [stats])


    const [activeWord, setActiveWord] = React.useState(getActiveWord())
    const [modalVisible, setModalVisible] = useState(false);

    function win() {
        setStats(prevStats => {
            let newStats = {...prevStats};
            newStats.guessIndex++;
            newStats.lastWin = new Date().getTime();
            newStats.lastPlayed = new Date().getTime();
            newStats.currentStreak += 1;
            newStats.maxStreak = Math.max(newStats.maxStreak, newStats.currentStreak);
            newStats.gamesWon += 1;
            newStats.gamesPlayed += 1;
            newStats.winPercentage = newStats.gamesWon / newStats.gamesPlayed * 100;
            let index = (newStats.guessIndex).toString();
            newStats.guesses[index] = newStats.guesses[index] + 1;
            return newStats;
        });
        setTimeout(() => {
            setModalVisible(true)
        }, 100)
    }


    function loss() {
        setStats(prevStats => {
            let newStats = {...prevStats};
            newStats.guessIndex++;
            newStats.lastPlayed = new Date().getTime()  ;
            newStats.currentStreak = 0;
            newStats.gamesPlayed += 1;
            newStats.winPercentage = newStats.gamesWon / newStats.gamesPlayed * 100;
            newStats.guesses["fail"] = newStats.guesses["fail"] + 1;
            return newStats;
        });
        setTimeout(() => {
            setModalVisible(true)
        }, 100)
    }

    const handleKeyPress = (letter) => {

        if (stats && hasPlayedToday(stats)) {
            return;
        }

        if (stats.guess[stats.guessIndex].length > 5) {
            return;
        }

        let newState = {...stats};
        if (letter === "⌫") {
            newState.guess[stats.guessIndex] = newState.guess[stats.guessIndex].slice(0, -1);
            setStats(newState);
            return;
        }

        if (letter === "ENTER") {

            if (stats.guess[stats.guessIndex].length !== 5) {
                return;
            }
            if (!wordsList.includes(stats.guess[stats.guessIndex].toLowerCase())) {
                return;
            }

            if (stats.guess[stats.guessIndex].toLowerCase().trim() === activeWord.toLowerCase().trim()) {
                win();
                return;
            }

            if (stats.guessIndex === Object.keys(defaultGuess).length - 1) {
                loss();
                return;
            }

            newState.guessIndex++;
            setStats(newState);
            return;
        }

        if (stats.guess[stats.guessIndex].length > 4) {
            return;
        }

        newState.guess[stats.guessIndex] += letter;

        setStats(newState);
    }


    const title = "Woordle";
    if (!stats) return;
    //ckeck keyboard
    if (stats.guessIndex > 0) {
        let correctLetters = [];
        for (const [index, value] of Object.entries(stats.guess)) {
            if (index < stats.guessIndex){
                value.split("").forEach((l, i) => {
                    l = l.toLowerCase();
                    if (correctLetters.includes(l)) return;
                    if (stats.wordToday.includes(l)) {
                        keyBoardStyling[l] = keyboardStyleTypes.guessed;
                        //check correct
                        if (stats.wordToday[i] === l) {
                            keyBoardStyling[l] = keyboardStyleTypes.correct;
                            correctLetters.push(l)
                        }
                    }else{
                        keyBoardStyling[l] = keyboardStyleTypes.absent;
                    }
                })
            }
        }

    }


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
                                <CloseIcon></CloseIcon>
                            </TouchableOpacity>
                        </View>


                        <Text style={styles.modalText}>Je
                            bent {hasWonToday(stats) ? "gewonnen!" : "verloren :("}</Text>
                        <Text style={styles.modalText}>Het woord was:</Text>
                        <Text style={styles.modalWord}>{activeWord.toUpperCase()}</Text>

                        <Text style={styles.modalText}>Volgende WOORDLE in:</Text>
                        <TimeDisplay styles={styles}></TimeDisplay>

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
                        guess={stats.guess[0]}
                        styles={styles}
                        word={activeWord}
                        guessed={stats.guessIndex > 0}>
                    </TileRow>
                    <TileRow
                        guess={stats.guess[1]}
                        styles={styles}
                        word={activeWord}
                        guessed={stats.guessIndex > 1}>
                    </TileRow>
                    <TileRow
                        guess={stats.guess[2]}
                        styles={styles}
                        word={activeWord}
                        guessed={stats.guessIndex > 2}>
                    </TileRow>
                    <TileRow
                        guess={stats.guess[3]}
                        styles={styles}
                        word={activeWord}
                        guessed={stats.guessIndex > 3}>
                    </TileRow>
                    <TileRow
                        guess={stats.guess[4]}
                        styles={styles}
                        word={activeWord}
                        guessed={stats.guessIndex > 4}>
                    </TileRow>
                    <TileRow
                        guess={stats.guess[5]}
                        styles={styles}
                        word={activeWord}
                        guessed={stats.guessIndex > 5}>
                    </TileRow>
                    <StatusBar style="auto"/>
                </View>
                <Keyboard onKeyPress={handleKeyPress} styling={keyBoardStyling} stats={stats}></Keyboard>
            </View>
        </SafeAreaView>
    );

}
const KeyboardRow = ({letters, onKeyPress, styling}) => {
    return (
        <View style={styles.keyboardRow}>
            {letters.map(letter => {
                //console.log(styling[letter.toLowerCase()])
                let keyStyle = styling[letter.toLowerCase()] ? styling[letter.toLowerCase()].key : styling.default.key;
                let letterStyle = styling[letter.toLowerCase()] ? styling[letter.toLowerCase()].letter : styling.default.letter;

                return (
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => onKeyPress(letter)}
                        key={letter.toString()}
                    >
                        <View style={keyStyle}>
                            <Text
                                style={letterStyle}>{letter}</Text>
                        </View>
                    </TouchableOpacity>
                );
            })}
        </View>
    )
}


const TimeDisplay = ({styles}) => {
    const [time, setTime] = React.useState(getTimeUntilNextDay());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(getTimeUntilNextDay());
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    return (
        <Text style={styles.modalWord}>{time}</Text>
    )
}

function CloseIcon() {
    return <FontAwesomeIcon style={[styles.modalText]} size={60} icon={faTimes}/>;
}

const Keyboard = ({onKeyPress, styling, stats}) => {
    const row1 = ["A", "Z", "E", "R", "T", "Y", "U", "I", "O", "P"]
    const row2 = ["Q", "S", "D", "F", "G", "H", "J", "K", "L"]
    const row3 = ["W", "X", "C", "V", "B", "N", "M", "⌫"]

    return (
        <View style={styles.keyboard}>
            <KeyboardRow letters={row1} onKeyPress={onKeyPress} styling={styling}/>
            <KeyboardRow letters={row2} onKeyPress={onKeyPress} styling={styling}/>
            <KeyboardRow letters={row3} onKeyPress={onKeyPress} styling={styling}/>
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
