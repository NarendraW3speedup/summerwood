import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const ConstructionScreen = () => {
	return (
		<View style={styles.container}>
			<View style={styles.LiveConstructionImg}></View>
			<Text style={styles.headingtext}>Construction</Text>
			<Text style={styles.paratext}>
				View real-time camera footage from your job sites — anytime,
				anywhere.
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 20,
	},
	LiveConstructionImg: {
		width: '100%',
		height: 220,
		marginTop: 0,
	},
	headingtext: {
		fontFamily: 'Sora-SemiBold',
        fontSize: 24,
		color: '#CBDB2A',
		lineHeight: 26,
		textAlign: 'center',
		marginTop: 43,
	},
	paratext: {
		fontFamily: 'PlusJakartaSans-Medium',
        fontSize: 15,
		color: '#fff',
		lineHeight: 20,
		textAlign: 'center',
		marginTop: 5,
	},
});

export default ConstructionScreen;
