import { useEffect, useState, useRef } from "react";
import { AppState } from "react-native";
import {
    setNotificationHandler,
    scheduleNotificationAsync,
} from "expo-notifications";
import moment from "moment";

export function useCountDownBackground(countdown) {
    const timeBeforeBackground = useRef();
    const [timer, setTimer] = useState(countdown);
    const [timerExpired, setTimerExpired] = useState(false);

    function sendNotificationAfterTimeFinish() {
        setNotificationHandler({
            shouldShowAlert: true,
            shouldPlaySound: true,
        });

        scheduleNotificationAsync({
            content: {
                title: "Timer is Over!",
                body: "¡Hey the Time is Over!",
            },
            trigger: null,
        });
    }

    function drecreaseTime() {
        setTimer(timer - 1);
    }

    function handleAppState(nextState) {
        if (nextState.match(/inactive|background/)) {
            timeBeforeBackground.current = moment();
        }

        if (nextState === "active") {
            const currentTime = moment();
            const timeElapsed = moment
                .duration(currentTime.diff(timeBeforeBackground.current))
                .asSeconds();

            if (timer - timeElapsed <= 0) {
                setTimer(0);
                return onTimerEnds();
            }

            setTimer(Math.abs(timer - timeElapsed).toFixed(0));
        }
    }

    function onTimerEnds() {
        setTimerExpired(true);
        sendNotificationAfterTimeFinish();
    }

    useEffect(() => {
        AppState.addEventListener("change", handleAppState);
        return () => AppState.removeEventListener("change", handleAppState);
    }, []);

    useEffect(() => {
        if (timer <= 0) {
            return onTimerEnds();
        }
        const intervalCountdown = setInterval(drecreaseTime, 1000);
        return () => clearInterval(intervalCountdown);
    }, [timer]);

    return { timer, setTimer, timerExpired };
}
