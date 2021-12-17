import { StatusBar } from "expo-status-bar";
import React from "react";
import { LogBox } from "react-native";
import Navigation from "./app/navigation/Navigation";

LogBox.ignoreLogs(["Setting a timer"]);

export default function App() {
    return (
        <>
            <Navigation />
            <StatusBar style="light" />
        </>
    );
}
