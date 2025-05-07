import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from './src/screens/HomeScreen'
import { ToastProvider } from 'react-native-toast-notifications'
import HistoryScreen from './src/screens/HistoryScreen'

export type RootStack = {
  home: undefined,
  history: undefined
}

const Stack = createNativeStackNavigator<RootStack>();

const App = () => {
  return (
    <ToastProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='home' screenOptions={{ headerShown: false }}>
          <Stack.Screen name='home' component={HomeScreen} ></Stack.Screen>
          <Stack.Screen name='history' component={HistoryScreen} ></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </ToastProvider>
  )
}

export default App