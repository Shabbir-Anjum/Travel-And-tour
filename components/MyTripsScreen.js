import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import backgroundImage from "../assets/Vector2.png";
import { useTripContext } from "../contexts/TripContext";

function MyTripsScreen() {
  const navigation = useNavigation();
  const { trips, deleteTrip } = useTripContext();
  const [showActions, setShowActions] = useState(null);

  const navigateToCalendar = (trip) => {
    navigation.navigate("calendar", { tripData: trip });
  };

  const navigateToNewTrip = () => {
    navigation.navigate("newTrip", {});
  };

  const handleDeleteTrip = (tripId) => {
    deleteTrip(tripId);
    setShowActions(null); // Hide actions after deletion
  };

  return (
    <ImageBackground
      source={backgroundImage}
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#163532",
      }}
      resizeMode="cover"
    >
      <View
        style={{
          flex: 1,
          alignItems: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: 300,
            marginTop: 60,
            marginBottom: 20,
          }}
        >
          <TouchableOpacity onPress={() => navigation.navigate("Start")}>
            <View>
              <Ionicons name="arrow-back" size={40} color="#D1FFA0" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Start")}>
            <View>
              <Image
                source={require("../assets/tp.logo.small.png")}
                style={{
                  opacity: 0.5,
                }}
              />
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.pageTitle}>Your travel plans:</Text>
        <View style={styles.scrollBox}>
          <ScrollView>
            {trips.map((trip) => (
              <TouchableOpacity
                key={trip.id}
                onPress={() => navigateToCalendar(trip)}
                onLongPress={() => setShowActions(trip.id)}
                style={styles.tripContainer}
              >
                <View style={styles.tripContainerBig}>
                  <View style={styles.tripContainerSmall}>
                    <Text style={styles.tripText}>{trip.destination}</Text>
                    <Text style={styles.smallTripText}>
                      {new Date(trip.startDate).toLocaleDateString()} -
                      {new Date(trip.endDate).toLocaleDateString()}
                    </Text>
                  </View>
                  <MaterialIcons
                    name="arrow-forward-ios"
                    size={40}
                    color="#D1FFA0"
                    style={{ marginLeft: 40 }}
                  />
                </View>

                {showActions === trip.id && (
                  <View style={styles.actionsContainer}>
                    <MaterialCommunityIcons
                      name="trash-can-outline"
                      size={30}
                      color="#D1FFA0"
                      onPress={() => handleDeleteTrip(trip.id)}
                    />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <TouchableOpacity onPress={navigateToNewTrip}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>CREATE NEW TRIP</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  tripContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#D1FFA0",
    margin: 10,
  },
  scrollBox: {
    height: 300,
    width: "70%",
    marginBottom: 10,
  },
  tripContainerBig: {
    flexDirection: "row",
    alignItems: "center",
  },
  tripContainerSmall: {
    flexDirection: "column",
  },

  pageTitle: {
    fontSize: 30,
    color: "#D1FFA0",
    fontWeight: "bold",
    fontFamily: "Kalnia-Bold",
    marginTop: 30,
  },

  tripText: {
    fontSize: 23,
    color: "#EDF2E1",
    fontFamily: "Poppins-Bold",
  },

  smallTripText: {
    fontSize: 14,
    color: "#EDF2E1",
    fontFamily: "Poppins-Regular",
  },

  actionsContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 5,
  },

  button: {
    backgroundColor: "#D1FFA0",
    padding: 10,
    borderRadius: 20,
    justifyContent: "flex-start",
    width: 200,
    marginVertical: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#163532",
    fontSize: 15,
    fontFamily: "Poppins-Bold",
  },
});

export default MyTripsScreen;
