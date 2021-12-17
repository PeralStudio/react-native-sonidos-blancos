import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import CountDown from "react-native-countdown-component";
import { TimePicker } from "react-native-simple-time-picker";

const CountdownComponent = () => {
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);

    console.log(minutes);

    const handleChange = ({ hours, minutes }) => {
        setHours(hours);
        setMinutes(minutes * 60);
    };

    return (
        <View>
            {minutes <= 0 && (
                <TimePicker
                    value={minutes}
                    onChange={handleChange}
                    zeroPadding
                    pickerShows={["minutes"]}
                />
            )}
            {minutes !== 0 && (
                <View style={styles.container}>
                    <CountDown
                        until={minutes}
                        onFinish={() => alert("finished")}
                        onPress={() => alert("hello")}
                        size={18}
                        timeToShow={["M", "S"]}
                        // timeLabels={{ m: "M", s: "S" }}
                        // digitStyle={{ backgroundColor: "#FFF" }}
                        digitTxtStyle={{ color: "#000" }}
                        showSeparator
                        separatorStyle={{
                            flex: 1,
                            color: "#000",
                            marginVertical: 8,
                        }}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "red",
        width: "50%",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
    },
});

export default CountdownComponent;
