import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useTripContext } from "../contexts/TripContext";
import Countdown from "./countdown";
import IconBar from "./IconBar";
import TodoComponent from "./TodoComponent";

function CalendarScreen() {
  const { getTrip, getTodoData } = useTripContext();
  const navigation = useNavigation();
  const [showTodoList, setShowTodoList] = useState(false);

  const route = useRoute();
  const { tripData: routeTripData, startDate, endDate } = route.params || {};
  const [tripData, setTripData] = useState(routeTripData || {});
  const [selectedDateMarked, setSelectedDateMarked] = useState({});
  const [todosDates, setTodosDates] = useState([]);
  const [todoData, setTodoData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const toggleTodoList = () => {
    setShowTodoList((prevShowTodoList) => !prevShowTodoList);
  };

  useEffect(() => {
    const fetchStoredTripData = async () => {
      try {
        const { tripId } = route.params || {};
        const storedTripData = await getTrip(tripId);

        if (storedTripData) {
          setTripData(storedTripData);

          // Fetch and set todos for the trip
          const todos = await getTodoData(tripId);
          setTodoData(todos);
        }
      } catch (error) {
        console.error("Error fetching trip data from AsyncStorage:", error);
      }
    };

    fetchStoredTripData();
  }, [route.params, getTrip, getTodoData]);

  // Use useEffect to load todos when the component mounts
  useEffect(() => {
    const loadTodos = async () => {
      try {
        const { tripId } = tripData;
        const todos = await getTodoData(tripId);
        setTodoData(todos);
      } catch (error) {
        console.error("Error loading todos:", error);
      }
    };

    // Load todos when the component mounts
    loadTodos();
  }, [tripData, getTodoData]);

  const today = new Date();
  const dateString = today.toISOString().split("T")[0];

  const renderDay = (day) => {
    const isToday = day.dateString === dateString;
    return <Text style={[styles.day, isToday && styles.today]}>{day.day}</Text>;
  };

  const handleBackToNewTripPress = () => {
    navigation.navigate("newTrip");
  };

  const handleDayPress = (day) => {
    const selectedDate = day.dateString;
    setSelectedDate(selectedDate);
    console.log("Selected Date:", selectedDate);

    if (!todosDates.includes(selectedDate)) {
      setTodosDates((prevDates) => [...prevDates, selectedDate]);
      updateMarkedDates(selectedDate);
    }

    setSelectedDateMarked({
      [selectedDate]: { selected: true, textColor: "#000" },
    });
    setShowTodoList(true);
  };

  const updateMarkedDates = (date) => {
    setSelectedDateMarked((prevMarkedDates) => ({
      ...prevMarkedDates,
      [date]: { selected: true, marked: true, dotColor: "#B726DC" },
    }));
  };

  const convertToYYYYMMDD = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const createDateRange = (startDate, endDate) => {
    const dateRange = [];
    let currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
      dateRange.push(convertToYYYYMMDD(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dateRange;
  };

  const markedDates = {};
  if (tripData.startDate && tripData.endDate) {
    const start = convertToYYYYMMDD(tripData.startDate);
    const end = convertToYYYYMMDD(tripData.endDate);
    const dateRange = createDateRange(start, end);
    dateRange.forEach((date, index) => {
      markedDates[date] = {
        color: "#D1FFA0",
        textColor: "#163532",
        ...(index === 0 && { startingDay: true }),
        ...(index === dateRange.length - 1 && { endingDay: true }),
      };
    });
  }

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
    <>
      <ScrollView style={{ backgroundColor: "#163532" }}>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: 300,
              marginTop: 60,
            }}
          >
            <TouchableOpacity onPress={() => navigation.navigate("myTrips")}>
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
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              padding: 30,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: 10,
              }}
            >
              <View style={styles.container}>
                {tripData.name && tripData.destination && (
                  <Text style={styles.detailText}>
                    {tripData.name}'s trip to {tripData.destination}
                  </Text>
                )}
              </View>

              <View style={styles.countdownContainer}>
                <Countdown startDate={new Date(tripData.startDate)} />
              </View>
            </View>

            <IconBar tripId={tripData.id} />
            <View style={styles.navContainer}></View>

            <Calendar
              style={styles.styleCalendar}
              theme={{
                calendarBackground: "#163532",
                monthTextColor: "white",
                fontFamily: "Poppins-Regular",
                textMonthFontSize: 22,
                textMonthFontFamily: "Poppins-Regular",
                arrowColor: "white",
                dayTextColor: "#D1FFA0",
                todayBackgroundColor: "#B726DC",
              }}
              onDayPress={handleDayPress}
              renderDay={renderDay}
              markingType={"period"}
              markedDates={{
                ...markedDates,
              }}
            />

            <View style={styles.addTodoContainer}>
              <Text style={styles.addButton}>Press a date to add a todo</Text>
            </View>

            {/* Display selected date */}

            {/* Conditionally render "Today's plans" based on whether a date is selected */}
            {selectedDate && (
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                  marginLeft: -150,
                  marginTop: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontFamily: "Poppins-Bold",
                    color: "#EDF2E1",
                    marginRight: 10,
                  }}
                >
                  Today's plans
                </Text>

                <View style={styles.selectedDateContainer}>
                  <Text style={styles.selectedDateText}>
                    {new Date(selectedDate).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                    }) + getDaySuffix(new Date(selectedDate).getDate())}
                  </Text>
                </View>
              </View>
            )}

            {/* Conditionally render the TodoComponent */}
            {showTodoList && (
              <TodoComponent tripId={tripData.id} selectedDate={selectedDate} />
            )}
          </View>
        </View>
      </ScrollView>
    </>
  );
}
const styles = StyleSheet.create({
  countdownContainer: {
    alignItems: "center",
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "Poppins-Regular",
    marginTop: 10,
  },
  detailText: {
    fontSize: 27,
    marginLeft: 10,

    fontFamily: "Poppins-Bold",
    color: "#EDF2E1",

    padding: 10,
  },
  styleCalendar: {
    marginTop: 20,
    width: 300,
    backgroundColor: "#163532",
    fontFamily: "Poppins-Bold",
    shadowColor: "#588278",
  },
  day: {
    textAlign: "center",
    fontSize: 18,
  },
  today: {
    fontWeight: "bold",
  },
  isToday: {
    fontWeight: "bold",
  },
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  navContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "auto",
  },

  addButton: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    fontFamily: "Poppins-Regular",
    color: "white",
    marginTop: 10,
    opacity: 0.5,
  },
  backButton: {
    fontSize: 13,
    color: "grey",
    marginTop: 10,
  },
  selectedDateText: {
    fontFamily: "Poppins-Regular",
    color: "#D1FFA0",
    fontSize: 18,
  },
  plans: {
    fontFamily: "Poppins-Bold",
    color: "white",
    fontSize: 22,
  },
  toggleButtonText: {
    backgroundColor: "purple",
  },
});

export default CalendarScreen;
