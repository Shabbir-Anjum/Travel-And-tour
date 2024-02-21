import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { TouchableOpacity, View } from "react-native";

function IconBar({ tripId }) {
  const navigation = useNavigation();

  const navigateToScreen = (screenName) => {
    navigation.navigate(screenName, { tripId });
  };

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 20,
        padding: 10,
      }}
    >
      <TouchableOpacity
        onPress={() => navigateToScreen("restaurants", { tripId })}
        style={styles.iconContainer}
      >
        <MaterialCommunityIcons
          name="food"
          size={40}
          color="#D1FFA0"
          style={{
            shadowColor: "#588278",
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.6,
            shadowRadius: 2,
            elevation: 2,
          }}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigateToScreen("sights", { tripId })}
        style={styles.iconContainer}
      >
        <MaterialCommunityIcons
          name="ferris-wheel"
          size={40}
          color="#D1FFA0"
          style={{
            shadowColor: "#588278",
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.6,
            shadowRadius: 2,
            elevation: 2,
          }}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          console.log("Navigating to packlist with tripId:", tripId);
          navigateToScreen("packlist", { tripId });
        }}
        style={styles.iconContainer}
      >
        <Entypo
          name="list"
          size={48}
          color="#D1FFA0"
          style={{
            shadowColor: "#588278",
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.6,
            shadowRadius: 2,
            elevation: 2,
          }}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigateToScreen("weather")}
        style={styles.iconContainer}
      >
        <MaterialCommunityIcons
          name="sun-thermometer"
          size={40}
          color="#D1FFA0"
          style={{
            shadowColor: "#588278",
            shadowOffset: { width: 1, height: 5 },
            shadowOpacity: 0.6,
            shadowRadius: 2,
            elevation: 2,
          }}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  iconContainer: {
    width: 63,
    height: 63,
    marginHorizontal: 7,
    backgroundColor: "rgba(209, 255, 160, 0.15)",

    borderRadius: 20,

    justifyContent: "center",
    alignItems: "center",
  },
  iconStyle: {
    shadowColor: "#588278",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.6,
    shadowRadius: 2,
    elevation: 2,
  },
};

export default IconBar;
