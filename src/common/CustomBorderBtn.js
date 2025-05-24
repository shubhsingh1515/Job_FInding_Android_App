import { View, Text,StyleSheet,TouchableOpacity } from 'react-native'
import React from 'react'
import { Text_COLOR,BG_COLOR } from '../utils/Colors'

const CustomBorderBtn = ({title,onClick}) => {
  return (
    <TouchableOpacity style={style.btn} onPress={()=>{
        onClick()
    }}>
   <Text style={style.title}>{title}</Text>
    </TouchableOpacity>
  )
}

export default CustomBorderBtn  
const style=StyleSheet.create({
    btn:{
        width:'90%',
        height:45,
        borderColor:"#20B2AA",
        borderWidth:1,
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