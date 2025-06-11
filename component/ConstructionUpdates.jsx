import React, { useState, useEffect} from "react";
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image, ScrollView, Dimensions,useWindowDimensions } from 'react-native';
import Background from "../assets/login-background.png";
import Backbutton from "../assets/Vector.png"
import { useNavigation } from '@react-navigation/native';
import Header from './Header';
import Pdf from 'react-native-pdf';

const ConstructionUpdates = () => {
    const navigation = useNavigation();
    // const { width, height } = useWindowDimensions();
    const { width, height } = Dimensions.get('window');
    const isLandscape = width > height; 
    const [pdfUrl, setPdfUrl] = useState({ uri: '' });
    const [loader, SetLoader] = useState(true);
    /* const pdfSource = Platform.OS === 'android'
    ? { uri: 'https://summerwood.biz/wp-content/uploads/construction_updates.pdf' } 
    : { uri: 'https://summerwood.biz/wp-content/uploads/construction_updates.pdf' };
     */
    //const pdfSource = { uri: 'bundle-assets://dummy.pdf' };
    const getPdf = async () =>{
      const apiUrl = 'https://summerwood.biz/wp-json/custom-api/v1/get-pdf-url';
      const response = await fetch(apiUrl, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
              }
          });
      const result = await response.json();
      const pdfSourceq = { uri: result.data };
      setPdfUrl(pdfSourceq);
      SetLoader(false);
  }
  useEffect(()=>{
    getPdf();
  })

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            {!loader &&
                isLandscape ? (
                    <Pdf
                        source={pdfUrl}
                        trustAllCerts={false}
                        enablePaging={true}
                        horizontal={true}
                        onLoadComplete={(numberOfPages) => {}}
                        onPageChanged={(page, numberOfPages) => {}}
                        onError={(error) => {
                            console.log('errrrr----', error.message);
                        }}
                        onPressLink={(uri) => {
                            console.log(`Link pressed: ${uri}`);
                        }}
                        style={{ width: width, minHeight: height * 1.5, }}
                    />
                ) : (
                    // Normal mode in portrait
                    <ImageBackground
                        source={Background}
                        style={styles.backgroundImage}>
                        <View style={styles.container}>
                            <View style={[styles.pdfContainer, { height: height * 0.6, width: width }]}>
                                
                                <Pdf
                                    source={pdfUrl}
                                    trustAllCerts={false}
                                    enablePaging={true}
                                    horizontal={true}
                                    onLoadComplete={(numberOfPages) => {}}
                                    onPageChanged={(page, numberOfPages) => {}}
                                    onError={(error) => {
                                        console.log('errrrr----', error.message);
                                    }}
                                    onPressLink={(uri) => {
                                        console.log(`Link pressed: ${uri}`);
                                    }}
                                    style={{
                                        flex: 1,
                                        width: '100%',
                                        height: '100%',
                                    }}
                                />
                            </View>
                        </View>
                    </ImageBackground>
                )
            }
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    scrollContainer: {
        flexGrow: 1,
        backgroundColor: '#fff',
    },
    pdfContainer: {
        marginTop: 20,
    },
});
export default ConstructionUpdates