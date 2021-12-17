import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Dimensions,
} from "react-native";
import { Image } from "react-native-elements";

const width = Dimensions.get("window").width;

const Card = ({ text, image, navTo, showAd }) => {
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            onPress={() => {
                showAd();
                navigation.navigate(navTo);
            }}
        >
            <View style={styles.card}>
                <Image
                    source={image}
                    style={styles.imageOne}
                    resizeMode="contain"
                />
                <Text style={styles.text}>{text}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        alignItems: "center",
        alignSelf: "center",
        backgroundColor: "#94DBDF",
        borderRadius: 10,
        margin: 5,
        width: width * 0.45,
    },
    text: {
        fontSize: 14,
        fontWeight: "bold",
        color: "black",
        textTransform: "uppercase",
        marginBottom: 10,
        textAlign: "center",
    },
    imageOne: {
        width: 150,
        height: 140,
    },
});

export default Card;
