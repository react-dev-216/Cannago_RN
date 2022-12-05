import React, { Component } from 'react';
import { View, Text, Image, ScrollView, FlatList, Dimensions, RefreshControl } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import Firebase from '../../../config/firebase'
import AlertModal from '../../components/AlertModal'
import Modal from 'react-native-modal';

import { func, string, bool, object, array } from "prop-types";
import { connect } from "react-redux";
import { load } from "./../../store/reducers/user";

import { styles } from '../../components/styles';
const width = Dimensions.get('screen').width * 0.9 / 2 - 20;

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usertype: 'consumer',
      real_data: [],
      userId: "",
      contentList: [],
      contentList1: [
      ],
      refreshing: false,
      store_data: [],
      isTouchable: false,
      cartStoreId: "",
      storeId: '',
      touchFlag: true,
      isModalVisible: false,
    };
  }

  componentDidMount = async () => {
    const { real_data } = this.props
    const usertype = await AsyncStorage.getItem("usertype");
    const userId = await AsyncStorage.getItem("userUid");
    await this.setState({ usertype: usertype })
    await this.setState({ userId: userId })
    console.log(this.state.userId)

    Firebase.database()
      .ref("Carts/" + this.state.userId)
      .on("value", async (snapshot) => {
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
          storeId: data,
        });
        console.log("================+++++++++++++_________________");
        console.log(this.state.storeId[0].storeId)
        console.log(this.state.storeId)
      })

    const { navigation } = this.props
    this.focusListener = navigation.addListener('didFocus', () => {
      Firebase.database()
        .ref("Carts/" + this.state.userId)
        .on("value", async (snapshot) => {
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
            storeId: data,
          });
          console.log("================+++++++++++++_________________");
          console.log(this.state.storeId[0].storeId)
          console.log(this.state.storeId)
        })
    });
    this.loadData();
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  loadData = async () => {
    Firebase.database()
      .ref("Items/" + this.state.userId)
      .on("value", (snapshot) => {
        var data = []
        var row
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
        this.setState({
          real_data: data,
        });
        this.setState({ refreshing: false })
      })

    Firebase.database()
      .ref("user")
      .on("value", async (snapshot) => {
        var data = []
        var row
        snapshot.forEach(element => {
          // console.log(element.key)
          if (element.val().hasOwnProperty('dispensary')) {
            row = {
              id: element.key,
              store: element.val().dispensary.storeName,
              ImageUrl: element.val().dispensary.profileimage,
              usertype: element.val().dispensary.userType,
            }
            data.push(row)
            console.log(data);
          }
        });
        this.setState({
          store_data: data,
        });
        this.setState({ refreshing: false })
      })


  }

  _onRefresh = () => {
    this.setState({ refreshing: true })
    this.loadData()
  }

  _rendermakelist({ item, index }) {
    return (
      <TouchableOpacity style={styles.StoreItem} onPress={() => { this.props.navigation.navigate("TouchableOpacity") }}>
        <Text style={styles.homeTitle}> {item.Title} </Text>
        <Image source={item.ImageUrl} resizeMode='stretch' style={styles.storeImage} />
        <View style={styles.storeDes}>
          <Text style={styles.desTxt}>{item.price}</Text>
          <Text style={styles.desTxt}>{item.time}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  gotoNextScreen = async (id) => {
    console.log(id);
    console.log("444444444444444444444444444444");
    // console.log(this.state.storeId[0].storeId);
    this.state.storeId.length == 0 ? await this.setState({ touchFlag: false }) : this.state.storeId[0].storeId == id ? await this.setState({ touchFlag: false }) : await this.setState({ touchFlag: true })
    if (this.state.touchFlag == true) {
      this.setState({ alertContent: "You can only order products from one store at a time", isModalVisible: true })
    } else {
      this.props.navigation.navigate("ProductScreen", { storeId: id })
    }
  }

  render() {
    const { real_data, store_data, storeId } = this.state
    return (
      <View style={{ flex: 1, alignItems: "center", backgroundColor: 'white' }}>
        <Modal isVisible={this.state.isModalVisible}>
          <AlertModal alertContent={this.state.alertContent} onPress={() => this.setState({ isModalVisible: false })} />
        </Modal>
        {this.state.usertype == "consumer" ?
          <View style={{ width: '100%', borderColor: 'white', flex: 1, }}>
            <View style={{ ...styles.container, paddingTop: 30 }}>
              <FlatList
                // showsVerticalScrollIndicator={true}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={() => this._onRefresh()}
                  />
                }
                style={{ width: '100%' }}
                numColumns={1}
                data={store_data.length == 0 ? this.state.contentList : store_data}
                renderItem={({ item }) => (
                  // <TouchableOpacity style={styles.StoreItem} onPress={() => { this.props.navigation.navigate("ProductScreen", { storeId: item.id }) }}>
                  <TouchableOpacity style={styles.StoreItem} onPress={() => { this.gotoNextScreen(item.id) }}>
                    <Text style={styles.homeTitle}> {item.store} </Text>
                    <Image source={store_data.length == 0 ? item.ImageUrl : { uri: item.ImageUrl }} resizeMode='cover' style={styles.storeImage} />
                    <View style={styles.storeDes1}>
                      <Text style={styles.desTxt}>Store's pricing: $$</Text>
                      <Text style={styles.desTxt}>Store's Hours Today: 8am - 7pm</Text>
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={item => `${item.id}`}
              />
            </View>
            <View style={{ height: 150, backgroundColor: 'white' }}></View>
          </View> :
          <View style={{ paddingTop: Platform.OS === 'ios' ? 70 : 30, backgroundColor: 'white', flex: 1, width: '100%' }}>
            <Text style={{ ...styles.CartTitle, marginTop: Platform.OS == 'ios' ? 7 : -10 }}>Your Store Front</Text>
            <TouchableOpacity style={styles.addItemBtn} onPress={() => { this.props.navigation.navigate("AddStoreItemScreen") }}>
              <Image source={require('../../assets/iamges/addImage.png')} resizeMode='stretch' style={styles.addImage} />
            </TouchableOpacity>
            <View style={{ paddingHorizontal: '5%', height: '100%', paddingBottom: Platform.OS == 'ios' ? 200 : 100, width: '100%' }}>
              <FlatList
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={() => this._onRefresh()}
                  />
                }
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                // showsVerticalScrollIndicator={true}
                data={real_data.length == 0 ? this.state.contentList1 : real_data}
                renderItem={({ item }) => (
                  <TouchableOpacity style={{ width: width, height: 201, marginHorizontal: 10, marginTop: 30 }} onPress={() => { this.props.navigation.navigate('UpdateItemScreen', { item: item }) }}>
                    <View style={{ justifyContent: 'center', height: 134, alignItems: 'center', borderWidth: 2, borderColor: '#61D273', borderTopLeftRadius: 30 }}>
                      <Image source={real_data.length == 0 ? item.ImageUrl : { uri: item.itemImage }} resizeMode='cover' style={{ ...styles.productImage, borderTopLeftRadius: Platform.OS === 'ios' ? 30 : 30 }} />
                      <Text style={styles.desTxt1}>$ {parseFloat(item.priceValue).toFixed(2)}</Text>
                    </View>
                    <View style={styles.storeDes}>
                      <Text style={styles.desTxt}>{item.productName}</Text>
                      <TouchableOpacity>
                        <Image source={require('../../assets/iamges/rightArror.png')} resizeMode='stretch' style={{ height: 16, width: 16, marginTop: 10 }} />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={item => `${item.id}`}
              />
            </View>
          </View>
        }
      </View>
    );
  }
}

HomeScreen.propTypes = {
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
)(HomeScreen);
