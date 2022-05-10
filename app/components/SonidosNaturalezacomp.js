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

import seaWavesImage from "../../assets/images/sonidosNaturaleza/sea-waves.png";
import rainImage from "../../assets/images/sonidosNaturaleza/rain.png";
import forestImage from "../../assets/images/sonidosNaturaleza/forest.png";
import stormImage from "../../assets/images/sonidosNaturaleza/storm.png";
import windImage from "../../assets/images/sonidosNaturaleza/wind.png";
import fireImage from "../../assets/images/sonidosNaturaleza/fire.png";
import birdsImage from "../../assets/images/sonidosNaturaleza/birds.png";
import farmImage from "../../assets/images/sonidosNaturaleza/farm.png";
import waterfallImage from "../../assets/images/sonidosNaturaleza/waterfall.png";
import Cardsound from "./CardSound";
import { AdMobBanner } from "expo-ads-admob";

const seaAwavesSound = require("../../assets/sounds/sonidosNaturaleza/sea-waves.mp3");
const rainSound = require("../../assets/sounds/sonidosNaturaleza/rain.mp3");
const forestSound = require("../../assets/sounds/sonidosNaturaleza/forest.mp3");
const stormSound = require("../../assets/sounds/sonidosNaturaleza/storm.mp3");
const windSound = require("../../assets/sounds/sonidosNaturaleza/wind.mp3");
const fireSound = require("../../assets/sounds/sonidosNaturaleza/fire.mp3");
const birdsSound = require("../../assets/sounds/sonidosNaturaleza/birds.mp3");
const farmSound = require("../../assets/sounds/sonidosNaturaleza/farm.m4a");
const waterfallSound = require("../../assets/sounds/sonidosNaturaleza/waterfall.mp3");

const seaAwavesSoundName = "Sonido Olas";
const rainSoundName = "Sonido Lluvia";
const forestSoundName = "Sonido Bosque";
const stormSoundName = "Sonido Tormenta";
const windSoundName = "Sonido Viento";
const fireSoundName = "Sonido Fuego";
const birdsSoundName = "Sonido Aves";
const farmSoundName = "Sonido Granja";
const waterfallSoundName = "Sonido Rio";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const SondsNaturaleza = () => {
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
                        adUnitID="ca-app-pub-6203383529182342/1839237229"
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
                                image={seaWavesImage}
                                onPress={() => {
                                    setSoundPicked(seaAwavesSound);
                                    setimagePicked(seaWavesImage);
                                    setSoundPickedName(seaAwavesSoundName);
                                    playing
                                        ? stopSound()
                                        : playSound(seaAwavesSound);
                                    imagePicked !== seaWavesImage &&
                                        playSound(seaAwavesSound);
                                }}
                            />
                            <Cardsound
                                image={rainImage}
                                onPress={() => {
                                    setSoundPicked(rainSound);
                                    setimagePicked(rainImage);
                                    setSoundPickedName(rainSoundName);
                                    playing
                                        ? stopSound()
                                        : playSound(rainSound);
                                    imagePicked !== rainImage &&
                                        playSound(rainSound);
                                }}
                            />
                            <Cardsound
                                image={waterfallImage}
                                onPress={() => {
                                    setSoundPicked(waterfallSound);
                                    setimagePicked(waterfallImage);
                                    setSoundPickedName(waterfallSoundName);
                                    playing
                                        ? stopSound()
                                        : playSound(waterfallSound);
                                    imagePicked !== waterfallImage &&
                                        playSound(waterfallSound);
                                }}
                            />
                        </View>
                        <View>
                            <Cardsound
                                image={forestImage}
                                onPress={() => {
                                    setSoundPicked(forestSound);
                                    setimagePicked(forestImage);
                                    setSoundPickedName(forestSoundName);
                                    playing
                                        ? stopSound()
                                        : playSound(forestSound);
                                    imagePicked !== forestImage &&
                                        playSound(forestSound);
                                }}
                            />
                            <Cardsound
                                image={windImage}
                                onPress={() => {
                                    setSoundPicked(windSound);
                                    setimagePicked(windImage);
                                    setSoundPickedName(windSoundName);
                                    playing
                                        ? stopSound()
                                        : playSound(windSound);
                                    imagePicked !== windImage &&
                                        playSound(windSound);
                                }}
                            />
                            <Cardsound
                                image={farmImage}
                                onPress={() => {
                                    setSoundPicked(farmSound);
                                    setimagePicked(farmImage);
                                    setSoundPickedName(farmSoundName);
                                    playing
                                        ? stopSound()
                                        : playSound(farmSound);
                                    imagePicked !== farmImage &&
                                        playSound(farmSound);
                                }}
                            />
                        </View>
                        <View>
                            <Cardsound
                                image={stormImage}
                                onPress={() => {
                                    setSoundPicked(stormSound);
                                    setimagePicked(stormImage);
                                    setSoundPickedName(stormSoundName);
                                    playing
                                        ? stopSound()
                                        : playSound(stormSound);
                                    imagePicked !== stormImage &&
                                        playSound(stormSound);
                                }}
                            />
                            <Cardsound
                                image={fireImage}
                                onPress={() => {
                                    setSoundPicked(fireSound);
                                    setimagePicked(fireImage);
                                    setSoundPickedName(fireSoundName);
                                    playing
                                        ? stopSound()
                                        : playSound(fireSound);
                                    imagePicked !== fireImage &&
                                        playSound(fireSound);
                                }}
                            />
                            <Cardsound
                                image={birdsImage}
                                onPress={() => {
                                    setSoundPicked(birdsSound);
                                    setimagePicked(birdsImage);
                                    setSoundPickedName(birdsSoundName);
                                    playing
                                        ? stopSound()
                                        : playSound(birdsSound);
                                    imagePicked !== birdsImage &&
                                        playSound(birdsSound);
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

export default SondsNaturaleza;
