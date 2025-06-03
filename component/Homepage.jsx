import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Image,
  SafeAreaView,
} from 'react-native';
import Background from '../assets/login-background.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConstructionCamera from './ContructionCamera';
import CameraImg from '../assets/CameraImg.png';
import CameraActive from '../assets/CameraActive.png';
import UpdateImg from '../assets/UpdateImg.png';
import UpdateActive from '../assets/UpdateActive.png';
import ConstructionImg from '../assets/ConstructionImg.png';
import ConstructionActive from '../assets/ConstructionActive.png';
import Header from './Header';
import { Dimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ConstructionUpdates from './ConstructionUpdates';

const { height: screenHeight } = Dimensions.get('window');

const { width, height } = Dimensions.get('window');

const Homepage = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('camera'); // 'camera' or 'updates'
const insets = useSafeAreaInsets();

// Base header height: 10% of screen + safe area (adjust 0.1 if needed)
const responsivePaddingTop = insets.top + 20
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          navigation.replace('Login');
        }
      } catch (error) {
        console.error('Error retrieving token:', error);
      }
    };

    checkToken();
  }, []);

  return (
    <View style={styles.pageContainer}>
      <ImageBackground source={Background} style={styles.backgroundImage}>
         <View style={styles.fixedHeader}>
        <Header />
      </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Tab Content */}
         <View style={[styles.contentPadding, { paddingTop: responsivePaddingTop }]} />
          <View style={styles.contentContainer}>
            {activeTab === 'camera' && <ConstructionCamera />}
            {activeTab === 'updates' &&  <ConstructionUpdates />}
            {activeTab === 'construction' && <Text style={styles.dummyText}>Construction Content</Text>}
          </View>
        </ScrollView>

        {/* Fixed Tab Buttons at Bottom of Section */}
        <View style={[styles.tabContainer, styles.fixedBottomTabs]}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'camera' && styles.activeTab]}
            onPress={() => setActiveTab('camera')}
          >{
              activeTab === 'camera' ?
                <Image
                  style={styles.iconImg}
                  source={CameraActive}
                />
                : <Image
                  style={styles.iconImg}
                  source={CameraImg}
                />
            }
            <Text style={[styles.tabText, activeTab === 'camera' && styles.activeTabText]}>
              LIVE CAMERAS
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'updates' && styles.activeTab]}
            onPress={() => setActiveTab('updates')}
          >
            {
              activeTab === 'updates' ?
                <Image
                  style={styles.iconImg}
                  source={UpdateActive}
                />
                : <Image
                  style={styles.iconImg}
                  source={UpdateImg}
                />
            }
            <Text style={[styles.tabText, activeTab === 'updates' && styles.activeTabText]}>
              UPDATES
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'construction' && styles.activeTab]}
            onPress={() => setActiveTab('construction')}
          >
            {
              activeTab === 'construction' ?
                <Image
                  style={styles.iconImg}
                  source={ConstructionActive}
                />
                : <Image
                  style={styles.iconImg}
                  source={ConstructionImg}
                />
            }
            <Text style={[styles.tabText, activeTab === 'construction' && styles.activeTabText]}>
              Construction
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    position: 'relative',
  },
  scrollContainer: {
    paddingBottom: height * 0.1, // dynamically reserve space
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  iconImg: {
    width: width * 0.05,  // ~22px on 375px screen
    height: width * 0.05,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#2A3443',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderColor: '#FFFFFF33',
  },
  fixedBottomTabs: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: height * 0.015,
    paddingBottom: height * 0.032,
    paddingHorizontal: width * 0.02,
  },
  tab: {
    flex: 1,
    // paddingVertical: height * 0.02,
    alignItems: 'center',
    backgroundColor: '#2A3443',
  },
  tabText: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 14,
    color: '#fff',
    marginTop: 5,
    whiteSpace: 'nowrap',
  },
  activeTabText: {
    color: '#CBDB2A',
  },
  contentContainer: {
    paddingHorizontal: width * 0.05,
    marginTop: height * 0.04,
  },
  dummyText: {
    fontSize: width * 0.045,
    color: '#fff',
    fontFamily: 'PlusJakartaSans-Regular',
  },
  fixedHeader: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 999, // ensure it's above other elements
},

// contentPadding: {
//   paddingTop: 80, // adjust based on actual header height (e.g., 80px)
// },
});

export default Homepage;
