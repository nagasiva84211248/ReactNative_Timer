import { Modal, StyleSheet, Text, View, TouchableWithoutFeedback, TouchableOpacity, FlatList, ActivityIndicator, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import FabButton from '../components/FabButton'
import CustomTextField from '../components/CustomTextField'
import { SelectList } from 'react-native-dropdown-select-list'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Toast } from "react-native-toast-notifications";
import TimerCatagoryList from '../components/TimerCatagoryList'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp, NativeStackNavigatorProps } from '@react-navigation/native-stack'
import { RootStack } from '../../App'


const HomeScreen = () => {
    const [timerInputModel, setTimerInputModel] = useState<boolean>(false);
    const [timerData, setTimerData] = useState<ICategory[]>([]);
    const [loader, setLoader] = useState<boolean>(false);
    const [isPlayingAll, setIsPlayingAll] = useState(false);
    const [restAll, setRestAll] = useState(false);
    const navigation = useNavigation<NativeStackNavigationProp<RootStack>>()
    
    const handleFabTimerButton = () => {
        console.log("trigger");
        setTimerInputModel(true);
    };

    const getTimerData = async () => {
        try {
            setLoader(true);
            let getData = await AsyncStorage.getItem('timer');
            if (getData) {
                setTimerInputModel(false)
                if (JSON.parse(getData).length > 0) {
                    const parsedData: ITimer[] = JSON.parse(getData);
                    const groupMap: Record<string, ITimer[]> = {};
                    parsedData.forEach(item => {
                        if (!groupMap[item.category]) {
                            groupMap[item.category] = [];
                        }
                        groupMap[item.category].push(item);
                    });

                    const finalArray: ICategory[] = Object.keys(groupMap).map((categoryName, index) => ({
                        id: index + 1,
                        categoryName,
                        categoryList: groupMap[categoryName],
                        expandCollapse: false,
                        playAllTimers: false,
                        ResetAllTimers: false,
                    }));

                    console.log(finalArray);
                    setTimerData(finalArray);
                    setTimeout(() => {
                        setLoader(false)
                    }, 2000);
                }

                console.log("data Avalilable", getData);
            } else {
                setLoader(false)
                setTimerInputModel(false)
            }
        } catch (error) {
            setLoader(false)
            console.log(error);
        }
    }

    const HandleExpandCollapse = (item: any) => {
        setTimerData(prev =>
            prev.map(cat =>
                cat.id === item.id
                    ? { ...cat, expandCollapse: !cat.expandCollapse }
                    : { ...cat, expandCollapse: false }
            )
        );

    }

    const handlePlayTimers = () => { 
        setIsPlayingAll(prev => prev = !prev);
     }

     const handleResetAllTimers = () => { 
        setIsPlayingAll(false);
        setRestAll(prev => prev = !prev);
     }

     const HandleNavigate = () => { 
        navigation.navigate('history');
      }

    useEffect(() => {
        getTimerData();
    }, [])

    useEffect(() => {
        console.log(timerData);
    }, [timerData])

    return (
        <View style={styles.mainContainer}>
            <View style={[styles.buttoncontainer,{marginBottom:10,justifyContent:'space-between'}]}>
                    <Text style={styles.buttonText}>Home</Text>
                <TouchableOpacity style={[styles.saveButton,{backgroundColor:'#8692f1'}]} onPress={HandleNavigate}>
                    <Text style={styles.buttonText}>History</Text>
                </TouchableOpacity>
            </View>
            <Text style={[styles.buttonText,{marginBottom:10,}]}>Categories</Text>
            {
                loader ? (
                    <View style={styles.notFoundText}>
                        <ActivityIndicator size="large" color="#000" />
                    </View>
                ) : timerData && timerData.length > 0 ? (
                    <FlatList
                        data={timerData}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View>
                                <View style={styles.catagoryListCard}>
                                    <Text style={styles.buttonText}>{item.categoryName}</Text>
                                    <View style={styles.playPauseContiner}>
                                        {
                                            item.expandCollapse &&
                                            <TouchableOpacity onPress={handlePlayTimers}>
                                                <Image source={isPlayingAll ? require('../assets/pause.png') : require('../assets/play.png')} style={styles.imageHeight}></Image>
                                            </TouchableOpacity>
                                        }{
                                            item.expandCollapse &&
                                            <TouchableOpacity onPress={handleResetAllTimers}>
                                                <Image source={require('../assets/restart.png')} style={styles.imageHeight}></Image>
                                            </TouchableOpacity>
                                        }
                                        <TouchableOpacity onPress={() => HandleExpandCollapse(item)}>
                                            <Image source={require('../assets/down-arrow.png')} style={[styles.arrowDownImage, { transform: [{ rotate: item.expandCollapse ? '0deg' : '180deg' }] }]}></Image>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                {
                                    item.expandCollapse && 
                                    <TimerCatagoryList list={item.categoryList} playAll={isPlayingAll} resetAll={restAll}></TimerCatagoryList>
                                }
                            </View>
                        )}
                    />
                ) : (
                    <View style={styles.notFoundText}>
                        <Text>No category found</Text>
                    </View>
                )
            }



            <View style={styles.fabButton}>
                <FabButton onpress={handleFabTimerButton}></FabButton>
            </View>
            {timerInputModel && (
                <Modal
                    animationType="slide"
                    transparent={false}
                    presentationStyle='pageSheet'
                    visible={timerInputModel}
                    backdropColor='transparent'
                    onRequestClose={() => setTimerInputModel(false)}
                >
                    <TouchableWithoutFeedback onPress={() => setTimerInputModel(false)}>
                        <View style={styles.modalDammyContainer} />
                    </TouchableWithoutFeedback>
                    <View style={styles.modalContent}>
                        <TimerInputScreen closeModal={() => getTimerData()} />
                    </View>
                </Modal>
            )}
        </View>
    )
}

