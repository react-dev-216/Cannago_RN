import React, { Component } from 'react';
import { View, Text, Image, ScrollView, FlatList, Dimensions, Platform, RefreshControl } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Firebase from '../../../config/firebase'

import { styles } from '../../components/styles'
const width = Dimensions.get('screen').width * 0.9 / 2 - 20;

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      storeId: '',
      real_data: [],
      contentList: [],
      refreshing: false
    };
  }

  componentDidMount = async () => {
    await this.setState({ storeId: this.props.navigation.getParam('storeId') })
    console.log(this.state.storeId)

    this.loadData();
  }

  loadData = async () => {
    Firebase.database()
      .ref("Items/" + this.state.storeId)
      .on("value", (snapshot) => {
        var data = []
        var row
        snapshot.forEach(element => {
          row = {
            id: element.key,
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
        console.log("_____________+++++++++++++_________________");
        console.log(data)
        this.setState({
          real_data: data,
        });
        this.setState({ refreshing: false })
      })
  }
  _rendermakelist({ item, index }) {
    return (
      <TouchableOpacity style={styles.StoreItem} >
        <Text style={styles.homeTitle}> {item.Title} </Text>
        <Image source={item.ImageUrl} resizeMode='stretch' style={styles.storeImage} />
        <View style={styles.storeDes}>
          <Text style={styles.desTxt}>{item.price}</Text>
          <Text style={styles.desTxt}>{item.Description}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  _onRefresh = () => {
    this.setState({ refreshing: true })
    this.loadData()
  }

  render() {
    const { real_data } = this.state
    return (
      //   <View style={{flex: 1, alignItems: "center",}}>
      <View style={{ paddingTop: Platform.OS === 'ios' ? 70 : 30, backgroundColor: 'white', flex: 1 }}>
        <TouchableOpacity onPress={() => { this.props.navigation.goBack() }}>
          <Image source={require('../../assets/iamges/backImage.png')} resizeMode='stretch' style={{ ...styles.backImage }} />
        </TouchableOpacity>
        <View style={{ paddingHorizontal: '5%', flex: 1 }}>
          <FlatList
            numColumns={2}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={() => this._onRefresh()}
              />
            }
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            // showsVerticalScrollIndicator={true}
            data={real_data.length == 0 ? this.state.contentList : real_data}
            renderItem={({ item }) => (
              <TouchableOpacity style={{ width: width, height: 201, marginHorizontal: 10, marginTop: 30 }} onPress={() => { this.props.navigation.navigate('ProductDetailScreen', { productId: item.id, storeId: this.state.storeId }) }}>
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
          <View style={{ height: 150 }}></View>
        </View>
      </View>
    );
  }
}
