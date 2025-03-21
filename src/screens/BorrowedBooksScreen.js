import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import { getDocs, deleteDoc, doc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { borrowedBooksRef } from "../firebase/config";

export default function BorrowedBooksScreen() {
  const [borrowedBooks, setBorrowedBooks] = useState([]);

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      const querySnapshot = await getDocs(borrowedBooksRef);
      const books = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBorrowedBooks(books);
    };
    fetchBorrowedBooks();
  }, []);

  const returnBook = async (id) => {
    try {
      await deleteDoc(doc(borrowedBooksRef, id));
      Alert.alert("Returned", "You returned the book.");
      setBorrowedBooks((prevBooks) =>
        prevBooks.filter((book) => book.id !== id)
      );
    } catch (error) {
      console.error("Error returning book:", error);
      Alert.alert("Error", "Failed to return the book.");
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={borrowedBooks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.imageContainer}>
              {item.imageUri ? (
                <Image
                  source={{ uri: item.imageUri }}
                  style={styles.bookImage}
                />
              ) : (
                <Ionicons
                  name="book-outline"
                  size={50}
                  color="gray"
                  style={styles.icon}
                />
              )}
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.author}>by {item.author}</Text>
              {/* Custom Return Button */}
              <TouchableOpacity
                style={styles.returnButton}
                onPress={() => returnBook(item.id)}
              >
                <Text style={styles.returnButtonText}>Return Book</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f4f4f9" },
  card: {
    backgroundColor: "#fff",
    marginBottom: 16,
    padding: 15,
    borderRadius: 10,
    elevation: 3, // adds shadow on Android
    shadowColor: "#000", // shadow color for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    flexDirection: "row", // Align the image and text horizontally
    alignItems: "center", // Vertically align them in the center
  },
  imageContainer: {
    width: 100,
    height: 150,
    marginRight: 15,
  },
  bookImage: { width: "100%", height: "90%", borderRadius: 10 },
  textContainer: { flex: 1 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  author: { fontSize: 14, color: "gray" },
  icon: { position: "absolute", right: 15, top: 15 },

  // Custom Return Button Styling
  returnButton: {
    backgroundColor: "#f44336", // Red background
    paddingVertical: 12, // Taller button
    paddingHorizontal: 20, // Wider button
    borderRadius: 8,
    marginTop: 10,
  },
  returnButtonText: {
    fontSize: 16, // Larger text
    color: "#fff", // White text
    textAlign: "center",
    fontWeight: "bold",
  },
});