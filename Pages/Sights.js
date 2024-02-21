import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import NotesScreen from "../components/NotesScreen";
import { useTripContext } from "../contexts/TripContext";

function Sights({ route }) {
  const navigation = useNavigation();
  const { tripId } = route.params;
  const { saveSightNotes, getSightNotes } = useTripContext();
  const [sightNotes, setSightNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const notes = await getSightNotes(tripId);
        setSightNotes(notes);
      } catch (error) {
        console.error("Error fetching restaurant notes:", error);
      }
    };

    fetchNotes();
  }, [tripId]);

  const onSaveSightNote = async (selectedNote, title, content) => {
    try {
      const newNote = {
        id: selectedNote ? selectedNote.id : Date.now(),
        title,
        content,
      };

      // Retrieve existing notes for the trip
      const existingNotes = await getSightNotes(tripId);

      // Update or add the new note
      const updatedNotes = selectedNote
        ? existingNotes.map((note) =>
            note.id === selectedNote.id ? { ...note, ...newNote } : note
          )
        : [...existingNotes, { ...newNote }];

      // Save the updated notes
      await saveSightNotes(tripId, updatedNotes);

      // Update the state with the new notes
      setSightNotes(updatedNotes);
    } catch (error) {
      console.error("Error saving restaurant notes:", error);
    }
  };

  // Function to delete a restaurant note
  const handleDeleteSightsNote = async (note) => {
    try {
      // Retrieve existing notes for the trip
      const existingNotes = await getSightNotes(tripId);

      // Filter out the note to be deleted
      const updatedNotes = existingNotes.filter((item) => item.id !== note.id);

      // Save the updated notes
      await saveSightNotes(tripId, updatedNotes);

      // Update the state with the new notes
      setSightNotes(updatedNotes);
    } catch (error) {
      console.error("Error deleting restaurant note:", error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#EDF2E1" }}>
      <View style={{ justifyContent: "flex-start", margin: 20, marginTop: 40 }}>
        <TouchableOpacity onPress={() => navigation.navigate("calendar")}>
          <MaterialCommunityIcons name="close" size={40} color="#163532" />
        </TouchableOpacity>
      </View>
      <View
        style={{ flex: 1, alignItems: "center", marginTop: 10, margin: 20 }}
      >
        <View
          style={{ flexDirection: "row", alignItems: "center", margin: 10 }}
        >
          <MaterialCommunityIcons
            name="ferris-wheel"
            size={70}
            color="#163532"
          />
          <View style={{ flexDirection: "column", marginLeft: 10, flex: 1 }}>
            <Text style={styles.title}>SIGHTS</Text>
            <Text style={styles.text}>
              Save information about sights and attractions you want to visit
              during your trip!
            </Text>
          </View>
        </View>

        <NotesScreen
          notesData={sightNotes}
          onSaveNote={onSaveSightNote}
          onDeleteNote={(note) => handleDeleteSightsNote(note)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#163532",
    fontFamily: "Poppins-Bold",
  },
  text: {
    fontSize: 14,
    color: "#163532",
    fontFamily: "Poppins-Regular",
  },
});

export default Sights;
