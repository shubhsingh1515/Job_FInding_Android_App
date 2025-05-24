import { View, Text,StyleSheet } from 'react-native'
import React from 'react'
import { moderateScale, verticalScale } from 'react-native-size-matters'
import { TouchableOpacity } from 'react-native-gesture-handler'

const CustomHeader = ({title, onBackPress}) => {
  return (
    <View style={styles.container}>
        <TouchableOpacity>
            
        </TouchableOpacity>
      <Text>{title}</Text>
    </View>
  )
}

export default CustomHeader

const styles=StyleSheet.create({
    container: {
        width:'100%',
        height:verticalScale(45),
        flexDirection:'row',
        paddingLeft:moderateScale(15)
        }
})