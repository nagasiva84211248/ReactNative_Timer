import { StyleSheet, Text, TextInput, View, } from 'react-native'
import React from 'react'

interface TextFieldProps {
  keyboardType: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  placeHolder: string;
  width: boolean;
  value: string ;
  onChangeText: (text: string) => void;

}
const CustomTextField: React.FC<TextFieldProps> = ({ keyboardType, placeHolder, width, value, onChangeText }) => {
  return (
    <View style={[styles.mainContainer, { width: width ? '100%' : '47%' }]}>
      <TextInput style={[styles.input]}
        keyboardType={keyboardType}
        placeholder={placeHolder}
        value={value}
        onChangeText={onChangeText}
      ></TextInput>
    </View>
  )
}

export default CustomTextField

const styles = StyleSheet.create({
  mainContainer: {
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 10,
    height: 60,
    justifyContent: 'center',
    padding: 5,
    marginBottom: 10
  },
  input: {
    fontSize: 16
  }
})