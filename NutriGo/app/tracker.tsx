import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Button } from 'react-native';
import { Link } from "expo-router";
import { useFood } from '@/components/FoodList';
import FoodItem from '../components/FoodItem';
import { useUser } from '@/hooks/useUser';
import { calculateCalorieIntake } from '@/models/functions';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
        gap: 10,
        paddingTop: 50,
    },
    subtext: {
        fontSize: 18
    }
});

export default function Tracker() {
    const { user } = useUser();
    const { foodItems, addFoodItem } = useFood(); // Destructure addFoodItem here

    const dailyCalorieIntake = user && calculateCalorieIntake(
        user.height,
        user.weight,
        user.age,
        user.gender || 'other',  // Default to 'other' if gender is undefined
        user.activityLevel,
        user.goal
    );

    const totalCaloriesConsumed = foodItems.reduce((sum, item) => sum + item.nutrients.ENERC_KCAL, 0);
    const remainingCalories = typeof dailyCalorieIntake === 'number'? dailyCalorieIntake - totalCaloriesConsumed : 0;


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 18, fontWeight: '600' }}>Calories</Text>
                    <Text style={{ fontSize: 18, fontWeight: '600' }}>{dailyCalorieIntake} cal - {totalCaloriesConsumed} cal = {remainingCalories} cal</Text>
                </View>
                <Text style={{ fontSize: 18, fontWeight: '600' }}>Today's Logged Food</Text>
                <Link href="/search" asChild>
                    <Button title="ADD FOOD" />
                </Link>
                <FlatList
                    data={foodItems}
                    renderItem={({ item }) => (
                        <FoodItem
                            item={item}
                            onAddFood={() => addFoodItem(item)}
                        />
                    )}
                    contentContainerStyle={{ gap: 5 }}
                />

            </View>
        </SafeAreaView>
    );
}