import React, { useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Image,
    ImageBackground,
    AppState,
    Text,
} from "react-native";
import { Audio } from "expo-av";
import { FontAwesome5 } from "@expo/vector-icons";
import { Button, Icon, Overlay } from "react-native-elements";
import { TimePicker } from "react-native-simple-time-picker";
import CountDown from "react-native-countdown-component";
import moment from "moment";

import Cardsound from "./CardSound";

import Constants from "expo-constants";
import * as Notifications from "expo-notifications";

import BackgroundTask from "../services/backgroundTask";
import { activateKeepAwake, deactivateKeepAwake } from "expo-keep-awake";

import caperucitaImage from "../../assets/images/audioCuentos/caperucita.png";
import burroImage from "../../assets/images/audioCuentos/burro.png";
import cerditosImage from "../../assets/images/audioCuentos/cerditos.png";
import flautistaImage from "../../assets/images/audioCuentos/flautista.png";
import juanImage from "../../assets/images/audioCuentos/juan.png";
import leonRatonImage from "../../assets/images/audioCuentos/leonRaton.png";
import patitoImage from "../../assets/images/audioCuentos/patito.png";
import principeImage from "../../assets/images/audioCuentos/principe.png";
import ratitaImage from "../../assets/images/audioCuentos/ratita.png";

const caperucitaSound = require("../../assets/sounds/audioCuentos/caperucita.mp3");
const burroSound = require("../../assets/sounds/audioCuentos/burro.mp3");
const cerditosSound = require("../../assets/sounds/audioCuentos/cerditos.mp3");
const flautistaSound = require("../../assets/sounds/audioCuentos/flautista.mp3");
const juanSound = require("../../assets/sounds/audioCuentos/juan.mp3");
const leonRatonSound = require("../../assets/sounds/audioCuentos/leonRaton.mp3");
const patitoSound = require("../../assets/sounds/audioCuentos/patito.mp3");
const principeSound = require("../../assets/sounds/audioCuentos/principe.mp3");
const ratitaSound = require("../../assets/sounds/audioCuentos/ratita.mp3");

