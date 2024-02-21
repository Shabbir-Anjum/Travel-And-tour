import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import bigLine from "../assets/Trainroadplane.png";
import backgroundImage from "../assets/Train_Darker.png";

function StartScreen() {
  const navigation = useNavigation();

  const navigateToMyTrips = () => {
    navigation.navigate("myTrips");
  };

  const [fontsLoaded] = useFonts({
    "Kalnia-Bold": require("../assets/fonts/Kalnia-Bold.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
  });

  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const moveTrain = () => {
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start(() => {
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: false,
        }).start(() => moveTrain());
      });
    };

    moveTrain();
  }, [animatedValue]);

  if (!fontsLoaded) {
    return undefined;
  }

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  return (
    <ImageBackground
      source={backgroundImage}
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#163532",
      }}
    >
      <Image
        source={bigLine}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          opacity: 0.5,
        }}
        resizeMode="cover"
      />
      <View
        style={{
          position: "relative",
          justifyContent: "flex-start",
          width: "100%",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 200,
            zIndex: 2,
          }}
        >
          <Text
            style={{
              fontSize: 45,
              fontFamily: "Kalnia-Bold",
              color: "#D1FFA0",
              margin: 20,
              top: -90,
            }}
          >
            TRAVEL PLANNER
          </Text>
          <Animated.View style={{ transform: [{ translateX }] }}>
            <MaterialIcons
              name="train"
              size={55}
              color="#EDF2E1"
              style={{ top: -62 }}
            />
          </Animated.View>
        </View>

        <Text
          style={{
            margin: 20,
            fontFamily: "Poppins-Regular",
            fontSize: 16,
            color: "#EDF2E1",
            top: -120,
          }}
        >
          Make your travel planning easier
        </Text>

        <TouchableOpacity
          onPress={navigateToMyTrips}
          style={{
            zIndex: 2,
            top: -90,
            shadowColor: "black",
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 2,
          }}
        >
          <View
            style={{
              backgroundColor: "#D1FFA0",
              padding: 14,
              borderRadius: 30,
              justifyContent: "flex-start",
              width: 190,
              margin: 10,
              marginLeft: 18,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#163532",
                fontSize: 15,
                fontFamily: "Poppins-Bold",
              }}
            >
              START PLANNING!
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

export default StartScreen;
