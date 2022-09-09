import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { LogBox } from "react-native";
import Navigation from "./app/navigation/Navigation";
import { registerforPushNotificationsAsync } from "./app/utils/expoToken";

LogBox.ignoreLogs(["Setting a timer"]);

export default function App() {
    useEffect(() => {
        registerforPushNotificationsAsync();
    }, []);

    return (
        <>
            <Navigation />
            <StatusBar style="light" />
        </>
    );
}
