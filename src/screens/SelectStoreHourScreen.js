import React, { Component } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, FlatList, TextInput, Platform } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { styles } from '../components/styles';
import dayjs from 'dayjs';
import RNPickerSelect from "react-native-picker-select";
import AlertModal from '../components/AlertModal'
import Modal from 'react-native-modal';

const initialDate = "2021-01-17T01:00:00.000Z"

import NonImage from '../assets/iamges/productDetail1.png'
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
            isModalVisible: false,
            alertContent: '',
            timeflag: false,
            dayData: [
                { id: 1, day: 'Sun.', startTime: '', endTime: '', openStatus: "" },
                { id: 2, day: 'Mon.', startTime: '', endTime: '', openStatus: "" },
                { id: 3, day: 'Tues.', startTime: '', endTime: '', openStatus: "" },
                { id: 4, day: 'Wed.', startTime: '', endTime: '', openStatus: "" },
                { id: 5, day: 'Thurs.', startTime: '', endTime: '', openStatus: "" },
                { id: 6, day: 'Fri.', startTime: '', endTime: '', openStatus: "" },
                { id: 7, day: 'Sat.', startTime: '', endTime: '', openStatus: "" },
            ],
            renderValue: 0,
        };
    }

    handleTimePicker = (time, index, i) => {
        console.log(time)
        console.log(index)
        if (i == 1) {
            this.state.dayData[index].startTime = dayjs(time).format('hh:mm A')
        } else {
            this.state.dayData[index].endTime = dayjs(time).format('hh:mm A')
        }
        this.setState({
            isTimeVisible: false,
        })
        console.log(time);

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
        this.setState({ renderValue: this.state.renderValue + 1 })
        console.log("aasdasdasdasd")
        console.log(this.state.dayData)
    };

    SaveHours = async () => {
        const { dayData } = this.state
        var i
        for (i in dayData) {
            console.log(i)
            if (dayData[i].openStatus == "") {
                await this.setState({ timeflag: false })
                break
            } else if (dayData[i].openStatus == "Open") {
                if (dayData[i].startTime == "" || dayData[i].endTime == "") {
                    await this.setState({ timeflag: false })
                    break
                } else { await this.setState({ timeflag: true }) }
            } else {
                await this.setState({ timeflag: true })
            }
        }
        this.gotoNext()
    }

    gotoNext = () => {
        if (this.state.timeflag == false) {
            this.setState({ alertContent: "Please put in your dispensary's daily hours.", isModalVisible: true })
        } else {
            this.props.navigation.navigate("DispensariesSignupScreen", { storeHour: this.state.dayData })
        }
    }

    render() {
        const { isModalVisible } = this.state
        return (
            <View style={styles.container}>
                <Modal isVisible={this.state.isModalVisible}>
                    <AlertModal alertContent={this.state.alertContent} onPress={() => this.setState({ isModalVisible: false })} />
                </Modal>
                <ScrollView style={{ width: '100%' }}>
                    <View style={styles.container}>
                        <View style={{ width: '100%', alignItems: 'center', marginTop: Platform.OS == 'ios' ? 55 : 25 }}>
                            <TouchableOpacity style={styles.backBtn} onPress={() => { this.props.navigation.goBack() }}>
                                <Image source={require('../assets/iamges/backImage.png')} resizeMode='stretch' style={styles.backImage} />
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
                                                                items={[
                                                                    { label: 'Closed', value: 'Closed' },
                                                                    { label: 'Open', value: 'Open' },
                                                                ]}
                                                                onValueChange={(value) => {
                                                                    this._onChangeStatus(value, index);
                                                                }}
                                                            />
                                                        </View>
                                                        {/* <Text style={styles.selectTxt}>Closed</Text> */}
                                                        <Image source={require('../assets/iamges/arrowdown.png')} resizeMode='stretch' style={styles.arrowdown} />
                                                    </View> :
                                                    <View style={styles.selectBtn}>
                                                        <View style={{ width: '100%', marginLeft: '1%' }}>
                                                            <RNPickerSelect
                                                                placeholder={{ label: 'Select...' }}
                                                                value={this.state.dayData[index].openStatus}
                                                                onValueChange={(value) => {
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
                                                                        color: 'black',
                                                                        fontFamily: 'Poppins',
                                                                        marginRight: -35,
                                                                        marginLeft: -17,
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
                                                                    return <Image source={require('../assets/iamges/arrowdown.png')} resizeMode='stretch' style={{ ...styles.arrowdown, position: 'absolute', top: 15, right: 0 }} />
                                                                }}
                                                            />
                                                        </View>
                                                    </View>
                                                }

                                            </View>
                                            <View style={styles.unselectArea}>
                                                <Text style={{ ...styles.selectTxt, textAlign: 'center' }}>{item.day}</Text>
                                            </View>
                                            <View style={styles.selectArea}>
                                                <TouchableOpacity style={styles.selectBtn} onPress={() => { this.setState({ isTimeVisible: this.state.dayData[index].openStatus == "Open" ? true : false, index: index, ii: 1 }) }}>
                                                    <Text style={styles.selectTxt}>{item.startTime}</Text>
                                                    <Image source={require('../assets/iamges/arrowdown.png')} resizeMode='stretch' style={styles.arrowdown} />
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ ...styles.unselectArea, width: '12%' }}>
                                                <Text style={{ ...styles.selectTxt, textAlign: 'center' }}>To</Text>
                                            </View>
                                            <View style={styles.selectArea}>
                                                <TouchableOpacity style={styles.selectBtn} onPress={() => { this.setState({ isTimeVisible: this.state.dayData[index].openStatus == "Open" ? true : false, index: index, ii: 2 }) }}>
                                                    <Text style={styles.selectTxt}>{item.endTime}</Text>
                                                    <Image source={require('../assets/iamges/arrowdown.png')} resizeMode='stretch' style={styles.arrowdown} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                )}

                            />
                            <DateTimePickerModal
                                isVisible={this.state.isTimeVisible}
                                headerTextIOS="Pick a time"
                                mode="time"
                                date={new Date(initialDate)}
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
