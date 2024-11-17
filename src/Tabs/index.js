import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

import Principal from "./TelaPrincipal";
import Perfil from "./Perfil";
import Config from "./Config";

const Tab = createBottomTabNavigator();

const screenOptions = {
    tabBarStyle: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        height: 50,
    },
    tabBarActiveTintColor: '#32AB6C',
    tabBarInactiveTintColor: '#8F9BB3',
};

const tabs = [
    {
        name: 'Perfil',
        component: Perfil,
        icon: 'person-outline',
    },
    {
        name: 'Principal',
        component: Principal,
        icon: 'home-outline',
    },
    {
        name: 'Config',
        component: Config,
        icon: 'settings-outline',
    },
];

export default function Tabs() {
    return (
        <Tab.Navigator screenOptions={screenOptions}>
            {tabs.map((tab) => (
                <Tab.Screen
                    key={tab.name}
                    name={tab.name}
                    component={tab.component}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name={tab.icon} color={color} size={size} />
                        ),
                    }}
                />
            ))}
        </Tab.Navigator>
    );
}
