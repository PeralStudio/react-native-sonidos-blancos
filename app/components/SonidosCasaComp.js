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

import vaccumImage from "../../assets/images/sonidosCasa/vaccum.png";
import dryerImage from "../../assets/images/sonidosCasa/dryer.png";
import washingImage from "../../assets/images/sonidosCasa/washing.png";
import keyboardImage from "../../assets/images/sonidosCasa/keyboard.png";
import writtingImage from "../../assets/images/sonidosCasa/writting.png";
import tictacImage from "../../assets/images/sonidosCasa/tictac.png";
import showerImage from "../../assets/images/sonidosCasa/shower.png";
import razorImage from "../../assets/images/sonidosCasa/razor.png";
import Cardsound from "./CardSound";

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

const SonidosCasaComp = () => {
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
                        adUnitID="ca-app-pub-6203383529182342/7638358812"
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
                        </View>
                        <View>
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
        backgroundColor: "#53A6A4",
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

export default SonidosCasaComp;
