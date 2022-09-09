import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Icon } from "react-native-elements";

const Cardsound = ({ image, onPress }) => {
    return (
        <View style={styles.singleTouchable}>
            <TouchableOpacity onPress={onPress}>
                {/* <TouchableOpacity
                    onPress={() => {
                        console.log("Pressed");
                    }}
                >
                    <Icon
                        name="heart-outline"
                        type="material-community"
                        color={"#94DBDF"}
                        size={30}
                        style={{
                            marginLeft: 65,
                        }}
                    />
                </TouchableOpacity> */}
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
