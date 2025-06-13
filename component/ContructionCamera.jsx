import React, { useState, useEffect,useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from "./constant/ConstantUrl";
import Header from './Header';
import ArrowVector from '../assets/ArrowVector.png';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const RADIUS = 8;

const ConstructionCamera = () => {
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();

  const videoWidth = width * 0.9;
  const videoHeight = (videoWidth * 9) / 16;

  const [activeStream, setActiveStream] = useState(null);
  const [activeVideoUrl, setActiveVideoUrl] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const [cameraSourcess, setCameraSources] = useState([]);
  const [loader, SetLoader] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          navigation.replace('Login');
        }
      } catch (error) {
        console.error('Error retrieving token:', error);
        navigation.replace('Login');
      }
    };

    checkToken();
    getActiveCamera();
  }, []);

  const getActiveCamera = async () =>{
      const apiUrl = API+'camera';
      const response = await fetch(apiUrl, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
              }
          });
      const result = await response.json();
      setCameraSources(result.data);
      SetLoader(false);
  }

  const saveActiveVideo = async (index, url) => {
    try {
      await AsyncStorage.setItem('activeVideo', JSON.stringify({ index, url }));
    } catch (error) {
      console.error('Error saving active video to storage:', error);
    }
  };

  const loadActiveVideo = async () => {
    try {
      const savedVideo = await AsyncStorage.getItem('activeVideo');
      if (savedVideo) {
        const { index, url } = JSON.parse(savedVideo);
        setActiveStream(index);
        setActiveVideoUrl(url);
      }
    } catch (error) {
      console.error('Error loading active video from storage:', error);
    }
  };

  useEffect(() => {
    loadActiveVideo();
  }, []);

  const handleImageError = (index) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} >
      {/* <Header /> */}
      <View style={styles.container}>
        {!loader &&
          cameraSourcess.map((source, index) => (
            <View key={index} style={styles.videoContainer}>
              {activeVideoUrl === source.url ? (
                <View style={[styles.outerContainer, { width: videoWidth, height: videoHeight }]}>
                  <View style={styles.webviewWrapper}>
                    <WebView
                      source={{ uri: source.url }}
                      style={styles.webview}
                      javaScriptEnabled
                      allowsFullscreenVideo
                      mediaPlaybackRequiresUserAction={false}
                    />
                  </View>
                </View>
              ) : (
                <View style={[styles.outerContainer, { width: videoWidth, height: videoHeight }]}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      setActiveStream(index);
                      setActiveVideoUrl(source.url);
                      saveActiveVideo(index, source.url);
                    }}
                    style={{ flex: 1 }}
                  >
                    {imageErrors[index] ? (
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: '#ccc',
                          borderRadius: RADIUS,
                        }}
                      >
                        <Text style={styles.errorText}>Snapshot is Not Available</Text>
                      </View>
                    ) : (
                      <Image
                        source={{ uri: source.thumbnail }}
                        style={{ flex: 1, borderRadius: RADIUS }}
                        onError={() => handleImageError(index)}
                        resizeMode="cover"
                      />
                    )}
                  </TouchableOpacity>
                </View>
              )}
              <View  style={styles.liveBtn}>
                <View style={styles.redDot}></View>
                <Text style={styles.liveBtnText}>LIVE</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.heading}>Camera {index + 1}</Text>
                <TouchableOpacity
                  style={styles.viewButton}
                  onPress={() => navigation.navigate('ViewFullScreen', { videoUrl: source.url })}
                >
                
                    <Text style={styles.viewButtonText}>VIEW</Text>
                    <Image
                      source={ArrowVector}
                      style={styles.ArrowVectorImg}
                      resizeMode="contain"
                    /> 
                </TouchableOpacity>
              </View>
            </View>
          ))
      }
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  videoContainer: {
    width: '100%',
    marginVertical: 10,
    backgroundColor: '#F0F0F0',
    borderColor: '#2A344380',
    borderWidth: 1,
    paddingBottom: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  outerContainer: {
    padding: 10,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: 'hidden',
    backgroundColor: '#F0F0F0',
    borderColor: '#2A344380',
    borderWidth: 1,
    borderBottomWidth:0
  },
  webviewWrapper: {
    flex: 1,
    borderRadius: RADIUS,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  heading: {
    fontFamily: 'Sora-SemiBold',
    color: '#2A3443',
    fontSize: 18,
    lineHeight: 18,
  },
  liveBtn: {
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    gap:8,
    paddingHorizontal:14,
    paddingVertical:7,
    backgroundColor:'#00000073',
    borderRadius:96,
    position:'absolute',
    top:20,
    left:20
  },
  redDot: {
    height:6,
    width:6,
    borderRadius:100,
    backgroundColor:'#FF0000'
  },
  liveBtnText: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 18,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 8,
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  viewButton: {
    backgroundColor: '#CBDB2A',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 96,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  viewButtonText: {
    fontFamily: 'PlusJakartaSans-Medium',
    color: '#000',
    fontSize: 14,
    lineHeight:14
  },
  ArrowVectorImg: {
    width: width * 0.03,
    height: width * 0.03,
  },
  errorText: {
    fontFamily: 'Poppins',
    fontSize: 16,
    color: '#555',
  },
});

export default ConstructionCamera;
