import React, { Component } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, TextInput, ImageBackground, Dimensions, Platform } from 'react-native';
import Modal from 'react-native-modalbox';
import Firebase from '../../../config/firebase'
const width = Dimensions.get('screen').width;

import { styles } from '../../components/styles'

export default class OrderHistoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      userId: "",
    };
  }

  componentDidMount = async () => {
    await this.setState({ storeId: this.props.navigation.getParam('storeId') })
    const userId = await AsyncStorage.getItem("userUid");
    this.setState({ userId: userId })
    console.log(this.state.storeId);
    Firebase.database()
      .ref('OrderItems/' + this.state.userId)
      .on("value", async (snapshot) => {
        console.log("++++++++++++++store+++++++++++++++++++");
        console.log(snapshot);
        var data = []
        var row
        snapshot.forEach(element => {
          row = {
            confirmDate: element.confirmDate,
            confirmStatus: element.confirmStatus,
            deliveryDate: element.deliveryDate,
            deliveryStatus: element.deliveryStatus,
            dropDate: element.dropDate,
            dropStatus: element.dropStatus,
            placeDate: element.placeDate,
            placeStatus: element.placeStatus,
          };
          data.push(row)
        })
        await this.setState({
          order_data: data,
        });
        console.log("++++++++++++++store+++++++++++++++++++");
        console.log(this.state.order_data);
      })
  }

  closeModal = () => {
    this.refs.modal6.close();
    // this.props.navigation.navigate('LoginScreen');
  }

  render() {
    return (
      <View style={{ backgroundColor: '#61D273', height: '100%', width: '100%' }}>
        <View style={{ ...styles.container, backgroundColor: '#61D273', position: 'absolute' }}>
          <View style={{ width: '100%', alignItems: 'center', marginTop: Platform.OS == 'ios' ? 60 : 40 }}>
            <TouchableOpacity style={styles.backBtn} onPress={() => { this.props.navigation.goBack() }}>
              <Image source={require('../../assets/iamges/backImage.png')} resizeMode='stretch' style={styles.backImage} />
            </TouchableOpacity>
            <View style={styles.personUploadgImage}>
              <Text style={{ ...styles.inputTxt, color: "white", alignSelf: 'center', marginTop: -30, fontSize: 28, fontFamily: 'Poppins-SemiBold' }}>Order Histroy</Text>
            </View>
          </View>
        </View>
        <ImageBackground source={require('../../assets/iamges/orderBackgroudImage.png')} resizeMode='stretch' style={{ ...styles.backgroundImage, width: width * 0.9 }} >
          <ScrollView style={{ width: '100%' }}>
            <View style={styles.historyItem}>
              <Text style={styles.ItemHeader}>Order Reference #FG1735UIWH7</Text>
              <View style={styles.historyContent}>
                <View style={styles.histroyImageArea}>
                  <Image source={require('../../assets/iamges/product3.png')} resizeMode='stretch' style={{ width: 60, height: 60 }} />
                </View>
                <View>
                  <Text style={styles.ItemHeader}>Just CBD Gummies</Text>
                  <Text style={styles.ItemHeader}>from Cannabis Station </Text>
                  <Text style={{ ...styles.ItemHeader, color: '#61D273' }}>$24.99</Text>
                </View>
              </View>
              <View style={styles.historyContent}>
                <View style={styles.histroyImageArea}>
                  <Image source={require('../../assets/iamges/product2.png')} resizeMode='stretch' style={{ width: 70, height: 70 }} />
                </View>
                <View>
                  <Text style={styles.ItemHeader}>Just CBD Gummies</Text>
                  <Text style={styles.ItemHeader}>from Cannabis Station </Text>
                  <Text style={{ ...styles.ItemHeader, color: '#61D273' }}>$24.99</Text>
                </View>
              </View>
              <Text style={{ ...styles.ItemHeader, textAlign: 'center', marginTop: 30 }}>Delivered 11/22/20, 10:32 AM</Text>
              <Text style={{ ...styles.ItemHeader, textAlign: 'center', marginTop: 10 }}>Total Amount: <Text style={{ color: '#61D273' }}>$47.88</Text></Text>
              <TouchableOpacity onPress={() => this.refs.modal6.open()}>
                <Text style={styles.ReportTxt}>Report an Issue</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.historyItem}>
              <Text style={styles.ItemHeader}>Order Reference #HEYF71736JDH</Text>
              <View style={styles.historyContent}>
                <View style={styles.histroyImageArea}>
                  <Image source={require('../../assets/iamges/product1.png')} resizeMode='stretch' style={{ width: 60, height: 60 }} />
                </View>
                <View>
                  <Text style={styles.ItemHeader}>Pure Karma</Text>
                  <Text style={{ ...styles.ItemHeader, color: '#61D273' }}>$25</Text>
                </View>
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
              <Text style={{ ...styles.ItemHeader, textAlign: 'center', marginTop: 30 }}>Delivered 11/22/20, 10:32 AM</Text>
              <Text style={{ ...styles.ItemHeader, textAlign: 'center', marginTop: 10 }}>Total Amount: <Text style={{ color: '#61D273' }}>$50</Text></Text>
              <TouchableOpacity onPress={() => this.refs.modal6.open()}>
                <Text style={styles.ReportTxt}>Report an Issue</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.historyItem}>
              <Text style={styles.ItemHeader}>Order Reference #HEYF71736JDH</Text>
              <View style={styles.historyContent}>
                <View style={styles.histroyImageArea}>
                  <Image source={require('../../assets/iamges/product1.png')} resizeMode='stretch' style={{ width: 60, height: 60 }} />
                </View>
                <View>
                  <Text style={styles.ItemHeader}>Pure Karma</Text>
                  <Text style={{ ...styles.ItemHeader, color: '#61D273' }}>$25</Text>
                </View>
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
              <Text style={{ ...styles.ItemHeader, textAlign: 'center', marginTop: 30 }}>Delivered 11/22/20, 10:32 AM</Text>
              <Text style={{ ...styles.ItemHeader, textAlign: 'center', marginTop: 10 }}>Total Amount: <Text style={{ color: '#61D273' }}>$50</Text></Text>
              <TouchableOpacity onPress={() => this.refs.modal6.open()}>
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
    );
  }
}
