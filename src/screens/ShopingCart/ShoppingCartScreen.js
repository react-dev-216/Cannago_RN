import React, { Component } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ImageBackground, TextInput, FlatList, Dimensions, Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Modal from 'react-native-modalbox';
import AlertModal from '../../components/AlertModal'
import Spinner from 'react-native-loading-spinner-overlay';
import NonImage from '../../assets/iamges/productDetail1.png'
import Firebase from '../../../config/firebase'

import { styles } from '../../components/styles'

const height = Dimensions.get('screen').height;
const width = Dimensions.get('screen').width;
var totalPrice = 0.0

export default class ShoppingCartScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      isEmpty: true,
      itemNum1: 2,
      itemNum2: 1,
      usertype: 'consumer',
      real_data: [],
      userId: "",
      isLoading: false,
      isModalVisible: false,
      alertContent: '',
      isModalVisible1: false,
      auto_num: 0,
      order_data: '',
      totalPrice: ''
    };
    this.addPriceValue = this.addPriceValue.bind(this)
  }
  componentDidMount = async () => {
    const usertype = await AsyncStorage.getItem("usertype");
    const userId = await AsyncStorage.getItem("userUid");
    await this.setState({userId:userId})
    await this.setState({ usertype: usertype })
    // this.setState({ userId: userId })
    const { navigation } = this.props
    this.focusListener = navigation.addListener('didFocus', () => {
      this.loadData();
    });
    this.loadData();

    console.log(this.state.storeId);
    Firebase.database()
      .ref('OrderItems/' + this.state.userId)
      .on("value", async (snapshot) => {
        console.log("++++++++++++++store+++++++++++++++++++");
        console.log(snapshot);
        var data = []
        var row
        snapshot.forEach(element => {
          console.log(element.val().orderItem);
          row = {
            "confirmDate": element.val().confirmDate,
            "confirmStatus": element.val().confirmStatus,
            "deliveryDate": element.val().deliveryDate,
            "deliveryStatus": element.val().deliveryStatus,
            "dropDate": element.val().dropDate,
            "dropStatus": element.val().dropStatus,
            "placeDate": element.val().placeDate,
            "placeStatus": element.val().placeStatus,
            "allPrice": element.val().AllPrice,
            "oderId": element.key,
            "orderItem": element.val().orderItem
          };
          data.push(row)
        })
        await this.setState({
          order_data: data,
        });
        console.log("++++++++++++++store+++++++++++++++++++");
        console.log(this.state.order_data[0].orderItem);
        console.log("++++++++++++++store+++++++++++++++++++");
      })
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  loadData = async () => {
    console.log("loadData++++++++++++++");
    Firebase.database()
      .ref("Carts/" + this.state.userId)
      .on("value", async (snapshot) => {
        var data = []
        var row
        snapshot.forEach(element => {
          row = {
            "Description": element.val().Description,
            "GpriceValue": element.val().GpriceValue,
            "Tag": element.val().Tag,
            "feeValue": element.val().feeValue,
            "id": element.key,
            "itemImage": element.val().itemImage,
            "itemNum1": element.val().itemNum1,
            "priceValue": element.val().priceValue,
            "productName": element.val().productName,
            "num": element.val().num,
            "coaImage": element.val().coaImage,
            "storeId": element.val().storeId,
          }
          data.push(row)
        });
        // console.log("_____________+++++++++++++_________________");
        // console.log(data)
        await this.setState({
          real_data: data,
        });
        console.log("================+++++++++++++_________________");
        console.log(this.state.real_data[0])
      })
  }

  closeModal = () => {
    this.refs.modal6.close();
    // this.props.navigation.navigate('LoginScreen');
  }

  GoBack = () => {
    this.props.navigation.navigate("ProductDetailScreen")
  }

  Addcart = (index, id) => {
    console.log(id);
    console.log("addcart++++++++++++_____________");
    console.log(this.state.real_data[index]);
    this.state.real_data[index].num += 1
    Firebase.database()
      .ref('Carts/' + this.state.userId + '/' + id)
      .update({
        "Description": this.state.real_data[index].Description,
        "GpriceValue": this.state.real_data[index].GpriceValue,
        "Tag": this.state.real_data[index].Tag,
        "feeValue": this.state.real_data[index].feeValue,
        "id": id,
        "itemImage": this.state.real_data[index].itemImage,
        "itemNum1": this.state.real_data[index].itemNum1,
        "priceValue": this.state.real_data[index].priceValue,
        "productName": this.state.real_data[index].productName,
        "coaImage": this.state.real_data[index].coaImage,
        "num": this.state.real_data[index].num,
        "storeId": this.state.real_data[index].storeId
      });
    this.setState({ auto_num: this.state.auto_num + 1 })
  }

  Minuscart = async (index, id) => {
    console.log("mincart+++++++++++++++");
    console.log(id);
    this.state.real_data[index].num -= 1
    if (this.state.real_data[index].num <= 0) {
      await Firebase.database().ref('Carts/' + this.state.userId + '/' + id).remove();
    } else {
      Firebase.database()
        .ref('Carts/' + this.state.userId + '/' + id)
        .update({
          Description: this.state.real_data[index].Description,
          GpriceValue: this.state.real_data[index].GpriceValue,
          Tag: this.state.real_data[index].Tag,
          feeValue: this.state.real_data[index].feeValue,
          id: id,
          itemImage: this.state.real_data[index].itemImage,
          itemNum1: this.state.real_data[index].itemNum1,
          priceValue: this.state.real_data[index].priceValue,
          productName: this.state.real_data[index].productName,
          coaImage: this.state.real_data[index].coaImage,
          num: this.state.real_data[index].num,
          storeId: this.state.real_data[index].storeId
        });
      this.setState({ auto_num: this.state.auto_num + 1 })
    }
  }

  chageState = async () => {
    await this.setState({ isEmpty: false })
  }

  GotoNextScreen = async () => {
    this.props.navigation.navigate("CheckOutScreen")
  }

  cutText = (e, length) => {
    return e.length < length ? e : e.substring(0, length) + '...';
  }

  addPriceValue(index) {
    var price = 0.0
    totalPrice = 0.0
    this.state.order_data[index].orderItem.forEach(element => {
      price = parseFloat(element.priceValue) * element.num
      totalPrice = totalPrice + price
    })
    // this.setState({ totalPrice: price })
    return parseFloat(totalPrice).toFixed(2)
  }

  render() {
    const { real_data } = this.state
    return (
      <View style={{ ...styles.container, justifyContent: 'center' }}>
        {this.state.usertype == "consumer" ?
          real_data.length == 0 ?
            <View style={{ alignItems: 'center', height: '100%', justifyContent: 'center' }}>
              <Text style={{ ...styles.CartTitle, marginTop: Platform.OS == 'ios' ? 7 : -10 }}>Cart</Text>
              <TouchableOpacity onPress={() => { this.props.navigation.navigate("HomeScreen") }}>
                <Image source={require('../../assets/iamges/plusImage.png')} resizeMode='stretch' style={styles.plusImage} />
              </TouchableOpacity>
              <Text style={{ ...styles.AddShopiingTxt, color: '#414041' }}>Shopping Cart Empty</Text>
            </View>
            :
            <View style={{ width: '100%', flex: 1, alignItems: 'center' }}>
              <ScrollView style={{ width: '100%', flex: 1 }}>
                <View style={{ ...styles.container, flex: 1 }}>
                  <View style={{ width: '100%', alignItems: 'center', marginTop: Platform.OS == 'ios' ? 55 : 25 }}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => { this.GoBack() }}>
                      <Image source={require('../../assets/iamges/backImage.png')} resizeMode='stretch' style={styles.backImage} />
                    </TouchableOpacity>
                    <Text style={{ ...styles.DetailTitle, marginTop: 7 }}>Cart</Text>

                    <FlatList
                      // showsVerticalScrollIndicator={true}
                      style={{ width: '100%' }}
                      numColumns={1}
                      data={real_data}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({ item, index }) => (
                        <View style={styles.cartItemArea}>
                          <View style={styles.cartImage}>
                            <Image source={{ uri: item.itemImage }} resizeMode='stretch' style={styles.productCartImage} />
                          </View>
                          <View>
                            <Text style={styles.productDescription}>{item.productName}</Text>
                            <Text style={{ ...styles.productDescription, color: "#61D273" }}>$ {item.priceValue}</Text>
                            <View style={styles.countItem}>
                              <TouchableOpacity style={styles.cartAccountArea} onPress={() => { this.Minuscart(index, item.id) }}>
                                <Text style={styles.cartAddBtn}>-</Text>
                              </TouchableOpacity>
                              <View style={styles.cartAccountArea}>
                                <Text style={styles.cartAddBtn}>{item.num}</Text>
                              </View>
                              <TouchableOpacity style={styles.cartAccountArea} onPress={() => { this.Addcart(index, item.id) }}>
                                <Text style={styles.cartAddBtn}>+</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      )}
                      keyExtractor={item => `${item.id}`}
                    />
                  </View>
                </View>
                <View style={{ height: 150 }}></View>
              </ScrollView>
              <TouchableOpacity style={styles.AddCartBtn1} onPress={() => { this.GotoNextScreen() }}>
                <Text style={styles.signinTxt1}>Next</Text>
              </TouchableOpacity>
            </View> :
          this.state.usertype == "dispensary" ?
            <View style={{ backgroundColor: '#61D273', height: '100%', width: '100%' }}>
              <View style={{ ...styles.container, backgroundColor: '#61D273', position: 'absolute' }}>
                <View style={{ width: '100%', alignItems: 'center', marginTop: Platform.OS == 'ios' ? 60 : 40 }}>
                  <View style={styles.personUploadgImage}>
                    <Text style={{ ...styles.inputTxt, color: "white", alignSelf: 'center', marginTop: -30, fontSize: 28, fontFamily: 'Poppins-SemiBold' }}>Order Histroy</Text>
                  </View>
                </View>
              </View>
              <ImageBackground source={require('../../assets/iamges/orderBackgroudImage.png')} resizeMode='stretch' style={{ ...styles.backgroundImage, width: width * 0.9 }} >
                <View style={{ width: '100%', marginBottom:180 }}>
                  <FlatList
                    data={this.state.order_data ? this.state.order_data : []}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                      <View style={styles.historyItem}>
                        <Text style={styles.ItemHeader}>Order Placed {item.placeDate}</Text>
                        <Text style={styles.ItemHeader}>Order Reference #{this.cutText(item.oderId, 10)}</Text>
                        <FlatList
                          data={item.orderItem}
                          keyExtractor={(newItem, newIndex) => newIndex.toString()}
                          renderItem={({ item, newIndex }) => (
                            <View style={styles.historyContent}>
                              <View style={styles.histroyImageArea}>
                                <Image source={{ uri: item.itemImage }} resizeMode='stretch' style={{ width: 60, height: 60 }} />
                              </View>
                              <View>
                                <Text style={styles.ItemHeader}>{item.productName}</Text>
                                <Text style={styles.ItemHeader}>from Cannabis Station </Text>
                                <View style={{ flexDirection: 'row' }}>
                                  <Text style={styles.ItemHeader}>Quantity</Text>
                                  <View style={styles.qualityArea}>
                                    <Text style={styles.ItemHeader}>{item.num}</Text>
                                  </View>
                                </View>
                                <Text style={{ ...styles.ItemHeader, color: '#61D273' }}>${item.priceValue}</Text>
                              </View>
                            </View>
                          )}
                        />
                        <View style={{ flexDirection: 'row', width: '80%', justifyContent: 'space-between' }}>
                          <Text style={{ ...styles.ItemHeader, textAlign: 'center', marginTop: 10 }}>Product Total</Text>
                          {/* <Text style={{ ...styles.ItemHeader, textAlign: 'center', marginTop: 10 }}>$ {index}</Text> */}
                          <Text style={{ ...styles.ItemHeader, textAlign: 'center', marginTop: 10 }}>$ {this.addPriceValue(index)}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', width: '80%', justifyContent: 'space-between' }}>
                          <Text style={{ ...styles.ItemHeader, textAlign: 'center', marginTop: 10 }}>CannaGo Service Fee</Text>
                          <Text style={{ ...styles.ItemHeader, textAlign: 'center', marginTop: 10 }}>-${parseFloat(totalPrice * 0.3).toFixed(2)}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', width: '80%', justifyContent: 'space-between' }}>
                          <Text style={{ ...styles.ItemHeader, textAlign: 'center', marginTop: 10 }}>Your Payout</Text>
                          <Text style={{ ...styles.ItemHeader, textAlign: 'center', marginTop: 10, color: '#61D273' }}>${parseFloat(totalPrice * 0.7).toFixed(2)}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                          <TouchableOpacity style={styles.orderBtn}>
                            <Text style={styles.OrderTxt}>Order Ready for Pickup</Text>
                          </TouchableOpacity>
                          <TouchableOpacity>
                            <Text style={{ ...styles.ReportTxt, marginTop: 7 }}>Don't have Item</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  />

                  {/* <View style={styles.historyItem}>
                    <Text style={styles.ItemHeader}>Order Placed 11/24/20,11:04 AM</Text>
                    <Text style={styles.ItemHeader}>Order Reference #HEYF71736JDH</Text>
                    <View style={styles.historyContent}>
                      <View style={styles.histroyImageArea}>
                        <Image source={require('../../assets/iamges/product1.png')} resizeMode='stretch' style={{ width: 60, height: 60 }} />
                      </View>
                      <View>
                        <Text style={styles.ItemHeader}>Just Pure Karma</Text>
                        <Text style={styles.ItemHeader}>from Cannabis Station </Text>
                        <View style={{ flexDirection: 'row' }}>
                          <Text style={styles.ItemHeader}>Quantity</Text>
                          <View style={styles.qualityArea}>
                            <Text style={styles.ItemHeader}>2</Text>
                          </View>
                        </View>
                        <Text style={{ ...styles.ItemHeader, color: '#61D273' }}>$30.00</Text>
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', width: '80%', justifyContent: 'space-between' }}>
                      <Text style={{ ...styles.ItemHeader, textAlign: 'center', marginTop: 10 }}>Product Total</Text>
                      <Text style={{ ...styles.ItemHeader, textAlign: 'center', marginTop: 10 }}>$27.55</Text>
                    </View>
                    <View style={{ flexDirection: 'row', width: '80%', justifyContent: 'space-between' }}>
                      <Text style={{ ...styles.ItemHeader, textAlign: 'center', marginTop: 10 }}>CannnaGo Service Fee</Text>
                      <Text style={{ ...styles.ItemHeader, textAlign: 'center', marginTop: 10 }}>-$8.26</Text>
                    </View>
                    <View style={{ flexDirection: 'row', width: '80%', justifyContent: 'space-between' }}>
                      <Text style={{ ...styles.ItemHeader, textAlign: 'center', marginTop: 10 }}>Your Payout</Text>
                      <Text style={{ ...styles.ItemHeader, textAlign: 'center', marginTop: 10, color: '#61D273' }}>$19.00</Text>
                    </View>
                    <View style={styles.historyContent}>
                      <View style={styles.histroyImageArea}>
                        <Image source={require('../../assets/iamges/product4.png')} resizeMode='stretch' style={{ width: 70, height: 70 }} />
                      </View>
                      <View>
                        <Text style={styles.ItemHeader}>Hemp Oil</Text>
                        <Text style={{ ...styles.ItemHeader, color: '#61D273' }}>$25</Text>
                      </View>
                    </View>
                    <Text style={{ ...styles.ItemHeader, textAlign: 'center', }}>Order Completed 11/22/20, 10:32 AM</Text>
                    <Text style={{ ...styles.ItemHeader, textAlign: 'center', marginTop: 10 }}>Total Amount: <Text style={{ color: '#61D273' }}>$50</Text></Text>
                    <TouchableOpacity onPress={() => this.refs.modal6.open()}>
                      <Text style={styles.ReportTxt}>Report an Issue</Text>
                    </TouchableOpacity>
                  </View> */}
                  <View style={{ height: 200 }}></View>
                </View>
              </ImageBackground>
              <Modal style={styles.modal1} position={"bottom"} ref={"modal6"} swipeArea={20}>
                <TouchableOpacity style={styles.closeBtn} onPress={() => { this.closeModal() }}>
                  <Image source={require('../../assets/iamges/close.png')} resizeMode='stretch' style={styles.closeImage} />
                </TouchableOpacity>
                <Text style={styles.MessageTxt}>Message</Text>
                <TextInput style={styles.contactlInput} multiline={true} placeholderTextColor="#BCBCBC" placeholder={'Order Reference #FG1735UIWH7\nType here...'} />
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
            </View> :
            <View style={{ backgroundColor: '#61D273', height: '100%', width: '100%' }}>
              <View style={{ ...styles.container, backgroundColor: '#61D273', position: 'absolute' }}>
                <View style={{ width: '100%', alignItems: 'center', marginTop: Platform.OS == 'ios' ? 60 : 40 }}>
                  <View style={styles.personUploadgImage}>
                    <Text style={{ ...styles.inputTxt, color: "white", alignSelf: 'center', marginTop: -30, fontSize: 28, fontFamily: 'Poppins-SemiBold' }}>Driver Histroy</Text>
                  </View>
                </View>
              </View>
              <ImageBackground source={require('../../assets/iamges/orderBackgroudImage.png')} resizeMode='stretch' style={{ ...styles.backgroundImage, width: width * 0.9 }} >
                <ScrollView style={{ width: '100%' }}>
                  <View style={styles.historyItem}>
                    <View style={styles.historyContent}>
                      <View style={styles.histroyImageArea}>
                        <Image source={require('../../assets/iamges/product3.png')} resizeMode='stretch' style={{ width: 60, height: 60 }} />
                      </View>
                      <View>
                        <Text style={styles.ItemHeader}>Victor N. Order</Text>
                        <Text style={{ ...styles.ItemHeader, color: '#61D273' }}>Earned $5.00 + $2.36 Tip</Text>
                        <Text style={styles.ItemHeader}>Date Completed 06/28/2019 </Text>
                      </View>
                    </View>
                    <TouchableOpacity style={{ marginTop: 30 }} onPress={() => this.refs.modal6.open()}>
                      <Text style={styles.ReportTxt}>Report an Issue</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.historyItem}>
                    <View style={styles.historyContent}>
                      <View style={styles.histroyImageArea}>
                        <Image source={require('../../assets/iamges/product3.png')} resizeMode='stretch' style={{ width: 60, height: 60 }} />
                      </View>
                      <View>
                        <Text style={styles.ItemHeader}>Meg F. Order</Text>
                        <Text style={{ ...styles.ItemHeader, color: '#61D273' }}>Earned $5.00 + $2.36 Tip</Text>
                        <Text style={styles.ItemHeader}>Date Completed 06/25/2019 </Text>
                      </View>
                    </View>
                    <TouchableOpacity style={{ marginTop: 30 }} onPress={() => this.refs.modal6.open()}>
                      <Text style={styles.ReportTxt}>Report an Issue</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ height: 200 }}></View>
                </ScrollView>
              </ImageBackground>
              <Modal style={styles.modal1} position={"bottom"} ref={"modal6"} swipeArea={20}>
                <TouchableOpacity style={styles.closeBtn} onPress={() => { this.closeModal() }}>
                  <Image source={require('../../assets/iamges/close.png')} resizeMode='stretch' style={styles.closeImage} />
                </TouchableOpacity>
                <Text style={styles.MessageTxt}>Message</Text>
                <TextInput style={styles.contactlInput} multiline={true} placeholderTextColor="#BCBCBC" placeholder={'Order Reference #FG1735UIWH7\nType here...'} />
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
            </View>
        }
      </View>
    );
  }
}
