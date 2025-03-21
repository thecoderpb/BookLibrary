import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";  
import { getDocs } from "firebase/firestore";
import { TouchableOpacity } from "react-native";
import { booksRef } from "../firebase/config";

export default function BookListScreen({ navigation }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const querySnapshot = await getDocs(booksRef);
        const booksList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBooks(booksList);
      } catch (error) {
        console.error("Error fetching books: ", error);
      }
      setLoading(false);
    };

    fetchBooks();

    // Set up toolbar icon in header
    navigation.setOptions({
      headerRight: () => (
        <Ionicons
          name="bookmark-outline"
          size={30}
          color="black"
          style={styles.icon}
          onPress={() => navigation.navigate("BorrowedBooks")} // Navigate to BorrowedBooks screen on press
        />
      ),
    });
  }, [navigation]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("BookDetails", { book: item })}
          >
            <View style={styles.imageContainer}>
              {item.imageUri ? (
                <Image source={{ uri: item.imageUri }} style={styles.bookImage} />
              ) : (
                <Ionicons name="book-outline" size={50} color="gray" style={styles.icon} />
              )}
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.author}>by {item.author}</Text>
            </View>
          </TouchableOpacity>
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
    alignItems: "center",  // Vertically align them in the center
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
  icon: { position: "absolute", right: 15, top: 5 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
});