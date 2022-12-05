import React, { Component } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, TextInput, Platform, Dimensions } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import dayjs from 'dayjs';
import { styles } from '../../components/styles'
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-community/async-storage';
import Firebase from 'firebase';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import RNPickerSelect from "react-native-picker-select";
import MonthPicker from 'react-native-month-year-picker';
import AlertModal from '../../components/AlertModal'
import states from '../../components/US_state'
import moment from 'moment';

import NonImage from '../../assets/iamges/personImage.png'
import uncheckImage from '../../assets/iamges/uncheckImage.png'
import checkImage from '../../assets/iamges/checkImage.png'

const options = {
    title: 'Choose Photo',
    takePhotoButtonTitle: 'Take photo with your camera',
    chooseFromLibraryButtonTitle: 'Choose photo from library'
}

const { screenWidth, screenHeight } = Dimensions.get('window')

const DEFAULT_OUTPUT_FORMAT = 'MM/YYYY';

export default class DriverInformationScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            usertype: 'consumer',
            firstName: '',
            lastName: '',
            email: '',
            phoneNum: '',
            password: '',
            profileimage: '',
            age: '',
            ageFlag: false,
            fein: '',
            userId: "",
            isloading: false,
            isModalVisible1: false,
            isModalVisible2: false,
            timeFlag: false,
            birthday: '',
            vehicleName: '',
            vehicleModel: '',
            vehicleColor: '',
            vehicleLicense: '',
            licenseState: '',
            licenseNumber: '',
            licenseExpiration: '',
            vehicleYear: '',
            insuranceProvider: '',
            insurance: '',
            InsuranceExpiration: '',
            isExpirationTimeVisible: false,
            isInsuranceTimeVisible: false,
            date: new Date(),
            insuranceDate: new Date(),
        };
    }

    componentDidMount = async () => {
        const usertype = await AsyncStorage.getItem("usertype");
        const userId = await AsyncStorage.getItem("userUid");
        await this.setState({ userId: userId })
        await this.setState({ usertype: usertype });
        Firebase.database()
            .ref('user/' + this.state.userId + '/driver')
            .on("value", async (snapshot) => {
                user_data = {
                    email: snapshot.val().email,
                    fristName: snapshot.val().fristName,
                    lastName: snapshot.val().lastName,
                    phoneNum: snapshot.val().phoneNum,
                    password: snapshot.val().password,
                    profileimage: snapshot.val().img_url,
                    userType: snapshot.val().userType,
                    birthday: snapshot.val().birthday,
                    age: snapshot.val().age,
                    licenseNumber: snapshot.val().licenseNumber,
                    licenseState: snapshot.val().licenseState,
                    licenseExpiration: snapshot.val().licenseExpiration,
                    vehicleName: snapshot.val().vehicleName,
                    vehicleModel: snapshot.val().vehicleModel,
                    vehicleColor: snapshot.val().vehicleColor,
                    vehicleLicense: snapshot.val().vehicleLicense,
                    vehicleYear: snapshot.val().vehicleYear,
                    insuranceProvider: snapshot.val().insuranceProvider,
                    insurance: snapshot.val().insurance,
                    InsuranceExpiration: snapshot.val().InsuranceExpiration,
                    taxInfo: snapshot.val().taxInfo,
                    availableBal: snapshot.val().availableBal
                    // data.push(row)
                };
                console.log("================================");
                console.log(user_data);
                await this.setState({
                    email: user_data.email,
                    firstName: user_data.fristName,
                    lastName: user_data.lastName,
                    phoneNum: user_data.phoneNum,
                    password: user_data.password,
                    profileimage: user_data.img_url,
                    userType: user_data.userType,
                    birthday: user_data.birthday,
                    age: user_data.age,
                    licenseNumber: user_data.licenseNumber,
                    licenseState: user_data.licenseState,
                    licenseExpiration: user_data.licenseExpiration,
                    vehicleName: user_data.vehicleName,
                    vehicleModel: user_data.vehicleModel,
                    vehicleColor: user_data.vehicleColor,
                    vehicleLicense: user_data.vehicleLicense,
                    vehicleYear: user_data.vehicleYear,
                    insuranceProvider: user_data.insuranceProvider,
                    insurance: user_data.insurance,
                    InsuranceExpiration: user_data.InsuranceExpiration,
                    taxInfo: user_data.taxInfo,
                    availableBal: user_data.availableBal
                })
            })
    }

    handleTimePicker = async (date) => {
        await this.setState({ birthday: dayjs(date).format('MM/DD/YYYY') })
        await this.setState({ birthdayYear: dayjs(date).format('YYYY') })
        await this.setState({ birthdayMonth: dayjs(date).format('MM') })
        await this.setState({ birthdayDate: dayjs(date).format('DD') })
        console.log(this.state.birthdayDate)
        this.setState({ isTimeVisible: false })
        var currentDay = new Date();
        var currentYear = currentDay.getFullYear();
        var currentMonth = currentDay.getMonth();
        var currentDate = currentDay.getDate();
        var yearDif = currentYear - this.state.birthdayYear;
        console.log(yearDif);
        var monDif = currentMonth + 1 - this.state.birthdayMonth;
        var dateDif = currentDate - this.state.birthdayDate;
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

    async update() {
        const { firstName, lastName, birthday, ageFlag, phoneNum, insuranceProvider, insurance, vehicleYear, InsuranceExpiration, email, zipCode, password, conPassword, img_url, userType, age, ischecked, licenseExpiration, licenseState, licenseNumber, taxInfo, vehicleName, vehicleColor, vehicleModel, vehicleLicense } = this.state;
        this.setState({ isLoading: true })
        try {
            await Firebase.database()
                .ref('user/' + this.state.userId + '/driver')
                .update({
                    email: email,
                    fristName: firstName,
                    lastName: lastName,
                    phoneNum: phoneNum,
                    password: password,
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
                });
            this.setState({ isLoading: false })
            this.setState({ isModalVisible1: true })
            setTimeout(() => {
                this.setState({ isModalVisible1: false })
                this.props.navigation.navigate("ProfileScreen")
            }, 3000)
        } catch (error) {
            console.log(error)
            this.setState({ isLoading: true })
        }
    }

    checkfun = async () => {
        await this.setState({ ischecked: !this.state.ischecked });
    }

    _onChangeStatus = (value) => {
        this.setState({ licenseState: value })
    };

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
                                    visible={this.state.isloading}
                                    textContent={'Updating profile infomation...'}
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
                                <Modal isVisible={this.state.isModalVisible1}>
                                    <View style={{ ...styles.modalView, backgroundColor: 'white' }}>
                                        <Image source={require('../../assets/iamges/CannaGo.png')} resizeMode='stretch' style={{ width: 80, height: 80, marginBottom: 20 }} />
                                        <Text style={{ ...styles.Description1, fontSize: 20, color: "#61D273", fontFamily: 'Poppins-Regular' }}>Profile informations are updated.</Text>
                                    </View>
                                </Modal>
                                <View style={{ width: '100%', alignItems: 'center', marginTop: Platform.OS == 'ios' ? 40 : 20 }}>
                                    <TouchableOpacity style={{ alignItems: 'flex-start', width: '100%', marginTop: 10 }} onPress={() => { this.props.navigation.goBack() }}>
                                        <Image source={require('../../assets/iamges/backImage.png')} resizeMode='stretch' style={styles.backImage} />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.inputArea}>
                                    <View style={styles.inputItem}>
                                        <Image source={require('../../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                                        <TextInput style={styles.inputTxt} placeholderTextColor="#7a7a7b" placeholder="First Name" value={this.state.firstName} onChangeText={(text) => { this.setState({ firstName: text }) }}></TextInput>
                                    </View>
                                    <View style={styles.inputItem}>
                                        <Image source={require('../../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                                        <TextInput style={styles.inputTxt} placeholderTextColor="#7a7a7b" placeholder="Last Name" value={this.state.lastName} onChangeText={(text) => { this.setState({ lastName: text }) }}></TextInput>
                                    </View>
                                    <TouchableOpacity style={styles.inputItem} onPress={() => { this.setState({ isTimeVisible: true, }) }}>
                                        <Image source={require('../../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                                        <Text style={{ ...styles.inputTxt, color: this.state.birthday == "" ? "#7a7a7b" : "#000" }}>{this.state.birthday == "" ? "Date of Birth" : this.state.birthday}</Text>
                                        <Image source={require('../../assets/iamges/down-left.png')} resizeMode='stretch' style={styles.downarror} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.inputItem} onPress={() => { this.props.navigation.navigate("ChangeEmailScreen", { email: this.state.email, password: this.state.password }) }}>
                                        <Image source={require('../../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                                        <Text style={{ ...styles.inputTxt }}>{this.state.email}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.inputItem} onPress={() => { this.props.navigation.navigate("ChangePasswordScreen", { passoword: this.state.password }) }}>
                                        <Image source={require('../../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                                        <Text style={{ ...styles.inputTxt }}>Update Password</Text>
                                    </TouchableOpacity>
                                    <View style={styles.inputItem}>
                                        <Image source={require('../../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                                        <TextInput style={styles.inputTxt} keyboardType='phone-pad' placeholderTextColor="#7a7a7b" placeholder="Mobile Number" value={this.state.phoneNum} onChangeText={(text) => { this.setState({ phoneNum: text }) }}></TextInput>
                                    </View>
                                    <View style={styles.inputItem}>
                                        <Image source={require('../../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                                        <TextInput style={styles.inputTxt} keyboardType='number-pad' placeholderTextColor="#7a7a7b" placeholder="Driver's License Number" value={this.state.licenseNumber} onChangeText={(text) => { this.setState({ licenseNumber: text }) }}></TextInput>
                                    </View>
                                    {Platform.OS == 'ios' ?
                                        <View style={styles.inputItem}>
                                            <Image source={require('../../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
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
                                            <Image source={require('../../assets/iamges/arrowdown.png')} resizeMode='stretch' style={{ position: 'absolute', right: 20, width: 20, height: 20 }} />
                                        </View> :
                                        <View style={styles.inputItem}>
                                            <Image source={require('../../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
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
                                                        return <Image source={require('../../assets/iamges/arrowdown.png')} resizeMode='stretch' style={{ width: 20, height: 23, position: 'absolute', top: 12, right: 0 }} />
                                                    }}
                                                />
                                            </View>
                                            {/* <Image source={require('../assets/iamges/down-left.png')} resizeMode='stretch' style={styles.downarror} /> */}
                                        </View>
                                    }
                                    <TouchableOpacity style={styles.inputItem} onPress={() => { this.setState({ isExpirationTimeVisible: true, }) }}>
                                        <Image source={require('../../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                                        <Text style={{ ...styles.inputTxt, color: this.state.licenseExpiration == "" ? "#7a7a7b" : "#000" }}>{this.state.licenseExpiration == "" ? "Driver's License Expiration" : this.state.licenseExpiration}</Text>
                                        <Image source={require('../../assets/iamges/down-left.png')} resizeMode='stretch' style={styles.downarror} />
                                    </TouchableOpacity>
                                    <View style={styles.SignInfoArea}>
                                        <Text style={styles.SignInfoTxt}>Vehicle Information</Text>
                                    </View>
                                    <View style={styles.inputItem}>
                                        <Image source={require('../../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                                        <TextInput style={styles.inputTxt} placeholderTextColor="#7a7a7b" placeholder="Vehicle Name" value={this.state.vehicleName} onChangeText={(text) => { this.setState({ vehicleName: text }) }}></TextInput>
                                    </View>
                                    <View style={styles.inputItem}>
                                        <Image source={require('../../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                                        <TextInput style={styles.inputTxt} placeholderTextColor="#7a7a7b" placeholder="Vehicle Model" value={this.state.vehicleModel} onChangeText={(text) => { this.setState({ vehicleModel: text }) }}></TextInput>
                                    </View>
                                    <View style={styles.inputItem}>
                                        <Image source={require('../../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                                        <TextInput style={styles.inputTxt} placeholderTextColor="#7a7a7b" placeholder="Vehicle Color" value={this.state.vehicleColor} onChangeText={(text) => { this.setState({ vehicleColor: text }) }}></TextInput>
                                    </View>
                                    <View style={styles.inputItem}>
                                        <Image source={require('../../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                                        <TextInput style={styles.inputTxt} keyboardType='phone-pad' placeholderTextColor="#7a7a7b" placeholder="Vehicle Year" value={this.state.vehicleYear} onChangeText={(text) => { this.setState({ vehicleYear: text }) }}></TextInput>
                                    </View>
                                    <View style={styles.inputItem}>
                                        <Image source={require('../../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                                        <TextInput style={styles.inputTxt} placeholderTextColor="#7a7a7b" keyboardType="number-pad" placeholder="Vehicle License Plate Number" value={this.state.vehicleLicense} onChangeText={(text) => { this.setState({ vehicleLicense: text }) }}></TextInput>
                                    </View>
                                    <View style={styles.inputItem}>
                                        <Image source={require('../../assets/iamges/insuranceIcon.png')} resizeMode='stretch' style={styles.InputImage2} />
                                        <TextInput style={styles.inputTxt} placeholderTextColor="#7a7a7b" placeholder="Insurance Provider" value={this.state.insuranceProvider} onChangeText={(text) => { this.setState({ insuranceProvider: text }) }}></TextInput>
                                    </View>
                                    <View style={styles.inputItem}>
                                        <Image source={require('../../assets/iamges/insuranceIcon.png')} resizeMode='stretch' style={styles.InputImage2} />
                                        <TextInput style={styles.inputTxt} placeholderTextColor="#7a7a7b" placeholder="Insurance #" value={this.state.insurance} onChangeText={(text) => { this.setState({ insurance: text }) }}></TextInput>
                                    </View>
                                    {/* <TouchableOpacity style={styles.inputItem} onPress={() => { this.setState({ isInsuranceTimeVisible: true, }) }}>
                                        <Image source={require('../../assets/iamges/insuranceIcon.png')} resizeMode='stretch' style={styles.InputImage2} />
                                        <Text style={{ ...styles.inputTxt, color: this.state.InsuranceExpiration == "" ? "#7a7a7b" : "#000" }}>{this.state.InsuranceExpiration == "" ? " Insurance Exp " : this.state.InsuranceExpiration}</Text>
                                        <Image source={require('../../assets/iamges/down-left.png')} resizeMode='stretch' style={styles.downarror} />
                                    </TouchableOpacity> */}
                                    <TouchableOpacity style={styles.inputItem} onPress={() => { this.setState({ isInsuranceTimeVisible: true, }) }}>
                                        <Image source={require('../../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                                        <Text style={{ ...styles.inputTxt, color: this.state.InsuranceExpiration == "" ? "#7a7a7b" : "#000" }}>{this.state.InsuranceExpiration == "" ? " Insurance Exp " : this.state.InsuranceExpiration}</Text>
                                        <Image source={require('../../assets/iamges/down-left.png')} resizeMode='stretch' style={styles.downarror} />
                                    </TouchableOpacity>
                                    <View style={styles.SignInfoArea}>
                                        <Text style={styles.SignInfoTxt}>Tax Information</Text>
                                    </View>
                                    <View style={styles.inputItem}>
                                        <Image source={require('../../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                                        <TextInput style={styles.inputTxt} placeholderTextColor="#7a7a7b" placeholder="1099 Agreement" value={this.state.taxInfo} onChangeText={(text) => { this.setState({ taxInfo: text }) }}></TextInput>
                                    </View>
                                    <TouchableOpacity style={{ ...styles.signinBtn, backgroundColor: '#3EA3E1', width: 128, alignSelf: 'center', marginTop: 20 }} onPress={() => { this.update() }}>
                                        <Text style={styles.signinTxt1}>Update</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{ height: 150 }}></View>
                        </ScrollView>
                    </View>
                </KeyboardAwareScrollView>
            </View >
        );
    }
}
