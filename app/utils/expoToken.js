import * as Notifications from "expo-notifications";

import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

export const registerforPushNotificationsAsync = async () => {
    const token = await Notifications.getExpoPushTokenAsync({
        experienceId: "alfanjorfresco/react-native-ruido-blanco-bebe",
    });

    const tokenFirebase = {
        token: token.data,
        createdAt: new Date(),
    };

    const tokenSnapshot = await getDocs(
        collection(db, "tokensPush-Ruido-Blanco")
    );
    const tokenQuery = tokenSnapshot.docs.map((doc) => doc.data().token);

    if (tokenQuery.includes(token.data)) {
        return;
    } else {
        await addDoc(collection(db, "tokensPush-Ruido-Blanco"), tokenFirebase);
    }
};
