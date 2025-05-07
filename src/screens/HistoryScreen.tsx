import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';

const HistoryScreen = () => {
  const [storedData, setStoredData] = useState<ITimer[]>([]);
  const getcompletedTimers = async () => {
    let getData = await AsyncStorage.getItem('CompletedTimer');
    if (getData) {
      setStoredData(JSON.parse(getData))
    }

  }
  useEffect(() => {
    getcompletedTimers();
  },)
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.mt}> History</Text>
      {
        storedData && storedData.length > 0 ?
          <FlatList
            data={storedData}
            keyExtractor={(item, index) => item.duration + index}
            renderItem={({ item, index }) => (
              <View style={styles.subContainer}>
                <View style={styles.textContainer}>
                  <View style={styles.textSubContainer}>
                    <Text>
                      <Text style={{ color: 'gray' }}>Timer name: </Text>
                      <Text style={{ color: '#000', fontWeight: 600 }}>{item.name}</Text>
                    </Text>
                    <Text>
                      <Text style={{ color: 'gray' }}> Date: </Text>
                      <Text style={{ color: '#000', fontWeight: 600 }}>{item.date}</Text>
                    </Text>
                  </View>
                </View>
              </View>

            )}></FlatList> :
          <View style={styles.notFoundText}>
            <Text>No Record found</Text>
          </View>
      }
    </View>
  )
}

export default HistoryScreen

const styles = StyleSheet.create({
  mainContainer:{
      margin:10
  },
  subContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageHeight: {
    height: 40,
    width: 40
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    borderWidth: 1,
    marginBottom:10,
    width: '100%',
    borderRadius:10

  },
  textSubContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
    padding: 10,
  },
  playPauseButtons: {
    display: 'flex',
    flexDirection: 'row',
    width: '50%',
    alignItems: 'center'
  },
  playButtons: {
    height: 40,
    width: 40,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    // flex: 1,
    height: "100%",
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mt:{
    marginBottom:10
  }
})