import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import Notes from "./Pages/Notes";
import Restaurant from "./Pages/Restaurant";
import Sights from "./Pages/Sights";
import Weather from "./Pages/Weather";
import CalendarScreen from "./components/CalendarScreen";
import MyTripsScreen from "./components/MyTripsScreen";
import NewTripScreen from "./components/NewTripScreen";
import PackListScreen from "./components/PackListScreen";
import StartScreen from "./components/StartScreen";

const Stack = createNativeStackNavigator();

function Main() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Start" component={StartScreen} />
        <Stack.Screen name="newTrip" component={NewTripScreen} />
        <Stack.Screen name="calendar" component={CalendarScreen} />
        <Stack.Screen name="myTrips" component={MyTripsScreen} />
        <Stack.Screen name="restaurants" component={Restaurant} />
        <Stack.Screen name="sights" component={Sights} />
        <Stack.Screen name="notes" component={Notes} />
        <Stack.Screen name="packlist" component={PackListScreen} />
        <Stack.Screen name="weather" component={Weather} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Main;
