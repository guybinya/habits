import React, {useEffect, useRef, useState} from 'react';
import * as Haptics from 'expo-haptics';
import {ImpactFeedbackStyle} from 'expo-haptics';
import {Animated, Easing, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {Audio} from 'expo-av';

const activeColor = 'rgba(71,94,94,0.86)';
const lastColor = '#197176';
const finishColor = '#1bbe67';
const borderFinishColor = '#06d6a0';

interface RewardButtonProps {
	title: string;
	onPress: () => boolean;
	count: number;
	isCeleb?: boolean;
	isEdit?: boolean;
	onEdit: (text: string) => void;
	setEditMode: (isEdit: boolean) => void;
	playSuccess: () => void;
}

const RewardButton = ({title='Hit Me', onPress, count, isCeleb, isEdit, onEdit, setEditMode, playSuccess} : RewardButtonProps) => {

	const scaleAnim = useRef(new Animated.Value(1)).current

	const localOnPress = async () => {
		const result = onPress();
		const hapticFeedback = result ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error;
		await Haptics.notificationAsync(hapticFeedback);
		if (result) {
			playSuccess();
		}
		Animated.timing(
			scaleAnim,
			{
				toValue: 1,
				duration: 1000,
				useNativeDriver: false
			}
		).start();
	}

	const startPress = async () => {
		await Haptics.impactAsync(ImpactFeedbackStyle.Heavy);
		Animated.timing(
			scaleAnim,
			{
				toValue: 1.5,
				duration: 1000,
				useNativeDriver: false,
				easing: Easing.ease,
				delay: 0
			}
		).start();
	}

	const pausePress = async () => {
		Animated.timing(
			scaleAnim,
			{
				toValue: 1,
				duration: 200,
				useNativeDriver: false
			}
		).start();
	}

	const backgroundColor = count === 0 ? finishColor : count === 1 ? activeColor : lastColor;

	return (
		<Animated.View style={[styles.animatedContainer, count === 0 && {borderColor:  borderFinishColor, opacity: 0.8, transform: [{scaleX: scaleAnim}, {scaleY: scaleAnim}]}]}>
			{isEdit ? ( // Edit Mode
				<View style={[styles.button, {backgroundColor: backgroundColor}]}>
					<TextInput onChangeText={onEdit}
					           autoFocus
					           style={styles.textInput}
					           value={title} />
				</View>
			) : ( // Regular Button
				<TouchableOpacity style={[styles.button, {backgroundColor: backgroundColor}]}
				                  activeOpacity={0.8} delayLongPress={500} onPressOut={pausePress}
				                  onPressIn={startPress} onLongPress={localOnPress} disabled={count === 0}>
					<Text style={styles.title}>{title}</Text>
				</TouchableOpacity>
			)}
		</Animated.View>
	)
}

const styles = StyleSheet.create({
	animatedContainer: {
		flexDirection: 'row',
		marginHorizontal: 16,
		borderRadius: 8,
		overflow: 'hidden',
		marginVertical: 4,
	},
	button: {
		flex: 1,
		flexDirection: 'row',
		height: 56,
		justifyContent: 'center',
		alignItems: 'center',
	},
	title: {
		color: 'white',
		fontFamily: 'NotoSans-Regular',
		fontSize: 22
	},
	textInput: {
		width: '100%',
		textAlign: 'center',
		color: '#ffff',
		fontSize: 22
	}
});


export default RewardButton;
