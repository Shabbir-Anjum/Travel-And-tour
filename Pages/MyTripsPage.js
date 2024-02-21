import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";

function MyTripsPage() {
  const navigation = useNavigation();
  const navigateToCalendar = () => {
    const serializedTripData = {
      name: name,
      destination: destination,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };

    navigation.navigate("calendar", {
      tripData: serializedTripData,
      startDate,
      endDate,
    });
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#163532",
      }}
    >
      <Text> My trips:</Text>
      <Text> example trip</Text>

      <TouchableOpacity onPress={navigateToCalendar}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Create New Trip</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default MyTripsPage;
