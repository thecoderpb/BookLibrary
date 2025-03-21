import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons for a placeholder icon
import { addDoc, query, where, getDocs } from "firebase/firestore";
import { borrowedBooksRef } from "../firebase/config";

export default function BookDetailsScreen({ route, navigation }) {
  const { book } = route.params;
  const [isBookBorrowed, setIsBookBorrowed] = useState(false);
  const [borrowedBooksCount, setBorrowedBooksCount] = useState(0);

  useEffect(() => {
    navigation.setOptions({
      headerBackTitle: null, // Hide the back button title
    });

    // Check if the book has already been borrowed
    const checkIfBookIsBorrowed = async () => {
      const q = query(
        borrowedBooksRef,
        where("title", "==", book.title),
        where("author", "==", book.author)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setIsBookBorrowed(true);
      }
    };

    // Fetch the count of borrowed books
    const fetchBorrowedBooksCount = async () => {
      const querySnapshot = await getDocs(borrowedBooksRef);
      setBorrowedBooksCount(querySnapshot.size); // Get the total number of borrowed books
    };

    checkIfBookIsBorrowed();
    fetchBorrowedBooksCount();
  }, [navigation, book]);

  const borrowBook = async () => {
    if (isBookBorrowed) {
      Alert.alert("Error", "This book has already been borrowed.");
      return;
    }

    if (borrowedBooksCount >= 3) {
      Alert.alert("Limit Reached", "You can only borrow up to 3 books.");
      return;
    }

    try {
      await addDoc(borrowedBooksRef, {
        title: book.title,
        author: book.author,
        imageUri: book.imageUri,
      });
      Alert.alert("Success", `"${book.title}" has been borrowed.`);
      setIsBookBorrowed(true);
      navigation.navigate("BorrowedBooks");
    } catch (error) {
      console.error("Error borrowing book:", error);
      Alert.alert("Error", "Failed to borrow book.");
    }
  };

  return (
    <View style={styles.container}>
      {book.imageUri ? (
        <Image source={{ uri: book.imageUri }} style={styles.image} />
      ) : (
        <Ionicons
          name="book-outline"
          size={150}
          color="gray"
          style={styles.icon}
        />
      )}
      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.author}>by {book.author}</Text>
      <Text style={styles.description}>
        {book.description || "No description available."}
      </Text>

      {/* Custom button with TouchableOpacity for larger size */}
      <TouchableOpacity
        style={[styles.borrowButton, isBookBorrowed && styles.disabledButton]} // Add disabled style if already borrowed
        onPress={borrowBook}
        disabled={isBookBorrowed} // Disable the button if already borrowed
      >
        <Text style={styles.borrowButtonText}>
          {isBookBorrowed ? "Already Borrowed" : "Borrow Book"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  image: { width: 200, height: 300, borderRadius: 10, marginBottom: 20 },
  icon: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  author: { fontSize: 18, color: "gray", marginBottom: 10 },
  description: {
    fontSize: 16,
    color: "black",
    marginBottom: 20,
    textAlign: "center",
  },

  // Styling for the Borrow Book button
  borrowButton: {
    backgroundColor: "#4CAF50", // Green background
    paddingVertical: 15, // Larger height
    paddingHorizontal: 30, // Wider button
    borderRadius: 10,
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: "#BDBDBD", // Grey out the button when already borrowed
  },
  borrowButtonText: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
