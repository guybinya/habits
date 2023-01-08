import React, {useState} from 'react';
import {StyleSheet, View, Text, Button} from 'react-native';
import {Audio} from 'expo-av';

interface HeaderProps {
	title: string,
	onEdit: () => void,
	onAdd: () => void;
}

const Header = ({title, onEdit, onAdd}: HeaderProps) => {
	return (
		<View style={[styles.mainContainer]}>
			<View style={styles.leftContainer}>
				<Button onPress={onEdit} title={'Edit'} />
			</View>
			<View style={styles.midContainer}>
				<Text style={styles.titleText}>{title}</Text>
			</View>
			<View style={styles.rightContainer}>
				<Button onPress={onAdd} title={'+'} />
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	mainContainer: {
		paddingTop: 44,
		flexDirection: 'row',
		height: 88,
		paddingHorizontal: 8,
		backgroundColor: '#e7e7e7'
	},
	leftContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	midContainer: {
		flex: 6,
		justifyContent: 'center',
		alignItems: 'center'
	},
	rightContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	titleText: {
		fontSize: 22,
	}
});


export default Header;
