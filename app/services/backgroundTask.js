import React, { useEffect, useState } from "react";
import { WebView } from "react-native-webview";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";

function BackgroundTask(props) {
    console.log(props.initialHour);
    console.log("Hora Final:", props.finishHour);
    const finishHour = props.finishHour;
    const timeToTimeout = props.minutes * 1000;

    const navigation = useNavigation();

    // const runFirst = `
    //   setInterval(()=>{window.ReactNativeWebView.postMessage("");}, ${props.interval});
    //   true; // note: this is required, or you'll sometimes get silent failures

    // `;

    return (
        <WebView
            onMessage={props.function} /* () => {
                console.log(
                    props.initialHour,
                    " - ",
                    moment().format("HH:mm:ss"),
                    " - ",
                    finishHour
                );
                if (moment().format("HH:mm:ss") >= finishHour) {
                    props.stopSound();
                    props.setMinutes(null);
                    // navigation.navigate("home-stack");
                }
                // props.stopSound();
                // props.setMinutes(null);
            }} */
            // injectedJavaScript={runFirst}
            // source={{
            //     html: `
            //         <script>
            //             setInterval(()=>{window.ReactNativeWebView.postMessage("");}, ${props.interval})
            //         </script>
            //          `,
            // }}
            //     source={{
            //         html: `<script>
            //   setInterval(()=>{window.ReactNativeWebView.postMessage("");}, ${props.interval})
            //   </script>`,
            //     }}
            source={{
                html: `<script>
          setInterval(()=>{window.ReactNativeWebView.postMessage("");}, ${props.interval})
          </script>`,
            }}
        />
    );
}
export default BackgroundTask;
