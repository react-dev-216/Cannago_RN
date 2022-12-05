import React, { Component } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, TextInput, Dimensions, FlatList, Platform } from 'react-native';
import Modal from 'react-native-modalbox';
import Firebase from '../../../config/firebase'
import dayjs from 'dayjs';
import { styles } from '../../components/styles'
import AsyncStorage from '@react-native-community/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const height = Dimensions.get('screen').height;
let today = '';

export default class CheckOutScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      isEmpty: false,
      cardNum: '',
      expired_date: '',
      userId: "",
      real_data: [],
      contentList: [],
      totalPrice: '',
      stateTax: '',
      AllPrice: '',
      placeDate: true,
      placeStatus: '',
      confirmDate: '',
      confirmStatus: '',
      deliveryDate: '',
      deliveryStatus: '',
      dropDate: '',
      dropStatus: '',
    };
  }

  componentDidMount = async () => {
    const userId = await AsyncStorage.getItem("userUid");
    this.setState({ userId: userId })

    Firebase.database()
      .ref("Carts/" + this.state.userId)
      .on("value", async (snapshot) => {
        console.log("cart++++++++++")
        console.log(snapshot)
        var data = []
        var row
        snapshot.forEach(element => {
          row = {
            'Description': element.val().Description,
            'GpriceValue': element.val().GpriceValue,
            'Tag': element.val().Tag,
            'feeValue': element.val().feeValue,
            'id': element.key,
            'itemImage': element.val().itemImage,
            'itemNum1': element.val().itemNum1,
            'priceValue': element.val().priceValue,
            'productName': element.val().productName,
            'coaImage': element.val().coaImage,
            'num': element.val().num,
            'storeId': element.val().storeId
          }
          data.push(row)
          console.log("_____________+++++++++++++_________________");
          console.log(data)
          console.log("_____________+++++++++++++_________________");
        })
        await this.setState({
          real_data: data,
        });
        // console.log(this.state.real_data)
        var totalPrice = 0;
        this.state.real_data.forEach(element => {
          var itemPrice = element.priceValue * element.num
          totalPrice = totalPrice + itemPrice
        })
        await this.setState({
          totalPrice: totalPrice,
        });
        await this.setState({ stateTax: ((this.state.totalPrice + 5) * 0.089).toFixed(2) });
        await this.setState({ AllPrice: parseFloat(this.state.totalPrice + (this.state.totalPrice + 5) * 0.089 + 5).toFixed(2) })
      })
  }

  parseCardNumber = async (input) => {
    await this.setState({ cardNum: input })
    if (this.state.cardNum.length === 4) {
      await this.setState({ cardNum: this.state.cardNum + " " })
    }
    if (this.state.cardNum.length === 9) {
      await this.setState({ cardNum: this.state.cardNum + " " })
    }
    if (this.state.cardNum.length === 14) {
      await this.setState({ cardNum: this.state.cardNum + " " })
    }
    console.log(this.state.cardNum)
  }
  parseExpireDate = async (input) => {
    await this.setState({ expired_date: input })
    if (this.state.expired_date.length === 2) {
      await this.setState({ expired_date: this.state.expired_date + "/" })
    }
  }

  checkOut = async () => {
    today = new Date();
    await this.setState({ placeDate: dayjs(today).format('hh:mm A MM/DD/YYYY') })
    console.log(this.state.placeDate);
    var newItemKey = Firebase.database().ref().child('Items').push().key;
    Firebase.database().ref('OrderItems/' + this.state.real_data[0].storeId + '/' + this.state.userId).update({
      orderItem: this.state.real_data,
      placeDate: this.state.placeDate,
      placeStatus: this.state.placeStatus,
      confirmDate: this.state.confirmDate,
      confirmStatus: this.state.confirmStatus,
      deliveryDate: this.state.deliveryDate,
      deliveryStatus: this.state.deliveryStatus,
      dropDate: this.state.dropDate,
      dropStatus: this.state.dropStatus,
      AllPrice: this.state.AllPrice,
    });
    this.props.navigation.navigate("OrderStatus", { storeId: this.state.real_data[0].storeId })
  }

  render() {
    const { real_data } = this.state
    return (
      <KeyboardAwareScrollView style={{ flex: 1 }}>
        <View style={{ ...styles.container, justifyContent: 'center' }}>
          <ScrollView style={{ width: '100%', flex: 1 }}>
            <View style={{ ...styles.container }}>
              <View style={{ width: '100%', alignItems: 'center', marginTop: Platform.OS == 'ios' ? 55 : 25 }}>
                <TouchableOpacity style={styles.backBtn} onPress={() => { this.props.navigation.goBack() }}>
                  <Image source={require('../../assets/iamges/backImage.png')} resizeMode='stretch' style={styles.backImage} />
                </TouchableOpacity>
                <Text style={{ ...styles.DetailTitle, marginTop: 7 }}>PAYMENT METHOD</Text>
                <TouchableOpacity style={styles.paymethodAddBtn}>
                  <Image source={require('../../assets/iamges/paymethodAdd.png')} resizeMode='stretch' style={styles.paymethodAdd} />
                </TouchableOpacity>
              </View>
              <View style={styles.paymenntArea}>
                <Text style={styles.OrderSummeryTxt}>Order Summery</Text>
                <View style={styles.orderContent}>
                  <FlatList
                    style={{ width: '100%' }}
                    numColumns={1}
                    data={real_data.length == 0 ? this.state.contentList : real_data}
                    renderItem={({ item }) => (
                      // <TouchableOpacity style={styles.StoreItem} onPress={() => { this.props.navigation.navigate("ProductScreen", { storeId: item.id }) }}>
                      <View style={styles.ContentItem}>
                        <Text style={styles.ItemTxt}>{item.productName} X {item.num}</Text>
                        <Text style={styles.ItemTxt}>$ {parseFloat(item.priceValue * item.num).toFixed(2)}</Text>
                      </View>
                    )}
                    keyExtractor={item => `${item.id}`}
                  />
                  <View style={styles.ContentItem}>
                    <Text style={styles.ItemTxt}>Service Fee</Text>
                    <Text style={styles.ItemTxt}>$5.00</Text>
                  </View>
                  <View style={styles.ContentItem}>
                    <Text style={styles.ItemTxt}>State Tax</Text>
                    <Text style={styles.ItemTxt}>$ {this.state.stateTax}</Text>
                  </View>
                </View>
                <View style={styles.ContentItem}>
                  <Text style={styles.ItemTxt}>Total Amount</Text>
                  <Text style={{ ...styles.ItemTxt, color: '#E47911' }}>$ {this.state.AllPrice}</Text>
                </View>
                <View style={styles.ContentItem}>
                  <Text style={styles.ItemTxt}>Promo Code</Text>
                </View>
                <View style={styles.ContentItem}>
                  <TextInput style={styles.PromoInput} placeholder="Type here" />
                  <TouchableOpacity style={styles.ApplyBtn}>
                    <Text style={styles.applyBtnTxt}>Apply</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ ...styles.ContentItem, marginTop: 30 }}>
                  <Text style={styles.ItemTxt}>Card Number</Text>
                </View>
                <View style={styles.ContentItem}>
                  <TextInput keyboardType="number-pad" value={this.state.cardNum} onChangeText={(input) => { this.parseCardNumber(input) }} maxLength={19} style={styles.CardNumberInput} placeholderTextColor="#5E5E5E" placeholder="xxxx xxxx xxxx 1278" />
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ width: '50%' }}>
                    <View style={styles.ContentItem}>
                      <Text style={styles.ItemTxt}>Expiration Date</Text>
                    </View>
                    <View style={styles.ContentItem}>
                      <TextInput keyboardType="number-pad" value={this.state.expired_date} onChangeText={(input) => { this.parseExpireDate(input) }} maxLength={5} style={{ ...styles.CardNumberInput, width: 96 }} placeholderTextColor="#5E5E5E" placeholder="06/22" />
                    </View>
                  </View>
                  <View style={{ width: '50%' }}>
                    <View style={styles.ContentItem}>
                      <Text style={styles.ItemTxt}>CVC</Text>
                    </View>
                    <View style={styles.ContentItem}>
                      <TextInput style={{ ...styles.CardNumberInput, width: 96 }} keyboardType="number-pad" maxLength={3} placeholderTextColor="#5E5E5E" placeholder="071" />
                    </View>
                  </View>
                </View>
                <View style={{ ...styles.ContentItem, marginTop: 10 }}>
                  <Text style={styles.ItemTxt}>Drop off Address</Text>
                </View>
                <View style={styles.inputItem}>
                  <Image source={require('../../assets/iamges/position.png')} resizeMode='stretch' style={styles.InputImage3} />
                  <TextInput style={styles.inputTxt} placeholderTextColor="#7a7a7b" placeholder="Street Address" value={this.state.storeStreetAdress} onChangeText={(text) => { this.setState({ storeStreetAdress: text }) }}></TextInput>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View style={styles.inputItem2}>
                    <TextInput style={styles.inputTxt2} placeholderTextColor="#7a7a7b" placeholder="City" value={this.state.city} onChangeText={(text) => { this.setState({ city: text }) }}></TextInput>
                  </View>
                  <View style={styles.inputItem2}>
                    <TextInput style={styles.inputTxt2} placeholderTextColor="#7a7a7b" editable={false} placeholder="GA" value="GA" value={this.state.GA} onChangeText={(text) => { this.setState({ GA: text }) }}></TextInput>
                  </View>
                  <View style={styles.inputItem2}>
                    <TextInput style={styles.inputTxt2} placeholderTextColor="#7a7a7b" keyboardType="number-pad" placeholder="Zip Code" maxLength={5} value={this.state.zipCode} onChangeText={(text) => { this.setState({ zipCode: text }) }}></TextInput>
                  </View>
                </View>
                <View style={{ ...styles.ContentItem, marginTop: 10 }}>
                  <Text style={styles.ItemTxt}>Special request</Text>
                </View>
                <View style={styles.ContentItem}>
                  <TextInput style={styles.specialInput} multiline={true} placeholderTextColor="#5E5E5E" placeholder="The gate code is #01234" />
                </View>
              </View>
              <TouchableOpacity style={{ ...styles.signinBtn, width: '85%', alignSelf: 'center' }} onPress={() => { this.checkOut() }}>
                <Text style={styles.signinTxt1}>Check Out</Text>
              </TouchableOpacity>
            </View>
            <View style={{ height: 150 }}></View>
          </ScrollView>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}
