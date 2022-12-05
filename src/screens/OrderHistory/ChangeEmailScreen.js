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

let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

class ChangeEmailScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timeFlag: false,
            isLoading: false,
            old_Email: '',
            current_Email: '',
            new_Email: '',
            confirm_Email: '',
            password: '',
            usertype: '',
            // userId: firebase.auth().currentUser.uid,
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
        await this.setState({ current_Email: this.props.navigation.getParam("email") })
        await this.setState({ password: this.props.navigation.getParam("password") })
        console.log(this.state.current_Email);
    }

    NetworkSensor = async () => {
        await this.setState({
            timeFlag: true,
            isLoading: false
        })
        // alert('network error')
    }

    reauthenticate = (password) => {
        var user = firebase.auth().currentUser;
        var cred = firebase.auth.EmailAuthProvider.credential(
            user.email, password);
        return user.reauthenticateWithCredential(cred);
    }

    async update() {
        const { current_Email, old_Email, new_Email, confirm_Email, password } = this.state
        console.log(old_Email);
        if (old_Email == "") {
            this.setState({ alertContent: 'Please input your current Email.', isModalVisible: true })
        } else if (old_Email != current_Email) {
            this.setState({ alertContent: 'Please input your current Email correctly.', isModalVisible: true })
        } else if (new_Email == "") {
            this.setState({ alertContent: 'Please input your new Email.', isModalVisible: true })
        } else if (reg.test(new_Email) === false) {
            this.setState({ alertContent: 'Email type error, Please type again', isModalVisible: true })
        } else if (confirm_Email != new_Email) {
            this.setState({ alertContent: "Email doesn't match", isModalVisible: true })
        } else {
            this.setState({ isLoading: true })
            this.reauthenticate(password).then(() => {
                var user = firebase.auth().currentUser;
                user.updateEmail(new_Email).then(() => {
                    this.setState({ isLoading: false })
                    this.upload_Email(new_Email);
                    this.setState({ isModalVisible1: true })
                    setTimeout(() => {
                        this.setState({ isModalVisible1: false })
                        this.props.navigation.goBack();
                    }, 2000)
                }).catch((error) => {
                    console.log(error);
                    this.setState({ isLoading: false })
                    if (error.message == "The email address is already in use by another account.") {
                        this.setState({ alertContent: 'The email address is already in use by another account.', isModalVisible: true })
                    }
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

    upload_Email = async (Email) => {
        try {
            await firebase.database().ref('user/' + this.state.userId + '/' + this.state.usertype).update({
                email: Email,
            });
        } catch (error) {
            console.log(error)
        }

    }

    render() {
        const { Email } = this.state
        return (
            <KeyboardAwareScrollView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <Modal isVisible={this.state.isModalVisible}>
                        <AlertModal alertContent={this.state.alertContent} onPress={() => this.setState({ isModalVisible: false })} />
                    </Modal>
                    <Modal isVisible={this.state.isModalVisible1}>
                        <View style={{ ...styles.modalView, backgroundColor: 'white' }}>
                            <Image source={require('../../assets/iamges/CannaGo.png')} resizeMode='stretch' style={{ width: 80, height: 80, marginBottom: 20 }} />
                            <Text style={{ ...styles.Description1, fontSize: 20, color: "#61D273", fontFamily: 'Poppins-Regular', width: '90%' }}>Email was changed successfully.</Text>
                        </View>
                    </Modal>
                    <ScrollView style={{ width: '100%' }}>
                        <View style={styles.container}>
                            <Spinner
                                visible={this.state.isLoading}
                                textContent={'Updating Email...'}
                                textStyle={{ color: 'white' }}
                            />
                            <View style={{ width: '100%', alignItems: 'center', marginTop: Platform.OS == 'ios' ? 40 : 20 }}>
                                <TouchableOpacity style={styles.backBtn} onPress={() => { this.props.navigation.goBack() }}>
                                    <Image source={require('../../assets/iamges/backImage.png')} resizeMode='stretch' style={styles.backImage} />
                                </TouchableOpacity>
                            </View>
                            <Image source={require('../../assets/iamges/forgpwdImage.png')} resizeMode='stretch' style={{ ...styles.logoImage, marginTop: 150 }} />
                            <Text style={styles.forgpwdTxt}>You are changing your account Email</Text>
                            <View style={styles.inputArea}>
                                <View style={styles.inputItem}>
                                    <Image source={require('../../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                                    <TextInput onChangeText={value => this.setState({ old_Email: value })} style={styles.inputTxt} placeholderTextColor="#7a7a7b" placeholder="Enter Old Email"></TextInput>
                                </View>
                                <View style={styles.inputItem}>
                                    <Image source={require('../../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                                    <TextInput onChangeText={value => this.setState({ new_Email: value })} style={styles.inputTxt} placeholderTextColor="#7a7a7b" placeholder="Enter New Email"></TextInput>
                                </View>
                                <View style={styles.inputItem}>
                                    <Image source={require('../../assets/iamges/email.png')} resizeMode='stretch' style={styles.InputImage} />
                                    <TextInput onChangeText={value => this.setState({ confirm_Email: value })} style={styles.inputTxt} placeholderTextColor="#7a7a7b" placeholder="Re-Type New Email"></TextInput>
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
)(ChangeEmailScreen);
