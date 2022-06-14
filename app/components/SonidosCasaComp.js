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

import vaccumImage from "../../assets/images/sonidosCasa/vaccum.png";
import dryerImage from "../../assets/images/sonidosCasa/dryer.png";
import washingImage from "../../assets/images/sonidosCasa/washing.png";
import keyboardImage from "../../assets/images/sonidosCasa/keyboard.png";
import writtingImage from "../../assets/images/sonidosCasa/writting.png";
import tictacImage from "../../assets/images/sonidosCasa/tictac.png";
import showerImage from "../../assets/images/sonidosCasa/shower.png";
import razorImage from "../../assets/images/sonidosCasa/razor.png";

const vaccumSound = require("../../assets/sounds/sonidosCasa/vaccum.m4a");
const dryerSound = require("../../assets/sounds/sonidosCasa/dryer.m4a");
const washingSound = require("../../assets/sounds/sonidosCasa/washing.m4a");
const keyboardSound = require("../../assets/sounds/sonidosCasa/keyboard.m4a");
const writtingSound = require("../../assets/sounds/sonidosCasa/writting.m4a");
const tictacSound = require("../../assets/sounds/sonidosCasa/tictac.m4a");
const showerSound = require("../../assets/sounds/sonidosCasa/shower.m4a");
const razorSound = require("../../assets/sounds/sonidosCasa/razor.m4a");

const vaccumSoundName = "Sonido Aspiradora";
const dryerSoundName = "Sonido Secador";
const washingSoundName = "Sonido Lavadora";
const keyboardSoundName = "Sonido Teclado";
const writtingSoundName = "Sonido Escritura";
const tictacSoundName = "Sonido TicTac Reloj";
const showerSoundName = "Sonido Ducha";
const razorSoundName = "Sonido Maquina de Afeitar";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const SonidosDeCasaComp = () => {
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
                        adUnitID="ca-app-pub-6203383529182342/1839237229"
                        servePersonalizedAds={true}
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
                                image={vaccumImage}
                                onPress={() => {
                                    setSoundPicked(vaccumSound);
                                    setimagePicked(vaccumImage);
                                    setSoundPickedName(vaccumSoundName);
                                    playing
                                        ? stopSound()
                                        : playSound(vaccumSound);
                                    imagePicked !== vaccumImage &&
                                        playSound(vaccumSound);
                                }}
                            />
                            <Cardsound
                                image={dryerImage}
                                onPress={() => {
                                    setSoundPicked(dryerSound);
                                    setimagePicked(dryerImage);
                                    setSoundPickedName(dryerSoundName);
                                    playing
                                        ? stopSound()
                                        : playSound(dryerSound);
                                    imagePicked !== dryerImage &&
                                        playSound(dryerSound);
                                }}
                            />
                            <Cardsound
                                image={washingImage}
                                onPress={() => {
                                    setSoundPicked(washingSound);
                                    setimagePicked(washingImage);
                                    setSoundPickedName(washingSoundName);
                                    playing
                                        ? stopSound()
                                        : playSound(washingSound);
                                    imagePicked !== washingImage &&
                                        playSound(washingSound);
                                }}
                            />
                        </View>
                        <View>
                            <Cardsound
                                image={keyboardImage}
                                onPress={() => {
                                    setSoundPicked(keyboardSound);
                                    setimagePicked(keyboardImage);
                                    setSoundPickedName(keyboardSoundName);
                                    playing
                                        ? stopSound()
                                        : playSound(keyboardSound);
                                    imagePicked !== keyboardImage &&
                                        playSound(keyboardSound);
                                }}
                            />
                            <Cardsound
                                image={writtingImage}
                                onPress={() => {
                                    setSoundPicked(writtingSound);
                                    setimagePicked(writtingImage);
                                    setSoundPickedName(writtingSoundName);
                                    playing
                                        ? stopSound()
                                        : playSound(writtingSound);
                                    imagePicked !== writtingImage &&
                                        playSound(writtingSound);
                                }}
                            />
                            <Cardsound
                                image={tictacImage}
                                onPress={() => {
                                    setSoundPicked(tictacSound);
                                    setimagePicked(tictacImage);
                                    setSoundPickedName(tictacSoundName);
                                    playing
                                        ? stopSound()
                                        : playSound(tictacSound);
                                    imagePicked !== tictacImage &&
                                        playSound(tictacSound);
                                }}
                            />
                        </View>
                        <View>
                            <Cardsound
                                image={showerImage}
                                onPress={() => {
                                    setSoundPicked(showerSound);
                                    setimagePicked(showerImage);
                                    setSoundPickedName(showerSoundName);
                                    playing
                                        ? stopSound()
                                        : playSound(showerSound);
                                    imagePicked !== showerImage &&
                                        playSound(showerSound);
                                }}
                            />
                            <Cardsound
                                image={fanImage}
                                onPress={() => {
                                    setSoundPicked(fanSound);
                                    setimagePicked(fanImage);
                                    setSoundPickedName(fanSoundName);
                                    playing ? stopSound() : playSound(fanSound);
                                    imagePicked !== fanImage &&
                                        playSound(fanSound);
                                }}
                            />
                            <Cardsound
                                image={razorImage}
                                onPress={() => {
                                    setSoundPicked(razorSound);
                                    setimagePicked(razorImage);
                                    setSoundPickedName(razorSoundName);
                                    playing
                                        ? stopSound()
                                        : playSound(razorSound);
                                    imagePicked !== razorImage &&
                                        playSound(razorSound);
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

export default SonidosDeCasaComp;
