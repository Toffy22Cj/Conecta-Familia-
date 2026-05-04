import React, { useEffect, useReducer } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as SecureStore from "expo-secure-store";
import { ActivityIndicator, View, StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Notifications from "expo-notifications";

import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import { colors } from "./src/theme/colors";
import {
  appMachineInitialState,
  appMachineReducer,
} from "./src/machines/appMachine";

const Stack = createStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [appState, dispatch] = useReducer(
    appMachineReducer,
    appMachineInitialState,
  );

  useEffect(() => {
    const initializeApp = async () => {
      dispatch({ type: "CHECK_AUTH" });
      try {
        const token = await SecureStore.getItemAsync("token");
        const savedTheme = await SecureStore.getItemAsync("theme");
        const theme = savedTheme === "dark" ? "dark" : "light";
        dispatch({ type: "SET_THEME", theme });

        const permission = await requestNotificationPermission();
        dispatch({
          type: "SET_NOTIFICATIONS",
          enabled: permission === "granted",
        });

        if (token) {
          dispatch({ type: "AUTH_SUCCESS" });
          if (permission === "granted") {
            scheduleWelcomeNotification();
          }
        } else {
          dispatch({ type: "AUTH_FAILED" });
        }
      } catch (error) {
        dispatch({ type: "ERROR", error: error.message });
      }
    };

    initializeApp();
  }, []);

  const requestNotificationPermission = async () => {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    return finalStatus;
  };

  const scheduleWelcomeNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Bienvenido a Conecta Familia",
        body: "Tu espacio familiar está listo. Explora foros, retos y citas.",
      },
      trigger: { seconds: 2 },
    });
  };

  const toggleTheme = async () => {
    const nextTheme = appState.theme === "dark" ? "light" : "dark";
    await SecureStore.setItemAsync("theme", nextTheme);
    dispatch({ type: "SET_THEME", theme: nextTheme });
  };

  if (appState.status === "booting") {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor:
            appState.theme === "dark" ? colors.dark : colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar
          barStyle={
            appState.theme === "dark" ? "light-content" : "dark-content"
          }
          backgroundColor={
            appState.theme === "dark" ? colors.dark : colors.background
          }
        />
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={
              appState.activeView === "dashboard" ? "Dashboard" : "Login"
            }
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Dashboard">
              {(props) => (
                <DashboardScreen
                  {...props}
                  themeMode={appState.theme}
                  toggleTheme={toggleTheme}
                />
              )}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
