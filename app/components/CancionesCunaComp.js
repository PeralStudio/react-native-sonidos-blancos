import React, { useEffect, useRef, useState } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Image,
    ImageBackground,
    AppState,
} from "react-native";
import { Audio } from "expo-av";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";

import Constants from "expo-constants";
import { AdMobBanner } from "expo-ads-admob";
import * as Notifications from "expo-notifications";
import { activateKeepAwake, deactivateKeepAwake } from "expo-keep-awake";
import Slider from "@react-native-community/slider";
import { addTotalTimeListened } from "../services/totalTimeListened";
import { useNavigation } from "@react-navigation/native";
import Cardsound from "./CardSound";

import cuna2Image from "../../assets/images/cancionesCuna/cuna2.png";
import cuna3Image from "../../assets/images/cancionesCuna/cuna3.png";
import cuna4Image from "../../assets/images/cancionesCuna/cuna4.png";
import cuna5Image from "../../assets/images/cancionesCuna/cuna5.png";
import cuna6Image from "../../assets/images/cancionesCuna/cuna6.png";
import cuna7Image from "../../assets/images/cancionesCuna/cuna7.png";

const cuna2Sound = require("../../assets/sounds/cancionesCuna/cuna2.m4a");
const cuna3Sound = require("../../assets/sounds/cancionesCuna/cuna3.m4a");
const cuna4Sound = require("../../assets/sounds/cancionesCuna/cuna4.m4a");
const cuna5Sound = require("../../assets/sounds/cancionesCuna/cuna5.m4a");
const cuna6Sound = require("../../assets/sounds/cancionesCuna/cuna6.m4a");
const cuna7Sound = require("../../assets/sounds/cancionesCuna/cuna7.m4a");

