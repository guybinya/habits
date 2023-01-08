import React, {useState} from 'react';
import * as Haptics from 'expo-haptics';
import {
	StyleSheet,
	Animated,
	Text,
	TouchableOpacity, View, TextInput
} from 'react-native';
import { Audio } from 'expo-av';

const activeColor = '#555757';
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
}

const RewardButton = ({title='Hit Me', onPress, count, isCeleb, isEdit, onEdit} : RewardButtonProps) => {
	const [sound, setSound] = useState<Audio.Sound>();

	const localOnPress = async () => {
		const result = onPress();
		const hapticFeedback = result ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error;
		await Haptics.notificationAsync(hapticFeedback);
	}

	const startPress = async () => {
		const { sound } = await Audio.Sound.createAsync(
			require('../../assets/sounds/HabitWin.mp3')
		);
		setSound(sound);
		await sound.playAsync();
	}

	const pausePress = async () => {
		if (sound) {
			await sound.pauseAsync();
		}
	}

	const backgroundColor = count === 0 ? finishColor : count === 1 ? activeColor : lastColor;

	return (
		<Animated.View style={[styles.animatedContainer, count === 0 && {borderColor:  borderFinishColor, opacity: 0.8}]}>
			{isEdit ? ( // Edit Mode
				<View style={[styles.button, {backgroundColor: backgroundColor}]}>
					<TextInput onChangeText={onEdit}
					           autoFocus
					           style={styles.textInput}
					           value={title} />
				</View>
			) : ( // Regular Button
				<TouchableOpacity style={[styles.button, {backgroundColor: backgroundColor}]}
				                  activeOpacity={0.8} delayLongPress={4000} onPressOut={pausePress}
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
