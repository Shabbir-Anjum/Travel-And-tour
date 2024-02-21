import { FontAwesome5 } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useTripContext } from "../contexts/TripContext";

const getCurrentTime = () => {
  const now = new Date();
  return now.toLocaleTimeString("sv-SE", {
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });
};

const TodoComponent = ({ tripId, selectedDate }) => {
  const { getTodoData, saveTodoData } = useTripContext();
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [isStartTimePickerVisible, setStartTimePickerVisibility] =
    useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);
  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const [selectedEndTime, setSelectedEndTime] = useState(null);
  const [startInput, setStartInput] = useState(getCurrentTime());
  const [endInput, setEndInput] = useState(getCurrentTime());

  useEffect(() => {
    loadTodos();
  }, [tripId, selectedDate]);

  const showStartTimePicker = () => {
    setStartTimePickerVisibility(true);
  };

  const hideStartTimePicker = () => {
    setStartTimePickerVisibility(false);
  };

  const showEndTimePicker = () => {
    setEndTimePickerVisibility(true);
  };

  const hideEndTimePicker = () => {
    setEndTimePickerVisibility(false);
  };

  const handleStartTimeConfirm = (date) => {
    const formattedTime = date.toLocaleTimeString("sv-SE", {
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    });

    setSelectedStartTime(formattedTime);
    setStartInput(formattedTime);
    hideStartTimePicker();
  };

  const handleEndTimeConfirm = (date) => {
    const formattedTime = date.toLocaleTimeString("sv-SE", {
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    });

    setSelectedEndTime(formattedTime);
    setEndInput(formattedTime);
    hideEndTimePicker();
  };

  const addTodo = async () => {
    if (todo.trim() !== "" && selectedStartTime && selectedEndTime) {
      const newTodo = {
        id: Date.now().toString(),
        text: todo,
        startTime: selectedStartTime,
        endTime: selectedEndTime,
        date: selectedDate,
      };

      const existingTodos = (await getTodoData(tripId)) || [];
      const updatedTodos = [...existingTodos, newTodo];
      setTodos(updatedTodos);

      await saveTodoData(tripId, updatedTodos);

      setTodo("");
      setSelectedStartTime(null);
      setSelectedEndTime(null);
      setStartInput(getCurrentTime());
      setEndInput(getCurrentTime());

      loadTodos();
    }
  };

  const handleDeleteTodo = async (item) => {
    try {
      // Remove the todo from the state
      const updatedTodos = todos.filter((todo) => todo.id !== item.id);
      setTodos(updatedTodos);

      // Remove the todo from persistent storage
      await saveTodoData(tripId, updatedTodos);

      console.log("Todo deleted successfully!");
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const loadTodos = async () => {
    try {
      const allTodos = (await getTodoData(tripId)) || [];
      const todosForSelectedDate = allTodos.filter(
        (todo) => todo.date === selectedDate
      );

      setTodos(todosForSelectedDate);
    } catch (error) {
      console.error("Error loading todos:", error);
    }
  };

  const getDaySuffix = (day) => {
    if (day >= 11 && day <= 13) {
      return "th";
    }

    const lastDigit = day % 10;
    switch (lastDigit) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView>
        {/* Conditionally render the first horizontal line */}
        {todos.length > 0 && <View style={styles.horizontalLine} />}

        <View style={styles.itemContainer}>
          {/* Map over todos array to render individual items */}
          {todos.map((item) => (
            <View key={item.id} style={styles.item}>
              {/* Todo item content */}
              <View style={styles.itemContent}>
                <Text
                  style={{
                    fontFamily: "Poppins-Regular",
                    fontSize: 14,
                    color: "#163532",
                  }}
                >
                  {item.date}
                </Text>
                <Text
                  style={{
                    fontFamily: "Poppins-Bold",
                    fontSize: 17,
                    color: "#163532",
                  }}
                >
                  {item.text}
                </Text>
                <Text
                  style={{
                    fontFamily: "Poppins-Regular",
                    fontSize: 14,
                    color: "#163532",
                  }}
                >
                  {`${item.startTime} - ${item.endTime}`}
                </Text>
              </View>

              {/* Trash icon */}
              <TouchableOpacity
                style={styles.trashIconContainer}
                onPress={() => handleDeleteTodo(item)}
              >
                <FontAwesome5 name="trash" size={20} color="#163532" />
              </TouchableOpacity>
            </View>
          ))}
          {/* Conditionally render the first horizontal line */}
          {todos.length > 0 && <View style={styles.horizontalLine} />}
        </View>

        <View style={styles.dateTimePickerContainer}>
          <TextInput
            style={styles.input}
            placeholder={"Write a todo"}
            placeholderTextColor={"#163532"}
            value={todo}
            onChangeText={(text) => setTodo(text)}
          />

          <TouchableOpacity onPress={() => addTodo()}>
            <View style={styles.addWrapper}>
              <Text style={styles.addText}>+</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Wrap "Enter start time" and "Enter end time" in a View with horizontal layout */}
        <View style={styles.timeInputContainer}>
          <TouchableOpacity
            onPress={showStartTimePicker}
            style={styles.timeButton}
          >
            <Text style={styles.timeInputLabel}>Starts</Text>
          </TouchableOpacity>
          <Text style={styles.timeInput}>{selectedStartTime}</Text>
        </View>

        <DateTimePickerModal
          isVisible={isStartTimePickerVisible}
          mode="time"
          onConfirm={handleStartTimeConfirm}
          onCancel={hideStartTimePicker}
        />

        {/* "Enter end time" label and text input */}
        <View style={styles.timeInputContainer}>
          <TouchableOpacity
            onPress={showEndTimePicker}
            style={styles.timeButton}
          >
            <Text style={styles.timeInputLabel}>Ends</Text>
          </TouchableOpacity>
          <Text style={styles.timeInput}>{selectedEndTime}</Text>
        </View>

        <DateTimePickerModal
          isVisible={isEndTimePickerVisible}
          mode="time"
          onConfirm={handleEndTimeConfirm}
          onCancel={hideEndTimePicker}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  dateTimePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  horizontalLine: {
    borderBottomColor: "#D3DFB7",
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  itemContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  item: {
    backgroundColor: "#D3DFB7",
    padding: 15,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    width: 300,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  timeInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    margin: 10,
  },
  itemContent: {
    flex: 1,
  },
  trashIconContainer: {
    marginLeft: 10,
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: "#D3DFB7",
    borderRadius: 60,
    borderColor: "#D3DFB7",
    borderWidth: 1,
    width: 240,
    fontFamily: "Poppins-Regular",
    margin: 10,
  },
  addButtonContainer: {
    alignItems: "flex-end",
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
  },
  timeInputLabel: {
    fontFamily: "Poppins-Bold",
    fontSize: 14,
    color: "#D3DFB7",
  },
  timeInput: {
    fontSize: 19,
    fontFamily: "Poppins-Regular",
    color: "#D1FFA0",
  },
  addWrapper: {
    width: 50,
    height: 50,
    backgroundColor: "#D3DFB7",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#C0C0C0",
    borderWidth: 1,
  },
  addText: {
    fontSize: 20,
  },
  timeButton: {
    borderWidth: 2,
    borderColor: "#D3DFB7",
    padding: 8,
    width: 80,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
});

export default TodoComponent;
