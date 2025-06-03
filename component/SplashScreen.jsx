import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    StyleSheet,
    Animated,
    Text,
    Dimensions,
    ImageBackground,
    Image,
} from 'react-native';
import Background from '../assets/login-background.png';
import Logo from '../assets/logo-white.png';
import LogoGif from '../assets/LogoAnimatedNew.gif';
import LottieView from 'lottie-react-native';
const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
    const fullText = 'Welcome to Our\nConstruction Camera Portal';
    const [displayedText, setDisplayedText] = useState('');
    const fadeInAnim = useRef(new Animated.Value(0)).current;
    const fadeOutAnim = useRef(new Animated.Value(1)).current;
    const logoTranslateY = useRef(new Animated.Value(0)).current;
    const animationRef = useRef(null);

    useEffect(() => {
        // Typing animation for heading
        const startTypingTimeout = setTimeout(() => {
            let currentIndex = 0;
            const typingInterval = setInterval(() => {
                setDisplayedText(prev => {
                    if (currentIndex < fullText.length) {
                        const nextChar = fullText[currentIndex];
                        currentIndex++;
                        return prev + nextChar;
                    } else {
                        clearInterval(typingInterval);
                        return prev;
                    }
                });
            }, 50);
        }, 2000); // Starts after 2s
        return () => clearTimeout(startTypingTimeout);
    }, []);

    useEffect(() => {
        // Fade in subtext after heading is done typing
        const startFadeInTimeout = setTimeout(() => {
            Animated.timing(fadeInAnim, {
                toValue: 1,
                duration: 1500,
                useNativeDriver: true,
            }).start();
        }, 4000);
        return () => clearTimeout(startFadeInTimeout);
    }, []);

    useEffect(() => {
        const fadeOutTimeout = setTimeout(() => {
            Animated.timing(fadeOutAnim, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }).start();
        }, 6000);
        return () => clearTimeout(fadeOutTimeout);
    }, []);

    useEffect(() => {
        const slideUpTimeout = setTimeout(() => {
            Animated.timing(logoTranslateY, {
                toValue: -height / 3,
                duration: 800,
                useNativeDriver: true,
            }).start();
        }, 6000);
        return () => clearTimeout(slideUpTimeout);
    }, []);
    return (
        <ImageBackground source={Background} style={styles.backgroundImage} resizeMode="cover">
            <View style={styles.container}>
                <Animated.View style={{ transform: [{ translateY: logoTranslateY }] }}>
                      <LottieView
                            source={{ uri: 'https://lottie.host/8b0c0721-5573-4de6-9fbc-7286b66c36a4/cevnN8Czar.lottie' }}
                            autoPlay
                            loop={false}
                            speed={0.6}
                            style={styles.logo}
                        />
                       
                         {/* <Image source={Logo} style={styles.logo} resizeMode="contain" /> */}
                </Animated.View> 
                <Animated.View style={[styles.textBlock, { opacity: fadeOutAnim }]}>
                    <Text style={styles.headingText}>{displayedText}</Text>
                    <Animated.Text style={[styles.paraText, { opacity: fadeInAnim }]}>
                        Your hub for real-time site monitoring, updates & insights.
                    </Animated.Text>
                </Animated.View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    // logo: {
    //     alignSelf: 'center',
    //     marginTop: height * 0.09,
    //     width: width * 0.6,
    //     height: height * 0.06,
    // },
    logo: {
        alignSelf: 'center',
        marginTop: height * 0.09,
        width: width * 0.6,
        height: height * 0.4,
    },
    textBlock: {
        alignItems: 'center',
        paddingHorizontal: 10,
        marginTop: 20, // Add spacing below logo instead of marginBottom above
    },
    headingText: {
        fontFamily: 'Sora-SemiBold',
        fontSize: 24,
        color: '#CBDB2A',
        textAlign: 'center',
        lineHeight: 30,
        marginTop: -10, // Remove extra spacing
        height: 60, // Remove extra spacing
    },
    paraText: {
        fontFamily: 'PlusJakartaSans-Medium',
        fontSize: 15,
        color: '#ffffff',
        textAlign: 'center',
        lineHeight: 20,
        marginTop: 12,
    },
});

export default SplashScreen;
