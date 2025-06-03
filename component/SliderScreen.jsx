import React, { useRef, useState } from 'react';
import { Dimensions, View, StyleSheet, TouchableOpacity, Text, Image, SafeAreaView, useColorScheme, FlatList } from 'react-native';
import LiveConstructionScreen from './screens/LiveConstructionScreen';
import InstantUpdatesScreen from './screens/InstantUpdatesScreen';
import ConstructionScreen from './screens/ConstructionScreen';
import Logo from '../assets/logo-white.png';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const previewGap = 20;
const itemWidth = width * 0.999; // 80% width
const spacerWidth = (width - itemWidth) / 2;

const slides = [<LiveConstructionScreen />, <InstantUpdatesScreen />, <ConstructionScreen />];
 

const SliderScreen = () => {
    const carouselRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigation = useNavigation();
    const isDarkMode = useColorScheme() === 'dark';
    const [index, setIndex] = useState(0);
    const flatListRef = useRef(null);

        const handleScroll = (event) => {
  const slideIndex = Math.round(event.nativeEvent.contentOffset.x / itemWidth);
  setIndex(slideIndex);
  setCurrentIndex(slideIndex);
};

        const goToIndex = (i) => {
            flatListRef.current.scrollToIndex({ index: i, animated: true });
            setIndex(i);
        };

        const goToNextSlide = () => {
            if (index < slides.length - 1) {
                goToIndex(index + 1);
            }
        };
        const goToNextScreen =()=>{
            navigation.navigate('Login');
        }
 

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                
                <Image source={Logo} style={styles.logo} resizeMode="contain" />
                   <FlatList
                        data={slides}
                        horizontal
                        pagingEnabled={true} // <- Enable one-screen-at-a-time paging
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(_, i) => i.toString()}
                        renderItem={({ item }) => (
                            <View style={{ width }}>{item}</View> // no TouchableOpacity needed
                        )}
                        ref={flatListRef}
                        onMomentumScrollEnd={(event) => {
                            const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
                            setIndex(slideIndex);
                            setCurrentIndex(slideIndex);
                        }}
                        scrollEventThrottle={16}
                        snapToAlignment="center"
                        decelerationRate="fast"
                    />
                    <View style={styles.footer}>
                    <View style={styles.indicators}>
                        {slides.map((_, i) => (
                        <View
                            key={i}
                            style={[
                                    styles.dot,
                                    currentIndex === i ? styles.activeDot : styles.inactiveDot,
                                ]}
                        >
                        </View>
                        ))}
                    </View> 
                    <View>
                       {currentIndex < slides.length - 1 && (
                        <TouchableOpacity style={styles.button} onPress={goToNextSlide}>
                            <Text style={styles.buttonText}>Next</Text>
                        </TouchableOpacity>
                        )}
                        {currentIndex === slides.length - 1 && (
                        <TouchableOpacity style={styles.button} onPress={goToNextScreen}>
                            <Text style={styles.buttonText}>Get Started</Text>
                        </TouchableOpacity>
                        )}
                    </View>
                   </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
   safeArea: {
        flex: 1,
        backgroundColor: '#2a3443',
    },
    container: {
        flex: 1,
        // paddingHorizontal: 20,
    },
    logo: {
        alignSelf: 'center',
        marginTop: height * 0.09,
        width: width * 0.6,
        height: height * 0.06,
    },
    indicators: {
        flexDirection: 'row',
        gap: 8,
    },
    dot: {
        height: 4,
        borderRadius: 2,
    },
    activeDot: {
        width: 32,
        backgroundColor: '#CBDB2A',
    },
    inactiveDot: {
        width: 16,
        backgroundColor: '#ccc',
    },
    footer: {
        position: 'absolute',
		bottom: 40,
		left: 0,
		right: 0,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 35,
    },
    button: {
        backgroundColor: '#CBDB2A',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 30,
        minWidth: 80,
    },
    buttonText: {
        fontFamily:'Sora-Medium',
        textAlign: 'center',
        fontSize: 14,
    },
     
});

export default SliderScreen;
