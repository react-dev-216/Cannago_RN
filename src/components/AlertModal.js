import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {styles} from '../components/styles'

const AlertModal = ({...props}) => {
    return (
        <View style={styles.modalView}>
            <Text style={styles.TitleTxt1}>OOPS!</Text>
            <Text style={{...styles.Description, textAlign:'center', width:'90%'}}>{props.alertContent}</Text>
            <TouchableOpacity style={styles.QuitWorkout} onPress={props.onPress}>
                <Text style={{ ...styles.Dismiss, color: 'white' }}>OK</Text>
            </TouchableOpacity>
        </View>
    );
};

export default AlertModal;
