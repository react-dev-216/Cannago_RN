import React, { Component } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Modal from 'react-native-modal';
import Spinner from 'react-native-loading-spinner-overlay';
import RNFetchBlob from "react-native-fetch-blob";
import { styles } from '../../components/styles'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AsyncStorage from '@react-native-community/async-storage';
import Firebase from '../../../config/firebase'
// import database from '@react-native-firebase/database';
// import storage from '@react-native-firebase/storage';

import { func, string, bool, array, object } from "prop-types";
import { connect } from "react-redux";
import { load } from "./../../store/reducers/user";

import NonImage from '../../assets/iamges/emptyItem.png'
import uncheckImage from '../../assets/iamges/uncheckImage.png'
import checkImage from '../../assets/iamges/checkImage.png'

const options = {
  title: 'Choose Photo',
  takePhotoButtonTitle: 'Take photo with your camera',
  chooseFromLibraryButtonTitle: 'Choose photo from library',
  quality: 0.5
}

class AddStoreItemScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatarSource: NonImage,
      ischecked: false,
      checkImage: checkImage,
      uncheckImage: uncheckImage,
      itemNum1: 1,
      feeValue: 0.00,
      priceValue: 0.00,
      GpriceValue: 0.00,
      productName: "",
      Tag: "",
      Description: "",
      img_url: '',
      timeFlag: false,
      isloading: false,
      chooseCoaImage: '',
      coaImage: '',
      isModalVisible1: false,
      isModalVisible2: false,
      isModalVisible3: false,
      isModalVisible4: false,
      isModalVisible5: false,
      isModalVisible6: false,
      isModalVisible7: false,
      isModalVisible8: false,
      isModalVisible9: false,
      isModalVisible10: false,
      isModalVisible11: false,
      userId: "",
      isImageUploading: false,
      isCoaImageUploading: false,
    };
  }

  componentDidMount = async () => {
    const userId = await AsyncStorage.getItem("userUid");
    await this.setState({ userId: userId })
    console.log(this.state.userId)
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
    alert('network error')
  }

  Addcart = () => {
    this.setState({ itemNum1: this.state.itemNum1 + 1 })
  }

  Minuscart = async () => {
    await this.setState({ itemNum1: this.state.itemNum1 - 1 })
    if (this.state.itemNum1 <= 1) {
      this.setState({ itemNum1: 1 })
    }
  }

  chooseImage = () => {
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
            Firebase.
              storage()
              .ref("ItemImages/" + _name)
              .put(blob)
              .then(() => {
                uploadBlob.close();
                return Firebase.
                  storage()
                  .ref("ItemImages/" + _name)
                  .getDownloadURL();
              })
              .then(async uploadedFile => {
                console.log("++++++++++++");
                console.log({ uploadedFile });
                await this.setState({ img_url: uploadedFile })
                console.log(this.state.img_url);
                this.setState({ isImageUploading: false })
                this.setState({ isModalVisible9: true })
                setTimeout(() => {
                  this.setState({ isModalVisible9: false })
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

  chooseCoaImage = () => {
    console.log("+++++00000");
    ImagePicker.launchImageLibrary(options, response => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else {
        const source = { uri: response.uri };
        const Blob = RNFetchBlob.polyfill.Blob;    //firebase image upload
        const fs = RNFetchBlob.fs;
        window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
        window.Blob = Blob;

        const Fetch = RNFetchBlob.polyfill.Fetch
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
            this.setState({ isCoaImageUploading: true })
            uploadBlob = blob;
            Firebase
              .storage()
              .ref("ItemImages/" + _name)
              .put(blob)
              .then(() => {
                uploadBlob.close();
                return Firebase
                  .storage()
                  .ref("ItemImages/" + _name)
                  .getDownloadURL();
              })
              .then(async uploadedFile => {
                console.log("++++++++++++");
                console.log({ uploadedFile });
                await this.setState({ coaImage: uploadedFile })
                console.log(this.state.img_url);
                this.setState({ isCoaImageUploading: false })
                this.setState({ isModalVisible11: true })
                setTimeout(() => {
                  this.setState({ isModalVisible11: false })
                }, 2000)
              })
              .catch(error => {
                console.log({ error });
              });
          });
      }
    });
  };

  AddStore = async () => {
    const { img_url, itemNum1, feeValue, priceValue, GpriceValue, productName, Tag, Description, coaImage, userId } = this.state
    const { load } = this.props
    var myTimer = setTimeout(function () { this.NetworkSensor() }.bind(this), 25000)
    this.setState({ isLoading: true })
    try {
      this.setState({ isLoading: false })
      clearTimeout(myTimer)
      if (img_url == '') {
        this.setState({ isModalVisible1: true })
      } else if (feeValue == "") {
        this.setState({ isModalVisible2: true })
      } else if (priceValue == "") {
        this.setState({ isModalVisible3: true })
      } else if (GpriceValue == "") {
        this.setState({ isModalVisible4: true })
      } else if (productName == "") {
        this.setState({ isModalVisible5: true })
      } else if (Tag == "") {
        this.setState({ isModalVisible6: true })
      } else if (Description == "") {
        this.setState({ isModalVisible7: true })
      } else if (coaImage == "") {
        this.setState({ isModalVisible10: true })
      } else {
        var newItemKey = Firebase.database().ref().child('Items').push().key;
        await Firebase.database().ref('Items/' + this.state.userId + '/' + newItemKey).update({
          id: newItemKey,
          itemNum1: itemNum1,
          feeValue: feeValue,
          priceValue: priceValue,
          GpriceValue: GpriceValue,
          productName: productName,
          Tag: Tag,
          Description: Description,
          itemImage: img_url,
          coaImage: coaImage,
          storeId:userId
        });
        console.log("true");
        // var data = []
        // var row
        // await Firebase.database()
        //   .ref('Items/' + this.state.userId)
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
        this.setState({ isModalVisible8: true })
        setTimeout(() => {
          this.props.navigation.navigate("HomeScreen")
          this.setState({ isModalVisible8: false })
        }, 2000)
      }
    }
    catch (error) {
      console.log(error.toString())
    }
  }

  changeValue = async (text) => {
    var value = text
    await this.setState({ feeValue: value.toFxied(2) })
  }

  changePrice = async (value) => {
    await this.setState({ priceValue: value, feeValue: value * 0.3, GpriceValue: value * 0.7 })
  }

  render() {
    return (
      <KeyboardAwareScrollView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Spinner
            visible={this.state.isLoading}
            textContent={'Adding item...'}
            textStyle={{ color: 'white' }}
          />
          <Spinner
            visible={this.state.isImageUploading}
            textContent={'Uploading item image...'}
            textStyle={{ color: 'white' }}
          />
          <Spinner
            visible={this.state.isCoaImageUploading}
            textContent={'Uploading COA image...'}
            textStyle={{ color: 'white' }}
          />
          <ScrollView style={{ width: '100%' }}>
            <View style={styles.container}>
              <Text style={{ ...styles.CartTitle, marginTop: Platform.OS == 'ios' ? 7 : -10 }}>Add an Item to Your Store</Text>
              <View style={{ width: '100%', alignItems: 'center', marginTop: 40 }}>
                <TouchableOpacity style={styles.backBtn} onPress={() => { this.props.navigation.goBack() }}>
                  <Image source={require('../../assets/iamges/backImage.png')} resizeMode='stretch' style={styles.backImage} />
                </TouchableOpacity>
                <View style={styles.AddItemImage}>
                  {/* <Image source={{uri:this.state.img_url}} resizeMode='cover' style={styles.storeImage2} /> */}
                  <Image source={this.state.avatarSource} resizeMode='contain' style={styles.storeImage2} />
                  <TouchableOpacity style={styles.addStoreBtn} onPress={() => { this.chooseImage() }}>
                    <Image source={require('../../assets/iamges/cameraImage.png')} resizeMode='stretch' style={styles.addImage} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 50 }}>
                <Text style={styles.quantityNum}>Quantity in Stock</Text>
                <View style={{ ...styles.countItem, marginTop: 0 }}>
                  <TouchableOpacity style={styles.cartAccountArea} onPress={() => { this.Minuscart() }}>
                    <Text style={styles.cartAddBtn}>-</Text>
                  </TouchableOpacity>
                  <View style={styles.cartAccountArea}>
                    <Text style={styles.cartAddBtn}>{this.state.itemNum1}</Text>
                  </View>
                  <TouchableOpacity style={styles.cartAccountArea} onPress={() => { this.Addcart() }}>
                    <Text style={styles.cartAddBtn}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ flexDirection: 'row', width: '90%', justifyContent: 'space-between' }}>
                <View style={{ ...styles.inputArea, width: '28%' }}>
                  <Text style={{ ...styles.quantityNum, textAlign: 'center', marginBottom: 10 }}>Our fees</Text>
                  <View style={{ ...styles.inputItem, alignItems: 'center' }}>
                    {/* <TextInput style={{ ...styles.inputTxt, textAlign: 'center' }} placeholderTextColor="#7a7a7b" value={this.state.feeValue} placeholder="$0.00" onChangeText={(text) => { this.setState({ feeValue: text }) }}
                    onBlur={() => { this.setState({ feeValue: parseFloat(this.state.feeValue).toFixed(2) }) }}></TextInput> */}
                    <Text style={{ ...styles.inputTxt, marginLeft: 20 }}>${parseFloat(this.state.feeValue).toFixed(2)}</Text>
                  </View>
                </View>
                <View style={{ ...styles.inputArea, width: '30%' }}>
                  <Text style={{ ...styles.quantityNum, textAlign: 'center', marginBottom: 10 }}>Product Price</Text>
                  <View style={styles.inputItem}>
                    <Text style={{ marginLeft: 20, marginRight: 0 }}>$</Text>
                    <TextInput style={{ ...styles.inputTxt, marginLeft: 0, marginTop:Platform.OS == 'ios' ? 0 : 5 }} placeholderTextColor="#7a7a7b" value={this.state.priceValue} placeholder="0.00" onChangeText={(text) => { this.changePrice(text) }}
                      onBlur={() => { this.setState({ priceValue: parseFloat(this.state.priceValue).toFixed(2) }) }}></TextInput>
                  </View>
                </View>
                <View style={{ ...styles.inputArea, width: '30%' }}>
                  <Text style={{ ...styles.quantityNum, textAlign: 'center', marginBottom: 10 }}>Gross Price</Text>
                  <View style={styles.inputItem}>
                    {/* <TextInput style={{ ...styles.inputTxt, textAlign: 'center' }} placeholderTextColor="#7a7a7b" value={this.state.GpriceValue} placeholder="$0.00" onChangeText={(text) => { this.setState({ GpriceValue: text }) }}
                    onBlur={() => { this.setState({ GpriceValue: parseFloat(this.state.GpriceValue).toFixed(2) }) }}></TextInput> */}
                    <Text style={{ ...styles.inputTxt, marginLeft: 20 }}>${parseFloat(this.state.GpriceValue).toFixed(2)}</Text>
                  </View>
                </View>
              </View>
              <View style={{ ...styles.inputArea, marginTop: 0 }}>
                <Text style={{ ...styles.quantityNum, marginBottom: 10 }}>Name of Product</Text>
                <View style={styles.inputItem}>
                  <TextInput style={{ ...styles.inputTxt, marginLeft: 20 }} placeholderTextColor="#7a7a7b" placeholder="Enter item's Name" onChangeText={(text) => { this.setState({ productName: text }) }}></TextInput>
                </View>
                <Text style={{ ...styles.quantityNum, marginBottom: 10 }}>Tags</Text>
                <View style={styles.inputItem}>
                  <TextInput style={{ ...styles.inputTxt, marginLeft: 20 }} placeholderTextColor="#7a7a7b" placeholder="Enter Relevant Search Tags of Item..." onChangeText={(text) => { this.setState({ Tag: text }) }}></TextInput>
                </View>
                <Text style={{ ...styles.quantityNum, marginBottom: 10 }}>Description</Text>
                <View style={styles.ContentItem}>
                  <TextInput style={styles.specialInput} multiline={true} placeholderTextColor="#5E5E5E" placeholder="Enter Items Description..." onChangeText={(text) => { this.setState({ Description: text }) }} />
                </View>
                <TouchableOpacity style={styles.uploadCod} onPress={() => { this.chooseCoaImage() }}>
                  <Text style={{ ...styles.signinTxt1, fontSize: 16 }}>Upload COA</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...styles.signinBtn, width: 170, alignSelf: 'center' }} onPress={() => { this.AddStore() }}>
                  <Text style={styles.signinTxt1}>Add to Store</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ height: 150 }}></View>
          </ScrollView>
          <Modal isVisible={this.state.isModalVisible1}>
            <View style={styles.modalView}>
              <Text style={styles.TitleTxt1}>OOPS!</Text>
              <Text style={styles.Description}>Please select image</Text>
              <TouchableOpacity style={styles.QuitWorkout} onPress={() => this.setState({ isModalVisible1: false })}>
                <Text style={{ ...styles.Dismiss, color: 'white' }}>OK</Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <Modal isVisible={this.state.isModalVisible2}>
            <View style={styles.modalView}>
              <Text style={styles.TitleTxt1}>OOPS!</Text>
              <Text style={styles.Description}>Please input fees</Text>
              <TouchableOpacity style={styles.QuitWorkout} onPress={() => this.setState({ isModalVisible2: false })}>
                <Text style={{ ...styles.Dismiss, color: 'white' }}>OK</Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <Modal isVisible={this.state.isModalVisible3}>
            <View style={styles.modalView}>
              <Text style={styles.TitleTxt1}>OOPS!</Text>
              <Text style={styles.Description}>Please input product price</Text>
              <TouchableOpacity style={styles.QuitWorkout} onPress={() => this.setState({ isModalVisible3: false })}>
                <Text style={{ ...styles.Dismiss, color: 'white' }}>OK</Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <Modal isVisible={this.state.isModalVisible4}>
            <View style={styles.modalView}>
              <Text style={styles.TitleTxt1}>OOPS!</Text>
              <Text style={styles.Description}>Please input gross price</Text>
              <TouchableOpacity style={styles.QuitWorkout} onPress={() => this.setState({ isModalVisible4: false })}>
                <Text style={{ ...styles.Dismiss, color: 'white' }}>OK</Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <Modal isVisible={this.state.isModalVisible5}>
            <View style={styles.modalView}>
              <Text style={styles.TitleTxt1}>OOPS!</Text>
              <Text style={styles.Description}>Please input item's name</Text>
              <TouchableOpacity style={styles.QuitWorkout} onPress={() => this.setState({ isModalVisible5: false })}>
                <Text style={{ ...styles.Dismiss, color: 'white' }}>OK</Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <Modal isVisible={this.state.isModalVisible6}>
            <View style={styles.modalView}>
              <Text style={styles.TitleTxt1}>OOPS!</Text>
              <Text style={styles.Description}>Please input item's tag for search</Text>
              <TouchableOpacity style={styles.QuitWorkout} onPress={() => this.setState({ isModalVisible6: false })}>
                <Text style={{ ...styles.Dismiss, color: 'white' }}>OK</Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <Modal isVisible={this.state.isModalVisible7}>
            <View style={styles.modalView}>
              <Text style={styles.TitleTxt1}>OOPS!</Text>
              <Text style={styles.Description}>Please input item's description</Text>
              <TouchableOpacity style={styles.QuitWorkout} onPress={() => this.setState({ isModalVisible7: false })}>
                <Text style={{ ...styles.Dismiss, color: 'white' }}>OK</Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <Modal isVisible={this.state.isModalVisible8}>
            <View style={{ ...styles.modalView, backgroundColor: 'white' }}>
              <Image source={require('../../assets/iamges/CannaGo.png')} resizeMode='stretch' style={{ width: 80, height: 80, marginBottom: 20 }} />
              <Text style={{ ...styles.Description1, fontSize: 20, color: "#61D273", fontFamily: 'Poppins-Regular' }}>New item is added</Text>
            </View>
          </Modal>
          <Modal isVisible={this.state.isModalVisible11}>
            <View style={{ ...styles.modalView, backgroundColor: 'white' }}>
              <Image source={require('../../assets/iamges/CannaGo.png')} resizeMode='stretch' style={{ width: 80, height: 80, marginBottom: 20 }} />
              <Text style={{ ...styles.Description1, fontSize: 20, color: "#61D273", fontFamily: 'Poppins-Regular' }}>COA image is uploaded</Text>
            </View>
          </Modal>
          <Modal isVisible={this.state.isModalVisible11}>
            <View style={{ ...styles.modalView, backgroundColor: 'white' }}>
              <Image source={require('../../assets/iamges/CannaGo.png')} resizeMode='stretch' style={{ width: 80, height: 80, marginBottom: 20 }} />
              <Text style={{ ...styles.Description1, fontSize: 20, color: "#61D273", fontFamily: 'Poppins-Regular' }}>Item image is uploaded</Text>
            </View>
          </Modal>
          <Modal isVisible={this.state.isModalVisible10}>
            <View style={styles.modalView}>
              <Text style={styles.TitleTxt1}>OOPS!</Text>
              <Text style={styles.Description}>Please select COA image</Text>
              <TouchableOpacity style={styles.QuitWorkout} onPress={() => this.setState({ isModalVisible10: false })}>
                <Text style={{ ...styles.Dismiss, color: 'white' }}>OK</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

AddStoreItemScreen.propTypes = {
  load: func,
  real_data: array,
};

const mapDispatchToProps = dispatch => ({
  load: (data) => dispatch(load(data)),
});

const mapStateToProps = ({ user }) => ({
  real_data: user.real_data,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddStoreItemScreen);