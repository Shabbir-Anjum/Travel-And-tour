import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const NotesScreen = ({
  notesData,
  titleText,
  descriptionText,
  onSaveNote,
  onEditNote,
  onDeleteNote,
}) => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const handleSaveNote = () => {
    if (selectedNote) {
      const updatedNotes = notes.map((note) =>
        note.id === selectedNote.id ? { ...note, title, content } : note
      );
      setNotes(updatedNotes);
      setSelectedNote(null);
    } else {
      const newNote = {
        id: Date.now(),
        title,
        content,
      };
      setNotes([...notes, newNote]);
    }
    onSaveNote(selectedNote, title, content);
    setTitle("");
    setContent("");
    setModalVisible(false);
  };

  const handleEditNote = (note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
    setModalVisible(true);
    // Call the onEditNote prop if it exists
    onEditNote && onEditNote(note);
  };

  const handleDeleteNote = (note) => {
    const updatedNotes = notes.filter((item) => item.id !== note.id);
    setNotes(updatedNotes);
    setSelectedNote(null);
    setModalVisible(false);

    onDeleteNote(note);
  };

  const handleLinkPress = (url) => {
    Linking.openURL(url);
  };

  const isLink = (content) => {
    // Define a regular expression to check if the content starts with "http://" or "https://"
    const linkPattern = /^(http:\/\/|https:\/\/)/;

    return linkPattern.test(content);
  };

  return (
    <View style={styles.container}>
      <View style={styles.littlecontainer}>
        <Text style={styles.title}>{titleText}</Text>
        <Text style={styles.title}>{descriptionText}</Text>
        {notesData.length > 0 ? (
          <ScrollView style={styles.noteList}>
            {notesData.map((note) => (
              <TouchableOpacity
                key={note.id}
                onPress={() => handleEditNote(note)}
                style={styles.bubble}
              >
                <Text style={styles.noteTitle}>{note.title}</Text>
                <Text
                  style={[
                    styles.noteSmallText,
                    isLink(note.content) && styles.linkText,
                  ]}
                  onPress={() => handleLinkPress(note.content)}
                >
                  {note.content}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>
              Tap "+" to add new notes!
            </Text>
          </View>
        )}
      </View>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setTitle("");
            setContent("");
            setModalVisible(true);
          }}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <Modal visible={modalVisible} animationType="slide" transparent={false}>
        <View style={styles.modalContainer}>
          {/* Note title input */}
          <TextInput
            style={styles.input}
            placeholder="Enter note title"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#163532"
          />

          {/* Note content input */}
          <TextInput
            style={styles.contentInput}
            multiline
            placeholder="Enter link"
            value={content}
            onChangeText={setContent}
            placeholderTextColor="#163532"
          />

          {/* Buttons for saving, canceling, and deleting */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.save]}
              onPress={handleSaveNote}
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
            {selectedNote && (
              <TouchableOpacity
                style={[styles.button, styles.delete]}
                onPress={() => handleDeleteNote(selectedNote)}
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
    padding: 10,
  },
  littlecontainer: {
    height: 300,
  },

  noteList: {
    flex: 1,
    width: 300,
  },
  noteTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    marginBottom: 5,
    color: "#163532",
    fontWeight: "bold",
    width: "100%",
    paddingLeft: 10,
    borderRadius: 8,
  },
  noteSmallText: {
    fontSize: 15,
    paddingLeft: 10,
    marginBottom: 10,
    color: "#163532",
    fontFamily: "Poppins-Regular",
  },
  addButton: {
    alignItems: "center",
    padding: 5,
    justifyContent: "center",
    backgroundColor: "#163532",
    paddingVertical: 12,
    borderRadius: 100,
    //marginTop: 10,
    width: 70,
  },
  addButtonText: {
    color: "#D1FFA0",
    fontSize: 30,
    fontFamily: "Poppins-Regular",
  },
  modalContainer: {
    flex: 1,
    padding: 50,
    backgroundColor: "#EDF2E1",
  },
  input: {
    padding: 20,
    marginBottom: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#163532",
    marginTop: 30,
  },
  contentInput: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    height: 150,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#163532",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  linkText: {
    textDecorationLine: "underline",
  },

  save: {
    backgroundColor: "#163532",
  },
  cancel: {
    borderColor: "#163532",
    borderWidth: 2,
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
    fontFamily: "Poppins-Regular",
    fontSize: 18,
    color: "#163532",
    textAlign: "center",
    opacity: 0.7,
  },
});

export default NotesScreen;
