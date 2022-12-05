import React, { Component } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, FlatList, TextInput, Platform } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { styles } from '../../components/styles';
import dayjs from 'dayjs';
import RNPickerSelect from "react-native-picker-select";
import Firebase from '../../../config/firebase'
import NonImage from '../../assets/iamges/productDetail1.png'
import AsyncStorage from '@react-native-community/async-storage';

export default class SelectStoreHourScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            avatarSource: NonImage,
            ischecked: false,
            isTimeVisible: false,
            index: '',
            ii: '',
            isTimeVisible2: false,
            SunStartTime: '',
            // dayData: [
            //     { id: 1, day: 'Sun.', startTime: '', endTime: '', openStatus:false },
            //     { id: 2, day: 'Mon.', startTime: '', endTime: '', openStatus:false },
            //     { id: 3, day: 'Tues.', startTime: '', endTime: '', openStatus:false },
            //     { id: 4, day: 'Wed.', startTime: '', endTime: '', openStatus:false },
            //     { id: 5, day: 'Thurs.', startTime: '', endTime: '', openStatus:false },
            //     { id: 6, day: 'Fri.', startTime: '', endTime: '', openStatus:false },
            //     { id: 7, day: 'Sat.', startTime: '', endTime: '', openStatus:false },
            // ],
            dayData: [],
            userId: "",
            count: 0
        };
    }

    componentDidMount = async() => {
        const userId = await AsyncStorage.getItem("userUid");
        this.setState({userId:userId})
        Firebase.database()
            .ref('user/' + this.state.userId + '/dispensary')
            .on("value", async (snapshot) => {
                console.log(snapshot);
                user_data = {
                    storeHours: snapshot.val().storeHours,
                    // data.push(row)
                };
                console.log(user_data);
                await this.setState({
                    dayData: user_data.storeHours,
                })
            })
    }

    handleTimePicker = (time, index, i) => {
        if (i == 1) {
            this.state.dayData[index].startTime = dayjs(time).format('hh:mm A')
        } else {
            this.state.dayData[index].endTime = dayjs(time).format('hh:mm A')
        }
        this.setState({
            isTimeVisible: false,
        })

    }
    hideTimePicker = () => {
        this.setState({ isTimeVisible: false })
    }

    _onChangeStatus = (value, index) => {
        this.state.dayData[index].openStatus = value
        if (this.state.dayData[index].openStatus == "Closed") {
            this.state.dayData[index].startTime = ""
            this.state.dayData[index].endTime = ""
        }
        this.setState({ count: this.state.count + 1 })
    };

    SaveHours = () => {
        Firebase.database()
            .ref('user/' + this.state.userId + '/dispensary')
            .update({
                storeHours: this.state.dayData,
            }
            )
        this.props.navigation.navigate("DispensaryUpdateScreen", { storeHour: this.state.dayData })
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView style={{ width: '100%' }}>
                    <View style={styles.container}>
                        <View style={{ width: '100%', alignItems: 'center', marginTop: Platform.OS == 'ios' ? 55 : 25 }}>
                            <TouchableOpacity style={styles.backBtn} onPress={() => { this.props.navigation.goBack() }}>
                                <Image source={require('../../assets/iamges/backImage.png')} resizeMode='stretch' style={styles.backImage} />
                            </TouchableOpacity>
                            <View style={{ ...styles.personUploadgImage, marginTop: 70, width: '100%' }}>
                                <Text style={styles.DetailTitle}>Please enter your daily hours of operation</Text>
                            </View>
                        </View>
                        <View style={{ ...styles.inputArea, marginTop: 50 }}>
                            <FlatList
                                data={this.state.dayData}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => (
                                    <View>
                                        <View style={styles.TimePickerRow}>
                                            <View style={styles.selectArea}>
                                                {Platform.OS == 'ios' ?
                                                    <View style={styles.selectBtn}>
                                                        <View style={{ width: '75%', marginLeft: '5%' }}>
                                                            <RNPickerSelect
                                                                placeholder={{ label: 'Select...' }}
                                                                value={this.state.dayData[index].openStatus}
                                                                onValueChange={(value) => {
                                                                    this._onChangeStatus(value, index);
                                                                }}
                                                                items={[
                                                                    { label: 'Closed', value: 'Closed' },
                                                                    { label: 'Open', value: 'Open' },
                                                                ]}
                                                            />
                                                        </View>
                                                        {/* <Text style={styles.selectTxt}>Closed</Text> */}
                                                        <Image source={require('../../assets/iamges/arrowdown.png')} resizeMode='stretch' style={styles.arrowdown} />
                                                    </View> :
                                                    <View style={styles.selectBtn}>
                                                        <View style={{ width: '100%', marginLeft: '1%' }}>
                                                            <RNPickerSelect
                                                                placeholder={{ label: 'Select...' }}
                                                                value={this.state.dayData[index].openStatus}
                                                                onValueChange={(value) => {
                                                                    console.log(value);
                                                                    this._onChangeStatus(value, index);
                                                                }}
                                                                style={{
                                                                    inputIOS: {
                                                                        fontSize: 16,
                                                                        paddingVertical: 12,
                                                                        paddingHorizontal: 10,
                                                                        borderWidth: 1,
                                                                        borderColor: 'gray',
                                                                        borderRadius: 4,
                                                                        color: 'black',
                                                                        paddingRight: 30, // to ensure the text is never behind the icon
                                                                        // transform: [
                                                                        //     { scaleX: 1.5 },
                                                                        //     { scaleY: 1.5 },
                                                                        // ]
                                                                    },
                                                                    inputAndroid: {
                                                                        fontSize: 7,
                                                                        fontFamily: 'Poppins',
                                                                        marginRight: -35,
                                                                        marginLeft: -15,
                                                                        // paddingRight: 30, // to ensure the text is never behind the icon
                                                                        transform: [
                                                                            { scaleX: 0.8 },
                                                                            { scaleY: 0.8 },
                                                                        ]
                                                                    },
                                                                }}

                                                                items={[
                                                                    { label: 'Closed', value: 'Closed' },
                                                                    { label: 'Open', value: 'Open' },
                                                                ]}
                                                                Icon={() => {
                                                                    return <Image source={require('../../assets/iamges/arrowdown.png')} resizeMode='stretch' style={{ ...styles.arrowdown, position: 'absolute', top: 15, right: 0 }} />
                                                                }}
                                                            />
                                                        </View>
                                                        {/* <Text style={styles.selectTxt}>Closed</Text> */}
                                                        {/* <Image source={require('../../assets/iamges/arrowdown.png')} resizeMode='stretch' style={styles.arrowdown} /> */}
                                                    </View>
                                                }

                                            </View>
                                            <View style={styles.unselectArea}>
                                                <Text style={{ ...styles.selectTxt, textAlign: 'center' }}>{item.day}</Text>
                                            </View>
                                            <View style={styles.selectArea}>
                                                <TouchableOpacity style={styles.selectBtn} onPress={() => { this.setState({ isTimeVisible: this.state.dayData[index].openStatus == "Open" ? true : false, index: index, ii: 1 }) }}>
                                                    <Text style={styles.selectTxt}>{item.startTime}</Text>
                                                    <Image source={require('../../assets/iamges/arrowdown.png')} resizeMode='stretch' style={styles.arrowdown} />
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ ...styles.unselectArea, width: '12%' }}>
                                                <Text style={{ ...styles.selectTxt, textAlign: 'center' }}>To</Text>
                                            </View>
                                            <View style={styles.selectArea}>
                                                <TouchableOpacity style={styles.selectBtn} onPress={() => { this.setState({ isTimeVisible: this.state.dayData[index].openStatus == "Open" ? true : false, index: index, ii: 2 }) }}>
                                                    <Text style={styles.selectTxt}>{item.endTime}</Text>
                                                    <Image source={require('../../assets/iamges/arrowdown.png')} resizeMode='stretch' style={styles.arrowdown} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                )}

                            />
                            <DateTimePickerModal
                                isVisible={this.state.isTimeVisible}
                                mode="time"
                                onConfirm={(time) => this.handleTimePicker(time, this.state.index, this.state.ii)}
                                onCancel={this.hideTimePicker}
                            />
                            <TouchableOpacity style={{ ...styles.signinBtn, marginTop: 100 }} onPress={() => { this.SaveHours() }}>
                                <Text style={styles.signinTxt1}>Save Dispensary Hours</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ height: 150 }}></View>
                </ScrollView>


            </View>
        );
    }
}


// const pickerSelectStyles = StyleSheet.create({
//     inputIOS: {
//         fontSize: 16,
//         paddingVertical: 12,
//         paddingHorizontal: 10,
//         borderWidth: 1,
//         borderColor: 'gray',
//         borderRadius: 4,
//         color: 'black',
//         paddingRight: 30, // to ensure the text is never behind the icon
//     },
//     inputAndroid: {
//         fontSize: 7,
//         fontFamily: 'Poppins',
//         marginRight: -15,
//         marginLeft: -7,
//         // paddingRight: 30, // to ensure the text is never behind the icon
//     },
// });