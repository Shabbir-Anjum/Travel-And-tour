import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import NotesScreen from "../components/NotesScreen";
import { useTripContext } from "../contexts/TripContext";

function Notes({ route }) {
  const navigation = useNavigation();
  const { tripId } = route.params;
  const { saveTripNotes, getTripNotes } = useTripContext();
  const [tripNotes, setTripNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const notes = await getTripNotes(tripId);
        setTripNotes(notes);
      } catch (error) {
        console.error("Error fetching restaurant notes:", error);
      }
    };

    fetchNotes();
  }, [tripId]);

  const onSaveTripNote = async (selectedNote, title, content) => {
    try {
      const newNote = {
        id: selectedNote ? selectedNote.id : Date.now(),
        title,
        content,
      };

      // Retrieve existing notes for the trip
      const existingNotes = await getTripNotes(tripId);

      // Update or add the new note
      const updatedNotes = selectedNote
        ? existingNotes.map((note) =>
            note.id === selectedNote.id ? { ...note, ...newNote } : note
          )
        : [...existingNotes, { ...newNote }];

      // Save the updated notes
      await saveTripNotes(tripId, updatedNotes);

      // Update the state with the new notes
      setTripNotes(updatedNotes);
    } catch (error) {
      console.error("Error saving restaurant notes:", error);
    }
  };

  // Function to delete a restaurant note
  const handleDeleteTripNote = async (note) => {
    try {
      // Retrieve existing notes for the trip
      const existingNotes = await getTripNotes(tripId);

      // Filter out the note to be deleted
      const updatedNotes = existingNotes.filter((item) => item.id !== note.id);

      // Save the updated notes
      await saveTripNotes(tripId, updatedNotes);

      // Update the state with the new notes
      setTripNotes(updatedNotes);
    } catch (error) {
      console.error("Error deleting restaurant note:", error);
    }
  };

  return (
    <>
      <View style={{ justifyContent: "flex-start", margin: 20, marginTop: 40 }}>
        <TouchableOpacity
          onPress={() => navigation.navigate("calendar")} // Navigate to CalendarScreen
        >
          <MaterialCommunityIcons name="close" size={30} color="#163532" />
        </TouchableOpacity>
      </View>
      <View
        style={{ flex: 1, alignItems: "center", marginTop: 10, margin: 20 }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            margin: 10,
          }}
        >
          <MaterialIcons name="notes" size={70} color="#163532" />
          <View style={{ flexDirection: "column", marginLeft: 10, flex: 1 }}>
            <Text style={styles.title}>Notes</Text>
            <Text style={styles.text}>
              On this page you can save general notes for your trip!
            </Text>
          </View>
        </View>

        <NotesScreen
          notesData={tripNotes}
          onSaveNote={onSaveTripNote}
          onEditNote={handleEditTripNote}
          onDeleteNote={(note) => handleDeleteTripNote(note)}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 40,
    fontWeight: "bold",
    //marginBottom: 10,
    color: "#163532",
  },
  text: {
    fontSize: 16,
    //padding: 10,
    //marginBottom: 10,
    color: "#333",
  },
});

export default Notes;
