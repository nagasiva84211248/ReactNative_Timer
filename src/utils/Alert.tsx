import { Modal, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import React from 'react'

interface AlertProps{
    timerName:string
}

const Alert:React.FC<AlertProps> = ({timerName}) => {
    return (
        <View>
            <Modal
                animationType="slide"
                transparent={false}
                presentationStyle='pageSheet'
                visible={true}
                backdropColor='transparent'
            >
                <TouchableWithoutFeedback>
                    <View style={styles.modalDammyContainer} />
                </TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                    <Text style={styles.text}>Congratulations Completed {timerName} Timer</Text>
                </View>
            </Modal>
        </View>
    )
}

export default Alert

const styles = StyleSheet.create({
    modalDammyContainer: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    modalContent: {
        height: '50%',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: '#ccc',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        experimental_backgroundImage: 'linear-gradient(to top, rgba(138, 133, 133, 0), rgb(121, 135, 241))'

    },
    text:{
        fontSize:20,
        textAlign:'center'
    }
})