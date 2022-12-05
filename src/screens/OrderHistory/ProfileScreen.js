import React, { Component } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Modal from 'react-native-modalbox';
import Modal1 from 'react-native-modal';
import { Switch } from 'react-native-switch';
import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import RNFetchBlob from "react-native-fetch-blob";
import Firebase from '../../../config/firebase'

import { styles } from '../../components/styles'

import { func, string, bool, object, array } from "prop-types";
import { connect } from "react-redux";
import { load, userInfo, updateUserInfo } from "../../store/reducers/user";

import NonImage from '../../assets/iamges/storeImage1.png'
import uncheckImage from '../../assets/iamges/uncheckImage.png'
import checkImage from '../../assets/iamges/checkImage.png'

const options = {
  title: 'Choose Photo',
  takePhotoButtonTitle: 'Take photo with your camera',
  chooseFromLibraryButtonTitle: 'Choose photo from library',
  maxWidth: 500,
  maxHeight: 300,
  quality: 0.5
}

let today = '';
let today_day = '';
let today_Hour = '';
let today_minute = '';
let now_Mins = ''

class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatarSource: NonImage,
      ischecked: false,
      checkImage: checkImage,
      uncheckImage: uncheckImage,
      modalVisible: false,
      usertype: 'consumer',
      Checked: true,
      firstName: '',
      lastName: '',
      email: '',
      phoneNum: '',
      password: '',
      profileimage: '',
      storeName: '',
      age: '',
      storePhoneNum: '',
      storeAddress: '',
      storeHours: '',
      companyName: '',
      fein: '',
      userId: "",
      availableBal: 0,
      isModalVisible1: false,
      timeFlag: false,
      isloading: false,
    };
  }

  componentDidMount = async () => {
    today = new Date();
    today_day = today.getDay();
    today_Hour = today.getHours()
    today_minute = today.getMinutes();
    const { real_data, user_real_info } = this.props
    const usertype = await AsyncStorage.getItem("usertype");
    const userId = await AsyncStorage.getItem("userUid");
    await this.setState({ userId: userId })
    console.log(this.state.userId);
    await this.setState({ usertype: usertype });
    console.log("_______________+++++++++++++++++++++++________________")
    console.log(this.state.usertype)
    // Firebase.database()
    //   .ref('user/' + this.state.userId)
    //   .on("value", async (snapshot) => {
    //     user_data = {
    //       userType: snapshot.val().userType,
    //       // data.push(row)
    //     };
    //     await this.setState({
    //       usertype: user_data.userType,
    //     })
    //     console.log(this.state.usertype);
    //   })
    // await AsyncStorage.setItem('usertype', this.state.usertype);

    if (this.state.usertype == "dispensary") {
      Firebase.database()
        .ref('user/' + this.state.userId + '/dispensary')
        .on("value", async (snapshot) => {
          user_data = {
            GA: snapshot.val().GA,
            availableBal: snapshot.val().availableBal,
            companyName: snapshot.val().companyName,
            email: snapshot.val().email,
            fein: snapshot.val().fein,
            firstName: snapshot.val().fristName,
            lastName: snapshot.val().lastName,
            password: snapshot.val().password,
            phoneNum: snapshot.val().phoneNum,
            profileimage: snapshot.val().profileimage,
            storeHours: snapshot.val().storeHours,
            storeName: snapshot.val().storeName,
            storePhoneNum: snapshot.val().storePhoneNum,
            storeStreetAdress: snapshot.val().storeStreetAdress,
            userType: snapshot.val().userType,
            zipCode: snapshot.val().zipCode,
            city: snapshot.val().city,
          };
          console.log(user_data);
          await this.setState({
            firstName: user_data.firstName,
            lastName: user_data.lastName,
            email: user_data.email,
            phoneNum: user_data.phoneNum,
            password: user_data.password,
            storeName: user_data.storeName,
            storePhoneNum: user_data.storePhoneNum,
            storeHours: user_data.storeHours,
            storeAddress: user_data.storeAddress,
            companyName: user_data.companyName,
            fein: user_data.fein,
            profileimage: user_data.profileimage,
            userType: user_data.userType,
            zipCode: user_data.zipCode,
            storeStreetAdress: user_data.storeStreetAdress,
            city: user_data.city,
          })
        })
      console.log(this.state.profileimage);
      const { navigation } = this.props;
      this.focusListener = navigation.addListener('didFocus', () => {
        this.compareTime();
      });
      this.compareTime();
    } else if (this.state.usertype == "driver") {
      console.log("================================");
      Firebase.database()
        .ref('user/' + this.state.userId + '/driver')
        .on("value", async (snapshot) => {
          user_data = {
            email: snapshot.val().email,
            firstName: snapshot.val().fristName,
            lastName: snapshot.val().lastName,
            password: snapshot.val().password,
            phoneNum: snapshot.val().phoneNum,
            profileimage: snapshot.val().profileimage,
            userType: snapshot.val().userType,
            age: snapshot.val().age,
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
          })
        })
    } else if (this.state.usertype == "consumer") {
      console.log("================================");
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
            availableBal: snapshot.val().availableBal,
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
            availableBal: user_data.availableBal
          })
        })
    }

  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  compareTime = () => {
    now_Mins = today_Hour * 60 + today_minute
    console.log(now_Mins)
    if (this.state.userType == "dispensary" || this.state.userType == "driver") {
      this.state.storeHours.forEach(this.myFunction);
    }
  }

  myFunction = (item, index) => {
    if (index == today_day) {
      var start_Time = item.startTime.split(" ")[0]
      var end_Time = item.endTime.split(" ")[0]
      var start_Time_Mins = parseInt(start_Time.split(":")[0]) * 60 + parseInt(start_Time.split(":")[1])
      var end_Time_Mins = (parseInt(end_Time.split(":")[0]) + 12) * 60 + parseInt(end_Time.split(":")[1])
      console.log(start_Time_Mins)
      console.log(end_Time_Mins)
      if (now_Mins >= start_Time_Mins && now_Mins <= end_Time_Mins) {
        this.setState({ Checked: false })
      } else {
        this.setState({ Checked: true })
      }
    }
  }

  closeModal = () => {
    this.refs.modal6.close();
    // this.props.navigation.navigate('LoginScreen');
  }

  _onChangeSwitch() {
    this.setState({ Checked: !this.state.Checked })
  }

  NetworkSensor = async () => {
    await this.setState({
      timeFlag: true,
      isLoading: false
    })
    // alert('network error')
  }

  chooseImage = async () => {
    ImagePicker.showImagePicker(options, response => {
      console.log("Response = ", response.uri);

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
                console.log("++++++++++++");
                console.log({ uploadedFile });
                await this.setState({ img_url: uploadedFile })
                console.log(this.state.img_url);
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

  async update() {
    const { firstName, lastName, email, phoneNum, userType, profileimage, password, storeName, availableBal, storePhoneNum, storeAddress, storeHours, companyName, fein } = this.state
    var myTimer = setTimeout(function () { this.NetworkSensor() }.bind(this), 25000)
    if (this.state.usertype == "dispensary") {
      await Firebase.database().ref('user/' + this.state.userId + '/dispensary').update({
        profileimage: profileimage,
      });
    } else if (this.state.usertype == "consumer") {
      await Firebase.database().ref('user/' + this.state.userId + '/consumer').update({
        profileimage: profileimage,
      });
    } else if (this.state.usertype == "driver") {
      await Firebase.database().ref('user/' + this.state.userId + '/driver').update({
        profileimage: profileimage,
      });
    }

  }

  checkfun = async () => {
    await this.setState({ ischecked: !this.state.ischecked });
  }

  logOut = async () => {
    try {
      await Firebase.auth().signOut();
      await AsyncStorage.setItem('Loggined', "");
      await AsyncStorage.setItem("userUid", "")
      await AsyncStorage.setItem("usertype", "")
      await this.props.navigation.navigate('LoginScreen')
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    const { profileimage, firstName, lastName, age, availableBal } = this.state
    return (
      <View style={styles.container}>
        <Spinner
          visible={this.state.isLoading}
          textContent={'Updating store image...'}
          textStyle={{ color: 'white' }}
        />
        {this.state.usertype == "consumer" ?
          <ScrollView style={{ width: '100%' }}>
            <View style={styles.container}>
              <View style={{ width: '100%', alignItems: 'center', marginTop: Platform.OS == 'ios' ? 40 : 20 }}>
                {/* <Image source={{uri:this.state.img_url}} resizeMode='cover' style={styles.storeImage2} /> */}
                <View style={styles.personUploadgImage}>
                  <View style={styles.personImageArea}>
                    <View style={styles.personImageArea1}>
                      <Image source={{ uri: profileimage }} resizeMode='cover' style={styles.personImage} />
                    </View>
                  </View>
                  <TouchableOpacity style={{ ...styles.addBtn, bottom: 50 }} onPress={() => { this.chooseImage() }}>
                    <Image source={require('../../assets/iamges/addImage.png')} resizeMode='stretch' style={styles.addImage} />
                  </TouchableOpacity>
                  <Text style={{ ...styles.inputTxt, alignSelf: 'center', textAlign: "center", marginTop: 20 }}>{firstName} {lastName}, {age}</Text>
                </View>
              </View>
              <View style={{ ...styles.inputArea, marginTop: 2 }}>
                <TouchableOpacity style={styles.inputItem} onPress={() => { this.props.navigation.navigate("ProfileInfoScreen") }}>
                  <Image source={require('../../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                  <Text style={{ ...styles.inputTxt, color: '#7a7a7b' }}>Profile Information</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.inputItem} onPress={() => { this.props.navigation.navigate("OrderHistoryScreen") }}>
                  <Image source={require('../../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                  <Text style={{ ...styles.inputTxt, color: '#7a7a7b' }}>Order History</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.inputItem} onPress={() => this.refs.modal6.open()}>
                  <Image source={require('../../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                  <Text style={{ ...styles.inputTxt, color: '#7a7a7b' }}>Contact Support</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...styles.inputItem, borderColor: 'red', borderWidth: 0.5 }} onPress={() => { this.logOut() }}>
                  <Image source={require('../../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                  <Text style={{ ...styles.inputTxt, color: '#7a7a7b' }}>Log Out</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ height: 150 }}></View>
          </ScrollView> :
          this.state.usertype == "dispensary" ?
            <ScrollView style={{ width: '100%' }}>
              <View style={styles.container}>
                <View style={{ width: '100%', alignItems: 'center', marginTop: Platform.OS == 'ios' ? 40 : 20 }}>
                  <Text style={{ ...styles.DetailTitle, marginTop: 7, position: 'absolute' }}>Profile</Text>
                  <View style={styles.switchShadow}>
                    <Switch
                      value={this.state.Checked}
                      onValueChange={() => this._onChangeSwitch()}
                      disabled={false}
                      barHeight={30}
                      switchWidthMultiplier={2.5}
                      // outerCircleStyle={{ width: 30 }}
                      circleBorderWidth={0}
                      activeTextStyle={{ alignItems: "flex-end", color: "#878787", fontSize: 10, fontFamily: 'Poppins-Regular' }}
                      inactiveTextStyle={{ alignItems: "flex-start", color: "#878787", fontSize: 10, fontFamily: 'Poppins-Regular', marginLeft: 0, paddingLeft: 0 }}
                      activeText={'Offline'}
                      inActiveText={'Online'}
                      backgroundActive={'#FFF'}
                      backgroundInactive={'#FFF'}
                      changeValueImmediately={false}
                      renderInsideCircle={() => <View resizeMode='stretch' style={this.state.Checked ? styles.uncheck : styles.checkImage} />}
                      circleActiveColor={'#FFF'}
                      circleInActiveColor={'#FFF'}
                      switchLeftPx={5}
                      switchRightPx={5}
                    />
                  </View>
                  <View style={{ ...styles.storeUploadgImage, marginTop: 10, borderRadius: 10 }}>
                    <Image source={{ uri: profileimage }} resizeMode='cover' style={{ ...styles.storeImage1, borderRadius: 10 }} />
                    <TouchableOpacity style={styles.addStoreBtn} onPress={() => { this.chooseImage() }}>
                      <Image source={require('../../assets/iamges/cameraImage.png')} resizeMode='stretch' style={styles.addImage} />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.inputArea}>
                  <Text style={{ ...styles.SignInfoTxt, textAlign: 'center', marginTop: 20, fontSize: 40, }}>$ {parseFloat(availableBal).toFixed(2)}</Text>
                  <Text style={{ ...styles.SignInfoTxt, textAlign: 'center', color: '#7a7a7b', marginBottom: 20 }}>Available Balance</Text>
                  <TouchableOpacity style={styles.inputItem} onPress={() => { this.props.navigation.navigate("DispensaryUpdateScreen") }}>
                    <Image source={require('../../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                    <Text style={{ ...styles.inputTxt, color: '#7a7a7b' }}>Dispensary Information</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.inputItem} onPress={() => this.refs.modal6.open()}>
                    <Image source={require('../../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                    <Text style={{ ...styles.inputTxt, color: '#7a7a7b' }}>Contact Support</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ ...styles.inputItem, borderColor: 'red', borderWidth: 0.5 }} onPress={() => { this.logOut() }}>
                    <Image source={require('../../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                    <Text style={{ ...styles.inputTxt, color: '#7a7a7b' }}>Log out</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ height: 150 }}></View>
            </ScrollView> :
            <ScrollView style={{ width: '100%' }}>
              <View style={styles.container}>
                <View style={{ width: '100%', alignItems: 'center', marginTop: Platform.OS == 'ios' ? 40 : 20 }}>
                  <View style={styles.switchShadow}>
                    <Switch
                      value={this.state.Checked}
                      onValueChange={() => this._onChangeSwitch()}
                      disabled={false}
                      barHeight={30}
                      switchWidthMultiplier={2.5}
                      // outerCircleStyle={{ width: 30 }}
                      circleBorderWidth={0}
                      activeTextStyle={{ alignItems: "flex-end", color: "#878787", fontSize: 10, fontFamily: 'Poppins-Regular' }}
                      inactiveTextStyle={{ alignItems: "flex-start", color: "#878787", fontSize: 10, fontFamily: 'Poppins-Regular', marginLeft: 0, paddingLeft: 0 }}
                      activeText={'Offline'}
                      inActiveText={'Online'}
                      backgroundActive={'#FFF'}
                      backgroundInactive={'#FFF'}
                      changeValueImmediately={false}
                      renderInsideCircle={() => <View resizeMode='stretch' style={this.state.Checked ? styles.uncheck : styles.checkImage} />}
                      circleActiveColor={'#FFF'}
                      circleInActiveColor={'#FFF'}
                      switchLeftPx={5}
                      switchRightPx={5}
                    />
                  </View>
                  <View style={styles.personUploadgImage}>
                    <View style={styles.personImageArea}>
                      <View style={styles.personImageArea1}>
                        <Image Image source={{ uri: profileimage }} resizeMode='cover' style={styles.personImage} />
                      </View>
                    </View>
                    <TouchableOpacity style={{ ...styles.addBtn, bottom: 50 }} onPress={() => { this.chooseImage() }}>
                      <Image source={require('../../assets/iamges/addImage.png')} resizeMode='stretch' style={styles.addImage} />
                    </TouchableOpacity>
                    <Text style={{ ...styles.inputTxt, alignSelf: 'center', textAlign: "center", marginTop: 20 }}>{firstName} {lastName}, {age}</Text>
                  </View>
                </View>
                <View style={styles.inputArea}>
                  <Text style={{ ...styles.SignInfoTxt, textAlign: 'center', marginTop: 0, fontSize: 40, }}>$ {parseFloat(availableBal).toFixed(2)}</Text>
                  <Text style={{ ...styles.SignInfoTxt, textAlign: 'center', color: '#7a7a7b', marginBottom: 20 }}>Available Balance</Text>
                  <TouchableOpacity style={styles.inputItem} onPress={() => { this.props.navigation.navigate("DriverInformationScreen") }}>
                    <Image source={require('../../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                    <Text style={{ ...styles.inputTxt, color: '#7a7a7b' }}>Driver Information</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.inputItem} onPress={() => this.refs.modal6.open()}>
                    <Image source={require('../../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                    <Text style={{ ...styles.inputTxt, color: '#7a7a7b' }}>Contact Support</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ ...styles.inputItem, borderColor: 'red', borderWidth: 0.5 }} onPress={() => { this.logOut() }}>
                    <Image source={require('../../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                    <Text style={{ ...styles.inputTxt, color: '#7a7a7b' }}>Log Out</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ height: 150 }}></View>
            </ScrollView>
        }
        <Modal style={styles.modal1} position={"bottom"} ref={"modal6"} swipeArea={20}>
          <TouchableOpacity style={styles.closeBtn} onPress={() => { this.closeModal() }}>
            <Image source={require('../../assets/iamges/close.png')} resizeMode='stretch' style={styles.closeImage} />
          </TouchableOpacity>
          <Text style={styles.MessageTxt}>Message</Text>
          <TextInput style={styles.contactlInput} multiline={true} placeholderTextColor="#BCBCBC" placeholder={'Account ID 17YGBEYG57272\nType here...'} />
          <View style={styles.ModalBtnArea}>
            <TouchableOpacity style={styles.modalBackBtn} onPress={() => { this.closeModal() }}>
              <View style={styles.backArea}>
                <Text style={styles.modalBackTxt}>Back</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sendBtn} onPress={() => { this.closeModal() }}>
              <Text style={styles.sendTxt}>Send</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <Modal1 isVisible={this.state.isModalVisible1}>
          <View style={{ ...styles.modalView, backgroundColor: 'white' }}>
            <Image source={require('../../assets/iamges/CannaGo.png')} resizeMode='stretch' style={{ width: 80, height: 80, marginBottom: 20 }} />
            <Text style={{ ...styles.Description1, fontSize: 20, color: "#61D273", fontFamily: 'Poppins-Regular' }}>Store image is uploaded.</Text>
          </View>
        </Modal1>
      </View>
    );
  }
}

ProfileScreen.propTypes = {
  load: func,
  real_data: array,
};

const mapDispatchToProps = dispatch => ({
  load: (data) => dispatch(load(data)),
  // updateUserInfo: (updateUserInfo_row) => dispatch(updateUserInfo(updateUserInfo_row)),
});

const mapStateToProps = ({ user }) => ({
  real_data: user.real_data,
  user_real_info: user.user_real_info
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileScreen);
