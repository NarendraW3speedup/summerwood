import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWindowDimensions } from 'react-native'; // ✅ okay to import
import Logoutbuttondrop from '../assets/Vector2.png';
import Logouticon from '../assets/Vector3.png';
import Logo from '../assets/logo-white.png';

const Header = () => {
  const navigation = useNavigation();
  const [showLogoutButton, setShowLogoutButton] = useState(false);
  const screenWidth = Dimensions.get('window').width;
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions(); // ✅ moved inside component

  const toggleLogoutButton = () => {
    setShowLogoutButton(!showLogoutButton);
  };
  
const logoutButtonStyle = {
  position: 'absolute',
  top: insets.top + 55,
  right: 40,
  backgroundColor: '#CBDB2A',
  borderRadius: 10,
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
  paddingHorizontal: 25,
  paddingVertical: 20,
  zIndex: 99,
  elevation: 5,
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 4,
};

  return (
    <SafeAreaView style={styles.containerq}>
      {showLogoutButton && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width,
            height,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 50,
          }}
          activeOpacity={1}
          onPress={() => setShowLogoutButton(false)}
        />
      )}

      <View
        style={[
          styles.containerHeader,
          { paddingHorizontal: screenWidth * 0.05, paddingTop: insets.top + 10 },
        ]}
      >
        <Image
          style={[
            styles.tinyLogo,
            { width: screenWidth > 400 ? 168 : 140, height: 35 },
          ]}
          source={Logo}
          resizeMode="contain"
        />

        <View style={styles.toggleContainer}>
          <TouchableOpacity style={styles.btn} onPress={toggleLogoutButton}>
            <Image source={Logoutbuttondrop} />
          </TouchableOpacity>
        </View>
      </View>

      {showLogoutButton && (
        <TouchableOpacity
          style={logoutButtonStyle}
          onPress={() => navigation.replace('Login')}
        >
          <Image source={Logouticon} />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    zIndex: 10,
  },
  tinyLogo: {
    height: 35,
  },
  toggleContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    position: 'relative',
    overflow: 'visible',
    zIndex: 99,
  },
  btn: {
    marginTop: 10,
  },
  logoutButtonText: {
    color: '#000000',
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    marginLeft: 10,
    lineHeight: 22,
  },
  containerq: {
    flex: 1,
    backgroundColor: '#2A3443',
  },
});

export default Header;
