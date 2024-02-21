// useAsyncStorageState.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export function useAsyncStorageState(key, initialValue) {
  const [state, setState] = useState(initialValue);

  useEffect(() => {
    const getData = async () => {
      try {
        const stringState = await AsyncStorage.getItem(key);
        if (stringState !== null) {
          setState(JSON.parse(stringState));
        }
      } catch (error) {
        console.error(
          `Error reading data from AsyncStorage for key ${key}:`,
          error
        );
      }
    };

    getData();
  }, [key]);

  const updateStateAndStorage = async (newState) => {
    setState(newState);
    await AsyncStorage.setItem(key, JSON.stringify(newState));
  };

  return [state, updateStateAndStorage];
}
