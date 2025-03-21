import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import BookListScreen from "../screens/BookListScreen";
import BookDetailsScreen from "../screens/BookDetailsScreen";
import BorrowedBooksScreen from "../screens/BorrowedBooksScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="BookList"
        screenOptions={{
          headerBackTitle: null,  // Hide the back button title globally
        }}
      >
        <Stack.Screen name="BookList" component={BookListScreen} options={{ title: "Book Library" }} />
        <Stack.Screen name="BookDetails" component={BookDetailsScreen} options={{ title: "Book Details" }} />
        <Stack.Screen name="BorrowedBooks" component={BorrowedBooksScreen} options={{ title: "Borrowed Books" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}