import React, { Component } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Firebase from '../../config/firebase';
import Modal from 'react-native-modal';
import Spinner from 'react-native-loading-spinner-overlay';
import { styles } from '../components/styles'

import { func, string, bool, object, array } from "prop-types";
import { connect } from "react-redux";
import { load, userInfo } from "./../store/reducers/user";

const consumers_logo = require('../assets/iamges/logo.png');
const driver_logo = require('../assets/iamges/driver_logo.png');
const seller_logo = require('../assets/iamges/seller_log.png');
var usertype = "consumer";

let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
let reg_strong = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,30}$/;

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logo_image: consumers_logo,
      logo_title: 'for consumers',
      isConsumers: true,
      isDriver: false,
      isDispensaries: false,
      email: '',
      password: '',
      isModalVisible1: false,
      isModalVisible2: false,
      isModalVisible3: false,
      isModalVisible4: false,
      isModalVisible5: false,
      isModalVisible6: false,
      isModalVisible7: false,
      isModalVisible8: false,
      isModalVisible9: false,
      timeFlag: false,
      isloading: false,
      loggedIn: false,
      userUid: ''
    };
    this.gotoMain = this.gotoMain.bind(this)
  }

  componentDidMount = async () => {
    await AsyncStorage.setItem('usertype', "consumer");
  }

  NetworkSensor = async () => {
    await this.setState({
      timeFlag: true,
      isLoading: false
    })
    this.setState({ isModalVisible5: true })
  }

  changefirst = () => {
    if (this.state.isConsumers) {
      this.change_logo(3)
    } else {
      this.change_logo(1)
    }
  }

  changeSecond = async () => {
    if (!this.state.isDispensaries) {
      this.change_logo(2)
    } else {
      this.change_logo(3)
    }
  }

  change_logo = async (logo_num) => {
    switch (logo_num) {
      case 1:
        await this.setState({ isDispensaries: false, isDriver: false, isConsumers: true })
        await AsyncStorage.setItem('usertype', "consumer");
        this.ChangeState();
        break;
      case 2:
        await this.setState({ isDispensaries: true, isDriver: false, isConsumers: false })
        this.ChangeState();
        await AsyncStorage.setItem('usertype', "dispensary");
        break;
      case 3:
        await this.setState({ isDispensaries: false, isDriver: true, isConsumers: false })
        this.ChangeState();
        await AsyncStorage.setItem('usertype', "driver");
        break;
    }
    usertype = (await AsyncStorage.getItem("usertype")).toString();
  }

  ChangeState = async () => {
    if (this.state.isDispensaries) {
      await this.setState({ logo_image: seller_logo, logo_title: 'for dispensaries' })
    } else if (this.state.isDriver) {
      await this.setState({ logo_image: driver_logo, logo_title: 'for drivers' })
    } else if (this.state.isConsumers) {
      await this.setState({ logo_image: consumers_logo, logo_title: 'for consumers' })
    }
  }



  gotoSignUp = () => {
    if (this.state.isDispensaries) {
      this.props.navigation.navigate("DispensariesSignupScreen")
    } else if (this.state.isDriver) {
      this.props.navigation.navigate("DriverSignupScreen")
    } else if (this.state.isConsumers) {
      this.props.navigation.navigate("SignUpScreen")
    }
  }

  routing = () => {
    const { email, password } = this.state
    const self = this;
    if (email == "") {
      self.setState({ isModalVisible1: true })
    } else if (reg.test(email) === false) {
      self.setState({ isModalVisible2: true })
    } else if (password == "") {
      self.setState({ isModalVisible3: true })
    } else {
      // var myTimer = setTimeout(function () { self.NetworkSensor() }.bind(self), 25000)
      self.setState({ isLoading: true })
      Firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function (user) {
          self.setState({ userId: user.user.uid })
          AsyncStorage.setItem('Loggined', "Success");
          AsyncStorage.setItem('userUid', user.user.uid);
          const { load, userInfo } = self.props
          var data = []
          var user_info
          var user_row
          var row
          // Firebase.database()
          //   .ref('Items/' + user.user.uid)
          //   .once("value")
          //   .then(snapshot => {
          //     snapshot.forEach(element => {
          //       row = {
          //         Description: element.val().Description,
          //         GpriceValue: element.val().GpriceValue,
          //         Tag: element.val().Tag,
          //         feeValue: element.val().feeValue,
          //         id: element.val().id,
          //         itemImage: element.val().itemImage,
          //         itemNum1: element.val().itemNum1,
          //         priceValue: element.val().priceValue,
          //         productName: element.val().productName
          //       }
          //       data.push(row)
          //     });
          //     // console.log(data)
          //     load(data)
          //   });

          // Firebase.database()
          //   .ref('user/' + user.user.uid)
          //   .once("value", snapshot => {
          //     console.log(snapshot)
          //     user_info
          //     user_row = {
          //       companyName: snapshot.val().companyName,
          //       email: snapshot.val().email,
          //       fein: snapshot.val().fein,
          //       phoneNum: snapshot.val().phoneNum,
          //       firstName: snapshot.val().fristName,
          //       lastName: snapshot.val().lastName,
          //       password: snapshot.val().password,
          //       profileimage: snapshot.val().profileimage,
          //       storeAddress: snapshot.val().storeStreetAdress,
          //       storeName: snapshot.val().storeName,
          //       storeHours: snapshot.val().storeHours,
          //       storePhoneNum: snapshot.val().storePhoneNum,
          //       userType: snapshot.val().userType,
          //       availableBal: snapshot.val().availableBal,
          //       GA: snapshot.val().GA,
          //       zipCode: snapshot.val().zipCode,
          //     }
          //     user_info = user_row;
          //     // console.log(data)
          //     userInfo(user_info)
          // });

          self.setState({ isLoading: false })
          // clearTimeout(myTimer)
          // self.setState({ isModalVisible6: true })
          // setTimeout(() => {
          //   self.props.navigation.navigate('Main', { userUid: self.state.userUid })
          //   self.setState({ isModalVisible6: false })
          // }, 2000)
          self.login()
        })
        .catch((error) => {
          console.log(error.message)
          if (error.message == "A network error (such as timeout, interrupted connection or unreachable host) has occurred.") {
            this.setState({ isModalVisible9: true })
          }
          if (error.message == "There is no user record corresponding to this identifier. The user may have been deleted.") {
            this.setState({ isModalVisible8: true })
          }
          if (error.message == "The password is invalid or the user does not have a password.") {
            this.setState({ isModalVisible7: true })
          }
          self.setState({ isLoading: false })
        })
    }
  }

  login = () => {
    const self = this;
    if (self.state.isDriver === true) {
      self.setState({ isModalVisible6: true })
      setTimeout(() => {
        self.props.navigation.navigate('Driver', { userUid: self.state.userUid })
        self.setState({ isModalVisible6: false })
      }, 2000)
    } else if (self.state.isDispensaries === true) {
      self.setState({ isModalVisible6: true })
      setTimeout(() => {
        self.props.navigation.navigate('Main', { userUid: self.state.userUid })
        self.setState({ isModalVisible6: false })
      }, 2000)
    } else {
      Firebase.database()
        .ref("Carts/" + this.state.userId)
        .once("value")
        .then(async (snapshot) => {
          var data = []
          var row
          snapshot.forEach(element => {
            row = {
              "storeId": element.val().storeId,
            }
            data.push(row)
          });
          console.log("_____________+++++++++++++_________________");
          await this.setState({
            storeId: data[0].storeId,
          });
          console.log("================+++++++++++++_________________");
          // console.log(this.state.storeId[0].storeId)
          console.log(this.state.storeId)
          this.loadStatus();
        })
        .catch(error => {
          self.setState({ isModalVisible6: true })
          setTimeout(() => {
            self.props.navigation.navigate('Main', { userUid: self.state.userUid })
            self.setState({ isModalVisible6: false })
          }, 2000)
        })
    }
  }

  loadStatus = () => {
    const self = this;
    Firebase.database()
      .ref("OrderItems/" + this.state.storeId + '/' + this.state.userId)
      .once("value")
      .then(async (snapshot) => {
        console.log("cart++++++++++")
        console.log(snapshot)
        var row
        row = {
          orderItem: snapshot.val().orderItem,
          placeDate: snapshot.val().placeDate,
          placeStatus: snapshot.val().placeStatus,
          confirmDate: snapshot.val().confirmDate,
          confirmStatus: snapshot.val().confirmStatus,
          deliveryDate: snapshot.val().deliveryDate,
          deliveryStatus: snapshot.val().deliveryStatus,
          dropDate: snapshot.val().dropDate,
          dropStatus: snapshot.val().dropStatus,
          AllPrice: snapshot.val().AllPrice,
        }
        await this.setState({ orderStatus: row })
        if (this.state.orderStatus.placeStatus == true && this.state.orderStatus.dropStatus == true) {
          self.setState({ isModalVisible6: true })
          setTimeout(() => {
            self.props.navigation.navigate('Main', { userUid: self.state.userUid })
            self.setState({ isModalVisible6: false })
          }, 2000)
        } else {
          self.setState({ isModalVisible6: true })
          setTimeout(() => {
            self.props.navigation.navigate('OrderStatus', { userUid: self.state.userUid })
            self.setState({ isModalVisible6: false })
          }, 2000)
        }
      })
      .catch(error => {
        self.setState({ isModalVisible6: true })
        setTimeout(() => {
          self.props.navigation.navigate('Main', { userUid: self.state.userUid })
          self.setState({ isModalVisible6: false })
        }, 2000)
      })
  }

  gotoMain() {
    console.log("sdfsdfsdfdfdfdfdf++++++++++++++++++")
    // return this.props.navigation.navigate('Main')
  }

  render() {
    return (
      <View style={styles.container}>
        <Spinner
          visible={this.state.isLoading}
          textContent={'Logging in...'}
          textStyle={{ color: 'white' }}
        />
        <ScrollView style={{ width: '100%' }}>
          <View style={styles.container}>
            <Image source={this.state.logo_image} resizeMode='stretch' style={styles.logoImage} />
            <Text style={styles.logoTxt}>{this.state.logo_title}</Text>
            <View style={styles.inputArea}>
              <View style={styles.inputItem}>
                <Image source={require('../assets/iamges/email.png')} resizeMode='stretch' style={styles.InputImage} />
                <TextInput style={styles.inputTxt} placeholderTextColor="#7a7a7b" placeholder={this.state.isDispensaries ? "Owner's Email Address" : "Email Address"} onChangeText={(text) => { this.setState({ email: text }) }}></TextInput>
              </View>
              <View style={styles.inputItem}>
                <Image source={require('../assets/iamges/password.png')} resizeMode='stretch' style={styles.InputImage1} />
                <TextInput secureTextEntry={true} style={styles.inputTxt} placeholderTextColor="#7a7a7b" placeholder="Password" onChangeText={(text) => { this.setState({ password: text }) }}></TextInput>
              </View>
              <TouchableOpacity style={styles.forgotBtn} onPress={() => this.props.navigation.navigate("ForgotPasswordScreen")}>
                <Text style={{ fontFamily: 'Poppins-Regular', color: '#7E7E7E', fontSize: 13 }}>Forgot Password?</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.signinBtn} onPress={() => { this.routing() }}>
                <Text style={styles.signinTxt1}>Sign in</Text>
              </TouchableOpacity>
              <Text style={styles.dontaccountTxt}>Don't have an account?</Text>
              <TouchableOpacity style={{ ...styles.forgotBtn, alignItems: 'center', marginTop: 5 }} onPress={() => { this.gotoSignUp() }}>
                <Text style={styles.signinTxt}>Sign up</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputArea}>
              <TouchableOpacity style={styles.wantBtn} onPress={() => { this.changefirst() }}>
                <Text style={styles.wantTxt}>{this.state.isConsumers ? "Want to drive with us?" : "Want to buy from us?"}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.wantBtn} onPress={() => { this.changeSecond() }}>
                <Text style={styles.wantTxt}>{!this.state.isDispensaries ? "Want to sell with us?" : "Want to drive with us?"}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ height: 50 }}></View>
        </ScrollView>
        <Modal isVisible={this.state.isModalVisible1}>
          <View style={styles.modalView}>
            <Text style={styles.TitleTxt1}>OOPS!</Text>
            <Text style={{...styles.Description, textAlign:'center'}}>Please input your email address</Text>
            <TouchableOpacity style={styles.QuitWorkout} onPress={() => this.setState({ isModalVisible1: false })}>
              <Text style={{ ...styles.Dismiss, color: 'white' }}>OK</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <Modal isVisible={this.state.isModalVisible2}>
          <View style={styles.modalView}>
            <Text style={styles.TitleTxt1}>OOPS!</Text>
            <Text style={{...styles.Description, textAlign:'center'}}>Email type error, Please type again</Text>
            <TouchableOpacity style={styles.QuitWorkout} onPress={() => this.setState({ isModalVisible2: false })}>
              <Text style={{ ...styles.Dismiss, color: 'white' }}>OK</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <Modal isVisible={this.state.isModalVisible3}>
          <View style={styles.modalView}>
            <Text style={styles.TitleTxt1}>OOPS!</Text>
            <Text style={{...styles.Description, textAlign:'center'}}>Please input your password</Text>
            <TouchableOpacity style={styles.QuitWorkout} onPress={() => this.setState({ isModalVisible3: false })}>
              <Text style={{ ...styles.Dismiss, color: 'white' }}>OK</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <Modal isVisible={this.state.isModalVisible4}>
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
            <TouchableOpacity style={styles.QuitWorkout} onPress={() => this.setState({ isModalVisible4: false })}>
              <Text style={{ ...styles.Dismiss, color: 'white' }}>OK</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <Modal isVisible={this.state.isModalVisible5}>
          <View style={styles.modalView}>
            <Text style={styles.TitleTxt1}>OOPS!</Text>
            <Text style={{...styles.Description, textAlign:'center'}}>Email or password is wrong</Text>
            <TouchableOpacity style={styles.QuitWorkout} onPress={() => this.setState({ isModalVisible5: false })}>
              <Text style={{ ...styles.Dismiss, color: 'white' }}>OK</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <Modal isVisible={this.state.isModalVisible6}>
          <View style={{ ...styles.modalView, backgroundColor: 'white' }}>
            <Image source={require('../assets/iamges/CannaGo.png')} resizeMode='stretch' style={{ width: 80, height: 80, marginBottom: 20 }} />
            <Text style={{ ...styles.Description1, fontSize: 20, color: "#61D273", fontFamily: 'Poppins-Regular' }}>Welcome back to CannaGo App!</Text>
          </View>
        </Modal>
        <Modal isVisible={this.state.isModalVisible7}>
          <View style={styles.modalView}>
            <Text style={styles.TitleTxt1}>OOPS!</Text>
            <Text style={{ ...styles.Description, textAlign: 'center' }}>You have entered the wrong email or password. Please try again.</Text>
            {/* <Text style={{ ...styles.Description, marginTop: -10 }}></Text> */}
            <TouchableOpacity style={styles.QuitWorkout} onPress={() => this.setState({ isModalVisible7: false })}>
              <Text style={{ ...styles.Dismiss, color: 'white' }}>OK</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <Modal isVisible={this.state.isModalVisible8}>
          <View style={styles.modalView}>
            <Text style={styles.TitleTxt1}>OOPS!</Text>
            <Text style={{...styles.Description, textAlign:'center'}}>This email does not exist. Please create an account.</Text>
            {/* <Text style={{ ...styles.Description, marginTop: -25 }}></Text> */}
            <TouchableOpacity style={styles.QuitWorkout} onPress={() => this.setState({ isModalVisible8: false })}>
              <Text style={{ ...styles.Dismiss, color: 'white' }}>OK</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <Modal isVisible={this.state.isModalVisible9}>
          <View style={styles.modalView}>
            <Text style={styles.TitleTxt1}>OOPS!</Text>
            <Text style={{...styles.Description, textAlign:'center'}}>Your internet Connection is failed</Text>
            <TouchableOpacity style={styles.QuitWorkout} onPress={() => this.setState({ isModalVisible9: false })}>
              <Text style={{ ...styles.Dismiss, color: 'white' }}>OK</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  }
}

// LoginScreen.propTypes = {
//   load: func,
//   real_data: array,
// };

// const mapDispatchToProps = dispatch => ({
//   load: (data) => dispatch(load(data)),
//   userInfo: (user_info) => dispatch(userInfo(user_info)),
// });

// const mapStateToProps = ({ user }) => ({
//   real_data: user.real_data,
//   user_real_info: user.user_real_info
// });

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps,
// )(LoginScreen);
