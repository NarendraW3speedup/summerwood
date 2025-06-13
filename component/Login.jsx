import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
    Image,
    ActivityIndicator,
    Dimensions,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    Animated,
    Easing,
    ScrollView,
    Alert,
} from 'react-native';
import Logo from '../assets/logo-white.png';
import Background from '../assets/login-background.png';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Keyboard } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import { API } from "./constant/ConstantUrl";

const rnBiometrics = new ReactNativeBiometrics();


const { width, height } = Dimensions.get('window');

const Login = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const slideAnim = useState(new Animated.Value(height))[0];
    const fadeAnim = useState(new Animated.Value(0))[0];
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');


    const handleLogin = async () => {
        setLoading(true);
        const apiUrl = API+'login';
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: email,
                    password: password,
                }),
            });
            const result = await response.json();
           if (result?.code === 'success' && result?.data.token) {
                const userId = String(result.data.user_id);
                await AsyncStorage.setItem('token', String(result.data.token));
                const { available } = await rnBiometrics.isSensorAvailable();

                if (available) {
                    await AsyncStorage.setItem('user_id', userId);
                    await storePublicKey(userId);                    
                }
                setToken(result?.token);
                navigation.replace('Homepage');
            } else {
                const message = result?.message?.toLowerCase() || '';

                // Clear both errors first
                setEmailError('');
                setPasswordError('');

                // Detect specific errors based on message content
              if (message.includes('invalid username') || message.includes('invalid email') || message.includes('user does not exist')) {
                    setEmailError('Wrong email');
                } else if (message.includes('incorrect password') || message.includes('wrong password')) {
                    setPasswordError('Wrong password');
                } else {
                    // Fallback: If message doesn't clearly state which one is wrong
                    if (!emailError && !passwordError) {
                        setEmailError('');
                        setPasswordError('Invalid credentials');
                    }
                }
            }
        } catch (error) {
            console.error('Error during login:', error);
            Alert.alert('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 1000,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setIsKeyboardVisible(true);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setIsKeyboardVisible(false);
        });

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    const generateNonce = (length = 32) => {
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        return result;
    };


     

    const storePublicKey = async (userId) => {
        try {
            const { publicKey } = await rnBiometrics.createKeys();
            await fetch(API+'store-public-key', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, public_key: publicKey }),
            });
        } catch (error) {
            console.error('Public key error:', error);
        }
    };

    const handleBiometricAuth = async () => {
        const { available, biometryType } = await rnBiometrics.isSensorAvailable();
        if (!available) {
            Alert.alert('Error', 'Biometric authentication not available');
            return;
        }
        Alert.alert("Biometry Type:", biometryType);
        const payload = generateNonce();
        const user_Id = await AsyncStorage.getItem('user_id');
        const prompt = biometryType === 'FaceID' ? 'Authenticate with Face ID' : 'Authenticate with Biometrics';
        try {
            const result = await rnBiometrics.createSignature({
                promptMessage: prompt,
                payload,
            });

            if (result.success) {
            const response = await fetch(API+'authenticate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                payload,
                signature: result.signature,
                user_id: user_Id,
                }),
            });

            const data = await response.json();

            if (data.success) {
                await AsyncStorage.setItem('token', String(data.token));
                setToken(data.token);
                navigation.replace('Homepage');
            } else {
                Alert.alert('Backend Error', data.message);
            }
            } else {
                Alert.alert('Failed', 'Biometric authentication failed.');
            }
        } catch (error) {
            Alert.alert('Error', error.message || 'Something went wrong.');
        }
    };

    useEffect(() => {
        const checkBiometricAvailability = async () => {
            try {
            const { available, biometryType  } = await rnBiometrics.isSensorAvailable();
            Alert.alert("Biometry Type", biometryType || "Not Available");
            const userId = await AsyncStorage.getItem('user_id');
            if (available && userId) {
                handleBiometricAuth(userId);
            }
            } catch (err) {
            console.warn('Biometric check failed:', err);
            }
        };

        checkBiometricAvailability();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ImageBackground source={Background} style={styles.backgroundImage}>
                <KeyboardAvoidingView
                    style={{ flex: 1, }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
                >
                    <View style={{ flex: 1, }}>
                        <ScrollView
                            contentContainerStyle={{ flexGrow: 1 }}
                            keyboardShouldPersistTaps="handled"
                            scrollEnabled={isKeyboardVisible} // <== key line
                        >
                            {!isKeyboardVisible && ( // <== key condition
                                <Animated.View style={[styles.topSection, { opacity: fadeAnim }]}>
                                    <Image style={styles.tinyLogo} source={Logo} />
                                    <Text style={styles.subtitleText}>
                                        Welcome to Our{'\n'}Construction Camera Portal
                                    </Text>
                                    <Text style={styles.paratext}>
                                        Your hub for real-time site monitoring, updates & insights.
                                    </Text>
                                </Animated.View>
                            )}
                        </ScrollView>

                        {/* Fixed Form Section at Bottom */}
                        <Animated.View
                            style={[
                                styles.formBox,
                                {
                                    transform: [{ translateY: slideAnim }],
                                },
                            ]}
                        >
                            <Text style={styles.welcomeText}>Log In</Text>
                            <View style={styles.hrLine}></View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.text}>Username or Email</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your email"
                                    placeholderTextColor="#ccc"
                                    value={email}
                                    onChangeText={(text) => {
                                        setEmail(text);
                                        setEmailError('');
                                    }}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.text}>Password</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your password"
                                    placeholderTextColor="#ccc"
                                    secureTextEntry
                                    value={password}
                                    onChangeText={(text) => {
                                        setPassword(text);
                                        setPasswordError('');
                                    }}
                                />
                            </View>
                                {passwordError ? (
                                    <Text style={styles.error_text}>{passwordError}</Text>
                                ) : null}


                            <TouchableOpacity
                                style={styles.signInButton}
                                onPress={handleLogin}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#000" />
                                ) : (
                                    <Text style={styles.signInButtonText}>SIGN IN</Text>
                                )}
                            </TouchableOpacity>                            
                        </Animated.View>
                    </View>
                </KeyboardAvoidingView>
            </ImageBackground>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        width: '100%',
        height: '100%',
    },
    topSection: {
        alignItems: 'center',
        paddingTop: height * 0.08,
        paddingHorizontal: width * 0.07,
        paddingBottom: height * 0.2,
    },
    tinyLogo: {
        width: width * 0.6,
        height: height * 0.06,
        resizeMode: 'contain',
        marginBottom: height * 0.02,
    },
    subtitleText: {
        fontFamily: 'Sora-SemiBold',
        fontSize: 24,
        // fontSize: width * 0.06,
        color: '#CBDB2A',
        textAlign: 'center',
    },
    paratext: {
        fontFamily: 'PlusJakartaSans-Medium',
        fontSize: 15,
        color: '#fff',
        textAlign: 'center',
        marginTop: height * 0.015,
        lineHeight: width * 0.05,
    },
    error_text: {
        // marginTop: 10,
        fontSize: width * 0.04,
        color: '#bf3a3a',
        fontFamily: 'Poppins-Regular',
        // textAlign: 'center',
    },
   formBox: {
    backgroundColor: '#1a222e',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingVertical: height * 0.04,
    paddingHorizontal: width * 0.07,
    alignSelf: 'stretch',
},
    welcomeText: {
        fontFamily: 'Sora-SemiBold',
        fontSize: 38,
        color: '#fff',
        textAlign: 'center',
    },
    hrLine: {
        height: 1,
        backgroundColor: '#fff',
        marginVertical: height * 0.025,
    },
    inputContainer: {
        width: '100%',
        marginBottom: height * 0.02,
    },
    text: {
        fontSize: 16,
        color: '#fff',
        marginBottom: 5,
        fontFamily: 'Poppins-Regular',
    },
    input: {
        height: 50,
        paddingHorizontal: 15,
        borderColor: '#363e48',
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: '#363e48',
        color: '#fff',
        fontSize: width * 0.04,
    },
    signInButton: {
        height: 55,
        backgroundColor: '#CBDB2A',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: height * 0.03,
    },
    signInButtonText: {
        fontSize: 20,
        color: '#000',
        fontFamily: 'PlusJakartaSans-Bold',
        textTransform: 'uppercase',
    },
    button: {
        padding: 15,
        backgroundColor: '#6200EE',
        borderRadius: 5,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
});

export default Login;
