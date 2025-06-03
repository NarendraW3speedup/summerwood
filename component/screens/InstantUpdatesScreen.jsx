import React from 'react';
import { View, Image, Text, StyleSheet, Dimensions } from 'react-native';
import InstantUpdatesImage from '../../assets/InstantUpdates.png';

const { width, height } = Dimensions.get('window');

const InstantUpdatesScreen = () => {
	return (
		<View style={styles.centerContent}>
			<Image
				source={InstantUpdatesImage}
				style={styles.image}
				resizeMode="contain"
			/>
			<Text style={styles.heading}>Instant Updates & Alerts</Text>
			<Text style={styles.description}>
				Stay informed with automated progress updates, alerts, and reports.
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	centerContent: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'flex-start',
		paddingHorizontal: 20,
		margin:"auto",
		marginTop: height * 0.08,
	},
	image: {
		width: width * 0.98,
		height: height * 0.4,
	},
	heading: {
		fontFamily: 'Sora-SemiBold',
        fontSize: 24,
		color: '#CBDB2A',
		textAlign: 'center',
		marginTop: 30,
	},
	description: {
		fontFamily: 'PlusJakartaSans-Medium',
        fontSize: 15,
		color: '#FFFFFF',
		textAlign: 'center',
		marginTop: 10,
		lineHeight: 20,
	},
});

export default InstantUpdatesScreen;
