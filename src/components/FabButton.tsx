import { StyleSheet, Text, View,TouchableOpacity, Image } from 'react-native'
import React from 'react'

interface FabButtonProps{
    onpress:()=> void
}
const FabButton:React.FC<FabButtonProps> = ({onpress}) => {
  return (
    <View style={styles.mainContiner}>
        <TouchableOpacity onPress={onpress}>
            <Image source={require('../assets/time.png')} style={styles.imageHeight}></Image>
        </TouchableOpacity>
    </View>
  )
}

export default FabButton

const styles = StyleSheet.create({
    mainContiner:{
        height:70,
        width:70,
        borderRadius:100,
        justifyContent:'center',
        alignItems:'center',
        experimental_backgroundImage:'linear-gradient(to right, rgba(138, 133, 133, 0), rgb(121, 135, 241))'
    },
    imageHeight:{
        height:40,
        width:40
    }
})