const cuna2SoundName = "Sonido Cuna 1";
const cuna3SoundName = "Sonido Cuna 2";
const cuna4SoundName = "Sonido Cuna 3";
const cuna5SoundName = "Sonido Cuna 4";
const cuna6SoundName = "Sonido Cuna 5";
const cuna7SoundName = "Sonido Cuna 6";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const CancionesCunaComp = () => {
    const [sound, setSound] = useState();
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [soundPicked, setSoundPicked] = useState(null);
    const [imagePicked, setimagePicked] = useState(null);
    const [soundPickedName, setSoundPickedName] = useState(null);
    const [timeListened, setTimeListened] = useState({
        initialTime: 0,
        finalTime: 0,
    });

    const sound2 = useRef(new Audio.Sound());

    const navigation = useNavigation();
    navigation.addListener("beforeRemove", () => {
        console.log("beforeRemove");
        goBackFinish();
        stopSound();
    });

    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);

    useEffect(() => {
        Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            staysActiveInBackground: true,
            interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
            playThroughEarpieceAndroid: false,
        });
    }, []);

    async function playSound(soundPicked) {
        await sound2.current.unloadAsync();
        const result = await sound2.current.loadAsync(soundPicked, {}, true);

        setSoundPicked(soundPicked);
        await sound2.current.playAsync();
        await sound2.current.setIsLoopingAsync(true);
        setPlaying(true);
        sound2.current.setOnPlaybackStatusUpdate(UpdateStatus);

        if (result.isLoaded === true) {
            setDuration(result.durationMillis);
        }

        setPlaying(true);

        if (timeListened.initialTime === 0) {
            setTimeListened({
                ...timeListened,
                initialTime: new Date().getTime(),
            });
        }

        console.log("play");
        activateKeepAwake();
    }

    const UpdateStatus = async (data) => {
        try {
            if (data.didJustFinish) {
                setCurrentTime(0);
            } else if (data.positionMillis) {
                setCurrentTime(data.positionMillis);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const finishTimeListened = () => {
        if (timeListened.initialTime !== 0) {
            setTimeListened({
                ...timeListened,
                finalTime: new Date().getTime(),
            });
            console.log("doscosas", timeListened);
            console.log(
                "resta",
                timeListened.finalTime - timeListened.initialTime
            );
            addTotalTimeListened(
                new Date().getTime() - timeListened.initialTime
            );
            setTimeListened({
                initialTime: 0,
                finalTime: 0,
            });
        }
    };

    const goBackFinish = () => {
        console.log(
            "goBackFinish",
            timeListened.finalTime - timeListened.initialTime
        );
        timeListened.initialTime > 0 &&
            addTotalTimeListened(
                timeListened.finalTime - timeListened.initialTime
            );
        deactivateKeepAwake();
    };

    const stopSound = async () => {
        await sound2.current.stopAsync();
        setPlaying(false);
        setCurrentTime(0);
        finishTimeListened();
        deactivateKeepAwake();
    };

    useEffect(() => {
        AppState.addEventListener("change", _handleAppStateChange);

        return () => {
            AppState.removeEventListener("change", _handleAppStateChange);
        };
    }, [playing, soundPickedName]);

    const _handleAppStateChange = (nextAppState) => {
        if (nextAppState === "background" && playing) {
            Notifications.scheduleNotificationAsync({
                content: {
                    title: `Escuchando: ${soundPickedName}`,
                    body: "Volver a la Aplicación",
                    data: { data: "goes here" },
                },
                trigger: { seconds: 2 },
            });
        }
        if (
            appState.current.match(/inactive|background/) &&
            nextAppState === "active"
        ) {
            // console.log("App has come to the foreground!");
        }

        appState.current = nextAppState;
        setAppStateVisible(appState.current);
        console.log("AppState", appState.current);
    };

    useEffect(() => {
        async function registerForPushNotificationsAsync() {
            let token;
            if (Constants.isDevice) {
                const { status: existingStatus } =
                    await Notifications.getPermissionsAsync();
                let finalStatus = existingStatus;
                if (existingStatus !== "granted") {
                    const { status } =
                        await Notifications.requestPermissionsAsync();
                    finalStatus = status;
                }
                if (finalStatus !== "granted") {
                    alert("Failed to get push token for push notification!");
                    return;
                }
                token = (await Notifications.getExpoPushTokenAsync()).data;
                console.log(token);
            } else {
                alert("Must use physical device for Push Notifications");
            }

            if (Platform.OS === "android") {
                Notifications.setNotificationChannelAsync("default", {
                    name: "default",
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: "#FF231F7C",
                });
            }
        }
        registerForPushNotificationsAsync();
    }, []);

    const forward = async (milisec) => {
        let milis;
        await sound2.current.getStatusAsync().then((status) => {
            milis = status.positionMillis;
        });
        await sound2.current.setPositionAsync(milis + milisec);
    };

    const rewind = async (milisec) => {
        let milis;
        await sound2.current.getStatusAsync().then((status) => {
            milis = status.positionMillis;
        });
        await sound2.current.setPositionAsync(milis - milisec);
    };

    return (
        <>
            <View>
                <ImageBackground
                    source={require("../../assets/images/background.jpg")}
                    style={styles.containerBackground}
                >
                    <AdMobBanner
                        bannerSize="smartBannerPortrait"
                        adUnitID="ca-app-pub-6203383529182342/8568297103"
                        onDidFailToReceiveAdWithError={(err) =>
                            console.log(err)
                        }
                        style={{
                            marginTop: height * 0.1,
                        }}
                    />
                    <View style={styles.container}>
                        <View>
                            <Cardsound
                                image={cuna2Image}
                                onPress={() => {
                                    setSoundPicked(cuna2Sound);
                                    setimagePicked(cuna2Image);
                                    setSoundPickedName(cuna2SoundName);
                                    playing
                                        ? stopSound()
                                        : playSound(cuna2Sound);
                                    imagePicked !== cuna2Image &&
                                        playSound(cuna2Sound);
                                }}
                            />
                            <Cardsound
                                image={cuna3Image}
                                onPress={() => {
                                    setSoundPicked(cuna3Sound);
                                    setimagePicked(cuna3Image);
                                    setSoundPickedName(cuna3SoundName);
                                    playing
                                        ? stopSound()
                                        : playSound(cuna3Sound);
                                    imagePicked !== cuna3Image &&
                                        playSound(cuna3Sound);
                                }}
                            />
                        </View>
                        <View>
                            <Cardsound
                                image={cuna4Image}
                                onPress={() => {
                                    setSoundPicked(cuna4Sound);
                                    setimagePicked(cuna4Image);
                                    setSoundPickedName(cuna4SoundName);
                                    playing
                                        ? stopSound()
                                        : playSound(cuna4Sound);
                                    imagePicked !== cuna4Image &&
                                        playSound(cuna4Sound);
                                }}
                            />
                            <Cardsound
                                image={cuna5Image}
                                onPress={() => {
                                    setSoundPicked(cuna5Sound);
                                    setimagePicked(cuna5Image);
                                    setSoundPickedName(cuna5SoundName);
                                    playing
                                        ? stopSound()
                                        : playSound(cuna5Sound);
                                    imagePicked !== cuna5Image &&
                                        playSound(cuna5Sound);
                                }}
                            />
                        </View>
                        <View>
                            <Cardsound
                                image={cuna6Image}
                                onPress={() => {
                                    setSoundPicked(cuna6Sound);
                                    setimagePicked(cuna6Image);
                                    setSoundPickedName(cuna6SoundName);
                                    playing
                                        ? stopSound()
                                        : playSound(cuna6Sound);
                                    imagePicked !== cuna6Image &&
                                        playSound(cuna6Sound);
                                }}
                            />
                            <Cardsound
                                image={cuna7Image}
                                onPress={() => {
                                    setSoundPicked(cuna7Sound);
                                    setimagePicked(cuna7Image);
                                    setSoundPickedName(cuna7SoundName);
                                    playing
                                        ? stopSound()
                                        : playSound(cuna7Sound);
                                    imagePicked !== cuna7Image &&
                                        playSound(cuna7Sound);
                                }}
                            />
                        </View>
                    </View>
                </ImageBackground>
            </View>
            <View style={styles.containerPlayer}>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                    }}
                >
                    <View style={styles.player}>
                        <Image
                            source={imagePicked}
                            style={styles.imagePicked}
                            resizeMode="contain"
                        />
                    </View>
                    <View
                        style={{
                            flexDirection: "column",
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "column",
                                marginBottom: -35,
                            }}
                        >
                            <Slider
                                style={styles.slider_style}
                                minimumValue={0}
                                maximumValue={duration / 1000}
                                minimumTrackTintColor={"red"}
                                maximumTrackTintColor="#d3d3d3"
                                thumbTintColor={"red"}
                                value={currentTime / 1000}
                                onSlidingStart={() => {
                                    if (!playing) {
                                        return;
                                    }
                                }}
                                onSlidingComplete={async (value) => {
                                    if (!playing) {
                                        return;
                                    } else {
                                        await sound2.current.setPositionAsync(
                                            value * 1000
                                        );
                                        setCurrentTime(value * 1000);
                                    }
                                }}
                            />
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <TouchableOpacity
                                disabled={!playing}
                                onPress={() => {
                                    rewind(30000);
                                }}
                            >
                                {playing ? (
                                    <MaterialCommunityIcons
                                        name="rewind-30"
                                        size={40}
                                        color="white"
                                    />
                                ) : (
                                    <MaterialCommunityIcons
                                        name="rewind-30"
                                        size={40}
                                        color="rgba(10, 75, 79, 0.4)"
                                    />
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity
                                disabled={!soundPicked}
                                style={
                                    soundPicked
                                        ? styles.playButtonContainer
                                        : styles.playButtonContainerDisabled
                                }
                                onPress={() => {
                                    playing
                                        ? stopSound()
                                        : playSound(soundPicked);
                                }}
                            >
                                <FontAwesome5
                                    name={playing ? "stop" : "play"}
                                    size={32}
                                    color="#0a4b4f"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                disabled={!playing}
                                onPress={() => {
                                    forward(30000);
                                }}
                            >
                                {playing ? (
                                    <MaterialCommunityIcons
                                        name="fast-forward-30"
                                        size={40}
                                        color="white"
                                    />
                                ) : (
                                    <MaterialCommunityIcons
                                        name="fast-forward-30"
                                        size={40}
                                        color="rgba(10, 75, 79, 0.4)"
                                    />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    containerBackground: {
        height: "100%",
        justifyContent: "center",
    },
    container: {
        flexDirection: "row",
        // backgroundColor: "#307473",
        justifyContent: "space-around",
        height: "100%",
    },
    imagePicked: {
        width: 80,
        height: 90,
    },
    player: {
        backgroundColor: "#94DBDF",
        padding: 10,
        marginRight: -20,
        borderRadius: 15,
    },
    containerPlayer: {
        // flexDirection: "row",
        // justifyContent: "space-around",
        position: "absolute",
        bottom: 0,
        // alignItems: "center",
        // right: width / 2 - 150,
        backgroundColor: "#53A6A4",
        width: width,
        paddingBottom: 5,
        paddingTop: 5,
    },
    slider_style: {
        height: "45%",
        width: "100%",
    },
    containerButtons: {
        flexDirection: "row",
    },
    playButtonContainer: {
        backgroundColor: "#FFF",
        borderColor: "rgba(10, 75, 79, 0.4)",
        borderWidth: 8,
        width: 80,
        height: 80,
        borderRadius: 64,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#5D3F6A",
        shadowRadius: 30,
        shadowOpacity: 0.5,
        marginHorizontal: 5,
    },
    playButtonContainerDisabled: {
        backgroundColor: "#FFF",
        borderColor: "rgba(10, 75, 79, 0.4)",
        borderWidth: 8,
        width: 80,
        height: 80,
        borderRadius: 64,
        alignItems: "center",
        justifyContent: "center",
        // marginHorizontal: 32,
        shadowColor: "#5D3F6A",
        shadowRadius: 30,
        shadowOpacity: 0.5,
        opacity: 0.5,
        marginHorizontal: 5,
    },
});

export default CancionesCunaComp;
