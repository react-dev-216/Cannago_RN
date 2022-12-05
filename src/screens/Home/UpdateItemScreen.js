import React, { Component } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Modal from 'react-native-modal';
import Spinner from 'react-native-loading-spinner-overlay';
import RNFetchBlob from "react-native-fetch-blob";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Firebase from '../../../config/firebase'
import AsyncStorage from '@react-native-community/async-storage';

import { func, string, bool, object } from "prop-types";
import { connect } from "react-redux";
import { load } from "./../../store/reducers/user";

import { styles } from '../../components/styles'

import NonImage from '../../assets/iamges/product4.png'
import uncheckImage from '../../assets/iamges/uncheckImage.png'
import checkImage from '../../assets/iamges/checkImage.png'

const options = {
  title: 'Choose Photo',
  takePhotoButtonTitle: 'Take photo with your camera',
  chooseFromLibraryButtonTitle: 'Choose photo from library',
  quality: 0.5
}

class UpdateItemScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatarSource: NonImage,
      ischecked: false,
      checkImage: checkImage,
      uncheckImage: uncheckImage,
      itemNum1: 6,
      Description: '',
      GpriceValue: '',
      Tag: '',
      feeValue: '',
      id: '',
      itemImage: '',
      coaImage: '',
      priceValue: '',
      productName: '',
      userId: "",
      // userId: Firebase.auth().currentUser.uid,
      isModalVisible1: false,
      isModalVisible2: false,
      timeFlag: false,
      isloading: false,
      isImageUploading: false,
      isCoaImageUploading: false,
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

  Addcart = () => {
    this.setState({ itemNum1: this.state.itemNum1 + 1 })
  }

  Minuscart = async () => {
    await this.setState({ itemNum1: this.state.itemNum1 - 1 })
    if (this.state.itemNum1 <= 0) {
      this.setState({ itemNum1: 0 })
    }
  }

  NetworkSensor = async () => {
    await this.setState({
      timeFlag: true,
      isLoading: false
    })
    // alert('network error')
  }

  async componentDidMount() {
    const userId = await AsyncStorage.getItem("userUid");
    this.setState({ userId: userId })
    console.log(this.props.navigation.getParam('item'))
    const item = this.props.navigation.getParam('item');
    this.setState({
      Description: item.Description,
      GpriceValue: item.GpriceValue,
      Tag: item.Tag,
      feeValue: item.feeValue,
      id: item.id,
      itemImage: item.itemImage,
      itemNum1: item.itemNum1,
      priceValue: item.priceValue,
      productName: item.productName
    })
  }

  chooseImage = () => {
    ImagePicker.showImagePicker(options, response => {
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
                await this.setState({ itemImage: uploadedFile })
                console.log(this.state.img_url);
                this.setState({ isImageUploading: false })
                this.setState({ isModalVisible2: true })
                setTimeout(() => {
                  this.setState({ isModalVisible2: false })
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
                this.setState({ isModalVisible3: true })
                setTimeout(() => {
                  this.setState({ isModalVisible3: false })
                }, 2000)
              })
              .catch(error => {
                console.log({ error });
              });
          });
      }
    });
  };

  async update() {
    const { Description, GpriceValue, Tag, feeValue, id, itemImage, itemNum1, priceValue, productName, coaImage } = this.state
    var myTimer = setTimeout(function () { this.NetworkSensor() }.bind(this), 25000)
    await Firebase.database()
      .ref('Items/' + this.state.userId + '/' + id)
      .update({
        id: id,
        itemNum1: itemNum1,
        feeValue: feeValue,
        priceValue: priceValue,
        GpriceValue: GpriceValue,
        productName: productName,
        Tag: Tag,
        Description: Description,
        itemImage: itemImage,
        coaImage: coaImage
      });
    const { load } = this.props
    var data = []
    var row
    await Firebase.database()
      .ref('Items/' + this.state.userId)
      .once("value")
      .then(snapshot => {
        snapshot.forEach(element => {
          row = {
            Description: element.val().Description,
            GpriceValue: element.val().GpriceValue,
            Tag: element.val().Tag,
            feeValue: element.val().feeValue,
            id: element.val().id,
            itemImage: element.val().itemImage,
            itemNum1: element.val().itemNum1,
            priceValue: element.val().priceValue,
            productName: element.val().productName
          }
          data.push(row)
        });
        console.log(data)
        load(data)
      });
    this.setState({ isModalVisible1: true })
    setTimeout(() => {
      this.props.navigation.navigate("HomeScreen")
      this.setState({ isModalVisible1: false })
    }, 2000)
  }

  async del() {
    const { id } = this.state

    await Firebase.database().ref('Items/' + this.state.userId + '/' + id).remove();

    const { load } = this.props
    var data = []
    var row
    await Firebase.database()
      .ref('Items/' + this.state.userId)
      .once("value")
      .then(snapshot => {
        snapshot.forEach(element => {
          row = {
            Description: element.val().Description,
            GpriceValue: element.val().GpriceValue,
            Tag: element.val().Tag,
            feeValue: element.val().feeValue,
            id: element.val().id,
            itemImage: element.val().itemImage,
            itemNum1: element.val().itemNum1,
            priceValue: element.val().priceValue,
            productName: element.val().productName
          }
          data.push(row)
        });
        console.log(data)
        load(data)
      });

    this.props.navigation.navigate('HomeScreen')

  }

  checkfun = async () => {
    await this.setState({ ischecked: !this.state.ischecked });
  }

  changePrice = async (value) => {
    await this.setState({ priceValue: value, feeValue: value * 0.3, GpriceValue: value * 0.7 })
  }

  render() {

    const { Description, GpriceValue, Tag, feeValue, itemImage, itemNum1, priceValue, productName } = this.state
    return (
      <KeyboardAwareScrollView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Spinner
            visible={this.state.isLoading}
            textContent={'Updating item...'}
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
              <Text style={{ ...styles.CartTitle, marginTop: Platform.OS == 'ios' ? 7 : -10 }}>Edit Item in Your Store</Text>
              <View style={{ width: '100%', alignItems: 'center', marginTop: 40 }}>
                <TouchableOpacity style={styles.backBtn} onPress={() => { this.props.navigation.goBack() }}>
                  <Image source={require('../../assets/iamges/backImage.png')} resizeMode='stretch' style={styles.backImage} />
                </TouchableOpacity>
                <View style={styles.AddItemImage}>
                  <Image source={{ uri: itemImage }} resizeMode='contain' style={styles.storeImage2} />
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
                    <Text style={styles.cartAddBtn}>{itemNum1}</Text>
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
                    {/* <TextInput value={feeValue} onChangeText={value => this.setState({ feeValue: value })} onBlur={() => { this.setState({ feeValue: parseFloat(this.state.feeValue).toFixed(2) }) }} style={{ ...styles.inputTxt, textAlign: 'center' }} placeholderTextColor="#7a7a7b" placeholder="$12.90"></TextInput> */}
                    <Text style={{ ...styles.inputTxt, marginLeft: 20 }}>${parseFloat(this.state.feeValue).toFixed(2)}</Text>
                  </View>
                </View>
                <View style={{ ...styles.inputArea, width: '30%' }}>
                  <Text style={{ ...styles.quantityNum, textAlign: 'center', marginBottom: 10 }}>Product Price</Text>
                  <View style={styles.inputItem}>
                    {/* <TextInput value={priceValue} onChangeText={value => this.setState({ priceValue: value })} onBlur={() => { this.setState({ priceValue: parseFloat(this.state.priceValue).toFixed(2) }) }} style={{ ...styles.inputTxt, textAlign: 'center' }} placeholderTextColor="#7a7a7b" placeholder="$15.33"></TextInput> */}
                    <Text style={{ marginLeft: 20, marginRight: 0 }}>$</Text>
                    <TextInput style={{ ...styles.inputTxt, marginLeft: 0, marginTop: Platform.OS == 'ios' ? 0 : 5 }} placeholderTextColor="#7a7a7b" value={this.state.priceValue} placeholder="0.00" onChangeText={(text) => { this.changePrice(text) }}
                      onBlur={() => { this.setState({ priceValue: parseFloat(this.state.priceValue).toFixed(2) }) }}></TextInput>
                  </View>
                </View>
                <View style={{ ...styles.inputArea, width: '30%' }}>
                  <Text style={{ ...styles.quantityNum, textAlign: 'center', marginBottom: 10 }}>Gross Price</Text>
                  <View style={styles.inputItem}>
                    {/* <TextInput value={GpriceValue} onChangeText={value => this.setState({ GpriceValue: value })} onBlur={() => { this.setState({ GpriceValue: parseFloat(this.state.GpriceValue).toFixed(2) }) }} style={{ ...styles.inputTxt, textAlign: 'center' }} placeholderTextColor="#7a7a7b" placeholder="$13.55"></TextInput> */}
                    <Text style={{ ...styles.inputTxt, marginLeft: 20 }}>${parseFloat(this.state.GpriceValue).toFixed(2)}</Text>
                  </View>
                </View>
              </View>
              <View style={{ ...styles.inputArea, marginTop: 0 }}>
                <Text style={{ ...styles.quantityNum, marginBottom: 10 }}>Name of Product</Text>
                <View style={styles.inputItem}>
                  <TextInput value={productName} onChangeText={value => this.setState({ productName: value })} style={{ ...styles.inputTxt, marginLeft: 20 }} placeholderTextColor="#000000" placeholder="Enter items's Name"></TextInput>
                </View>
                <Text style={{ ...styles.quantityNum, marginBottom: 10 }}>Tags</Text>
                <View style={styles.inputItem}>
                  <TextInput value={Tag} onChangeText={value => this.setState({ Tag: value })} style={{ ...styles.inputTxt, marginLeft: 20 }} placeholderTextColor="#000000" placeholder="ECBD, Flower,CBD Plant, CBD Bud"></TextInput>
                </View>
                <Text style={{ ...styles.quantityNum, marginBottom: 10 }}>Description</Text>
                <View style={styles.ContentItem}>
                  <TextInput value={Description} onChangeText={value => this.setState({ Description: value })} style={styles.specialInput} multiline={true} placeholderTextColor="#000000" placeholder="Lorem ipsum, or lipsum as it is sometimes known, Lorem ipsum, or lipsum as it is sometimes known, " />
                </View>
                <TouchableOpacity style={{ ...styles.uploadCod, marginBottom: 30 }} onPress={() => { this.chooseCoaImage() }}>
                  <Text style={{ ...styles.signinTxt1, fontSize: 16 }}>Upload COA</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: -20 }}>
                  <TouchableOpacity style={{ ...styles.signinBtn, backgroundColor: "white", width: 128 }} onPress={() => this.del()}>
                    <Text style={{ ...styles.signinTxt1, color: "#CD5D5D" }}>Delete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ ...styles.signinBtn, backgroundColor: "#3EA5E1", width: 128 }} onPress={() => this.update()}>
                    <Text style={styles.signinTxt1}>Update</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={{ height: 150 }}></View>
          </ScrollView>
          <Modal isVisible={this.state.isModalVisible1}>
            <View style={{ ...styles.modalView, backgroundColor: 'white' }}>
              <Image source={require('../../assets/iamges/CannaGo.png')} resizeMode='stretch' style={{ width: 80, height: 80, marginBottom: 20 }} />
              <Text style={{ ...styles.Description1, fontSize: 20, color: "#61D273", fontFamily: 'Poppins-Regular' }}>Item is updated</Text>
            </View>
          </Modal>
          <Modal isVisible={this.state.isModalVisible2}>
            <View style={{ ...styles.modalView, backgroundColor: 'white' }}>
              <Image source={require('../../assets/iamges/CannaGo.png')} resizeMode='stretch' style={{ width: 80, height: 80, marginBottom: 20 }} />
              <Text style={{ ...styles.Description1, fontSize: 20, color: "#61D273", fontFamily: 'Poppins-Regular' }}>Item image is updated</Text>
            </View>
          </Modal>
          <Modal isVisible={this.state.isModalVisible3}>
            <View style={{ ...styles.modalView, backgroundColor: 'white' }}>
              <Image source={require('../../assets/iamges/CannaGo.png')} resizeMode='stretch' style={{ width: 80, height: 80, marginBottom: 20 }} />
              <Text style={{ ...styles.Description1, fontSize: 20, color: "#61D273", fontFamily: 'Poppins-Regular' }}>COA image is updated</Text>
            </View>
          </Modal>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

UpdateItemScreen.propTypes = {
  load: func,
  users: object,
};

const mapDispatchToProps = dispatch => ({
  load: (data) => dispatch(load(data)),
});

const mapStateToProps = ({ user }) => ({
  users: user,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UpdateItemScreen);