const TimerInputScreen = ({ closeModal }: { closeModal: () => void }) => {
    const [selected, setSelected] = useState<string>('');
    const [timerName, setTimerName] = useState<string>('');
    const [duration, setDuration] = useState<string>('');
    const data = [
        { key: '1', value: 'Workout' },
        { key: '2', value: 'Study' },
        { key: '3', value: 'Break' }
    ]

    const saveTimerData = async () => {
        if (timerName.trim() === "") {
            Toast.show('Please enter timer name', { type: 'warning', placement: "top" });
        } else if (duration === "") {
            Toast.show('Please enter duration', { type: 'warning', placement: "top" });
        }else if (duration === '0') {
            Toast.show('Please enter valid duration', { type: 'warning', placement: "top" });
        } else if (selected === "") {
            Toast.show('Please select catagory', { type: 'warning', placement: "top" });
        } else {
            try {
                let date = new Date();
                const timer: ITimer[] = [{
                    name: timerName,
                    duration: duration,
                    category: selected,
                    PlaySingleTimer: false,
                    ResetSingleTimer: false,
                    progress:0,
                    Status:"",
                    remainingTimer:0,
                    date:date
                }];
                let timerData: ITimer[] = [];
                let getData = await AsyncStorage.getItem('timer');
                if (getData) {
                    let parseTimerData = JSON.parse(getData);
                    if (parseTimerData.length > 0) {
                        timerData = [...parseTimerData, ...timer]
                    }
                    console.log('timer', timer);
                    AsyncStorage.setItem('timer', JSON.stringify(timerData))
                } else {
                    AsyncStorage.setItem('timer', JSON.stringify(timer))
                }
                closeModal()
            } catch (error) {
                console.log(error);
            }
        }
    }
    return (
        <View style={styles.timerMainContainer}>
            <View>
                <Text style={[styles.buttonText,{marginBottom:10}]}> Timer Content</Text>
                <CustomTextField keyboardType={'default'} value={timerName} onChangeText={setTimerName} placeHolder='Enter timer name' width={true}></CustomTextField>
                <View style={styles.durationCatagoryContainer}>
                    <CustomTextField keyboardType={'numeric'} value={duration} onChangeText={setDuration} width={false} placeHolder='Enter Duration in Sec'></CustomTextField>
                    <SelectList maxHeight={100}  boxStyles={{ width: 180, height: 60,borderWidth:2,borderColor:'#000',justifyContent:'center',alignItems:'center',marginBottom:10 }}
                        setSelected={(val: string) => setSelected(val)}
                        data={data}
                        fontFamily='Roboto'
                        save="value"
                        searchPlaceholder="Categories"
                    ></SelectList>
                </View>
            </View>
            <View style={styles.buttoncontainer}>
                <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
                    <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={saveTimerData}>
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        margin: 10
    },
    fabButton: {
        position: 'absolute',
        bottom: 10,
        right: 20,
        zIndex: 1000
    },
    modalDammyContainer: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    modalContent: {
        height: '50%',
        backgroundColor: '#caf0fc',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        experimental_backgroundImage: 'linear-gradient(to top, rgba(231, 227, 227, 0), rgb(233, 233, 236))'
        

    },
    timerMainContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%'
    },
    buttoncontainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: 10,
        width: '100%'
    },
    durationCatagoryContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        alignContent:'center',
        justifyContent: 'space-between',

    },
    buttonText: {
        fontSize: 16,
        fontWeight: 600
    },
    saveButton: {
        backgroundColor: 'rgb(121, 135, 241))',
        borderRadius: 10,
        height: 50,
        width: '40%',
        alignItems: 'center',
        justifyContent: 'center',

    },
    cancelButton: {
        borderWidth: 2,
        borderColor: '#000',
        backgroundColor: 'transparent',
        borderRadius: 10,
        height: 50,
        width: '40%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectDropdown: {
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 10,
        height: 60,
        justifyContent: 'center',
        padding: 5,
        marginBottom: 10
    },
    notFoundText: {
        flex: 1,
        height: "100%",
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    catagoryListCard: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        width: '95%',
        borderColor: '#000',
        borderRadius: 10,
        height: 60,
        padding: 10,
        marginBottom: 10
    },
    arrowDownImage: {
        height: 20,
        width: 20,
    },
    imageHeight: {
        height: 25,
        width: 25,
        marginRight: 20
    },
    playPauseContiner: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    }
})




