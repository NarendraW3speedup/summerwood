import React from 'react';
import { View, Image, StyleSheet, Text, Dimensions } from 'react-native';
import LiveConstructionImage from '../../assets/LiveConstruction.png';

const { width, height } = Dimensions.get('window');

const LiveConstructionScreen = () => {
    return (
         <View style={styles.container}>
            <Image
                source={LiveConstructionImage}
                style={styles.image}
                resizeMode="contain"
            />
            <Text style={styles.heading}>Live Construction Feeds</Text>
            <Text style={styles.description}>
                View real-time camera footage from your job sites — anytime, anywhere.
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingHorizontal: 20,
        height: '100%',
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

export default LiveConstructionScreen;
