import { StyleSheet, Text, FlatList, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import * as Progress from 'react-native-progress';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Alert from '../utils/Alert';


interface CardProps {
  list: ITimer[];
  playAll:boolean,
  resetAll:boolean
}
const TimerCatagoryList: React.FC<CardProps> = ({ list,playAll,resetAll }) => {
  const intervalRefs = useRef<{ [key: number]: NodeJS.Timeout }>({});
  const [timers, setTimers] = useState<ITimer[]>([]);
  const [showSuccessFullAlert, setShowSuccessFullAlert] = useState<boolean>(false)
  const [showTimerName, setTimerName] = useState<string>('')
    const timersRef = useRef<ITimer[]>([]);

  const handlePlayPause = (index: number) => {
    const timer = timers[index];
    const duration = parseInt(timer.duration);
    const increment = 1 / duration;

    if (timer.PlaySingleTimer) {
      clearInterval(intervalRefs.current[index]);
      updateTimer(index, {
        PlaySingleTimer: false,
        Status: 'Paused'
      });
    } else {
      updateTimer(index, {
        PlaySingleTimer: true,
        Status: 'Start'
      });

      intervalRefs.current[index] = setInterval(() => {
        setTimers(prev => {
          const updated = [...prev];
          const current = updated[index];
          const currentProgress = updated[index].progress + increment;
          const newRemainingTime = Math.max((current.remainingTimer ?? duration) - 1, 0);
          if (currentProgress >= 1) {
            clearInterval(intervalRefs.current[index]);
            let date = new Date();
            updated[index] = {
              ...updated[index],
              progress: 1,
              PlaySingleTimer: false,
              Status: 'Completed',
              date:date,
              remainingTimer: 0,
            };
            setTimerName(current.name)
            setShowSuccessFullAlert(true);
            setTimeout(() => {
              setShowSuccessFullAlert(false);
            }, 3000);
            storeDataForHistoryScreen(current)
          } else {
            updated[index] = {
              ...current,
              progress: currentProgress,
              remainingTimer: newRemainingTime
            };
          }

          return updated;
        });
      }, 1000);
    }
  };

  const storeDataForHistoryScreen = async (current: ITimer) => {
    let temp = [];
    let timerData:ITimer [] = [];
    let date = new Date();
    current.date = date;
    temp.push(current);
    let getData = await AsyncStorage.getItem('CompletedTimer');
    if (getData) {
      let parseTimerData = JSON.parse(getData);
      if (parseTimerData.length > 0) {
        timerData = [...parseTimerData, ...temp]
      }
      AsyncStorage.setItem('CompletedTimer', JSON.stringify(timerData))
    } else {
      AsyncStorage.setItem('CompletedTimer', JSON.stringify(temp))
    }
  }

  const handleReset = (index: number) => {
    clearInterval(intervalRefs.current[index]);
    updateTimer(index, {
      progress: 0,
      PlaySingleTimer: false,
      Status: 'Reset'
    });
  };

  const updateTimer = (index: number, updates: Partial<ITimer>) => {
    setTimers(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...updates };
      return updated;
    });
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };


  useEffect(() => {
    const initializedTimers = list.map(timer => ({
      ...timer,
      remainingTimer: timer.remainingTimer > 0 ? timer.remainingTimer : parseInt(timer.duration),
      progress: timer.progress ?? 0,
      PlaySingleTimer: false,
      Status: 'Idle',
    }));
    setTimers(initializedTimers);
    return () => {
      Object.values(intervalRefs.current).forEach(clearInterval);
    };
  }, []);

  useEffect(() => {
    timersRef.current = timers;
  }, [timers]);

  useEffect(() => {
    if (playAll) {
      timersRef.current.forEach((timer, index) => {
        const isRunning = intervalRefs.current[index] !== undefined;
  
        if (!isRunning) {
          if (timer.Status === 'Completed') {
            updateTimer(index, {
              remainingTimer: parseInt(timer.duration),
              progress: 0,
              Status: 'Idle',
            });
          }
          handlePlayPause(index);
        }
      });
    } else {
      Object.keys(intervalRefs.current).forEach((key) => {
        const idx = parseInt(key);
        clearInterval(intervalRefs.current[idx]);
        delete intervalRefs.current[idx];
        updateTimer(idx, {
          PlaySingleTimer: false,
          Status: 'Paused',
        });
      });
    }
  }, [playAll]);
  

  useEffect(() => {
    if (resetAll) {
      Object.keys(intervalRefs.current).forEach((key) => {
        const idx = parseInt(key);
        clearInterval(intervalRefs.current[idx]);
        delete intervalRefs.current[idx];
      });
      setTimers(prev =>
        prev.map(timer => ({
          ...timer,
          progress: 0,
          PlaySingleTimer: false,
          Status: 'Reset',
          remainingTimer: parseInt(timer.duration),
        }))
      );
    }
  }, [resetAll]);
  

  return (
    <View style={styles.mainContainer}>
      <FlatList
        data={timers}
        keyExtractor={(item, index) => item.duration + index}
        renderItem={({ item, index }) => (
          <View style={styles.subContainer}>
            <View style={styles.textContainer}>
              <View style={styles.textSubContainer}>
                <Text>
                  <Text style={{ color: 'gray' }}>Timer name: </Text>
                  <Text style={{ color: '#000', fontWeight: 600 }}>{item.name}</Text>
                </Text>
                <Text style={{ marginLeft: 20 }}>
                  <Text style={{ color: 'gray', }}>Remaining Time: </Text>
                  <Text style={{ color: '#000', fontWeight: 600 }}>{formatTime(item.remainingTimer || 0)}</Text>
                </Text>
              </View>
              <Text style={{ marginLeft: 12 }}>
                <Text style={{ color: 'gray' }}>Status: </Text>
                <Text style={{ color: '#000', fontWeight: 600 }}>{item.Status}</Text>
              </Text>
              <View style={styles.playPauseButtons}>
                <View style={styles.playButtons}>
                  <TouchableOpacity onPress={() => handlePlayPause(index)}>
                    <Image source={item.PlaySingleTimer ? require('../assets/pause.png') : require('../assets/play.png')} style={styles.imageHeight}></Image>
                  </TouchableOpacity>
                </View>

                <View style={[styles.playButtons, { marginLeft: 10 }]}>
                  <TouchableOpacity onPress={() => handleReset(index)}>
                    <Image source={require('../assets/restart.png')} style={styles.imageHeight}></Image>
                  </TouchableOpacity>

                </View>
                <View style={{ borderWidth: 1, height: 10, borderRadius:2, margin: 20 }}>
                  <Progress.Bar progress={item.progress} width={210} height={10} borderWidth={0} />
                </View>

              </View>
            </View>
          </View>

        )}></FlatList>

        {
          showSuccessFullAlert && <Alert timerName={showTimerName} />
        }
    </View>
  )
}

export default TimerCatagoryList

const styles = StyleSheet.create({
  mainContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    width: '95%',
    borderColor: '#000',
    borderRadius: 10,
    // padding: 10,
    marginBottom: 10,
    // experimental_backgroundImage: 'linear-gradient(to right, rgba(138, 133, 133, 0), rgb(121, 135, 241))'
  },
  subContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageHeight: {
    height: 25,
    width: 25
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    width: '100%',
    padding: 10
  },
  textSubContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
    padding: 10
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


})