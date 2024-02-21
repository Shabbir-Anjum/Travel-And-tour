import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext } from "react";
import { useAsyncStorageState } from "../hooks/useAsyncStorageState";

const TripContext = createContext();

export const useTripContext = () => {
  return useContext(TripContext);
};

export const TripProvider = ({ children }) => {
  const [trips, updateTrips] = useAsyncStorageState("trips", []);

  const addTrip = async (newTrip) => {
    try {
      // Generate a unique ID using the current timestamp
      const tripWithId = { id: Date.now().toString(), ...newTrip };

      // Store the new trip data in AsyncStorage
      await AsyncStorage.setItem(
        `tripData:${tripWithId.id}`,
        JSON.stringify(tripWithId)
      );

      updateTrips([...trips, tripWithId]);
    } catch (error) {
      console.error("Error adding trip:", error);
    }
  };

  const deleteTrip = async (tripId) => {
    try {
      const updatedTrips = trips.filter((trip) => trip.id !== tripId);

      // Remove the corresponding trip data from AsyncStorage
      await AsyncStorage.removeItem(`tripData:${tripId}`);

      updateTrips(updatedTrips);
    } catch (error) {
      console.error("Error deleting trip:", error);
    }
  };

  const getTrip = async (tripId) => {
    try {
      // Retrieve trip data from AsyncStorage based on the provided id
      const tripData = await AsyncStorage.getItem(`tripData:${tripId}`);
      return tripData ? JSON.parse(tripData) : null;
    } catch (error) {
      console.error("Error fetching trip data:", error);
      return null;
    }
  };

  const saveTripNotes = async (tripId, notes) => {
    try {
      // Save the notes for the trip in AsyncStorage
      await AsyncStorage.setItem(`tripNotes:${tripId}`, JSON.stringify(notes));
    } catch (error) {
      console.error("Error saving trip notes:", error);
    }
  };

  const getTripNotes = async (tripId) => {
    try {
      // Retrieve trip notes from AsyncStorage based on the provided tripId
      const tripNotes = await AsyncStorage.getItem(`tripNotes:${tripId}`);
      return tripNotes ? JSON.parse(tripNotes) : [];
    } catch (error) {
      console.error("Error fetching trip notes:", error);
      return [];
    }
  };

  const saveRestaurantNotes = async (tripId, notes) => {
    try {
      await AsyncStorage.setItem(
        `restaurantNotes:${tripId}`,
        JSON.stringify(notes)
      );
    } catch (error) {
      console.error("Error saving restaurant notes:", error);
    }
  };

  const getRestaurantNotes = async (tripId) => {
    try {
      const restaurantNotes = await AsyncStorage.getItem(
        `restaurantNotes:${tripId}`
      );
      return restaurantNotes ? JSON.parse(restaurantNotes) : [];
    } catch (error) {
      console.error("Error fetching restaurant notes:", error);
      return [];
    }
  };

  // Save and retrieve sight notes
  const saveSightNotes = async (tripId, notes) => {
    try {
      await AsyncStorage.setItem(`sightNotes:${tripId}`, JSON.stringify(notes));
    } catch (error) {
      console.error("Error saving sight notes:", error);
    }
  };

  const getSightNotes = async (tripId) => {
    try {
      const sightNotes = await AsyncStorage.getItem(`sightNotes:${tripId}`);
      return sightNotes ? JSON.parse(sightNotes) : [];
    } catch (error) {
      console.error("Error fetching sight notes:", error);
      return [];
    }
  };

  //save todo items

  // Inside TripProvider

  // Save todo items with start and end dates
  const getTodoData = async (tripId) => {
    try {
      // Retrieve todoData from AsyncStorage based on the provided tripId
      const todoData = await AsyncStorage.getItem(`todoData:${tripId}`);
      return todoData ? JSON.parse(todoData) : [];
    } catch (error) {
      console.error("Error fetching todoData:", error);
      return [];
    }
  };

  // Inside saveTodoData
  const saveTodoData = async (tripId, todoData) => {
    try {
      await AsyncStorage.setItem(
        `todoData:${tripId}`,
        JSON.stringify(todoData)
      );
    } catch (error) {
      console.error("Error saving todoData:", error);
    }
  };

  // Save and retrieve packing list items
  const getPackingList = async (tripId) => {
    try {
      const packingList = await AsyncStorage.getItem(`packingList:${tripId}`);
      console.log(
        "Fetched packing list for tripId:",
        tripId,
        "Data:",
        packingList
      );
      return packingList ? JSON.parse(packingList) : [];
    } catch (error) {
      console.error("Error fetching packing list:", error);
      return [];
    }
  };

  // Inside savePackingList
  const savePackingList = async (tripId, packingList) => {
    try {
      await AsyncStorage.setItem(
        `packingList:${tripId}`,
        JSON.stringify(packingList)
      );
      console.log(
        "Saved packing list for tripId:",
        tripId,
        "Data:",
        packingList
      );
    } catch (error) {
      console.error("Error saving packing list:", error);
    }
  };

  const value = {
    trips,
    addTrip,
    deleteTrip,
    getTrip,
    saveTripNotes,
    getTripNotes,
    getRestaurantNotes,
    saveRestaurantNotes,
    getSightNotes,
    saveSightNotes,
    getTodoData,
    saveTodoData,
    getPackingList,
    savePackingList,
  };

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
};