const caperucitaSoundName = "AudioCuento Caperucita Roja";
const burroSoundName = "AudioCuento Burro Y El Lobo";
const cerditosSoundName = "AudioCuento Los Tres Cerditos";
const flautistaSoundName = "AudioCuento El Flautista de Hamelin";
const juanSoundName = "AudioCuento Juan Sin Miedo";
const leonRatonSoundName = "AudioCuento El Leon y El Raton";
const patitoSoundName = "AudioCuento El Patito Feo";
const principeSoundName = "AudioCuento El Principe Rana";
const ratitaSoundName = "AudioCuento La Ratita Presumida";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const AudioCuentosComp = () => {
    const [sound, setSound] = useState();
    const [playing, setPlaying] = useState(false);
    const [soundPicked, setSoundPicked] = useState(null);
    const [imagePicked, setimagePicked] = useState(null);
    const [soundPickedName, setSoundPickedName] = useState(null);
    const [visible, setVisible] = useState(false);
    const [minutes, setMinutes] = useState(null);
    const [forceCountDownDestroy, setForceCountDownDestroy] = useState(1);
    const [initialHour, setInitialHour] = useState(null);
    const [finishHour, setFinishHour] = useState(null);

    const navigation = useNavigation();

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
                    title: `🔊 Escuchando: ${soundPickedName}`,
                    body: "Volver a la Aplicación",
                    data: { data: "goes here" },
                },
                trigger: { seconds: 1 },
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

    const toggleOverlay = () => {
        setVisible(!visible);
    };

    console.log("HoraActual:", moment().format("HH:mm:ss"));
    console.log(finishHour);
    console.log(initialHour < finishHour);

    const handleChange = ({ minutes }) => {
        setMinutes(minutes * 60);
        setForceCountDownDestroy(forceCountDownDestroy + 1);
        //Todo: guardar la hora actual + el temporizador = hora de finalización
        setFinishHour(moment().add(minutes, "m").format("HH:mm:ss"));
        setInitialHour(moment().format("HH:mm:ss"));
        activateKeepAwake();
        console.log("Activate non awake");
        toggleOverlay();
    };

    console.log("pepe");

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
                                image={caperucitaImage}
                                onPress={() => {
                                    setSoundPicked(caperucitaSound);
                                    setimagePicked(caperucitaImage);
                                    setSoundPickedName(caperucitaSoundName);
                                    playing
                                        ? stopSound()
                                        : playSound(caperucitaSound);
                                    imagePicked !== caperucitaImage &&
                                        playSound(caperucitaSound);
                                }}
                            />
                            <Cardsound
                                image={burroImage}
                                onPress={() => {
                                    setSoundPicked(burroSound);
                                    setimagePicked(burroImage);
                                    setSoundPickedName(burroSoundName);
                                    playing
                                        ? stopSound()
                                        : playSound(burroSound);
                                    imagePicked !== burroImage &&
                                        playSound(burroSound);
                                }}
                            />
                            <Cardsound
                                image={cerditosImage}
                                onPress={() => {
                                    setSoundPicked(cerditosSound);
                                    setimagePicked(cerditosImage);
                                    setSoundPickedName(cerditosSoundName);
                                    playing
                                        ? stopSound()
                                        : playSound(cerditosSound);
                                    imagePicked !== cerditosImage &&
                                        playSound(cerditosSound);
                                }}
                            />
                        </View>
                        <View>
                            <Cardsound
                                image={flautistaImage}
                                onPress={() => {
                                    setSoundPicked(flautistaSound);
                                    setimagePicked(flautistaImage);
                                    setSoundPickedName(flautistaSoundName);
                                    playing
                                        ? stopSound()
                                        : playSound(flautistaSound);
                                    imagePicked !== flautistaImage &&
                                        playSound(flautistaSound);
                                }}
                            />
                            <Cardsound
                                image={juanImage}
                                onPress={() => {
                                    setSoundPicked(juanSound);
                                    setimagePicked(juanImage);
                                    setSoundPickedName(juanSoundName);
                                    playing
                                        ? stopSound()
                                        : playSound(juanSound);
                                    imagePicked !== juanImage &&
                                        playSound(juanSound);
                                }}
                            />
                            <Cardsound
                                image={leonRatonImage}
                                onPress={() => {
                                    setSoundPicked(leonRatonSound);
                                    setimagePicked(leonRatonImage);
                                    setSoundPickedName(leonRatonSoundName);
                                    playing
                                        ? stopSound()
                                        : playSound(leonRatonSound);
                                    imagePicked !== leonRatonImage &&
                                        playSound(leonRatonSound);
                                }}
                            />
                        </View>
                        <View>
                            <Cardsound
                                image={patitoImage}
                                onPress={() => {
                                    setSoundPicked(patitoSound);
                                    setimagePicked(patitoImage);
                                    setSoundPickedName(patitoSoundName);
                                    playing
                                        ? stopSound()
                                        : playSound(patitoSound);
                                    imagePicked !== patitoImage &&
                                        playSound(patitoSound);
                                }}
                            />
                            <Cardsound
                                image={principeImage}
                                onPress={() => {
                                    setSoundPicked(principeSound);
                                    setimagePicked(principeImage);
                                    setSoundPickedName(principeSoundName);
                                    playing
                                        ? stopSound()
                                        : playSound(principeSound);
                                    imagePicked !== principeImage &&
                                        playSound(principeSound);
                                }}
                            />
                            <Cardsound
                                image={ratitaImage}
                                onPress={() => {
                                    setSoundPicked(ratitaSound);
                                    setimagePicked(ratitaImage);
                                    setSoundPickedName(ratitaSoundName);
                                    playing
                                        ? stopSound()
                                        : playSound(ratitaSound);
                                    imagePicked !== ratitaImage &&
                                        playSound(ratitaSound);
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
                        if (playing) {
                            stopSound();
                            setMinutes(null);
                        } else playSound(soundPicked);
                    }}
                >
                    <FontAwesome5
                        name={playing ? "stop" : "play"}
                        size={32}
                        color="#0a4b4f"
                    />
                </TouchableOpacity>
                <View style={styles.count}>
                    <TouchableOpacity
                        disabled={
                            !soundPicked || !playing /* || minutes !== 0 */
                        }
                        onPress={toggleOverlay}
                        style={
                            playing
                                ? styles.buttonContainerCountDown
                                : styles.buttonContainerCountDownDisabled
                        }
                    >
                        <FontAwesome5 name="clock" size={20} color="#0a4b4f" />
                    </TouchableOpacity>
                    {minutes > 0 && (
                        <CountDown
                            size={20}
                            key={forceCountDownDestroy}
                            until={minutes}
                            onFinish={() => {
                                stopSound();
                                deactivateKeepAwake();
                                console.log("Finished awake");
                                setMinutes(null);
                                // navigation.navigate("home-stack");
                            }}
                            digitStyle={{
                                // backgroundColor: "#0a4b4f",
                                // borderColor: "#0a4b4f",
                                // borderWidth: 1,
                                // borderRadius: 5,
                                width: 25,
                                height: 25,
                                margin: 2,
                            }}
                            digitTxtStyle={{
                                color: "white",
                                fontSize: 20,
                                fontWeight: "bold",
                            }}
                            separatorStyle={{
                                color: "white",
                                fontSize: 20,
                                fontWeight: "bold",
                            }}
                            timeToShow={["M", "S"]}
                            timeLabels={{ m: null, s: null }}
                            showSeparator
                            style={{
                                flex: 1,
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                textAlign: "center",
                            }}
                        />
                    )}
                </View>
            </View>
            <View>
                {minutes > 0 && (
                    <BackgroundTask
                        interval={1000}
                        startOnBoot={true}
                        stopOnTerminate={true}
                        enableHeadless={true}
                        forceStart={true}
                        minutes={minutes}
                        //Todo: Enviar HORA de finalizacion
                        finishHour={finishHour}
                        setMinutes={setMinutes}
                        stopSound={stopSound}
                        initialHour={initialHour}
                        function={() => {
                            console.log(
                                "initial: ",
                                initialHour,
                                "timer: ",
                                moment().format("HH:mm:ss"),
                                "end: ",
                                finishHour
                            );
                            if (
                                moment().format("HH:mm:ss") === finishHour &&
                                playing
                            ) {
                                stopSound();
                                setMinutes(null);
                                // navigation.navigate("home-stack");
                            }
                        }}
                    />
                )}
                <Overlay
                    isVisible={visible}
                    onBackdropPress={toggleOverlay}
                    overlayStyle={styles.overlay}
                    backdropStyle={{ backgroundColor: "rgba(0,0,0,0.7)" }}
                >
                    <Text
                        style={{
                            textAlign: "center",
                            fontSize: 16,
                            color: "white",
                            fontWeight: "bold",
                        }}
                    >
                        {minutes
                            ? "Vuelve a establecer el tiempo de duración del temporizador "
                            : "Elige el tiempo de duración del temporizador"}
                    </Text>
                    <TimePicker
                        value={minutes}
                        onChange={handleChange}
                        zeroPadding
                        pickerShows={["minutes"]}
                        minutesUnit=" min"
                    />
                    {minutes > 0 && (
                        <Button
                            title="  Parar Temporizador"
                            buttonStyle={{
                                backgroundColor: "#0a4b4f",
                                borderRadius: 5,
                                marginTop: 10,
                            }}
                            onPress={() => {
                                setFinishHour(null);
                                setMinutes(null);
                                setVisible(!visible);
                            }}
                            iconPosition="left"
                            icon={
                                <FontAwesome5
                                    name="stopwatch"
                                    size={20}
                                    color="white"
                                />
                            }
                        />
                    )}
                </Overlay>
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
    buttonContainerCountDown: {
        backgroundColor: "#FFF",
        borderColor: "rgba(10, 75, 79, 0.4)",
        borderWidth: 16,
        width: 65,
        height: 65,
        borderRadius: 64,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#5D3F6A",
        shadowRadius: 30,
        shadowOpacity: 0.5,
    },
    buttonContainerCountDownDisabled: {
        backgroundColor: "#FFF",
        borderColor: "rgba(10, 75, 79, 0.4)",
        borderWidth: 16,
        width: 65,
        height: 65,
        borderRadius: 64,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#5D3F6A",
        shadowRadius: 30,
        shadowOpacity: 0.5,
        opacity: 0.5,
    },
    overlay: {
        width: width * 0.8,
        height: height * 0.3,
        borderRadius: 10,
        padding: 20,
        backgroundColor: "#53A6A4",
        justifyContent: "space-around",
    },
    count: {
        flexDirection: "column",
        alignItems: "center",
        alignSelf: "center",
        marginLeft: -20,
    },
});

export default AudioCuentosComp;
