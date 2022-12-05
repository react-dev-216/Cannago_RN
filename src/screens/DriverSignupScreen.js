import React, { Component, useCallback } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import dayjs from 'dayjs';
import RNFetchBlob from "react-native-fetch-blob";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-community/async-storage';
import MonthPicker from 'react-native-month-year-picker';
import moment from 'moment';
import Firebase from 'firebase';
import { styles } from '../components/styles'
import RNPickerSelect from "react-native-picker-select";
import NonImage from '../assets/iamges/emptyPerson.png'
import uncheckImage from '../assets/iamges/uncheckImage.png'
import checkImage from '../assets/iamges/checkImage.png'
import AlertModal from '../components/AlertModal'

import states from '../components/US_state'

const options = {
    title: 'Choose Photo',
    takePhotoButtonTitle: 'Take photo with your camera',
    chooseFromLibraryButtonTitle: 'Choose photo from library'
}

const { screenWidth, screenHeight } = Dimensions.get('window')

const DEFAULT_OUTPUT_FORMAT = 'MM/YYYY';

let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
let reg_strong = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,30}$/;

export default class DriverSignUpScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            avatarSource: NonImage,
            ischecked: false,
            checkImage: checkImage,
            uncheckImage: uncheckImage,
            //state for driver license
            showFrontImageDocument: false,
            resultFrontImageDocument: '',
            showBackImageDocument: false,
            resultBackImageDocument: '',
            showImageFace: false,
            resultImageFace: '',
            showSuccessFrame: false,
            successFrame: '',
            results: '',
            licenseKeyErrorMessage: '',
            firstName: '',
            img_url: '',
            lastName: '',
            isTimeVisible: false,
            birthday: '',
            ageFlag: false,
            birthdayYear: '',
            age: '',
            email: '',
            password: '',
            conPassword: '',
            phoneNum: '',
            vehicleName: '',
            vehicleModel: '',
            vehicleColor: '',
            vehicleLicense: '',
            taxInfo: '',
            isModalVisible: false,
            timeFlag: false,
            isloading: false,
            loggedIn: false,
            isImageUploading: false,
            licenseState: '',
            licenseNumber: '',
            licenseExpiration: '',
            userType: "driver",
            isExpirationTimeVisible: false,
            userId: '',
            userData: '',
            isConsumer: false,
            isDispensary: false,
            isDriver: false,
            vehicleYear: '',
            insuranceProvider: '',
            insurance: '',
            InsuranceExpiration: '',
            isflag: true,
            date: new Date(),
            insuranceDate: new Date(),
            isInsuranceTimeVisible: false,
        };
    }

    // chooseImage = () => {
    //   ImagePicker.showImagePicker(options, async (response) => {
    //       console.log('Response = ', response);
    //       if (response.didCancel) {
    //           console.log('User cancelled image picker');
    //       } else if (response.error) {
    //           console.log('ImagePicker Error: ', response.error);
    //       } else {
    //           console.log(response.uri)
    //           const source = { uri: response.uri };
    //           const URL = response.data;
    //       }
    //   });
    // }

    componentDidMount = () => {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('didFocus', async () => {

        });
    }

    componentWillUnmount() {
        this.focusListener.remove();
    }

    chooseImage = async () => {
        ImagePicker.showImagePicker(options, response => {

            if (response.didCancel) {
                console.log("User cancelled image picker");
            } else if (response.error) {
                console.log("ImagePicker Error: ", response.error);
            } else {
                const source = { uri: response.uri };
                // console.log(response.data);
                const Blob = RNFetchBlob.polyfill.Blob;    //firebase image upload
                const fs = RNFetchBlob.fs;
                window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
                window.Blob = Blob;

                const Fetch = RNFetchBlob.polyfill.Fetch
                // replace built-in fetch
                window.fetch = new Fetch({
                    auto: true,
                    binaryContentTypes: [
                        'image/',
                        'video/',
                        'audio/',
                        'foo/',
                    ]
                }).build()

                let uploadBlob = null;

                var path = Platform.OS === "ios" ? response.uri.replace("file://", "") : response.uri

                var d = new Date();
                var _name = d.getHours() + d.getMinutes() + d.getSeconds() + 'img.jpg';

                fs.readFile(path, "base64")
                    .then(data => {
                        //console.log(data);
                        let mime = "image/jpg";
                        return Blob.build(data, { type: `${mime};BASE64` });
                    })
                    .then(blob => {
                        this.setState({ isImageUploading: true })
                        uploadBlob = blob;
                        Firebase
                            .storage()
                            .ref("ProfileImages/" + _name)
                            .put(blob)
                            .then(() => {
                                uploadBlob.close();
                                return Firebase
                                    .storage()
                                    .ref("ProfileImages/" + _name)
                                    .getDownloadURL();
                            })
                            .then(async uploadedFile => {
                                await this.setState({ img_url: uploadedFile })
                                this.setState({ isImageUploading: false })
                                this.setState({ isModalVisible12: true })
                                setTimeout(() => {
                                    this.setState({ isModalVisible12: false })
                                }, 2000)
                            })
                            .catch(error => {
                                console.log({ error });
                            });
                    });

                this.setState({
                    avatarSource: source
                });
            }
        });
    };

    checkfun = async () => {
        await this.setState({ ischecked: !this.state.ischecked });
    }

    SingUp = () => {
        const { firstName, lastName, birthday, ageFlag, phoneNum, email, vehicleYear, insuranceProvider, insurance, InsuranceExpiration, zipCode, password, conPassword, img_url, userType, age, ischecked, licenseExpiration, licenseState, licenseNumber, taxInfo, vehicleName, vehicleColor, vehicleModel, vehicleLicense } = this.state;
        if (img_url == "") {
            this.setState({ alertContent: 'Please Select Profile Image.', isModalVisible: true })
        }
        else if (firstName == "") {
            this.setState({ alertContent: 'Please input first name.', isModalVisible: true })
        } else if (lastName == "") {
            this.setState({ alertContent: 'Please input last name.', isModalVisible: true })
        } else if (birthday == "") {
            this.setState({ alertContent: 'Please select your birthday.', isModalVisible: true })
        } else if (email == "") {
            this.setState({ alertContent: 'Please input email address.', isModalVisible: true })
        } else if (reg.test(email) === false) {
            this.setState({ alertContent: 'Email type error, Please type again.', isModalVisible: true })
        } else if (password == "") {
            this.setState({ alertContent: 'Please input your password.', isModalVisible: true })
        } else if (reg_strong.test(password) === false) {
            this.setState({ isModalVisible6: true })
        } else if (password != conPassword) {
            this.setState({ alertContent: "Password doesn't match.", isModalVisible: true })
        } else if (phoneNum == "") {
            this.setState({ alertContent: 'Please input phone number.', isModalVisible: true })
        } else if (licenseNumber == "") {
            this.setState({ alertContent: 'Please input driver license number.', isModalVisible: true })
        } else if (licenseState == "") {
            this.setState({ alertContent: 'Please input driver license state.', isModalVisible: true })
        } else if (licenseExpiration == "") {
            this.setState({ alertContent: 'Please input driver license expiration.', isModalVisible: true })
        } else if (vehicleName == "") {
            this.setState({ alertContent: 'Please input vehicle name.', isModalVisible: true })
        } else if (vehicleModel == "") {
            this.setState({ alertContent: 'Please input vehicle model.', isModalVisible: true })
        } else if (vehicleColor == "") {
            this.setState({ alertContent: 'Please input vehicle color.', isModalVisible: true })
        } else if (vehicleYear == "") {
            this.setState({ alertContent: 'Please input vehicle year.', isModalVisible: true })
        } else if (vehicleLicense == "") {
            this.setState({ alertContent: 'Please input vehicle license plate number.', isModalVisible: true })
        } else if (insuranceProvider == "") {
            this.setState({ alertContent: 'Please input insurance provider.', isModalVisible: true })
        } else if (insurance == "") {
            this.setState({ alertContent: 'Please input insurance #.', isModalVisible: true })
        } else if (InsuranceExpiration == "") {
            this.setState({ alertContent: 'Please input insurance exp .', isModalVisible: true })
        } else if (taxInfo == "") {
            this.setState({ alertContent: 'Please input tax information.', isModalVisible: true })
        } else if (ischecked == false) {
            this.setState({ alertContent: 'You need to agree our Terms and Conditions.', isModalVisible: true })
        }
        else {
            // var myTimer = setTimeout(function () { this.NetworkSensor() }.bind(this), 25000)
            this.setState({ isLoading: true })
            try {
                Firebase
                    .auth()
                    .createUserWithEmailAndPassword(email, password)
                    .then(async (res) => {
                        AsyncStorage.setItem('Loggined', "Success");
                        AsyncStorage.setItem('userUid', res.user.uid);
                        await this.setState({ userId: res.user.uid })
                        this.setState({ isLoading: false })
                        // clearTimeout(myTimer)
                        var user = Firebase.auth().currentUser;
                        Firebase.database().ref('user/' + res.user.uid + '/driver').update({
                            email: email,
                            fristName: firstName,
                            lastName: lastName,
                            phoneNum: phoneNum,
                            password: password,
                            profileimage: img_url,
                            userType: userType,
                            birthday: birthday,
                            age: age,
                            licenseNumber: licenseNumber,
                            licenseState: licenseState,
                            licenseExpiration: licenseExpiration,
                            vehicleName: vehicleName,
                            vehicleModel: vehicleModel,
                            vehicleColor: vehicleColor,
                            vehicleLicense: vehicleLicense,
                            vehicleYear: vehicleYear,
                            insuranceProvider: insuranceProvider,
                            insurance: insurance,
                            InsuranceExpiration: InsuranceExpiration,
                            taxInfo: taxInfo,
                            availableBal: 0
                        });
                        this.setState({ isModalVisible17: true })
                        setTimeout(() => {
                            this.props.navigation.navigate('Driver')
                            this.setState({ isModalVisible17: false })
                        }, 2000)
                        // user.sendEmailVerification().then(function () {
                        //   console.log('email sent!!!');// Email sent.
                        //   this.showAlert("Created new account successfully! please check your email! if you login, you need email verification.");
                        // }.bind(this)).catch(function (error) {
                        //   console.log(error);
                        // });
                    }
                    )
                    .catch((error) => {
                        console.log(error)
                        if (error.message == "A network error (such as timeout, interrupted connection or unreachable host) has occurred.") {
                            this.setState({ alertContent: 'Your internet Connection is failed.', isModalVisible: true })
                        } else if (error.message == "The email address is already in use by another account." && this.state.isflag) {
                            Firebase.database()
                                .ref('user')
                                .on("value", async (snapshot) => {
                                    var data = []
                                    var row
                                    snapshot.forEach(element => {
                                        console.log(element)
                                        if (element.val().hasOwnProperty('driver')) {
                                            if (element.val().driver.email == email) {
                                                this.setState({ alertContent: 'The email address is already in use by another account.', isModalVisible: true })
                                            }
                                        } else {
                                            if (element.val().hasOwnProperty('consumer')) {
                                                console.log("consumer");
                                                if (element.val().consumer.email == email) {
                                                    console.log("consumerTrue");
                                                    this.setState({ userId: element.key, isConsumer: true })
                                                    console.log(this.state.userId);
                                                    AsyncStorage.setItem('userUid', element.key);
                                                    Firebase.database().ref('user/' + element.key + '/driver').set({
                                                        email: email,
                                                        fristName: firstName,
                                                        lastName: lastName,
                                                        phoneNum: phoneNum,
                                                        password: password,
                                                        profileimage: img_url,
                                                        userType: userType,
                                                        birthday: birthday,
                                                        age: age,
                                                        licenseNumber: licenseNumber,
                                                        licenseState: licenseState,
                                                        licenseExpiration: licenseExpiration,
                                                        vehicleName: vehicleName,
                                                        vehicleModel: vehicleModel,
                                                        vehicleColor: vehicleColor,
                                                        vehicleLicense: vehicleLicense,
                                                        vehicleYear: vehicleYear,
                                                        insuranceProvider: insuranceProvider,
                                                        insurance: insurance,
                                                        InsuranceExpiration: InsuranceExpiration,
                                                        taxInfo: taxInfo,
                                                        availableBal: 0
                                                    });
                                                    this.setState({ isModalVisible17: true, isflag: false })
                                                    setTimeout(() => {
                                                        this.props.navigation.navigate('Driver')
                                                        this.setState({ isModalVisible17: false })
                                                    }, 2000)
                                                }
                                            }
                                            if (element.val().hasOwnProperty('dispensary')) {
                                                console.log("dispensaryoooooooooooooo");
                                                if (element.val().dispensary.email == email) {
                                                    console.log("dispensaryTrue");
                                                    this.setState({ userId: element.key, isDispensary: true })
                                                    AsyncStorage.setItem('userUid', element.key);
                                                    Firebase.database().ref('user/' + element.key + '/driver').set({
                                                        email: email,
                                                        fristName: firstName,
                                                        lastName: lastName,
                                                        phoneNum: phoneNum,
                                                        password: password,
                                                        profileimage: img_url,
                                                        userType: userType,
                                                        birthday: birthday,
                                                        age: age,
                                                        licenseNumber: licenseNumber,
                                                        licenseState: licenseState,
                                                        licenseExpiration: licenseExpiration,
                                                        vehicleName: vehicleName,
                                                        vehicleModel: vehicleModel,
                                                        vehicleColor: vehicleColor,
                                                        vehicleLicense: vehicleLicense,
                                                        vehicleYear: vehicleYear,
                                                        insuranceProvider: insuranceProvider,
                                                        insurance: insurance,
                                                        InsuranceExpiration: InsuranceExpiration,
                                                        taxInfo: taxInfo,
                                                        availableBal: 0
                                                    });
                                                    this.setState({ isModalVisible17: true, isflag: false })
                                                    setTimeout(() => {
                                                        this.props.navigation.navigate('Driver')
                                                        this.setState({ isModalVisible17: false })
                                                    }, 2000)
                                                }
                                            }
                                        }
                                    });
                                    // console.log("_____________+++++++++++++_________________");
                                    // await this.setState({
                                    //     userData: data,
                                    // });
                                    // console.log(this.state.userData);
                                })
                        }
                        this.setState({ isLoading: false })
                    })
            }
            catch (error) {
                console.log(error.toString())
            }
        }

    }

    _onChangeStatus = (value) => {
        this.setState({ licenseState: value })
    };

    handleTimePicker = async (date) => {
        await this.setState({ birthday: dayjs(date).format('MM/DD/YYYY') })
        await this.setState({ birthdayYear: dayjs(date).format('YYYY') })
        await this.setState({ birthdayMonth: dayjs(date).format('MM') })
        await this.setState({ birthdayDate: dayjs(date).format('DD') })
        console.log("__________");
        console.log(this.state.birthdayMonth)
        this.setState({ isTimeVisible: false })
        var currentDay = new Date();
        var currentYear = currentDay.getFullYear();
        var currentMonth = currentDay.getMonth();
        console.log(currentDay);
        var currentDate = currentDay.getDate();
        var yearDif = currentYear - this.state.birthdayYear;
        console.log("__________");
        console.log(yearDif);
        var monDif = currentMonth + 1 - this.state.birthdayMonth;
        console.log(monDif);
        var dateDif = currentDate - this.state.birthdayDate;
        console.log(dateDif);
        if (monDif == 0) {
            if (dateDif >= 0) {
                await this.setState({ age: yearDif })
                console.log(this.state.age);
            } else {
                await this.setState({ ageFlag: true })
                await this.setState({ age: yearDif - 1 })
                console.log(this.state.age);
            }
        } else if (monDif < 0) {
            await this.setState({ age: yearDif - 1 })
            console.log(this.state.age);
        } else {
            await this.setState({ age: yearDif })
            console.log(this.state.age);
        }
    }
    hideTimePicker = () => {
        this.setState({ isTimeVisible: false })
    }

    handleTimePicker2 = async (date) => {
        await this.setState({ InsuranceExpiration: dayjs(date).format('MM/DD/YYYY') })
        this.setState({ isInsuranceTimeVisible: false })
    }

    hideTimePicker2 = () => {
        this.setState({ isInsuranceTimeVisible: false })
    }

    handleTimePicker1 = async (event, newDate) => {
        console.log("++++++++++++++++++++")
        console.log(newDate)
        const selectedDate = newDate || this.state.date;
        await this.setState({ licenseExpiration: moment(selectedDate).format(DEFAULT_OUTPUT_FORMAT) })
        await this.setState({ isExpirationTimeVisible: false })
    }

    insuranceTimePicker1 = async (event, newDate) => {
        console.log("++++++++++++++++++++")
        console.log(newDate)
        const selectedDate = newDate || this.state.insuranceDate;
        await this.setState({ InsuranceExpiration: moment(selectedDate).format(DEFAULT_OUTPUT_FORMAT) })
        await this.setState({ isInsuranceTimeVisible: false })
    }

    hideTimePicker1 = () => {
        this.setState({ isExpirationTimeVisible: false })
    }

    render() {
        const self = this;
        return (
            <View style={{ flex: 1, height: screenHeight }}>
                {self.state.isExpirationTimeVisible && (
                    <MonthPicker
                        onChange={self.handleTimePicker1}
                        value={self.state.date}
                        minimumDate={new Date()}
                        maximumDate={new Date(2050, 12)}
                        locale="en"
                        mode="full"
                        okButton="Confirm"
                        cancelButton="Abort"
                    />
                )}
                {/* {self.state.isInsuranceTimeVisible && (
                    <MonthPicker
                        onChange={self.insuranceTimePicker1}
                        value={self.state.insuranceDate}
                        minimumDate={new Date()}
                        maximumDate={new Date(2050, 12)}
                        locale="en"
                        mode="full"
                        okButton="Confirm"
                        cancelButton="Abort"
                    />
                )} */}
                <KeyboardAwareScrollView style={{ flex: 1, height: screenHeight }}>
                    <View style={styles.container}>
                        <ScrollView style={{ width: '100%', flex: 1 }}>
                            <View style={styles.container}>
                                <Spinner
                                    visible={this.state.isLoading}
                                    textContent={'Creating your account...'}
                                    textStyle={{ color: 'white' }}
                                />
                                <Spinner
                                    visible={this.state.isImageUploading}
                                    textContent={'Uploading profile image...'}
                                    textStyle={{ color: 'white' }}
                                />
                                <DateTimePickerModal
                                    isVisible={this.state.isTimeVisible}
                                    mode="date"
                                    onConfirm={(date) => { this.handleTimePicker(date) }}
                                    onCancel={this.hideTimePicker}
                                />
                                <DateTimePickerModal
                                    isVisible={this.state.isInsuranceTimeVisible}
                                    mode="date"
                                    onConfirm={(date) => { this.handleTimePicker2(date) }}
                                    onCancel={this.hideTimePicker2}
                                />
                                <Modal isVisible={this.state.isModalVisible}>
                                    <AlertModal alertContent={this.state.alertContent} onPress={() => this.setState({ isModalVisible: false })} />
                                </Modal>
                                <Modal isVisible={this.state.isModalVisible1}>
                                    <View style={{ ...styles.modalView, backgroundColor: 'white' }}>
                                        <Image source={require('../assets/iamges/CannaGo.png')} resizeMode='stretch' style={{ width: 80, height: 80, marginBottom: 20 }} />
                                        <Text style={{ ...styles.Description1, fontSize: 20, color: "#61D273", fontFamily: 'Poppins-Regular', width: '90%' }}>Password was changed successfully.</Text>
                                    </View>
                                </Modal>
                                <Modal isVisible={this.state.isModalVisible6}>
                                    <View style={styles.modalView1}>
                                        <Text style={styles.TitleTxt1}>OOPS!</Text>
                                        <View style={{ width: "95%", alignSelf: 'center' }}>
                                            <Text style={{ ...styles.Description, textAlign: 'center' }}>
                                                Password must contain following:
                                        </Text>
                                            <Text style={styles.Description1}>
                                                A lowercase letter{'\n'}
                                            A capital letter{'\n'}
                                            A number{'\n'}
                                            A special character{'\n'}
                                            Minimum 8 characters
                                        </Text>
                                        </View>
                                        <TouchableOpacity style={styles.QuitWorkout} onPress={() => this.setState({ isModalVisible6: false })}>
                                            <Text style={{ ...styles.Dismiss, color: 'white' }}>OK</Text>
                                        </TouchableOpacity>
                                    </View>
                                </Modal>
                                <Modal isVisible={this.state.isModalVisible12}>
                                    <View style={{ ...styles.modalView, backgroundColor: 'white' }}>
                                        <Image source={require('../assets/iamges/CannaGo.png')} resizeMode='stretch' style={{ width: 80, height: 80, marginBottom: 20 }} />
                                        <Text style={{ ...styles.Description1, fontSize: 20, color: "#61D273", fontFamily: 'Poppins-Regular' }}>Profile image is uploaded</Text>
                                    </View>
                                </Modal>
                                <Modal isVisible={this.state.isModalVisible17}>
                                    <View style={{ ...styles.modalView, backgroundColor: 'white' }}>
                                        <Image source={require('../assets/iamges/CannaGo.png')} resizeMode='stretch' style={{ width: 80, height: 80, marginBottom: 20 }} />
                                        <Text style={{ ...styles.Description1, fontSize: 20, color: "#61D273", fontFamily: 'Poppins-Regular' }}>Welcome to CannaGo App!</Text>
                                    </View>
                                </Modal>
                                <View style={{ width: '100%', alignItems: 'center', marginTop: 40 }}>
                                    <TouchableOpacity style={styles.backBtn} onPress={() => { this.props.navigation.goBack() }}>
                                        <Image source={require('../assets/iamges/backImage.png')} resizeMode='stretch' style={styles.backImage} />
                                    </TouchableOpacity>
                                    <View style={styles.personUploadgImage}>
                                        <View style={styles.personImageArea}>
                                            <View style={styles.personImageArea1}>
                                                <Image source={this.state.avatarSource} resizeMode='cover' style={styles.personImage} />
                                            </View>
                                        </View>
                                        <TouchableOpacity style={styles.addBtn} onPress={() => { this.chooseImage() }}>
                                            <Image source={require('../assets/iamges/addImage.png')} resizeMode='cover' style={styles.addImage} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={styles.inputArea}>
                                    <View style={styles.inputItem}>
                                        <Image source={require('../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                                        <TextInput style={styles.inputTxt} placeholderTextColor="#7a7a7b" placeholder="First Name" value={this.state.firstName} onChangeText={(text) => { this.setState({ firstName: text }) }}></TextInput>
                                    </View>
                                    <View style={styles.inputItem}>
                                        <Image source={require('../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                                        <TextInput style={styles.inputTxt} placeholderTextColor="#7a7a7b" placeholder="Last Name" value={this.state.lastName} onChangeText={(text) => { this.setState({ lastName: text }) }}></TextInput>
                                    </View>
                                    <TouchableOpacity style={styles.inputItem} onPress={() => { this.setState({ isTimeVisible: true, }) }}>
                                        <Image source={require('../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                                        <Text style={{ ...styles.inputTxt, color: this.state.birthday == "" ? "#7a7a7b" : "#000" }}>{this.state.birthday == "" ? "Date of Birth" : this.state.birthday}</Text>
                                        <Image source={require('../assets/iamges/down-left.png')} resizeMode='stretch' style={styles.downarror} />
                                    </TouchableOpacity>
                                    <View style={styles.inputItem}>
                                        <Image source={require('../assets/iamges/email.png')} resizeMode='stretch' style={styles.InputImage} />
                                        <TextInput style={styles.inputTxt} placeholderTextColor="#7a7a7b" placeholder="Email Address" value={this.state.email} onChangeText={(text) => { this.setState({ email: text }) }}></TextInput>
                                    </View>
                                    <View style={styles.inputItem}>
                                        <Image source={require('../assets/iamges/password.png')} resizeMode='stretch' style={styles.InputImage1} />
                                        <TextInput secureTextEntry={true} style={styles.inputTxt} placeholderTextColor="#7a7a7b" placeholder="Password" value={this.state.password} onChangeText={(text) => { this.setState({ password: text }) }}></TextInput>
                                    </View>
                                    <View style={styles.inputItem}>
                                        <Image source={require('../assets/iamges/password.png')} resizeMode='stretch' style={styles.InputImage1} />
                                        <TextInput secureTextEntry={true} style={styles.inputTxt} placeholderTextColor="#7a7a7b" placeholder="Retype password" value={this.state.conPassword} onChangeText={(text) => { this.setState({ conPassword: text }) }}></TextInput>
                                    </View>
                                    <View style={styles.inputItem}>
                                        <Image source={require('../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                                        <TextInput style={styles.inputTxt} keyboardType='phone-pad' placeholderTextColor="#7a7a7b" placeholder="Mobile Number" value={this.state.phoneNum} onChangeText={(text) => { this.setState({ phoneNum: text }) }}></TextInput>
                                    </View>
                                    <View style={styles.inputItem}>
                                        <Image source={require('../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                                        <TextInput style={styles.inputTxt} maxLength={7} placeholderTextColor="#7a7a7b" placeholder="Driver's License Number" value={this.state.licenseNumber} onChangeText={(text) => { this.setState({ licenseNumber: text }) }}></TextInput>
                                    </View>
                                    {Platform.OS == 'ios' ?
                                        <View style={styles.inputItem}>
                                            <Image source={require('../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                                            <View style={{ width: '75%', marginLeft: '5%' }}>
                                                <RNPickerSelect
                                                    placeholder={{ label: "Driver's License State" }}
                                                    value={this.state.licenseState}
                                                    onValueChange={(value) => {
                                                        this._onChangeStatus(value);
                                                    }}
                                                    items={states}
                                                />
                                            </View>
                                            {/* <Text style={styles.selectTxt}>Closed</Text> */}
                                            <Image source={require('../assets/iamges/arrowdown.png')} resizeMode='stretch' style={{ position: 'absolute', right: 20, width: 20, height: 20 }} />
                                        </View> :
                                        <View style={styles.inputItem}>
                                            <Image source={require('../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                                            {/* <TextInput style={styles.inputTxt} placeholderTextColor="#7a7a7b" placeholder="Driver's License State" value={this.state.licenseState} onChangeText={(text) => { this.setState({ licenseState: text }) }}></TextInput> */}
                                            <View style={{ width: '86%', marginLeft: '-9%' }}>
                                                <RNPickerSelect
                                                    placeholder={{ label: "Driver's License State" }}
                                                    placeholderTextColor="red"
                                                    value={this.state.licenseState}
                                                    onValueChange={(value) => {
                                                        this._onChangeStatus(value);
                                                    }}
                                                    style={{
                                                        inputIOS: {
                                                            fontSize: 16,
                                                            paddingVertical: 12,
                                                            paddingHorizontal: 10,
                                                            borderWidth: 1,
                                                            borderColor: 'gray',
                                                            borderRadius: 4,
                                                            color: 'black',
                                                            paddingRight: 30, // to ensure the text is never behind the icon
                                                            // transform: [
                                                            //     { scaleX: 1.5 },
                                                            //     { scaleY: 1.5 },
                                                            // ]
                                                        },
                                                        inputAndroid: {
                                                            fontSize: 7,
                                                            placeholder: {
                                                                color: 'red',
                                                            },
                                                            color: 'black',
                                                            fontFamily: 'Poppins',
                                                            // paddingRight: 30, // to ensure the text is never behind the icon
                                                            transform: [
                                                                { scaleX: 0.8 },
                                                                { scaleY: 0.8 },
                                                            ]
                                                        },
                                                    }}

                                                    items={states}
                                                    Icon={() => {
                                                        return <Image source={require('../assets/iamges/arrowdown.png')} resizeMode='stretch' style={{ width: 20, height: 23, position: 'absolute', top: 12, right: 0 }} />
                                                    }}
                                                />
                                            </View>
                                            {/* <Image source={require('../assets/iamges/down-left.png')} resizeMode='stretch' style={styles.downarror} /> */}
                                        </View>
                                    }
                                    <TouchableOpacity style={styles.inputItem} onPress={() => { this.setState({ isExpirationTimeVisible: true, }) }}>
                                        <Image source={require('../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                                        <Text style={{ ...styles.inputTxt, color: this.state.licenseExpiration == "" ? "#7a7a7b" : "#000" }}>{this.state.licenseExpiration == "" ? "Driver's License Expiration" : this.state.licenseExpiration}</Text>
                                        <Image source={require('../assets/iamges/down-left.png')} resizeMode='stretch' style={styles.downarror} />
                                    </TouchableOpacity>
                                    <View style={styles.SignInfoArea}>
                                        <Text style={styles.SignInfoTxt}>Vehicle Information</Text>
                                    </View>
                                    <View style={styles.inputItem}>
                                        <Image source={require('../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                                        <TextInput style={styles.inputTxt} placeholderTextColor="#7a7a7b" placeholder="Vehicle Name" value={this.state.vehicleName} onChangeText={(text) => { this.setState({ vehicleName: text }) }}></TextInput>
                                    </View>
                                    <View style={styles.inputItem}>
                                        <Image source={require('../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                                        <TextInput style={styles.inputTxt} placeholderTextColor="#7a7a7b" placeholder="Vehicle Model" value={this.state.vehicleModel} onChangeText={(text) => { this.setState({ vehicleModel: text }) }}></TextInput>
                                    </View>
                                    <View style={styles.inputItem}>
                                        <Image source={require('../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                                        <TextInput style={styles.inputTxt} placeholderTextColor="#7a7a7b" placeholder="Vehicle Color" value={this.state.vehicleColor} onChangeText={(text) => { this.setState({ vehicleColor: text }) }}></TextInput>
                                    </View>
                                    <View style={styles.inputItem}>
                                        <Image source={require('../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                                        <TextInput style={styles.inputTxt} keyboardType='phone-pad' placeholderTextColor="#7a7a7b" placeholder="Vehicle Year" value={this.state.vehicleYear} onChangeText={(text) => { this.setState({ vehicleYear: text }) }}></TextInput>
                                    </View>
                                    <View style={styles.inputItem}>
                                        <Image source={require('../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                                        <TextInput style={styles.inputTxt} placeholderTextColor="#7a7a7b" maxLength={7} placeholder="Vehicle License Plate Number" value={this.state.vehicleLicense} onChangeText={(text) => { this.setState({ vehicleLicense: text }) }}></TextInput>
                                    </View>
                                    <View style={styles.inputItem}>
                                        <Image source={require('../assets/iamges/insuranceIcon.png')} resizeMode='stretch' style={styles.InputImage2} />
                                        <TextInput style={styles.inputTxt} placeholderTextColor="#7a7a7b" placeholder="Insurance Provider" value={this.state.insuranceProvider} onChangeText={(text) => { this.setState({ insuranceProvider: text }) }}></TextInput>
                                    </View>
                                    <View style={styles.inputItem}>
                                        <Image source={require('../assets/iamges/insuranceIcon.png')} resizeMode='stretch' style={styles.InputImage2} />
                                        <TextInput style={styles.inputTxt} placeholderTextColor="#7a7a7b" placeholder="Insurance #" value={this.state.insurance} onChangeText={(text) => { this.setState({ insurance: text }) }}></TextInput>
                                    </View>
                                    {/* <TouchableOpacity style={styles.inputItem} onPress={() => { this.setState({ isInsuranceTimeVisible: true, }) }}>
                                        <Image source={require('../assets/iamges/insuranceIcon.png')} resizeMode='stretch' style={styles.InputImage2} />
                                        <Text style={{ ...styles.inputTxt, color: this.state.InsuranceExpiration == "" ? "#7a7a7b" : "#000" }}>{this.state.InsuranceExpiration == "" ? " Insurance Exp " : this.state.InsuranceExpiration}</Text>
                                        <Image source={require('../assets/iamges/down-left.png')} resizeMode='stretch' style={styles.downarror} />
                                    </TouchableOpacity> */}
                                    <TouchableOpacity style={styles.inputItem} onPress={() => { this.setState({ isInsuranceTimeVisible: true, }) }}>
                                        <Image source={require('../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                                        <Text style={{ ...styles.inputTxt, color: this.state.InsuranceExpiration == "" ? "#7a7a7b" : "#000" }}>{this.state.InsuranceExpiration == "" ? " Insurance Exp " : this.state.InsuranceExpiration}</Text>
                                        <Image source={require('../assets/iamges/down-left.png')} resizeMode='stretch' style={styles.downarror} />
                                    </TouchableOpacity>
                                    <View style={styles.SignInfoArea}>
                                        <Text style={styles.SignInfoTxt}>Tax Information</Text>
                                    </View>
                                    <View style={styles.inputItem}>
                                        <Image source={require('../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                                        <TextInput style={styles.inputTxt} placeholderTextColor="#7a7a7b" placeholder="1099 Agreement" value={this.state.taxInfo} onChangeText={(text) => { this.setState({ taxInfo: text }) }}></TextInput>
                                    </View>
                                    <View style={styles.TermsArea}>
                                        <TouchableOpacity style={styles.forgotBtn1} onPress={() => { this.checkfun() }}>
                                            <Image source={this.state.ischecked ? this.state.checkImage : this.state.uncheckImage} resizeMode='stretch' style={styles.uncheckImage} />
                                        </TouchableOpacity>
                                        <Text style={styles.termsTxt}>By checking this I agree to CannaGo's  </Text>
                                        <TouchableOpacity style={styles.forgotBtn1}>
                                            <Text style={{ color: '#61D273', fontSize: 10, fontFamily: 'Poppins-Regular' }}>Terms & Conditions</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <TouchableOpacity style={styles.signinBtn} onPress={() => this.SingUp()}>
                                        <Text style={styles.signinTxt1}>Create Account</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{ height: 50 }}></View>
                        </ScrollView>
                    </View>
                </KeyboardAwareScrollView>
            </View>
        );
    }
}
