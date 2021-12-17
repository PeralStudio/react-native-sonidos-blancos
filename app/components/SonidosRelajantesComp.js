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

import Constants from "expo-constants";
import * as Notifications from "expo-notifications";

import Cardsound from "./CardSound";

import babyImage from "../../assets/images/sonidosRelajantes/baby.png";
import heartImage from "../../assets/images/sonidosRelajantes/heart.png";
import xylophoneImage from "../../assets/images/sonidosRelajantes/xylophone.png";
import catImage from "../../assets/images/sonidosRelajantes/cat.png";
import coffeeShopImage from "../../assets/images/sonidosRelajantes/coffeeShop.png";
import silenceImage from "../../assets/images/sonidosRelajantes/silence.png";
import trainImage from "../../assets/images/sonidosRelajantes/train.png";
import fanImage from "../../assets/images/sonidosRelajantes/fan.png";
import singingBowlImage from "../../assets/images/sonidosRelajantes/singingBowl.png";

const babySound = require("../../assets/sounds/sonidosRelajantes/baby.m4a");
const heartSound = require("../../assets/sounds/sonidosRelajantes/heart.mp3");
const xylophoneSound = require("../../assets/sounds/sonidosRelajantes/xylophone.m4a");
const catSound = require("../../assets/sounds/sonidosRelajantes/cat.m4a");
const coffeeShopSound = require("../../assets/sounds/sonidosRelajantes/coffeeShop.m4a");
const silenceSound = require("../../assets/sounds/sonidosRelajantes/silence.m4a");
const trainSound = require("../../assets/sounds/sonidosRelajantes/train.m4a");
const fanSound = require("../../assets/sounds/sonidosRelajantes/fan.m4a");
const singingBowlSound = require("../../assets/sounds/sonidosRelajantes/singingBowl.m4a");

const babySoundName = "Sonido bebé Utero";
const heartSoundName = "Sonido Corazón";
const xylophoneSoundName = "Sonido Xylofono";
const catSoundName = "Sonido Gato";
const coffeeShopSoundName = "Sonido Ambiente Cafetería";
const silenceSoundName = "Sonido Silencio";
const trainSoundName = "Sonido Tren";
const fanSoundName = "Sonido Ventilador";
const singingBowlSoundName = "Sonido Cuenco Tibetano";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const SonidosRelajantes = () => {
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
                    <View style={styles.container}>
                        <View>
                            <Cardsound
                                image={babyImage}
                                onPress={() => {
                                    setSoundPicked(babySound);
                                    setimagePicked(babyImage);
                                    setSoundPickedName(babySoundName);
                                    playing
                                        ? stopSound()
                                        : playSound(babySound);
                                    imagePicked !== babyImage &&
                                        playSound(babySound);
                                }}
                            />
                            <Cardsound
                                image={heartImage}
                                onPress={() => {
                                    setSoundPicked(heartSound);
                                    setimagePicked(heartImage);
                                    setSoundPickedName(heartSoundName);
                                    playing
                                        ? stopSound()
                                        : playSound(heartSound);
                                    imagePicked !== heartImage &&
                                        playSound(heartSound);
                                }}
                            />
                            <Cardsound
                                image={singingBowlImage}
                                onPress={() => {
                                    setSoundPicked(singingBowlSound);
                                    setimagePicked(singingBowlImage);
                                    setSoundPickedName(singingBowlSoundName);
                                    playing
                                        ? stopSound()
                                        : playSound(singingBowlSound);
                                    imagePicked !== singingBowlImage &&
                                        playSound(singingBowlSound);
                                }}
                            />
                        </View>
                        <View>
                            <Cardsound
                                image={xylophoneImage}
                                onPress={() => {
                                    setSoundPicked(xylophoneSound);
                                    setimagePicked(xylophoneImage);
                                    setSoundPickedName(xylophoneSoundName);
                                    playing
                                        ? stopSound()
                                        : playSound(xylophoneSound);
                                    imagePicked !== xylophoneImage &&
                                        playSound(xylophoneSound);
                                }}
                            />
                            <Cardsound
                                image={coffeeShopImage}
                                onPress={() => {
                                    setSoundPicked(coffeeShopSound);
                                    setimagePicked(coffeeShopImage);
                                    setSoundPickedName(coffeeShopSoundName);
                                    playing
                                        ? stopSound()
                                        : playSound(coffeeShopSound);
                                    imagePicked !== coffeeShopImage &&
                                        playSound(coffeeShopSound);
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
                        </View>
                        <View>
                            <Cardsound
                                image={catImage}
                                onPress={() => {
                                    setSoundPicked(catSound);
                                    setimagePicked(catImage);
                                    setSoundPickedName(catSoundName);
                                    playing ? stopSound() : playSound(catSound);
                                    imagePicked !== catImage &&
                                        playSound(catSound);
                                }}
                            />
                            <Cardsound
                                image={silenceImage}
                                onPress={() => {
                                    setSoundPicked(silenceSound);
                                    setimagePicked(silenceImage);
                                    setSoundPickedName(silenceSoundName);
                                    playing
                                        ? stopSound()
                                        : playSound(silenceSound);
                                    imagePicked !== silenceImage &&
                                        playSound(silenceSound);
                                }}
                            />
                            <Cardsound
                                image={trainImage}
                                onPress={() => {
                                    setSoundPicked(trainSound);
                                    setimagePicked(trainImage);
                                    setSoundPickedName(trainSoundName);
                                    playing
                                        ? stopSound()
                                        : playSound(trainSound);
                                    imagePicked !== trainImage &&
                                        playSound(trainSound);
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

export default SonidosRelajantes;
