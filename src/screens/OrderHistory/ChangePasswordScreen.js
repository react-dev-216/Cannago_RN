import React, { Component } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { styles } from '../../components/styles'

import { func, string, bool, object, array } from "prop-types";
import { connect } from "react-redux";
import user, { load, userInfo } from "../../store/reducers/user";
import Spinner from 'react-native-loading-spinner-overlay';
import firebase from 'firebase'
import AlertModal from '../../components/AlertModal'
import Modal from 'react-native-modal';

class ChangePasswordScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeFlag: false,
      isLoading: false,
      old_password: '',
      current_password: '',
      new_password: '',
      confirm_password: '',
      usertype: '',
      userId: "",
      isModalVisible: false,
      isModalVisible1: false,
      alertContent: ''
    };
  }

  componentDidMount = async () => {
    const usertype = await AsyncStorage.getItem("usertype");
    this.setState({ usertype: usertype })
    const userId = await AsyncStorage.getItem("userUid");
    this.setState({ userId: userId })
    await this.setState({ current_password: this.props.navigation.getParam("passoword") })
    console.log(this.state.current_password);
  }

  NetworkSensor = async () => {
    await this.setState({
      timeFlag: true,
      isLoading: false
    })
    // alert('network error')
  }

  reauthenticate = (currentPassword) => {
    var user = firebase.auth().currentUser;
    var cred = firebase.auth.EmailAuthProvider.credential(
      user.email, currentPassword);
    return user.reauthenticateWithCredential(cred);
  }

  async update() {
    const { current_password, old_password, new_password, confirm_password } = this.state
    if (old_password == "") {
      this.setState({ alertContent: 'Please input your current password.', isModalVisible: true })
    } else if (old_password != current_password) {
      this.setState({ alertContent: 'Please input your current password correctly.', isModalVisible: true })
    } else if (new_password == "") {
      this.setState({ alertContent: 'Please input your new password.', isModalVisible: true })
    } else if (confirm_password != new_password) {
      this.setState({ alertContent: "Password doesn't match", isModalVisible: true })
    } else {
      this.setState({ isLoading: true })
      this.reauthenticate(old_password).then(() => {
        var user = firebase.auth().currentUser;
        user.updatePassword(new_password).then(() => {
          this.setState({ isLoading: false })
          this.upload_password(new_password);
          this.setState({ isModalVisible1: true })
          setTimeout(() => {
            this.setState({ isModalVisible1: false })
            this.props.navigation.goBack();
          }, 2000)
        }).catch((error) => {
          console.log(error);
          this.setState({ isLoading: false })
        });
      }).catch((error) => {
        console.log(error);
        this.setState({ isLoading: false })
      });
    }
    // this.setState({ isModalVisible1: true })
    // setTimeout(() => {
    // this.props.navigation.navigate("ProfileInfoScreen")
    // }, 2000)
  }

  upload_password = async (password) => {
    try {
      await firebase.database().ref('user/' + this.state.userId + '/' + this.state.usertype).update({
        password: password,
      });
    } catch (error) {
      console.log(error)
    }

  }

  render() {
    const { password } = this.state
    return (
      <KeyboardAwareScrollView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Modal isVisible={this.state.isModalVisible}>
            <AlertModal alertContent={this.state.alertContent} onPress={() => this.setState({ isModalVisible: false })} />
          </Modal>
          <Modal isVisible={this.state.isModalVisible1}>
            <View style={{ ...styles.modalView, backgroundColor: 'white' }}>
              <Image source={require('../../assets/iamges/CannaGo.png')} resizeMode='stretch' style={{ width: 80, height: 80, marginBottom: 20 }} />
              <Text style={{ ...styles.Description1, fontSize: 20, color: "#61D273", fontFamily: 'Poppins-Regular', width: '90%' }}>Password was changed successfully.</Text>
            </View>
          </Modal>
          <ScrollView style={{ width: '100%' }}>
            <View style={styles.container}>
              <Spinner
                visible={this.state.isLoading}
                textContent={'Updating password...'}
                textStyle={{ color: 'white' }}
              />
              <View style={{ width: '100%', alignItems: 'center', marginTop: Platform.OS == 'ios' ? 40 : 20 }}>
                <TouchableOpacity style={styles.backBtn} onPress={() => { this.props.navigation.goBack() }}>
                  <Image source={require('../../assets/iamges/backImage.png')} resizeMode='stretch' style={styles.backImage} />
                </TouchableOpacity>
              </View>
              <Image source={require('../../assets/iamges/forgpwdImage.png')} resizeMode='stretch' style={{ ...styles.logoImage, marginTop: 150 }} />
              <Text style={styles.forgpwdTxt}>You are changing your account password</Text>
              <View style={styles.inputArea}>
                <View style={styles.inputItem}>
                  <Image source={require('../../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                  <TextInput secureTextEntry={true} onChangeText={value => this.setState({ old_password: value })} style={styles.inputTxt} placeholderTextColor="#7a7a7b" placeholder="Enter Old Password"></TextInput>
                </View>
                <View style={styles.inputItem}>
                  <Image source={require('../../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                  <TextInput secureTextEntry={true} onChangeText={value => this.setState({ new_password: value })} style={styles.inputTxt} placeholderTextColor="#7a7a7b" placeholder="Enter New Password"></TextInput>
                </View>
                <View style={styles.inputItem}>
                  <Image source={require('../../assets/iamges/email.png')} resizeMode='stretch' style={styles.InputImage} />
                  <TextInput secureTextEntry={true} onChangeText={value => this.setState({ confirm_password: value })} style={styles.inputTxt} placeholderTextColor="#7a7a7b" placeholder="Retype New Password"></TextInput>
                </View>
                <TouchableOpacity style={{ ...styles.signinBtn, backgroundColor: '#3EA3E1', width: 128, alignSelf: 'center' }} onPress={() => { this.update() }}>
                  <Text style={styles.signinTxt1}>Update</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ height: 150 }}></View>
          </ScrollView>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  load: (data) => dispatch(load(data)),
  userInfo: (updateUserInfo_row) => dispatch(userInfo(updateUserInfo_row)),
});

const mapStateToProps = ({ user }) => ({
  real_data: user.real_data,
  user_real_info: user.user_real_info
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChangePasswordScreen);
