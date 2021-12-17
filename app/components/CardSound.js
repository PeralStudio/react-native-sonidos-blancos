import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";

const Cardsound = ({ image, onPress }) => {
    return (
        <View style={styles.singleTouchable}>
            <TouchableOpacity onPress={onPress}>
                <Image
                    source={image}
                    style={styles.image}
                    resizeMode="contain"
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    singleTouchable: {
        backgroundColor: "#94DBDF",
        margin: 10,
        borderRadius: 15,
    },
    image: {
        width: 100,
        height: 110,
        margin: 5,
    },
});

export default Cardsound;
