import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-elements/dist/icons/Icon";

import HomeStack from "./HomeStack";
// import AudioCuentosComp from "../components/AudioCuentosComp";

const Tab = createBottomTabNavigator();

const Navigation = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName="home"
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ color }) => screenOptions(route, color),
                    tabBarActiveTintColor: "#fff",
                    tabBarInactiveTintColor: "#0a4b4f",
                    tabBarHideOnKeyboard: true,
                })}
            >
                <Tab.Screen
                    name="home"
                    component={HomeStack}
                    options={{
                        headerShown: false,
                        title: "Inicio",
                        tabBarActiveBackgroundColor: "#0a4b4f",
                        tabBarLabel: "Inicio",
                        tabBarLabelStyle: {
                            fontSize: 12,
                            fontWeight: "bold",
                            marginBottom: 5,
                        },
                        tabBarShowLabel: true,
                        tabBarStyle: {
                            borderTopWidth: 0,
                            height: 0,
                        },
                    }}
                />
                {/* <Tab.Screen
                    name="nose"
                    component={AudioCuentosComp}
                    options={{
                        headerShown: true,
                        title: "Inicio",
                        tabBarActiveBackgroundColor: "#0a4b4f",
                        tabBarLabel: "Inicio",
                        tabBarShowLabel: true,
                        tabBarStyle: {
                            borderTopWidth: 0,
                        },
                    }}
                /> */}
            </Tab.Navigator>
        </NavigationContainer>
    );
};

const screenOptions = (route, color) => {
    let iconName;

    switch (route.name) {
        case "home":
            iconName = "home-outline";
            break;
        case "nose":
            iconName = "heart-outline";
            break;
        case "top-restaurants":
            iconName = "star-outline";
            break;
        case "search":
            iconName = "magnify";
            break;
        case "account":
            iconName = "home-outline";
            break;

        default:
            break;
    }
    return (
        <Icon
            type="material-community"
            name={iconName}
            size={25}
            color={color}
        />
    );
};

export default Navigation;
