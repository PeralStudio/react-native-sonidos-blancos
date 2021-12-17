import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "../screens/Home";
import Cancionescuna from "../screens/CancionesCuna";
import SonidosNaturaleza from "../screens/SonidosNaturaleza";
import SonidosRelajantes from "../screens/SonidosRelajantes";
import AudioCuentos from "../screens/AudioCuentos";
import SonidosCasa from "../screens/SonidosCasa";
import RuidoBlanco from "../screens/RuidoBlanco";
import { Icon } from "react-native-elements";

const Stack = createNativeStackNavigator();

const HomeStack = ({ navigation }) => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="home-stack"
                component={Home}
                options={{
                    title: "Sonidos para Relajarse",
                    headerTitleAlign: "center",
                    headerStyle: { backgroundColor: "#0a4b4f" },
                    contentStyle: { backgroundColor: "#307473" },
                    headerTitleStyle: {
                        fontWeight: "bold",
                        color: "white",
                    },
                }}
            />
            <Stack.Screen
                name="sonidos-naturaleza-stack"
                component={SonidosNaturaleza}
                options={{
                    title: "Sonidos Naturaleza",
                    headerTitleAlign: "center",
                    headerStyle: { backgroundColor: "#0a4b4f" },
                    // contentStyle: { backgroundColor: "#004F7E" },
                    headerTitleStyle: {
                        fontWeight: "bold",
                        color: "white",
                    },
                    headerLeft: () => (
                        <Icon
                            name="arrow-left"
                            type="feather"
                            color="white"
                            size={26}
                            onPress={() => {
                                navigation.goBack();
                            }}
                        />
                    ),
                }}
            />
            <Stack.Screen
                name="sonidos-relajantes-stack"
                component={SonidosRelajantes}
                options={{
                    title: "Sonidos Relajantes",
                    headerTitleAlign: "center",
                    headerStyle: { backgroundColor: "#0a4b4f" },
                    // contentStyle: { backgroundColor: "#004F7E" },
                    headerTitleStyle: {
                        fontWeight: "bold",
                        color: "white",
                    },
                    headerLeft: () => (
                        <Icon
                            name="arrow-left"
                            type="feather"
                            color="white"
                            size={26}
                            onPress={() => {
                                navigation.goBack();
                            }}
                        />
                    ),
                }}
            />
            <Stack.Screen
                name="audio-cuentos-stack"
                component={AudioCuentos}
                options={{
                    title: "AudioCuentos Infantiles",
                    headerTitleAlign: "center",
                    headerStyle: { backgroundColor: "#0a4b4f" },
                    // contentStyle: { backgroundColor: "#004F7E" },
                    headerTitleStyle: {
                        fontWeight: "bold",
                        color: "white",
                    },
                    headerLeft: () => (
                        <Icon
                            name="arrow-left"
                            type="feather"
                            color="white"
                            size={26}
                            onPress={() => {
                                navigation.goBack();
                            }}
                        />
                    ),
                }}
            />
            <Stack.Screen
                name="sonidos-casa-stack"
                component={SonidosCasa}
                options={{
                    title: "Sonidos de Casa",
                    headerTitleAlign: "center",
                    headerStyle: { backgroundColor: "#0a4b4f" },
                    // contentStyle: { backgroundColor: "#004F7E" },
                    headerTitleStyle: {
                        fontWeight: "bold",
                        color: "white",
                    },
                    headerLeft: () => (
                        <Icon
                            name="arrow-left"
                            type="feather"
                            color="white"
                            size={26}
                            onPress={() => {
                                navigation.goBack();
                            }}
                        />
                    ),
                }}
            />
            <Stack.Screen
                name="ruido-blanco-stack"
                component={RuidoBlanco}
                options={{
                    title: "Ruido Blanco",
                    headerTitleAlign: "center",
                    headerStyle: { backgroundColor: "#0a4b4f" },
                    // contentStyle: { backgroundColor: "#004F7E" },
                    headerTitleStyle: {
                        fontWeight: "bold",
                        color: "white",
                    },
                    headerLeft: () => (
                        <Icon
                            name="arrow-left"
                            type="feather"
                            color="white"
                            size={26}
                            onPress={() => {
                                navigation.goBack();
                            }}
                        />
                    ),
                }}
            />
            <Stack.Screen
                name="canciones-cuna-stack"
                component={Cancionescuna}
                options={{
                    title: "Canciones Cuna",
                    headerTitleAlign: "center",
                    headerStyle: { backgroundColor: "#0a4b4f" },
                    // contentStyle: { backgroundColor: "#004F7E" },
                    headerTitleStyle: {
                        fontWeight: "bold",
                        color: "white",
                    },
                    headerLeft: () => (
                        <Icon
                            name="arrow-left"
                            type="feather"
                            color="white"
                            size={26}
                            onPress={() => {
                                navigation.goBack();
                            }}
                        />
                    ),
                }}
            />
        </Stack.Navigator>
    );
};

export default HomeStack;
