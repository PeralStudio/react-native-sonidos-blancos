import { Dimensions, StyleSheet } from "react-native";

const width = Dimensions.get("window").width;

export const styles = StyleSheet.create({
    containerBackground: {
        height: "100%",
        justifyContent: "center",
    },
    container: {
        flexDirection: "row",
        // backgroundColor: "#307473",
        justifyContent: "space-around",
        height: "100%",
    },
    imagePicked: {
        width: 80,
        height: 90,
    },
    player: {
        backgroundColor: "#94DBDF",
        padding: 10,
        marginRight: -20,
        borderRadius: 15,
    },
    containerPlayer: {
        // flexDirection: "row",
        // justifyContent: "space-around",
        position: "absolute",
        bottom: 0,
        // alignItems: "center",
        // right: width / 2 - 150,
        backgroundColor: "#53A6A4",
        width: width,
        paddingBottom: 5,
        paddingTop: 5,
    },
    slider_style: {
        height: "40%",
        width: "100%",
    },
    containerButtons: {
        flexDirection: "row",
    },
    playButtonContainer: {
        backgroundColor: "#FFF",
        borderColor: "rgba(10, 75, 79, 0.4)",
        borderWidth: 8,
        width: 80,
        height: 80,
        borderRadius: 64,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#5D3F6A",
        shadowRadius: 30,
        shadowOpacity: 0.5,
        marginHorizontal: 5,
    },
    playButtonContainerDisabled: {
        backgroundColor: "#FFF",
        borderColor: "rgba(10, 75, 79, 0.4)",
        borderWidth: 8,
        width: 80,
        height: 80,
        borderRadius: 64,
        alignItems: "center",
        justifyContent: "center",
        // marginHorizontal: 32,
        shadowColor: "#5D3F6A",
        shadowRadius: 30,
        shadowOpacity: 0.5,
        opacity: 0.5,
        marginHorizontal: 5,
    },
});
