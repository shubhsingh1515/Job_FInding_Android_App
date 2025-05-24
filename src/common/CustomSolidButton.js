import { View, Text,StyleSheet,TouchableOpacity } from 'react-native'
import React from 'react'
import { Text_COLOR,BG_COLOR } from '../utils/Colors'

const CustomSolidButton = ({title,onClick}) => {
  return (
    <TouchableOpacity style={style.btn}onPress={()=>{
        onClick()
    }}>
   <Text style={style.title}>{title}</Text>
    </TouchableOpacity>
  )
}

export default CustomSolidButton
const style=StyleSheet.create({
    btn:{
        width:'90%',
        height:45,
        backgroundColor:"#20B2AA",
        alignSelf:'center',
        marginTop:20,
        borderRadius:10,
        justifyContent:'center',
        alignItems:'center'

    },
    title:{
        color:"black",
        fontWeight:'500',
        fontSize:16
    }
})