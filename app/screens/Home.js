import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback } from "react";
import {
    View,
    StyleSheet,
    ImageBackground,
    Dimensions,
    ScrollView,
} from "react-native";
import { AdMobInterstitial, AdMobBanner } from "expo-ads-admob";

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
                    "ca-app-pub-6203383529182342/7415035522"
                ); // Test ID, Replace with your-admob-unit-id
                const ready = await AdMobInterstitial.getIsReadyAsync();
                if (ready) {
                    return;
                } else {
                    await AdMobInterstitial.requestAdAsync({
                        servePersonalizedAds: true,
                    });
                    AdMobInterstitial.addEventListener(
                        "interstitialDidLoad",
                        () => {
                            console.log("interstitialDidLoad is loaded");
                        }
                    );
                }
            };
            loadAd();
            AdMobInterstitial.dismissAdAsync();
        }, [])
    );

    const showAd = () => AdMobInterstitial.showAdAsync();

    return (
        <ImageBackground
            source={require("../../assets/images/background.jpg")}
            style={styles.containerBackground}
        >
            <ScrollView style={styles.viewBody}>
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
            </ScrollView>
            <AdMobBanner
                bannerSize="smartBannerPortrait"
                adUnitID="ca-app-pub-6203383529182342/7941611144"
                onDidFailToReceiveAdWithError={(err) => console.log(err)}
            />
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        // backgroundColor: "#0c2954",
        marginTop: 10,
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
