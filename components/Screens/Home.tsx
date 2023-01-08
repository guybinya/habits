import React, {useLayoutEffect, useState} from 'react';
import {Button, Dimensions, KeyboardAvoidingView, ScrollView, StyleSheet, Text, View} from 'react-native';
import RewardButton from '../basicComponents/RewardButton';
import ConfettiCannon from 'react-native-confetti-cannon';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AddRewardButton from "../basicComponents/AddRewardButton";
import {ResizeMode, Video, Audio} from "expo-av";

const victory1 = require('../../assets/sounds/victory1.mp3');
const victory2 = require('../../assets/sounds/victory2.wav');
const victories = [victory1, victory2];

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
	isCeleb: boolean,
	defaultCount: number
}

const defaultHabits = [
	{
		id: 1,
		name: '50 Push Ups',
		count: 2,
		isCeleb: false,
		defaultCount: 2
	},
	{
		id: 2,
		name: 'Abs',
		count: 1,
		isCeleb: false,
		defaultCount: 1
	},
	{
		id: 3,
		name: 'Meditate',
		count: 1,
		isCeleb: false,
		defaultCount: 1
	},
	{
		id: 4,
		name: 'Read a Book',
		count: 1,
		isCeleb: false,
		defaultCount: 1
	},
	{
		id: 5,
		name: 'Jira Ticket',
		count: 3,
		isCeleb: false,
		defaultCount: 3
	},
	{
		id: 6,
		name: 'Practice Guitar',
		count: 1,
		isCeleb: false,
		defaultCount: 1
	},
	{
		id: 7,
		name: 'Practice Piano',
		count: 1,
		isCeleb: false,
		defaultCount: 1
	},
	{
		id: 8,
		name: 'Produce a Beat',
		count: 1,
		isCeleb: false,
		defaultCount: 1
	},
	{
		id: 9,
		name: 'Freestyle',
		count: 1,
		isCeleb: false,
		defaultCount: 1
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

	const checkWin = (tempHabits: Array<Habit>) => {
		const winHabit = tempHabits.find((habit: Habit) => habit.count === 0);
		if (winHabit && winHabit.count === 0) {
			win(winHabit);
		}
	}

	const setStorageHabits = async (habits: Array<Habit>) => {
		console.log('saving');
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
		await setStorageHabits(defaultHabits);
	}

	const newDay = async () => {
		const tempHabits = habits.map(habit => {
			habit.count = habit.defaultCount;
			return habit;
		});
		await AsyncStorage.setItem('@habits', JSON.stringify(tempHabits));
		await AsyncStorage.setItem('@timestamp', getTodayTimestamp());
		setHabits(tempHabits);
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
			isCeleb: false,
			defaultCount: 1
		})
		setStorageHabits(tempHabits);
		setAddMode(false);
		setHabits(tempHabits);
	}

	const playSuccess = async () => {
		const randomElement = victories[Math.floor(Math.random() * victories.length)];
		const { sound } = await Audio.Sound.createAsync(randomElement);
		await sound.playAsync();
	}

	return (
		<View style={[styles.container, {paddingTop: insets.top}]}>
			<Video source={require("../../assets/habits-bg.mp4")}
			       style={styles.backgroundVideo}
			       isLooping={true}
			       shouldPlay={true}
			       resizeMode={ResizeMode.COVER} />
			{/*<Header onAdd={toggleAddMode} onEdit={toggleEditMode} title={'Habits'} />*/}
			<KeyboardAvoidingView behavior={'padding'}  style={styles.rewardContainer}>
				<ScrollView style={styles.rewardContainer}>
					<View style={styles.titleContainer}>
						<Text style={styles.title}>Habits</Text>
					</View>
					{habits.map((habit: Habit) =>
						<RewardButton key={habit.id} count={habit.count} setEditMode={setEditMode} isEdit={editMode}
						              playSuccess={playSuccess}
						              title={habit.name} onPress={() => decrementCount(habit.id)} />)}
					<AddRewardButton addMode={addMode} toggleAddMode={toggleAddMode} onPressOut={doneAdding} />
				</ScrollView>
			</KeyboardAvoidingView>

			{showConfetti ? <ConfettiCannon count={200} origin={{x: -10, y: 0}} /> : null}
			<View style={styles.buttonContainer}>
				<View style={{flex: 1}}>
					<Button title={'New Day'} onPress={newDay} />
				</View>
				<View style={{flex: 1}}>
					<Button color={'red'} title={'Reset to Default'} onPress={resetHabits} />
				</View>
			</View>
		</View>
	);
}

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
	buttonContainer: {
		flexDirection: 'row-reverse',
		justifyContent: 'space-evenly'
	},
	backgroundVideo: {
		height: height,
		position: "absolute",
		top: 0,
		left: 0,
		alignItems: "stretch",
		bottom: 0,
		right: 0
	},
	titleContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1
	},
	title: {
		textAlign: 'center',
		fontSize: 40,
		color: 'white',
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
