import { useFocusEffect } from "@react-navigation/native";
import { AdMobInterstitial } from "expo-ads-admob";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, StyleSheet, ImageBackground, Dimensions } from "react-native";

import Card from "../components/Card";

const sourceImageOne = require("../../assets/images/cuna.png");
const sourceImageTwo = require("../../assets/images/sonidos-relajantes.png");
const sourceImageThree = require("../../assets/images/audiocuentos.png");
const sourceImageFour = require("../../assets/images/naturaleza.png");
const sourceImageFive = require("../../assets/images/hogar.png");
const sourceImageSix = require("../../assets/images/ruido-blanco.png");

const height = Dimensions.get("window").height;

const Home = () => {
    useFocusEffect(
        useCallback(() => {
            const loadAd = async () => {
                await AdMobInterstitial.setAdUnitID(
                    "ca-app-pub-3940256099942544/1033173712"
                ); // Test ID, Replace with your-admob-unit-id
                await AdMobInterstitial.requestAdAsync({
                    servePersonalizedAds: true,
                });
                AdMobInterstitial.addEventListener(
                    "interstitialDidLoad",
                    () => {
                        console.log("interstitialDidLoad is loaded");
                    }
                );
            };
            loadAd();
        }, [])
    );

    const showAd = () => AdMobInterstitial.showAdAsync();

    return (
        <ImageBackground
            source={require("../../assets/images/background.jpg")}
            style={styles.containerBackground}
        >
            {/* <ScrollView style={styles.viewBody}> */}
            <View style={styles.container}>
                <View>
                    <Card
                        text={"Sonidos Naturaleza"}
                        image={sourceImageFour}
                        navTo={"sonidos-naturaleza-stack"}
                        showAd={showAd}
                    />
                    <Card
                        text={"Audio cuentos"}
                        image={sourceImageThree}
                        navTo={"audio-cuentos-stack"}
                        showAd={showAd}
                    />
                </View>
                <View>
                    <Card
                        text={"Sonidos Relajantes"}
                        image={sourceImageTwo}
                        navTo={"sonidos-relajantes-stack"}
                        showAd={showAd}
                    />
                    <Card
                        text={"Sonidos de Casa"}
                        image={sourceImageFive}
                        navTo={"sonidos-casa-stack"}
                        showAd={showAd}
                    />
                </View>
            </View>
            <View style={styles.container}>
                <View>
                    <Card
                        text={"Ruido Blanco"}
                        image={sourceImageSix}
                        navTo={"ruido-blanco-stack"}
                        showAd={showAd}
                    />
                </View>
                <View>
                    <Card
                        text={"Canciones Cuna"}
                        image={sourceImageOne}
                        navTo={"canciones-cuna-stack"}
                        showAd={showAd}
                    />
                </View>
            </View>
            {/* </ScrollView> */}
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        // backgroundColor: "#0c2954",
    },
    container: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "center",
        // marginTop: 50,
    },
    containerBackground: {
        flex: 1,
        height: height,
        justifyContent: "center",
    },
});

export default Home;
