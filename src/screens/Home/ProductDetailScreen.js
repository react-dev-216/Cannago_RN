import React, { Component } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import Firebase from '../../../config/firebase'
import { styles } from '../../components/styles'
import Modal from 'react-native-modal';
import AlertModal from '../../components/AlertModal'
import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import NonImage from '../../assets/iamges/productDetail1.png'

export default class ProductDetailScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            avatarSource: NonImage,
            ischecked: false,
            productId: '',
            storeId: '',
            real_data: '',
            userId: "",
            isLoading: false,
            isModalVisible: false,
            alertContent: '',
            isModalVisible1: false,
            storeId: ''
        };
    }

    componentDidMount = async () => {
        await this.setState({ productId: this.props.navigation.getParam('productId') })
        await this.setState({ storeId: this.props.navigation.getParam('storeId') })
        const userId = await AsyncStorage.getItem("userUid");
        // console.log(this.state.userId)
        await this.setState({ userId: userId })
        console.log(this.state.productId)
        console.log(this.state.storeId)

        Firebase.database()
            .ref("Items/" + this.state.storeId + '/' + this.state.productId)
            .on("value", async (snapshot) => {
                console.log(snapshot)
                var row
                row = {
                    'Description': snapshot.val().Description,
                    'GpriceValue': snapshot.val().GpriceValue,
                    'Tag': snapshot.val().Tag,
                    'feeValue': snapshot.val().feeValue,
                    'id': snapshot.val().id,
                    'itemImage': snapshot.val().itemImage,
                    'itemNum1': snapshot.val().itemNum1,
                    'priceValue': snapshot.val().priceValue,
                    'productName': snapshot.val().productName,
                    'coaImage': snapshot.val().coaImage,
                    'storeId': snapshot.val().storeId
                }
                console.log("_____________+++++++++++++_________________");
                console.log(row)
                await this.setState({
                    real_data: row,
                });
                console.log(this.state.real_data.itemImage)
            })
    }

    AddtoCart = async () => {
        const { real_data } = this.state
        console.log(real_data);
        try {
            var newCartKey = Firebase.database().ref().child('Carts').push().key;
            await Firebase.database()
                .ref('Carts/' + this.state.userId + '/' + newCartKey)
                .update({
                    Description: real_data.Description,
                    GpriceValue: real_data.GpriceValue,
                    Tag: real_data.Tag,
                    feeValue: real_data.feeValue,
                    itemImage: real_data.itemImage,
                    itemNum1: real_data.itemNum1,
                    priceValue: real_data.priceValue,
                    productName: real_data.productName,
                    coaImage: real_data.coaImage,
                    num: 1,
                    storeId: real_data.storeId
                });
            this.setState({ isModalVisible1: true })
            setTimeout(() => {
                this.setState({ isModalVisible1: false })
                this.props.navigation.navigate("ShoppingCartScreen")
            }, 3000)
        } catch (error) {
            console.log(error)
        }
    }

    render() {
        const { real_data } = this.state
        return (
            <View style={styles.container}>
                <ScrollView style={{ width: '100%' }}>
                    <View style={styles.container}>
                        <Spinner
                            visible={this.state.isLoading}
                            textContent={'Adding to cart...'}
                            textStyle={{ color: 'white' }}
                        />
                        <View style={{ width: '100%', alignItems: 'center', marginTop: Platform.OS == 'ios' ? 55 : 25 }}>
                            <TouchableOpacity style={styles.backBtn} onPress={() => { this.props.navigation.goBack() }}>
                                <Image source={require('../../assets/iamges/backImage.png')} resizeMode='stretch' style={styles.backImage} />
                            </TouchableOpacity>
                            <View style={styles.personUploadgImage}>
                                <Text style={styles.DetailTitle}>Details</Text>
                                <Image source={{ uri: this.state.real_data.itemImage }} resizeMode='contain' style={styles.productDetailImage} />
                            </View>
                        </View>
                        <View style={styles.inputArea}>
                            <View style={{ width: '90%', marginLeft: '5%' }}>
                                <Text style={{ ...styles.productDescription, marginBottom: 10 }}>Name: {this.state.real_data.productName}</Text>
                                <Text style={styles.productDescription}>Price: $ {this.state.real_data.priceValue}</Text>
                            </View>
                            <TouchableOpacity style={styles.PreviewtBtn} onPress={() => { this.props.navigation.navigate("CoaImageScreen", { coaImage: this.state.real_data.coaImage }) }}>
                                <Text style={styles.previewTxt}>Preview COA</Text>
                            </TouchableOpacity>
                            <View style={{ width: '90%', marginLeft: '5%', marginTop: 50 }}>
                                <Text style={{ ...styles.productDescription, fontSize: 16 }}>Description</Text>
                                <Text style={{ ...styles.productDescription, fontSize: 12, marginTop: 10, color: '#707070' }}>{this.state.real_data.Description}</Text>
                            </View>
                            <TouchableOpacity style={styles.AddCartBtn} onPress={() => { this.AddtoCart() }}>
                                <Text style={styles.signinTxt1}>Add to Cart</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ height: 150 }}></View>
                </ScrollView>
                <Modal isVisible={this.state.isModalVisible}>
                    <AlertModal alertContent={this.state.alertContent} onPress={() => this.setState({ isModalVisible: false })} />
                </Modal>
                <Modal isVisible={this.state.isModalVisible1}>
                    <View style={{ ...styles.modalView, backgroundColor: 'white' }}>
                        <Image source={require('../../assets/iamges/CannaGo.png')} resizeMode='stretch' style={{ width: 80, height: 80, marginBottom: 20 }} />
                        <Text style={{ ...styles.Description1, fontSize: 20, color: "#61D273", fontFamily: 'Poppins-Regular', width: '90%' }}>Product was added successfully.</Text>
                    </View>
                </Modal>
            </View>
        );
    }
}
