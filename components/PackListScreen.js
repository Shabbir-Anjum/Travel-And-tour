import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CheckBox from "react-native-check-box";
import { useTripContext } from "../contexts/TripContext";

const PackListScreen = ({ route, onSaveItem }) => {
  const { savePackingList, getPackingList } = useTripContext();
  const [packItems, setPackItems] = useState([]);
  const [selectedPackItem, setSelectedPackItem] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const { tripId } = route.params;
  const navigation = useNavigation();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        console.log("Fetching trip items for tripId:", tripId);
        const items = await getPackingList(tripId);
        console.log("Fetched trip items:", items);
        setPackItems(items || []);
      } catch (error) {
        console.error("Error fetching trip items:", error);
      }
    };

    fetchItems();
  }, [tripId, getPackingList]);

  const handleSavePackItem = () => {
    console.log("Saving pack item...");

    // If onSaveItem is a function, call it with the necessary data
    if (typeof onSaveItem === "function") {
      onSaveItem(selectedPackItem, title, content);
    }

    if (selectedPackItem) {
      const updatedPackItems = packItems.map((item) =>
        item.id === selectedPackItem.id
          ? { ...item, title, checked: selectedPackItem.checked }
          : item
      );
      setPackItems((prevPackItems) => {
        const newState = updatedPackItems;
        savePackingList(tripId, newState);
        return newState;
      });
      setSelectedPackItem(null);
    } else {
      const newPackItem = {
        id: Date.now(),
        title,
        checked: false,
      };
      setPackItems((prevPackItems) => {
        const newState = [...prevPackItems, newPackItem];
        savePackingList(tripId, newState);
        return newState;
      });
    }

    setTitle("");
    setModalVisible(false);

    console.log("Pack item saved successfully!");
  };

  const handleToggleCheckbox = (item) => {
    const updatedPackItems = packItems.map((packItem) =>
      packItem.id === item.id
        ? { ...packItem, checked: !packItem.checked }
        : packItem
    );
    setPackItems((prevPackItems) => {
      const newState = updatedPackItems;
      savePackingList(tripId, newState);
      return newState;
    });
  };

  const handleEditPackItem = (item) => {
    setSelectedPackItem(item);
    setTitle(item.title);
    setContent(item.content);
    setModalVisible(true);
  };

  const handleDeletePackItem = (item) => {
    const updatedPackItems = packItems.filter(
      (packItem) => packItem.id !== item.id
    );
    setPackItems(updatedPackItems);
    setSelectedPackItem(null);
    setModalVisible(false);

    // Save the updated items to async storage
    savePackingList(tripId, updatedPackItems);

    console.log("Pack item deleted successfully!");
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          justifyContent: "flex-start",
          margin: 10,

          marginTop: 40,
        }}
      >
        <TouchableOpacity onPress={() => navigation.navigate("calendar")}>
          <MaterialCommunityIcons
            name="close"
            size={40}
            color="#EDF2E1"
            style={{ marginTop: -20, marginBottom: 20, marginLeft: -150 }}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>My packing list:</Text>

      {packItems.length === 0 ? (
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>
            Your packing list is empty.
          </Text>
          <Text style={styles.placeholderText}>Tap "+" to add items.</Text>
        </View>
      ) : (
        <ScrollView style={styles.packItemList}>
          {packItems.map((packItem) => (
            <TouchableOpacity
              key={packItem.id}
              onPress={() => handleEditPackItem(packItem)}
            >
              <View style={styles.packItemContainer}>
                <CheckBox
                  style={styles.checkBox}
                  onClick={() => handleToggleCheckbox(packItem)}
                  isChecked={packItem.checked}
                  checkBoxColor="#D3DFB7"
                />
                <Text style={styles.packItemTitle}>{packItem.title}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setTitle("");
          setModalVisible(true);
        }}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent={false}>
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter pack item title"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#163532"
          />
          {/* Buttons for saving, canceling, and deleting */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.save]}
              onPress={handleSavePackItem}
            >
              <Text style={styles.buttonTextSave}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: "transparent",
                  borderColor: "#163532",
                  borderWidth: 2,
                },
              ]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            {selectedPackItem && (
              <TouchableOpacity
                style={[styles.button, styles.delete]}
                onPress={() => handleDeletePackItem(selectedPackItem)}
              >
                <MaterialCommunityIcons
                  name="trash-can-outline"
                  size={25}
                  color="#163532"
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    alignItems: "center",
    backgroundColor: "#163532",
  },
  title: {
    fontSize: 30,
    fontFamily: "Poppins-Bold",
    marginBottom: 10,
    color: "#D3DFB7",
  },
  packItemList: {
    flex: 1,
  },
  packItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    color: "#D3DFB7",
  },
  packItemTitle: {
    fontSize: 17,
    fontFamily: "Poppins-Regular",
    color: "#D3DFB7",
    width: "100%",
    marginLeft: 30,
  },
  checkBox: {
    flex: 1,
    padding: 10,
  },
  addButton: {
    alignItems: "center",
    padding: 5,
    justifyContent: "center",
    backgroundColor: "#D3DFB7",
    paddingVertical: 12,
    borderRadius: 100,
    //marginTop: 10,
    width: 70,
  },
  addButtonText: {
    color: "#163532",
    fontSize: 30,
    fontFamily: "Poppins-Regular",
  },
  modalContainer: {
    flex: 1,
    padding: 50,
    backgroundColor: "white",
  },
  input: {
    padding: 20,
    marginBottom: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#163532",
    marginTop: 30,
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  save: {
    backgroundColor: "#163532",
  },
  buttonText: {
    fontFamily: "Poppins-Regular",
    fontSize: 15,
  },
  buttonTextSave: {
    fontFamily: "Poppins-Regular",
    fontSize: 15,
    color: "#D1FFA0",
  },
  cancel: {
    borderColor: "#163532",
    borderWidth: 2,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 20,
    marginHorizontal: 5,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 18,
    fontFamily: "Poppins-Regular",
    color: "#D3DFB7",
    opacity: 0.5,
  },
});

export default PackListScreen;
