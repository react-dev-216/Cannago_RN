import React, { Component } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Modal from 'react-native-modal';
import Spinner from 'react-native-loading-spinner-overlay';
import { styles } from '../components/styles'
import RNFetchBlob from "react-native-fetch-blob";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AsyncStorage from '@react-native-community/async-storage';
import AlertModal from '../components/AlertModal'
import NonImage from '../assets/iamges/emptyPhoto.png'
import uncheckImage from '../assets/iamges/uncheckImage.png'
import checkImage from '../assets/iamges/checkImage.png'
import Firebase from 'firebase';

const options = {
  title: 'Choose Photo',
  takePhotoButtonTitle: 'Take photo with your camera',
  chooseFromLibraryButtonTitle: 'Choose photo from library',
  maxWidth: 500,
  maxHeight: 300,
  quality: 0.5
}

let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
let reg_strong = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,30}$/;

export default class DispensariesSignupScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatarSource: NonImage,
      ischecked: false,
      ischecked1: false,
      displayName: '',
      checkImage: checkImage,
      uncheckImage: uncheckImage,
      fristName: '',
      lastName: '',
      ownerEmail: '',
      ownerPhoneNum: '',
      password: '',
      conPassword: '',
      storeName: '',
      storePhoneNum: '',
      storeStreetAdress: '',
      city: '',
      GA: 'GA',
      zipCode: '',
      storeHours: [],
      companyName: '',
      img_url: '',
      fein: '',
      userType: 'dispensary',
      isModalVisible: false,
      isModalVisible1: false,
      isModalVisible2: false,
      isModalVisible3: false,
      isModalVisible4: false,
      isModalVisible5: false,
      isModalVisible6: false,
      isModalVisible7: false,
      isModalVisible9: false,
      isModalVisible10: false,
      isModalVisible11: false,
      isModalVisible12: false,
      isModalVisible13: false,
      isModalVisible14: false,
      isModalVisible15: false,
      isModalVisible16: false,
      isModalVisible17: false,
      isModalVisible18: false,
      isModalVisible19: false,
      isModalVisible20: false,
      isModalVisible21: false,
      isModalVisible22: false,
      timeFlag: false,
      isloading: false,
      loggedIn: false,
      isImageUploading: false,
    };
  }

  componentDidMount = () => {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', async () => {
      await this.setState({ storeHours: this.props.navigation.getParam("storeHour") })
      console.log(this.state.storeHours);
    });
  }

  componentWillUnmount() {
    this.focusListener.remove();
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

  NetworkSensor = async () => {
    await this.setState({
      timeFlag: true,
      isLoading: false
    })
    this.setState({ isModalVisible16: true })
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
          // enable this option so that the response data conversion handled automatically
          auto: true,
          // when receiving response data, the module will match its Content-Type header
          // with strings in this array. If it contains any one of string in this array, 
          // the response body will be considered as binary data and the data will be stored
          // in file system instead of in memory.
          // By default, it only store response data to file system when Content-Type 
          // contains string `application/octet`.
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
                this.setState({ isModalVisible20: true })
                setTimeout(() => {
                  this.setState({ isModalVisible20: false })
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
  checkfun1 = async () => {
    await this.setState({ ischecked1: !this.state.ischecked1 });
  }

  SingUp = () => {
    const { fristName, lastName, ownerPhoneNum, ownerEmail, password, conPassword, storeName, storePhoneNum, storeStreetAdress, GA, zipCode, storeHours, companyName, fein, img_url, userType, ischecked, city, ischecked1 } = this.state;
    console.log("++++++++++++++++_______");
    console.log(img_url);
    if (img_url == "") {
      this.setState({ isModalVisible15: true })
    }
    else if (fristName == "") {
      this.setState({ isModalVisible1: true })
    } else if (lastName == "") {
      this.setState({ isModalVisible2: true })
    }
    else if (ownerEmail == "") {
      this.setState({ isModalVisible3: true })
    } else if (reg.test(ownerEmail) === false) {
      this.setState({ isModalVisible4: true })
    } else if (password == "") {
      this.setState({ isModalVisible5: true })
    } else if (reg_strong.test(password) === false) {
      this.setState({ isModalVisible6: true })
    }
    else if (password != conPassword) {
      this.setState({ isModalVisible7: true })
    }
    else if (storeName == "") {
      this.setState({ isModalVisible8: true })
    }
    else if (storePhoneNum == "") {
      this.setState({ isModalVisible9: true })
    }
    else if (storeStreetAdress == "") {
      this.setState({ isModalVisible10: true })
    }
    else if (city == "") {
      this.setState({ isModalVisible18: true })
    }
    else if (zipCode == "") {
      this.setState({ isModalVisible19: true })
    }
    else if (storeHours == "") {
      this.setState({ isModalVisible11: true })
    }
    else if (ischecked == false) {
      this.setState({ isModalVisible14: true })
    }
    else if (companyName == "") {
      this.setState({ isModalVisible12: true })
    }
    else if (fein == "") {
      this.setState({ isModalVisible13: true })
    }
    else if (ischecked1 == false) {
      this.setState({ isModalVisible14: true })
    }
    else {
      // var myTimer = setTimeout(function () { this.NetworkSensor() }.bind(this), 25000)
      this.setState({ isLoading: true })
      try {
        Firebase
          .auth()
          .createUserWithEmailAndPassword(ownerEmail, password)
          .then((res) => {
            // console.log(res.Error)
            AsyncStorage.setItem('Loggined', "Success");
            AsyncStorage.setItem('userUid', res.user.uid);
            this.setState({ isLoading: false })
            // clearTimeout(myTimer)
            var user = Firebase.auth().currentUser;
            Firebase.database().ref('user/' + res.user.uid + '/dispensary').update({
              email: ownerEmail,
              fristName: fristName,
              lastName: lastName,
              phoneNum: ownerPhoneNum,
              password: password,
              storeName: storeName,
              storePhoneNum: storePhoneNum,
              storeStreetAdress: storeStreetAdress,
              city: city,
              GA: GA,
              zipCode: zipCode,
              storeHours: storeHours,
              companyName: companyName,
              fein: fein,
              profileimage: img_url,
              userType: userType,
              availableBal: 0
            });
            this.setState({ isModalVisible17: true })
            setTimeout(() => {
              this.props.navigation.navigate('Main')
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
            } else if (error.message == "The email address is already in use by another account.") {
              Firebase.database()
                .ref('user')
                .on("value", async (snapshot) => {
                  var data = []
                  var row
                  snapshot.forEach(element => {
                    console.log(element)
                    if (element.val().hasOwnProperty('dispensary')) {
                      if (element.val().dispensary.email == ownerEmail) {
                        this.setState({ alertContent: 'The email address is already in use by another account.', isModalVisible: true })
                      }
                    } else {
                      if (element.val().hasOwnProperty('driver')) {
                        if (element.val().driver.email == ownerEmail) {
                          this.setState({ userId: element.key, isConsumer: true })
                          console.log(this.state.userId);
                          AsyncStorage.setItem('userUid', element.key);
                          Firebase.database().ref('user/' + element.key + '/dispensary').update({
                            email: ownerEmail,
                            fristName: fristName,
                            lastName: lastName,
                            phoneNum: ownerPhoneNum,
                            password: password,
                            storeName: storeName,
                            storePhoneNum: storePhoneNum,
                            storeStreetAdress: storeStreetAdress,
                            city: city,
                            GA: GA,
                            zipCode: zipCode,
                            storeHours: storeHours,
                            companyName: companyName,
                            fein: fein,
                            profileimage: img_url,
                            userType: userType,
                            availableBal: 0
                          });
                          this.setState({ isModalVisible17: true })
                          setTimeout(() => {
                            this.props.navigation.navigate('Main')
                            this.setState({ isModalVisible17: false })
                          }, 2000)
                        }
                      }
                      if (element.val().hasOwnProperty('consumer')) {
                        if (element.val().consumer.email == ownerEmail) {
                          this.setState({ userId: element.key, isDispensary: true })
                          AsyncStorage.setItem('userUid', element.key);
                          Firebase.database().ref('user/' + element.key + '/dispensary').update({
                            email: ownerEmail,
                            fristName: fristName,
                            lastName: lastName,
                            phoneNum: ownerPhoneNum,
                            password: password,
                            storeName: storeName,
                            storePhoneNum: storePhoneNum,
                            storeStreetAdress: storeStreetAdress,
                            city: city,
                            GA: GA,
                            zipCode: zipCode,
                            storeHours: storeHours,
                            companyName: companyName,
                            fein: fein,
                            profileimage: img_url,
                            userType: userType,
                            availableBal: 0
                          });
                          this.setState({ isModalVisible17: true })
                          setTimeout(() => {
                            this.props.navigation.navigate('Main')
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

  ChangeFein = async (input) => {
    await this.setState({ fein: input })
    input = input.replace("-", "")
    if (input.length >= 3) {
      var str = input.slice(0, 2) + '-' + input.slice(2)
      await this.setState({ fein: str })
      console.log(this.state.fein);
      // this.state.fein.replace(this.state.fein, this.state.fein + "-")
    }
    // if (input.length >= 0 && input.length < 9) {
    //   this.setState({ fein: input.replace(/\s/g, '').replace(/(\d{2})/g, `${input}-`) });
    // }

  }

  render() {
    return (
      <KeyboardAwareScrollView style={{ flex: 1 }}>
        <View style={styles.container} >
          <Spinner
            visible={this.state.isLoading}
            textContent={'Creating your account...'}
            textStyle={{ color: 'white' }}
          />
          <Spinner
            visible={this.state.isImageUploading}
            textContent={'Uploading store image...'}
            textStyle={{ color: 'white' }}
          />
          <ScrollView style={{ width: '100%' }}>
            <View style={styles.container}>
              <View style={{ width: '100%', alignItems: 'center', marginTop: 40 }}>
                <TouchableOpacity style={styles.backBtn} onPress={() => { this.props.navigation.goBack() }}>
                  <Image source={require('../assets/iamges/backImage.png')} resizeMode='stretch' style={styles.backImage} />
                </TouchableOpacity>
                <View style={styles.storeUploadgImage}>
                  <Image source={this.state.avatarSource} resizeMode='cover' style={styles.storeImage1} />
                  <TouchableOpacity style={styles.addStoreBtn} onPress={() => { this.chooseImage() }}>
                    <Image source={require('../assets/iamges/cameraImage.png')} resizeMode='stretch' style={styles.addImage} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.inputArea}>
                <View style={styles.SignInfoArea}>
                  <Text style={styles.SignInfoTxt}>Sign Up Information</Text>
                </View>
                <View style={styles.inputItem}>
                  <Image source={require('../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                  <TextInput style={styles.inputTxt} name="fristName" value={this.state.fristName} placeholderTextColor="#7a7a7b" placeholder="First Name" onChangeText={(text) => { this.setState({ fristName: text }) }}></TextInput>
                </View>
                <View style={styles.inputItem}>
                  <Image source={require('../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                  <TextInput style={styles.inputTxt} placeholderTextColor="#7a7a7b" placeholder="Last Name" value={this.state.lastName} onChangeText={(text) => { this.setState({ lastName: text }) }}></TextInput>
                </View>
                <View style={styles.inputItem}>
                  <Image source={require('../assets/iamges/email.png')} resizeMode='stretch' style={styles.InputImage} />
                  <TextInput style={styles.inputTxt} placeholderTextColor="#7a7a7b" placeholder="Owner's Email Address" value={this.state.ownerEmail} onChangeText={(text) => { this.setState({ ownerEmail: text }) }}></TextInput>
                </View>
                <View style={styles.inputItem}>
                  <Image source={require('../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                  <TextInput keyboardType="number-pad" style={styles.inputTxt} placeholderTextColor="#7a7a7b" placeholder="Owner's Phone Number" value={this.state.ownerPhoneNum} onChangeText={(text) => { this.setState({ ownerPhoneNum: text }) }}></TextInput>
                </View>
                <View style={styles.inputItem}>
                  <Image source={require('../assets/iamges/password.png')} resizeMode='stretch' style={styles.InputImage1} />
                  <TextInput style={styles.inputTxt} placeholderTextColor="#7a7a7b" secureTextEntry={true} placeholder="Password" value={this.state.password} onChangeText={(text) => { this.setState({ password: text }) }}></TextInput>
                </View>
                <View style={styles.inputItem}>
                  <Image source={require('../assets/iamges/password.png')} resizeMode='stretch' style={styles.InputImage1} />
                  <TextInput style={styles.inputTxt} placeholderTextColor="#7a7a7b" secureTextEntry={true} placeholder="Retype password" value={this.state.conPassword} onChangeText={(text) => { this.setState({ conPassword: text }) }}></TextInput>
                </View>
                <View style={styles.SignInfoArea}>
                  <Text style={styles.SignInfoTxt}>Dispensary Information</Text>
                </View>
                <View style={styles.inputItem}>
                  <Image source={require('../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                  <TextInput style={styles.inputTxt} placeholderTextColor="#7a7a7b" placeholder="Dispensary Store Name" value={this.state.storeName} onChangeText={(text) => { this.setState({ storeName: text }) }}></TextInput>
                </View>
                <View style={styles.inputItem}>
                  <Image source={require('../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                  <TextInput keyboardType="number-pad" style={styles.inputTxt} placeholderTextColor="#7a7a7b" placeholder="Dispensary's Phone Number" value={this.state.storePhoneNum} onChangeText={(text) => { this.setState({ storePhoneNum: text }) }}></TextInput>
                </View>
                <View style={styles.inputItem}>
                  <Image source={require('../assets/iamges/position.png')} resizeMode='stretch' style={styles.InputImage3} />
                  <TextInput style={styles.inputTxt} placeholderTextColor="#7a7a7b" placeholder="Dispensary's Street Address" value={this.state.storeStreetAdress} onChangeText={(text) => { this.setState({ storeStreetAdress: text }) }}></TextInput>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View style={styles.inputItem2}>
                    <TextInput style={styles.inputTxt2} placeholderTextColor="#7a7a7b" placeholder="City" value={this.state.city} onChangeText={(text) => { this.setState({ city: text }) }}></TextInput>
                  </View>
                  <View style={styles.inputItem2}>
                    <TextInput style={styles.inputTxt2} placeholderTextColor="#7a7a7b" editable={false} placeholder="GA" value="GA" value={this.state.GA} onChangeText={(text) => { this.setState({ GA: text }) }}></TextInput>
                  </View>
                  <View style={styles.inputItem2}>
                    <TextInput style={styles.inputTxt2} placeholderTextColor="#7a7a7b" placeholder="Zip Code" value={this.state.zipCode} onChangeText={(text) => { this.setState({ zipCode: text }) }}></TextInput>
                  </View>
                </View>
                <TouchableOpacity style={styles.inputItem} onPress={() => { this.props.navigation.navigate("SelectStoreHourScreen") }}>
                  <Image source={require('../assets/iamges/position.png')} resizeMode='stretch' style={styles.InputImage1} />
                  <Text style={{ ...styles.inputTxt, color: '#7a7a7b' }}>Dispensary's Hours</Text>
                </TouchableOpacity>
                <View style={styles.TermsArea}>
                  <TouchableOpacity style={styles.forgotBtn1} onPress={() => { this.checkfun() }}>
                    <Image source={this.state.ischecked ? this.state.checkImage : this.state.uncheckImage} resizeMode='stretch' style={styles.uncheckImage} />
                  </TouchableOpacity>
                  <Text style={{ ...styles.termsTxt, width: '90%', marginTop: 10 }}>By checking I am an authorized signatory of this business, with the power to commit to binding agreements</Text>
                </View>
                {/* <TouchableOpacity style={styles.inputItem}>
                <Image source={require('../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                <Text style={{...styles.inputTxt, color:'#7a7a7b'}}>Scan Driver's License</Text>
                <Image source={require('../assets/iamges/arrow-left.png')} resizeMode='stretch' style={styles.arrowleft} />
              </TouchableOpacity> */}
                <View style={{ ...styles.SignInfoArea, marginTop: 20 }}>
                  <Text style={styles.SignInfoTxt}>Tax Information</Text>
                </View>
                <View style={styles.inputItem}>
                  <Image source={require('../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                  <TextInput style={styles.inputTxt} placeholderTextColor="#7a7a7b" placeholder="Business entity/Company name" value={this.state.companyName} onChangeText={(text) => { this.setState({ companyName: text }) }}></TextInput>
                </View>
                <Text style={{ ...styles.termsTxt, width: '90%', marginTop: -10, marginBottom: 10 }}>Ensure this matches the official tax documents for your business.</Text>
                <View style={styles.inputItem}>
                  <Image source={require('../assets/iamges/user.png')} resizeMode='stretch' style={styles.InputImage2} />
                  <TextInput keyboardType="number-pad" style={{ ...styles.inputTxt, fontSize: 11 }} placeholderTextColor="#7a7a7b" placeholder="FEIN (Federal Employer Identification Number)" value={this.state.fein} onChangeText={(input) => { this.ChangeFein(input) }} maxLength={10}></TextInput>
                </View>
                <View style={styles.TermsArea}>
                  <TouchableOpacity style={styles.forgotBtn1} onPress={() => { this.checkfun1() }}>
                    <Image source={this.state.ischecked1 ? this.state.checkImage : this.state.uncheckImage} resizeMode='stretch' style={styles.uncheckImage} />
                  </TouchableOpacity>
                  <Text style={styles.termsTxt}>By checking this I agree to CannaGo's  </Text>
                  <TouchableOpacity style={styles.forgotBtn1}>
                    <Text style={{ color: '#61D273', fontSize: 10, fontFamily: 'Poppins-Regular' }}>Terms & Conditions</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.signinBtn} onPress={() => { this.SingUp() }}>
                  <Text style={styles.signinTxt1}>Create Account</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ height: 50 }}></View>
          </ScrollView>
          <Modal isVisible={this.state.isModalVisible1}>
            <View style={styles.modalView}>
              <Text style={styles.TitleTxt1}>OOPS!</Text>
              <Text style={styles.Description}>Please input your first name</Text>
              <TouchableOpacity style={styles.QuitWorkout} onPress={() => this.setState({ isModalVisible1: false })}>
                <Text style={{ ...styles.Dismiss, color: 'white' }}>OK</Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <Modal isVisible={this.state.isModalVisible2}>
            <View style={styles.modalView}>
              <Text style={styles.TitleTxt1}>OOPS!</Text>
              <Text style={styles.Description}>Please input your last name</Text>
              <TouchableOpacity style={styles.QuitWorkout} onPress={() => this.setState({ isModalVisible2: false })}>
                <Text style={{ ...styles.Dismiss, color: 'white' }}>OK</Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <Modal isVisible={this.state.isModalVisible3}>
            <View style={styles.modalView}>
              <Text style={styles.TitleTxt1}>OOPS!</Text>
              <Text style={styles.Description}>Please input owner's email address</Text>
              <TouchableOpacity style={styles.QuitWorkout} onPress={() => this.setState({ isModalVisible3: false })}>
                <Text style={{ ...styles.Dismiss, color: 'white' }}>OK</Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <Modal isVisible={this.state.isModalVisible4}>
            <View style={styles.modalView}>
              <Text style={styles.TitleTxt1}>OOPS!</Text>
              <Text style={styles.Description}>Email type error, Please type again</Text>
              <TouchableOpacity style={styles.QuitWorkout} onPress={() => this.setState({ isModalVisible4: false })}>
                <Text style={{ ...styles.Dismiss, color: 'white' }}>OK</Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <Modal isVisible={this.state.isModalVisible5}>
            <View style={styles.modalView}>
              <Text style={styles.TitleTxt1}>OOPS!</Text>
              <Text style={styles.Description}>Please input your password</Text>
              <TouchableOpacity style={styles.QuitWorkout} onPress={() => this.setState({ isModalVisible5: false })}>
                <Text style={{ ...styles.Dismiss, color: 'white' }}>OK</Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <Modal isVisible={this.state.isModalVisible}>
            <AlertModal alertContent={this.state.alertContent} onPress={() => this.setState({ isModalVisible: false })} />
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
          <Modal isVisible={this.state.isModalVisible7}>
            <View style={styles.modalView}>
              <Text style={styles.TitleTxt1}>OOPS!</Text>
              <Text style={styles.Description}>Password doesn't match</Text>
              <TouchableOpacity style={styles.QuitWorkout} onPress={() => this.setState({ isModalVisible7: false })}>
                <Text style={{ ...styles.Dismiss, color: 'white' }}>OK</Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <Modal isVisible={this.state.isModalVisible8}>
            <View style={styles.modalView}>
              <Text style={styles.TitleTxt1}>OOPS!</Text>
              <Text style={styles.Description}>Please input dispensary store name</Text>
              <TouchableOpacity style={styles.QuitWorkout} onPress={() => this.setState({ isModalVisible8: false })}>
                <Text style={{ ...styles.Dismiss, color: 'white' }}>OK</Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <Modal isVisible={this.state.isModalVisible9}>
            <View style={styles.modalView}>
              <Text style={styles.TitleTxt1}>OOPS!</Text>
              <Text style={styles.Description}>Please input dispensary's phone number</Text>
              <TouchableOpacity style={styles.QuitWorkout} onPress={() => this.setState({ isModalVisible9: false })}>
                <Text style={{ ...styles.Dismiss, color: 'white' }}>OK</Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <Modal isVisible={this.state.isModalVisible10}>
            <View style={styles.modalView}>
              <Text style={styles.TitleTxt1}>OOPS!</Text>
              <Text style={styles.Description}>Please input dispensary's street address</Text>
              <TouchableOpacity style={styles.QuitWorkout} onPress={() => this.setState({ isModalVisible10: false })}>
                <Text style={{ ...styles.Dismiss, color: 'white' }}>OK</Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <Modal isVisible={this.state.isModalVisible11}>
            <View style={styles.modalView}>
              <Text style={styles.TitleTxt1}>OOPS!</Text>
              <Text style={styles.Description}>Please input dispensary's hours</Text>
              <TouchableOpacity style={styles.QuitWorkout} onPress={() => this.setState({ isModalVisible11: false })}>
                <Text style={{ ...styles.Dismiss, color: 'white' }}>OK</Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <Modal isVisible={this.state.isModalVisible12}>
            <View style={styles.modalView}>
              <Text style={styles.TitleTxt1}>OOPS!</Text>
              <Text style={styles.Description}>Please input company name</Text>
              <TouchableOpacity style={styles.QuitWorkout} onPress={() => this.setState({ isModalVisible12: false })}>
                <Text style={{ ...styles.Dismiss, color: 'white' }}>OK</Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <Modal isVisible={this.state.isModalVisible13}>
            <View style={styles.modalView}>
              <Text style={styles.TitleTxt1}>OOPS!</Text>
              <Text style={styles.Description}>Please input FEIN</Text>
              <TouchableOpacity style={styles.QuitWorkout} onPress={() => this.setState({ isModalVisible13: false })}>
                <Text style={{ ...styles.Dismiss, color: 'white' }}>OK</Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <Modal isVisible={this.state.isModalVisible14}>
            <View style={styles.modalView}>
              <Text style={styles.TitleTxt1}>OOPS!</Text>
              <Text style={styles.Description}>You need to agree our Terms and Conditions</Text>
              <TouchableOpacity style={styles.QuitWorkout} onPress={() => this.setState({ isModalVisible14: false })}>
                <Text style={{ ...styles.Dismiss, color: 'white' }}>OK</Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <Modal isVisible={this.state.isModalVisible15}>
            <View style={styles.modalView}>
              <Text style={styles.TitleTxt1}>OOPS!</Text>
              <Text style={styles.Description}>Please Select Store Image</Text>
              <TouchableOpacity style={styles.QuitWorkout} onPress={() => this.setState({ isModalVisible15: false })}>
                <Text style={{ ...styles.Dismiss, color: 'white' }}>OK</Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <Modal isVisible={this.state.isModalVisible16}>
            <View style={styles.modalView}>
              <Text style={styles.TitleTxt1}>OOPS!</Text>
              <Text style={styles.Description}>Internet connection failed</Text>
              <TouchableOpacity style={styles.QuitWorkout} onPress={() => this.setState({ isModalVisible16: false })}>
                <Text style={{ ...styles.Dismiss, color: 'white' }}>OK</Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <Modal isVisible={this.state.isModalVisible17}>
            <View style={{ ...styles.modalView, backgroundColor: 'white' }}>
              <Image source={require('../assets/iamges/CannaGo.png')} resizeMode='stretch' style={{ width: 80, height: 80, marginBottom: 20 }} />
              <Text style={{ ...styles.Description1, fontSize: 20, color: "#61D273", fontFamily: 'Poppins-Regular' }}>Welcome to CannaGo App!</Text>
            </View>
          </Modal>
          <Modal isVisible={this.state.isModalVisible18}>
            <View style={styles.modalView}>
              <Text style={styles.TitleTxt1}>OOPS!</Text>
              <Text style={styles.Description}>Please input city name</Text>
              <TouchableOpacity style={styles.QuitWorkout} onPress={() => this.setState({ isModalVisible18: false })}>
                <Text style={{ ...styles.Dismiss, color: 'white' }}>OK</Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <Modal isVisible={this.state.isModalVisible19}>
            <View style={styles.modalView}>
              <Text style={styles.TitleTxt1}>OOPS!</Text>
              <Text style={styles.Description}>Please input Zipe Code</Text>
              <TouchableOpacity style={styles.QuitWorkout} onPress={() => this.setState({ isModalVisible19: false })}>
                <Text style={{ ...styles.Dismiss, color: 'white' }}>OK</Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <Modal isVisible={this.state.isModalVisible20}>
            <View style={{ ...styles.modalView, backgroundColor: 'white' }}>
              <Image source={require('../assets/iamges/CannaGo.png')} resizeMode='stretch' style={{ width: 80, height: 80, marginBottom: 20 }} />
              <Text style={{ ...styles.Description1, fontSize: 20, color: "#61D273", fontFamily: 'Poppins-Regular' }}>Store image is uploaded</Text>
            </View>
          </Modal>
          <Modal isVisible={this.state.isModalVisible21}>
            <View style={{ ...styles.modalView, alignItems: 'center' }}>
              <Text style={styles.TitleTxt1}>OOPS!</Text>
              <Text style={{ ...styles.Description, textAlign: 'center' }}>The email address is already in use by another account.</Text>
              <TouchableOpacity style={styles.QuitWorkout} onPress={() => this.setState({ isModalVisible21: false })}>
                <Text style={{ ...styles.Dismiss, color: 'white' }}>OK</Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <Modal isVisible={this.state.isModalVisible22}>
            <View style={styles.modalView}>
              <Text style={styles.TitleTxt1}>OOPS!</Text>
              <Text style={styles.Description}>Your internet Connection is failed</Text>
              <TouchableOpacity style={styles.QuitWorkout} onPress={() => this.setState({ isModalVisible22: false })}>
                <Text style={{ ...styles.Dismiss, color: 'white' }}>OK</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}