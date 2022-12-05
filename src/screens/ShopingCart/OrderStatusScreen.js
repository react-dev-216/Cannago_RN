import React, { Component } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, SafeAreaView, TextInput, Platform } from 'react-native';
import Firebase from '../../../config/firebase'
import AsyncStorage from '@react-native-community/async-storage';
import { styles } from '../../components/styles'

import NonImage from '../../assets/iamges/productDetail1.png'

export default class OrderStatusScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            avatarSource: NonImage,
            ischecked: false,
            storeId: '',
            userId: "",
            orderStatus: '',
        };
    }

    componentDidMount = async () => {
        const userId = await AsyncStorage.getItem("userUid");
        this.setState({ userId: userId })

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
                    storeId: data[0].storeId,
                });
                console.log("================+++++++++++++_________________");
                // console.log(this.state.storeId[0].storeId)
                console.log(this.state.storeId)
                this.loadStatus();
            })
    }

    loadStatus = () => {
        Firebase.database()
            .ref("OrderItems/" + this.state.storeId + '/' + this.state.userId)
            .on("value", async (snapshot) => {
                console.log("cart++++++++++")
                console.log(snapshot)
                var row
                row = {
                    orderItem: snapshot.val().orderItem,
                    placeDate: snapshot.val().placeDate,
                    placeStatus: snapshot.val().placeStatus,
                    confirmDate: snapshot.val().confirmDate,
                    confirmStatus: snapshot.val().confirmStatus,
                    deliveryDate: snapshot.val().deliveryDate,
                    deliveryStatus: snapshot.val().deliveryStatus,
                    dropDate: snapshot.val().dropDate,
                    dropStatus: snapshot.val().dropStatus,
                    AllPrice: snapshot.val().AllPrice,
                }
                this.setState({ orderStatus: row })
            })
    }

    render() {
        const { orderStatus } = this.state
        return (
            <SafeAreaView style={styles.container} >
                <ScrollView style={{ width: '100%' }}>
                    <View style={styles.container}>
                        <View style={styles.CheckStatus}>
                            <Image source={require('../../assets/iamges/location.png')} resizeMode='stretch' style={styles.locationkIcon} />
                            <Text style={styles.locationTxt}>Check your order status</Text>
                        </View>
                        <View style={{ width: '100%', alignItems: 'center', marginTop: Platform.OS == 'ios' ? 55 : 25 }}>
                            <Text style={styles.OrderStatusTitle}>Order Status</Text>
                        </View>
                        <View style={styles.statusArea}>
                            <View style={styles.orderStatusItem}>
                                <View style={styles.checkLineArea}>
                                    <View style={styles.checkArea}>
                                        <Image source={require('../../assets/iamges/checkIcon.png')} resizeMode='stretch' style={styles.checkIcon} />
                                    </View>
                                    <View style={styles.lineArea}></View>
                                </View>
                                <View style={styles.orderStatus}>
                                    <Text style={styles.statusTitle}>Order Placed</Text>
                                    <Text style={styles.statusDescrition}>We have received your order.</Text>
                                    <Text style={styles.statusDescrition}>{orderStatus.placeDate}</Text>
                                </View>
                            </View>
                            <View style={styles.orderStatusItem}>
                                <View style={styles.checkLineArea}>
                                    <View style={styles.checkArea}>
                                        {/* <Image source={require('../../assets/iamges/checkIcon.png')} resizeMode='stretch' style={styles.checkIcon} /> */}
                                    </View>
                                    <View style={styles.lineArea}></View>
                                </View>
                                <View style={styles.orderStatus}>
                                    <Text style={styles.statusTitle}>Order Confirmed</Text>
                                    {/* <Text style={styles.statusDescrition}>The store has confirmed your order</Text>
                                <Text style={styles.statusDescrition}>11:22 AM, 11/20/2020</Text> */}
                                </View>
                            </View>
                            <View style={styles.orderStatusItem}>
                                <View style={styles.checkLineArea}>
                                    <View style={styles.checkArea}>
                                        {/* <Image source={require('../../assets/iamges/checkIcon.png')} resizeMode='stretch' style={styles.checkIcon} /> */}
                                    </View>
                                    <View style={styles.lineArea}></View>
                                </View>
                                <View style={styles.orderStatus}>
                                    <Text style={styles.statusTitle}>Order En Route</Text>
                                    {/* <Text style={styles.statusDescrition}>Your order is being delivered</Text>
                                <Text style={styles.statusDescrition}>10:03 AM, 11/21/2020</Text> */}
                                </View>
                            </View>
                            <View style={styles.orderStatusItem}>
                                <View style={styles.checkLineArea}>
                                    <View style={styles.checkArea}>
                                        {/* <Image source={require('../../assets/iamges/checkIcon.png')} resizeMode='stretch' style={styles.checkIcon} /> */}
                                    </View>
                                </View>
                                <View style={styles.orderStatus}>
                                    <Text style={styles.statusTitle}>Order Delivered</Text>
                                    {/* <Text style={styles.statusDescrition}>Your order has been dropped off. </Text>
                                <Text style={styles.statusDescrition}>10:32 AM, 11/21/2020</Text> */}
                                </View>
                            </View>
                            <TouchableOpacity style={{ ...styles.AddCartBtn, borderRadius: 5, width: 200 }} onPress={() => { this.props.navigation.navigate("RateExperienceScreen") }}>
                                <Text style={styles.signinTxt1}>Message Driver</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ height: 150 }}></View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}
