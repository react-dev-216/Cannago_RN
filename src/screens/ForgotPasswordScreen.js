import React, { Component } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import Modal from 'react-native-modalbox';

import {styles} from '../components/styles'

export default class ForgotPasswordScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
        modalVisible: false,
    };
  }

  closeModal = () => {
    this.refs.modal6.close();
    this.props.navigation.navigate('LoginScreen');
  }

  render() {
    return (
        <View style={{...styles.container, justifyContent:'center'}}>
            <TouchableOpacity style={{position:'absolute', top:Platform.OS=='ios'?55:25, left:0}} onPress={()=>{this.props.navigation.goBack()}}>
              <Image source={require('../assets/iamges/backImage.png')} resizeMode='stretch' style={{...styles.backImage}} />
            </TouchableOpacity>
            <Image source={require('../assets/iamges/forgpwdImage.png')} resizeMode='stretch' style={{...styles.logoImage, marginTop:0}} />
            <Text style={styles.forgpwdTxt}>Please enter the email address you used to make your CannaGo Account</Text>
            <View style={styles.inputArea}>
              <View style={styles.inputItem}>
                <Image source={require('../assets/iamges/email.png')} resizeMode='stretch' style={styles.InputImage} />
                <TextInput style={styles.inputTxt} placeholderTextColor="#7a7a7b" placeholder="Email Address"></TextInput>
              </View>
              <TouchableOpacity style={{...styles.signinBtn, marginTop:5, marginBottom:50}} onPress={() => this.refs.modal6.open()}>
                <Text style={styles.signinTxt1}>Submit</Text>
              </TouchableOpacity>
            </View>
            <Modal style={styles.modal} position={"bottom"} ref={"modal6"} swipeArea={20}>
                <TouchableOpacity style={styles.closeBtn} onPress={() => {this.closeModal()}}>
                    <Image source={require('../assets/iamges/close.png')} resizeMode='stretch' style={styles.closeImage} />
                </TouchableOpacity>
                <Image source={require('../assets/iamges/modalImage.png')} resizeMode='stretch' style={{...styles.logoImage, marginTop:0}} />
                <Text style={{...styles.forgpwdTxt, width:'80%'}}>Please check your email inbox for further instructions!</Text>
            </Modal>
        </View>
    );
  }
}
