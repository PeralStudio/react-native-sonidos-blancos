import AsyncStorage from "@react-native-async-storage/async-storage";
import * as StoreReview from "expo-store-review";

//! Se ha modificado el componente SonidosNaturaleza.js y añadido un useEffect con el interval en Navigation.js

// funcion showModalReview
// muestra el modal de review
// checkMinimalTimeToReview() funcion cada x tiempo si tiene que mostrar o no el modal
// getTotalTimeListened --> obtiene el tiempo total de reproduccion
// setTotalTimeListened --> guarda el tiempo total de reproduccion
// addTotalTimeListened(time) exportar para que se pueda usar todos los componentes

const MINIMAL_TIME_TO_REVIEW = 240000;
export const TIME_TO_INTERVAL = 20000;

//todo Al iniciar la app, coger los datos del LS y guardarlos en el state

export let timeListened = {
    totalTimeListened: 0,
    reviewShowed: false,
};

export let needCheckReview = true;

const showModalReview = async () => {
    console.log("showModalReview");

    //Mostrar el modal
    StoreReview.requestReview();

    //Guardar en LS reviewShowed = true
    setTotalTimeListenedLS({
        ...timeListened,
        reviewShowed: true,
    });

    //Actualizar timeListened.reviewShowed = true
    timeListened.reviewShowed = true;
};

export const getTotalTimeListenLS = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem("@totalTimeListened");
        // console.log(
        //     "jsonvalue",
        //     jsonValue != null ? JSON.parse(jsonValue) : timeListened
        // );
        return jsonValue != null ? JSON.parse(jsonValue) : timeListened;
    } catch (e) {
        // error reading value
    }
};

const setTotalTimeListenedLS = async (timeObject) => {
    try {
        await AsyncStorage.setItem(
            "@totalTimeListened",
            JSON.stringify(timeObject)
        );
    } catch (e) {
        // saving error
    }
};

export const checkMinimalTimeToReview = async () => {
    getTotalTimeListenLS().then((data) => {
        timeListened = data;
        if (data.reviewShowed === true) {
            needCheckReview = false;
            return;
        } else if (data.totalTimeListened >= MINIMAL_TIME_TO_REVIEW) {
            showModalReview();
        }
    });
};

//Añadir el tiempo total de reproduccion al LS
export const addTotalTimeListened = (time) => {
    if (time > 0) {
        getTotalTimeListenLS().then((data) => {
            // Actualizar LocalStorage con el tiempo total de reproduccion y reviewShowed
            setTotalTimeListenedLS({
                totalTimeListened: (data.totalTimeListened += time),
                reviewShowed: data.reviewShowed,
            });
        });
    }
};
