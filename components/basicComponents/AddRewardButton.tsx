import React, {useState} from 'react';
import {
	StyleSheet,
	View, TextInput, Text, TouchableOpacity
} from 'react-native';

interface AddRewardButtonProps {
	onPressOut: (title: string) => void;
	addMode?: boolean;
	toggleAddMode: () => void;
}

const AddRewardButton = ({onPressOut, addMode, toggleAddMode} : AddRewardButtonProps) => {
	const [title, setTitle] = useState('');

	if (!addMode) {
		return (
			<TouchableOpacity activeOpacity={0.8} onPress={toggleAddMode} style={styles.mainContainer}>
				<Text style={styles.text}>Add New Habit</Text>
			</TouchableOpacity>
		)
	}

	return (
		<View style={styles.mainContainer}>
			<TextInput onChangeText={setTitle}
			           autoFocus
			           onBlur={() => onPressOut(title)}
			           onEndEditing={() => onPressOut(title)}
			           style={styles.textInput}
			           value={title} />
		</View>
	)
}

const styles = StyleSheet.create({
	mainContainer: {
		flexDirection: 'row',
		marginHorizontal: 16,
		borderRadius: 8,
		overflow: 'hidden',
		marginVertical: 4,
		backgroundColor: '#d06f8c',
		height: 50,
		alignItems: 'center'
	},
	text: {
		width: '100%',
		textAlign: 'center',
		color: '#ffff',
		fontSize: 22,
	},
	textInput: {
		width: '100%',
		textAlign: 'center',
		color: '#ffff',
		fontSize: 22
	}
});


export default AddRewardButton;
