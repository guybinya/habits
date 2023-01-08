import React, {useLayoutEffect, useState} from 'react';
import {Button, Text, StyleSheet, View, ScrollView, KeyboardAvoidingView} from 'react-native';
import RewardButton from '../basicComponents/RewardButton';
import ConfettiCannon from 'react-native-confetti-cannon';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AddRewardButton from "../basicComponents/AddRewardButton";

const getTodayTimestamp = () => {
	const today = new Date();
	const dd = String(today.getDate()).padStart(2, '0');
	const mm = String(today.getMonth() + 1).padStart(2, '0');
	const yyyy = today.getFullYear();

	return (dd + '/' + mm + '/' + yyyy);
}

interface Habit {
	id: number,
	name: string,
	count: number,
	isCeleb: boolean
}

const defaultHabits = [
	{
		id: 1,
		name: 'Practice Guitar',
		count: 1,
		isCeleb: false
	},
	{
		id: 2,
		name: 'Practice Piano',
		count: 1,
		isCeleb: false
	},
	{
		id: 3,
		name: 'Produce',
		count: 1,
		isCeleb: false
	},
	{
		id: 4,
		name: 'Read',
		count: 1,
		isCeleb: false
	},
	{
		id: 5,
		name: 'Back Physio',
		count: 1,
		isCeleb: false
	},
	{
		id: 6,
		name: 'Meditate',
		count: 1,
		isCeleb: false
	},
	{
		id: 7,
		name: 'Freestyle',
		count: 1,
		isCeleb: false
	},
]

const Home = () => {
	const insets = useSafeAreaInsets();

	const [showConfetti, setShowConfetti] = useState(false);
	const [habits, setHabits] = useState<Habit[]>([]);
	const [addMode, setAddMode] = useState(false);
	const [editMode, setEditMode] = useState(false);

	useLayoutEffect(() => {
		getHabits();
	}, []);

	// useLayoutEffect(() => {
	// 	AppState.addEventListener('change', () => setStorageHabits(habits));
	// 	return () => {
	// 		AppState.removeEventListener('change', () => setStorageHabits(habits));
	// 	}
	// }, [habits])

	const checkWin = (tempHabits: Array<Habit>) => {
		const winHabit = tempHabits.find((habit: Habit) => habit.count === 0);
		if (winHabit && winHabit.count === 0) {
			win(winHabit);
		}
	}

	const setStorageHabits = async (habits: Array<Habit>) => {
		console.log('saving')
		await AsyncStorage.setItem('@habits', JSON.stringify(habits));
	}

	const getHabits = async () => {
		const storedHabits = await AsyncStorage.getItem('@habits');
		const timestamp = await AsyncStorage.getItem('@timestamp');
		if (!storedHabits || getTodayTimestamp() !== timestamp) { // no habits
			await resetHabits();
		} else {
			const tempHabits = JSON.parse(storedHabits);
			setHabits(tempHabits);
		}
	}

	const resetHabits = async () => {
		await AsyncStorage.setItem('@habits', JSON.stringify(defaultHabits));
		await AsyncStorage.setItem('@timestamp', getTodayTimestamp());
		setHabits(defaultHabits);
	}

	const decrementCount = (habitId: number) => {
		const tempHabits:Habit[] = [...habits];
		const index = tempHabits.findIndex((habit: Habit) => habit.id === habitId);
		if (index > -1) {
			tempHabits[index].count = tempHabits[index].count - 1;
		}
		setHabits(tempHabits);
		checkWin(tempHabits);
		return true;
	}

	const countWin = (habitId: number) => {
		const tempHabits:Habit[] = [...habits];
		const index = tempHabits.findIndex((habit: Habit) => habit.id === habitId);
		if (index > -1) {
			tempHabits[index].isCeleb = true;
		}
		setHabits(tempHabits);
		setStorageHabits(tempHabits);
		return true;
	}

	const win = (habit: Habit) => {
		// if (habit.isCeleb) {
		// 	return false;
		// }
		countWin(habit.id);
		setTimeout(async () => {
			setTimeout(() => {
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
			}, 5);
			setShowConfetti(true);
			setTimeout(() => {
				setShowConfetti(false);
			}, 4000);
		}, 0);
	}

	const toggleAddMode = () => {
		setAddMode(!addMode);
	}

	const toggleEditMode = () => {

	}

	const doneAdding = (text: string) => {
		if (!text) {
			setAddMode(false);
			return;
		}
		let tempHabits = [...habits];
		tempHabits.push({
			id: habits.length + 1,
			name: text,
			count: 1,
			isCeleb: false
		})
		setStorageHabits(tempHabits);
		setAddMode(false);
		setHabits(tempHabits);
	}

	return (
		<View style={[styles.container, {paddingTop: insets.top}]}>
			{/*<Header onAdd={toggleAddMode} onEdit={toggleEditMode} title={'Habits'} />*/}
			<KeyboardAvoidingView behavior={'padding'}  style={styles.rewardContainer}>
				<ScrollView style={styles.rewardContainer}>
					<View style={styles.titleContainer}>
						<Text style={styles.title}>Habits</Text>
					</View>
					{habits.map((habit: Habit) =>
						<RewardButton key={habit.id} count={habit.count}
						              title={habit.name} onPress={() => decrementCount(habit.id)} />)}
					<AddRewardButton addMode={addMode} toggleAddMode={toggleAddMode} onPressOut={doneAdding} />
				</ScrollView>
			</KeyboardAvoidingView>

			{showConfetti ? <ConfettiCannon count={200} origin={{x: -10, y: 0}} /> : null}
			<Button title={'Reset'} onPress={resetHabits} />

		</View>
	);
}

const styles = StyleSheet.create({
	titleContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1
	},
	title: {
		textAlign: 'center',
		fontSize: 40,
		fontFamily: 'VesperLibre-Bold'
	},
	container: {
		flex: 1,
		backgroundColor: '#fff',
		marginBottom: 40
	},
	rewardContainer: {
		flex: 1,
		marginTop: 4
	},
});

export default Home;
