import React, { Component } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Firebase from '../../../config/firebase'
import ImagePicker from 'react-native-image-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import Modal from 'react-native-modal';
import dayjs from 'dayjs';


import { styles } from '../../components/styles'


export default class ProfileInfoScreen extends Component {
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
      isDeactiveloading: false,
      isModalVisible1: false,
      isModalVisible2: false,
      isModalVisible3: false,
      isModalVisible4: false,
      isModalVisible5: false,
      isModalVisible17: false,
      timeFlag: false,
      birthday: ''
    };
  }

  componentDidMount = async () => {
    const usertype = await AsyncStorage.getItem("usertype");
    const userId = await AsyncStorage.getItem("userUid");
    await this.setState({ userId: userId })
    console.log(this.state.userId);
    await this.setState({ usertype: usertype });
    Firebase.database()
      .ref('user/' + this.state.userId + '/consumer')
      .on("value", async (snapshot) => {
        user_data = {
          email: snapshot.val().email,
          firstName: snapshot.val().fristName,
          lastName: snapshot.val().lastName,
          password: snapshot.val().password,
          phoneNum: snapshot.val().phoneNum,
          profileimage: snapshot.val().profileimage,
          userType: snapshot.val().userType,
          zipCode: snapshot.val().zipCode,
          age: snapshot.val().age,
          birthday: snapshot.val().birthday,
          // data.push(row)
        };
        console.log("================================");
        console.log(user_data);
        await this.setState({
          firstName: user_data.firstName,
          lastName: user_data.lastName,
          email: user_data.email,
          phoneNum: user_data.phoneNum,
          password: user_data.password,
          profileimage: user_data.profileimage,
          userType: user_data.userType,
          zipCode: user_data.zipCode,
          age: user_data.age,
          birthday: user_data.birthday,
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
    console.log(currentDate);
    var yearDif = currentYear - this.state.birthdayYear;
    var monDif = currentMonth + 1 - this.state.birthdayMonth;
    var dateDif = currentDate - this.state.birthdayDate;
    if (yearDif >= 22) {
      await this.setState({ ageFlag: true })
      console.log(this.state.ageFlag);
      if (monDif == 0) {
        if (dateDif >= 0) {
          await this.setState({ ageFlag: true })
          await this.setState({ age: yearDif })
          console.log(this.state.age);
        } else {
          await this.setState({ ageFlag: true })
          await this.setState({ age: yearDif - 1 })
          console.log(this.state.age);
        }
      } else if (monDif < 0) {
        await this.setState({ ageFlag: true })
        await this.setState({ age: yearDif - 1 })
        console.log(this.state.age);
      } else {
        await this.setState({ ageFlag: true })
        await this.setState({ age: yearDif })
        console.log(this.state.age);
      }
    } else if (yearDif == 21) {
      if (monDif == 0) {
        if (dateDif >= 0) {
          await this.setState({ ageFlag: true })
          await this.setState({ age: yearDif })
          console.log(this.state.age);
        } else {
          await this.setState({ ageFlag: false })
          await this.setState({ age: yearDif - 1 })
          console.log(this.state.age);
        }
      } else if (monDif < 0) {
        await this.setState({ ageFlag: false })
        await this.setState({ age: yearDif - 1 })
        console.log(this.state.age);
      } else {
        await this.setState({ ageFlag: true })
        await this.setState({ age: yearDif })
        console.log(this.state.age);
      }
    } else {
      await this.setState({ ageFlag: false })
      console.log(this.state.ageFlag);
    }
  }
  hideTimePicker = () => {
    this.setState({ isTimeVisible: false })
  }

  async update() {
    const { firstName, lastName, email, phoneNum, userType, birthday, age, ageFlag } = this.state
    if (ageFlag == false) {
      this.setState({ isModalVisible2: true })
    } else {
      this.setState({ isLoading: true })
      try {
        await Firebase.database()
          .ref('user/' + this.state.userId + '/consumer')
          .update({
            fristName: firstName,
            lastName: lastName,
            phoneNum: phoneNum,
            userType: userType,
            age: age,
            birthday: birthday,
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
  }

  deactiveAccount = async () => {
    const self = this
    var user = Firebase.auth().currentUser;
    var userUid = Firebase.auth().currentUser.uid
    self.setState({ isDeactiveloading: true })
    user.delete().then(function () {
      AsyncStorage.setItem('Loggined', "");
      AsyncStorage.setItem("userUid", "")
      AsyncStorage.setItem("usertype", "")
      self.setState({ isDeactiveloading: false })
      setTimeout(() => {
        self.setState({ isModalVisible17: true })
      }, 500);
      setTimeout(() => {
        self.props.navigation.navigate('LoginScreen')
        self.setState({ isModalVisible17: false })
      }, 2500)
      self.setState({ isModalVisible4: false })
      Firebase.database().ref('user/' + userUid).remove();
    }, function (error) {
      console.log(error);
      self.setState({ isDeactiveloading: false })
      if (error.message == "This operation is sensitive and requires recent authentication. Log in again before retrying this request.") {
        self.setState({ isModalVisible4: false })
        setTimeout(() => {
          self.setState({ isModalVisible5: true })
        }, 500);
      }
      self.setState({ isDeactiveloading: false })
    });
  }

  confirm = () => {
    this.setState({ isModalVisible3: false })
    setTimeout(() => {
      this.setState({ isModalVisible4: true })
    }, 500);
  }

  render() {
    const { profileimage, firstName, password, lastName, age, phoneNum, email, availableBal, birthday, ageFlag } = this.state
    return (
      <View style={styles.container}>
        <ScrollView style={{ width: '100%' }}>
          <View style={styles.container}>
            <Spinner
              visible={this.state.isloading}
              textContent={'Updating profile infomation...'}
              textStyle={{ color: 'white' }}
            />
            <Spinner
              visible={this.state.isDeactiveloading}
              textContent={'Deactivating your account...'}
              textStyle={{ color: 'white' }}
            />
            <View style={{ width: '100%', alignItems: 'center', marginTop: Platform.OS == 'ios' ? 40 : 20 }}>
              <TouchableOpacity style={styles.backBtn} onPress={() => { this.props.navigation.goBack() }}>
                <Image source={require('../../assets/iamges/backImage.png')} resizeMode='stretch' style={styles.backImage} />
              </TouchableOpacity>
              <View style={styles.personUploadgImage}>
                <Text style={{ ...styles.inputTxt, color: '#707070', alignSelf: 'center', marginTop: 40, fontSize: 24 }}>Profile Information</Text>
                <Text style={{ ...styles.inputTxt, color: '#707070', alignSelf: 'center', marginTop: 70, fontSize: 18 }}>Welcome {firstName} {lastName}, {age}</Text>
              </View>
            </View>
            <View style={styles.inputArea}>
              <View style={{ flexDirection: 'row', width: '100%' }}>
                <View style={{ ...styles.inputItem, width: '48.5%', marginRight: '3%' }}>
                  <Image source={require('../../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                  <TextInput style={styles.inputTxt} placeholderTextColor="#7a7a7b" placeholder="First Name" value={this.state.firstName} onChangeText={(text) => { this.setState({ firstName: text }) }}></TextInput>
                </View>
                <View style={{ ...styles.inputItem, width: '48.5%' }}>
                  <Image source={require('../../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                  <TextInput style={styles.inputTxt} placeholderTextColor="#7a7a7b" placeholder="Last Name" value={this.state.lastName} onChangeText={(text) => { this.setState({ lastName: text }) }}></TextInput>
                </View>
              </View>
              <View style={{ ...styles.inputItem }}>
                <Image source={require('../../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                <TextInput keyboardType="phone-pad" style={styles.inputTxt} placeholderTextColor="#7a7a7b" placeholder="Phone Number" value={this.state.phoneNum} onChangeText={(text) => { this.setState({ phoneNum: text }) }}></TextInput>
              </View>
              <TouchableOpacity style={{ ...styles.inputItem }} onPress={() => { this.setState({ isTimeVisible: true, }) }}>
                <Image source={require('../../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                <Text style={{ ...styles.inputTxt }}>{birthday}</Text>
                <Image source={require('../../assets/iamges/down-left.png')} resizeMode='stretch' style={styles.downarror} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.inputItem} onPress={() => { this.props.navigation.navigate("ChangeEmailScreen", { email: email, password: password }) }}>
                <Image source={require('../../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                <Text style={{ ...styles.inputTxt }}>{email}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.inputItem} onPress={() => { this.props.navigation.navigate("ChangePasswordScreen", { passoword: password }) }}>
                <Image source={require('../../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                <Text style={{ ...styles.inputTxt }}>Change Password</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ ...styles.inputItem, borderColor: 'red', borderWidth: 0.5 }} onPress={() => { this.setState({ isModalVisible3: true }) }}>
                <Image source={require('../../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                <Text style={{ ...styles.inputTxt }}>Deactivate Account</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ ...styles.signinBtn, backgroundColor: '#3EA3E1', width: 128, alignSelf: 'center' }} onPress={() => { this.update() }}>
                <Text style={styles.signinTxt1}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ height: 150 }}></View>
          <DateTimePickerModal
            isVisible={this.state.isTimeVisible}
            mode="date"
            onConfirm={(date) => { this.handleTimePicker(date) }}
            onCancel={this.hideTimePicker}
          />
          <Modal isVisible={this.state.isModalVisible1}>
            <View style={{ ...styles.modalView, backgroundColor: 'white' }}>
              <Image source={require('../../assets/iamges/CannaGo.png')} resizeMode='stretch' style={{ width: 80, height: 80, marginBottom: 20 }} />
              <Text style={{ ...styles.Description1, fontSize: 20, color: "#61D273", fontFamily: 'Poppins-Regular' }}>Profile informations are updated.</Text>
            </View>
          </Modal>
          <Modal isVisible={this.state.isModalVisible2}>
            <View style={styles.modalView}>
              <Text style={styles.TitleTxt1}>OOPS!</Text>
              <Text style={{ ...styles.Description, textAlign: 'center', width: '90%' }}>Sorry, you have to be 21 years or older to use our service.</Text>
              <TouchableOpacity style={styles.QuitWorkout} onPress={() => this.setState({ isModalVisible2: false })}>
                <Text style={{ ...styles.Dismiss, color: 'white' }}>OK</Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <Modal isVisible={this.state.isModalVisible3}>
            <View style={styles.modalView}>
              <Text style={styles.TitleTxt1}>OOPS!</Text>
              <Text style={{ ...styles.Description, textAlign: 'center', width: '90%' }}>Are you sure you want to deactivate your CannaGo account?</Text>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={{ ...styles.QuitWorkout, marginHorizontal: 5 }} onPress={() => { this.confirm() }}>
                  <Text style={{ ...styles.Dismiss, color: 'white' }}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...styles.QuitWorkout, marginHorizontal: 5 }} onPress={() => this.setState({ isModalVisible3: false })}>
                  <Text style={{ ...styles.Dismiss, color: 'white' }}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <Modal isVisible={this.state.isModalVisible4}>
            <View style={{ ...styles.modalView, height: 250 }}>
              <Text style={styles.TitleTxt1}>OOPS!</Text>
              <Text style={{ ...styles.Description, textAlign: 'center', width: '90%' }}>Once you have deactivated your account you'll no longer have access to this account. Are you sure you want to move forward?</Text>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={{ ...styles.QuitWorkout, marginHorizontal: 5 }} onPress={() => { this.deactiveAccount() }}>
                  <Text style={{ ...styles.Dismiss, color: 'white' }}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...styles.QuitWorkout, marginHorizontal: 5 }} onPress={() => this.setState({ isModalVisible4: false })}>
                  <Text style={{ ...styles.Dismiss, color: 'white' }}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <Modal isVisible={this.state.isModalVisible5}>
            <View style={{ ...styles.modalView, height: 220 }}>
              <Text style={styles.TitleTxt1}>OOPS!</Text>
              <Text style={{ ...styles.Description, textAlign: 'center', width: '90%' }}>This operation is sensitive and requires recent authentication. Log in again before retrying this request.</Text>
              <TouchableOpacity style={styles.QuitWorkout} onPress={() => this.setState({ isModalVisible5: false })}>
                <Text style={{ ...styles.Dismiss, color: 'white' }}>OK</Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <Modal isVisible={this.state.isModalVisible17}>
            <View style={{ ...styles.modalView, backgroundColor: 'white' }}>
              <Image source={require('../../assets/iamges/CannaGo.png')} resizeMode='stretch' style={{ width: 80, height: 80, marginBottom: 20 }} />
              <Text style={{ ...styles.Description1, fontSize: 20, color: "#61D273", fontFamily: 'Poppins-Regular' }}>Your CannaGo account was deactivated successfully. Thanks for using our app.</Text>
            </View>
          </Modal>
        </ScrollView>
      </View>
    );
  }
}
