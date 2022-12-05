import React, { Component } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, TextInput, Dimensions, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import StarRating from 'react-native-star-rating';

import {styles} from '../../components/styles'

const height = Dimensions.get('screen').height;

export default class RateExperienceScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
        modalVisible: false,
        isEmpty:true,
        itemNum1: 2,
        itemNum2: 1,
        starCount: 4,
        selectPro:2
    };
  }

  GoBack = () =>{
    this.props.navigation.navigate("ProductDetailScreen")
  }

  Addcart = () => {
    this.setState({itemNum1:this.state.itemNum1 + 1})
  }

  Minuscart = async() => {
    await this.setState({itemNum1:this.state.itemNum1 - 1})
    if(this.state.itemNum1 <= 0){
      this.setState({itemNum1:0})
    }
  }

  Addcart1 = () => {
    this.setState({itemNum2:this.state.itemNum2 + 1})
  }

  Minuscart1 = async() => {
    await this.setState({itemNum2:this.state.itemNum2 - 1})
    if(this.state.itemNum2 <= 0){
      this.setState({itemNum2:0})
    }
  }

  chageState = async() => {
    await this.setState({isEmpty:false})
  }

  onStarRatingPress(rating) {
    this.setState({
      starCount: rating
    });
    // alert(this.state.starCount);
  }

  render() {
    return (
        <View style={{...styles.container, justifyContent:'center'}}>
            <View style={{width:'100%', flex:1, alignItems:'center'}}>
              <ScrollView style={{width:'100%', flex:1}}>
                  <View style={{...styles.container, flex:1}}>
                    <View style={styles.rateArea}>
                      <Text style={{...styles.DetailTitle, marginTop:Platform.OS=='ios'?7:-10, fontSize:18}}>Rate Experience</Text>
                      <Text style={styles.rateTitle}>$74.81</Text>
                    </View>
                    <View style={{...styles.rateArea, marginTop:40}}>
                      <Text style={{...styles.DetailTitle, marginTop:-20, color:'#4A4A4A', fontFamily:'Poppins-Medium', fontSize:20}}>Great</Text>
                      <View style={{marginTop:20, marginBottom:20}}>
                        <StarRating
                          disabled={false}
                          maxStars={5}
                          starSize={40}
                          rating={this.state.starCount}
                          selectedStar={(rating) => this.onStarRatingPress(rating)}
                          fullStarColor={'#FFBB46'}
                        />
                      </View>
                    </View>
                    <View style={{...styles.rateArea, marginTop:40}}>
                      <Text style={{...styles.DetailTitle, marginTop:-20, color:'#4A4A4A', fontFamily:'Poppins-Medium', fontSize:20}}>What could be better?</Text>
                      <TouchableOpacity style={styles.TimingBtn}>
                          <Text style={{...styles.signinTxt1, fontSize:15}}>Timing</Text>
                      </TouchableOpacity>
                      <View style={{marginTop:5, marginBottom:20, flexDirection:'row', justifyContent:'space-around', width:'100%'}}>
                        <TouchableOpacity style={styles.TimingBtn1}>
                            <Text style={styles.signinTxt2}>User Experience</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.TimingBtn1}>
                            <Text style={styles.signinTxt2}>Packaging</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.TimingBtn1}>
                            <Text style={styles.signinTxt2}>Driver</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  <Text style={{...styles.DetailTitle, marginTop:20, color:'#4A4A4A', fontFamily:'Poppins-Medium', fontSize:20}}>Leave a tip?</Text>
                  <View style={{marginTop:5, marginBottom:20, flexDirection:'row', justifyContent:'space-around', width:'100%'}}>
                    <TouchableOpacity style={this.state.selectPro == 1?styles.TimingBtn3:styles.TimingBtn2} onPress={()=>{this.setState({selectPro:1})}}>
                        <Text style={this.state.selectPro == 1?styles.signinTxt3:styles.signinTxt2}>10%</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  style={this.state.selectPro == 2?styles.TimingBtn3:styles.TimingBtn2} onPress={()=>{this.setState({selectPro:2})}}>
                        <Text style={this.state.selectPro == 2?styles.signinTxt3:styles.signinTxt2}>15%</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  style={this.state.selectPro == 3?styles.TimingBtn3:styles.TimingBtn2} onPress={()=>{this.setState({selectPro:3})}}>
                        <Text style={this.state.selectPro == 3?styles.signinTxt3:styles.signinTxt2}>20%</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  style={this.state.selectPro == 4?styles.TimingBtn3:styles.TimingBtn2} onPress={()=>{this.setState({selectPro:4})}}>
                        <Text style={this.state.selectPro == 4?styles.signinTxt3:styles.signinTxt2}>custom</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={{...styles.DetailTitle, marginTop:20, color:'#4A4A4A', fontFamily:'Poppins-Medium', fontSize:20}}>Leave a comment</Text>
                  <TextInput style={{...styles.contactlInput, alignSelf:'center'}} multiline={true} placeholderTextColor="#BCBCBC" placeholder='Type here...' />
                  <TouchableOpacity style={styles.SubmitBtn} onPress={()=>{this.props.navigation.navigate("ShoppingCartScreen")}}>
                      <Text style={styles.signinTxt1}>Submit</Text>
                  </TouchableOpacity>
                  <View style={{height:150}}></View>
              </ScrollView>
            </View>
        </View>
    );
  }
}
