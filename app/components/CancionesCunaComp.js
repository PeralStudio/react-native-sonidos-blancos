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
import { FontAwesome5 } from "@expo/vector-icons";
import { AdMobBanner } from "expo-ads-admob";

import Constants from "expo-constants";
import * as Notifications from "expo-notifications";

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
    const [playing, setPlaying] = useState(false);
    const [soundPicked, setSoundPicked] = useState(null);
    const [imagePicked, setimagePicked] = useState(null);
    const [soundPickedName, setSoundPickedName] = useState(null);

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
        const { sound } = await Audio.Sound.createAsync(soundPicked);
        setSound(sound);

        await sound.playAsync();
        await sound.setIsLoopingAsync(true);

        setPlaying(true);
    }

    const stopSound = async () => {
        await sound.stopAsync();
        setPlaying(false);
    };

    useEffect(() => {
        return sound
            ? () => {
                  sound.unloadAsync();
              }
            : undefined;
    }, [sound]);

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
                <View style={styles.player}>
                    <Image
                        source={imagePicked}
                        style={styles.imagePicked}
                        resizeMode="contain"
                    />
                </View>
                <TouchableOpacity
                    disabled={!soundPicked}
                    style={
                        soundPicked
                            ? styles.playButtonContainer
                            : styles.playButtonContainerDisabled
                    }
                    onPress={() => {
                        playing ? stopSound() : playSound(soundPicked);
                    }}
                >
                    <FontAwesome5
                        name={playing ? "stop" : "play"}
                        size={32}
                        color="#0a4b4f"
                    />
                </TouchableOpacity>
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
        flexDirection: "row",
        justifyContent: "space-around",
        position: "absolute",
        bottom: 0,
        alignItems: "center",
        // right: width / 2 - 150,
        backgroundColor: "rgba(83, 166, 164, 0.5)",
        width: width,
        paddingBottom: 5,
        paddingTop: 5,
    },
    containerButtons: {
        flexDirection: "row",
    },
    playButtonContainer: {
        backgroundColor: "#FFF",
        borderColor: "rgba(10, 75, 79, 0.4)",
        borderWidth: 16,
        width: 118,
        height: 118,
        borderRadius: 64,
        alignItems: "center",
        justifyContent: "center",
        // marginHorizontal: 32,
        shadowColor: "#5D3F6A",
        shadowRadius: 30,
        shadowOpacity: 0.5,
    },
    playButtonContainerDisabled: {
        backgroundColor: "#FFF",
        borderColor: "rgba(10, 75, 79, 0.4)",
        borderWidth: 16,
        width: 118,
        height: 118,
        borderRadius: 64,
        alignItems: "center",
        justifyContent: "center",
        // marginHorizontal: 32,
        shadowColor: "#5D3F6A",
        shadowRadius: 30,
        shadowOpacity: 0.5,
        opacity: 0.5,
    },
});

export default CancionesCunaComp;
