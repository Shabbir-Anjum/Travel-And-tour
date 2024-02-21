import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";
import WeatherScreen from "../components/WeatherScreen";

function Weather() {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",

        backgroundColor: "#163532",
      }}
    >
      <View
        style={{
          justifyContent: "flex-start",
          width: "90%",
          margin: 20,
          marginTop: 40,
        }}
      >
        <TouchableOpacity onPress={() => navigation.navigate("calendar")}>
          <MaterialCommunityIcons name="close" size={30} color="white" />
        </TouchableOpacity>
      </View>
      <Text
        style={{
          fontSize: 30,
          margin: 20,
          color: "#EDF2E1",
          fontFamily: "Poppins-Bold",
        }}
      >
        Check the weather!
      </Text>

      <WeatherScreen />
    </View>
  );
}

export default Weather;
