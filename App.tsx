/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
 
import React, {useEffect, useState} from 'react';
import {
  useColorScheme,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './component/Login';
import Homepage from './component/Homepage';
import SplashScreen from './component/SplashScreen';
import ConstructionCamera from './component/ContructionCamera';
import ViewFullScreen from './component/ViewFullScreen';
import SliderScreen from './component/SliderScreen';
 

import { enableScreens } from 'react-native-screens';
 
enableScreens();

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Simulate loading process
    setTimeout(() => {
      setIsLoading(false);
    }, 7000); // Adjust the time as needed
  }, []);
   

   
  const Stack = createStackNavigator();
   

  return (
    <NavigationContainer>
      {isLoading ? <SplashScreen /> :
        <Stack.Navigator initialRouteName="SliderScreen">
              <Stack.Screen name="SliderScreen" component={SliderScreen} options={{ headerShown: false }} />
          {/* <Stack.Screen name="SliderScreen" component={SliderScreen} options={{ headerShown: false }} /> */}

          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>          

          <Stack.Screen name="Homepage" component={Homepage} options={{ headerShown: false }}/>

          <Stack.Screen name="ConstructionCamera" component={ConstructionCamera} options={{ headerShown: false }}/>

          <Stack.Screen name="ViewFullScreen" component={ViewFullScreen} options={{ title: '' }}/>

        </Stack.Navigator>
      }
    </NavigationContainer>
  );
}




export default App;
