import { StyleSheet } from 'react-native';
import { color } from 'react-native-reanimated';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: '#fff',
        width: '100%'
    },
    switchShadow: {
        flex: 1,
        marginTop: 5,
        borderRadius: 18,
        shadowColor: '#878787',
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowRadius: 5,
        shadowOpacity: 0.7,
        alignSelf: 'flex-end',
        margin: '5%',
        elevation: 5
    },
    CheckStatus:{
        width:224,
        height:60,
        marginTop:-25,
        backgroundColor:'#61D273',
        borderBottomRightRadius:30,
        borderBottomLeftRadius:30,
        justifyContent:'center',
        alignItems:'center', 
        flexDirection:'row'
    },
    logoImage: {
        width: 162,
        height: 170,
        marginTop: 60
    },
    plusImage: {
        width: 121,
        height: 121,
    },
    InputImage: {
        width: 18,
        height: 13.5,
        marginLeft: 20,
        marginRight: 10,
    },
    InputImage1: {
        width: 12.17,
        height: 17.72,
        marginLeft: 23,
        marginRight: 13
    },
    InputImage2: {
        width: 18,
        height: 18,
        marginLeft: 22,
        marginRight: 10
    },
    InputImage3: {
        width: 16,
        height: 20,
        marginLeft: 22,
        marginRight: 10
    },
    logoTxt: {
        fontSize: 13,
        color: '#7E7E7E',
        fontFamily: 'Poppins-Regular'
    },
    forgpwdTxt: {
        fontSize: 15,
        color: '#515151',
        textAlign: 'center',
        width: '90%',
        lineHeight: 25,
        marginTop: 20,
        marginBottom: 20,
        fontFamily: 'Poppins-Regular'
    },
    MessageTxt: {
        fontSize: 17,
        color: '#161616',
        lineHeight: 25,
        fontFamily: 'Poppins-Bold',
        width: '80%',
        marginTop: 110
    },
    AddShopiingTxt: {
        fontSize: 19,
        color: '#414041',
        textAlign: 'center',
        width: '90%',
        lineHeight: 25,
        marginTop: 20,
        fontFamily: 'Poppins-Regular',
        marginBottom: 20
    },
    CartTitle: {
        position: 'absolute',
        alignSelf: 'center',
        top: 45,
        fontSize: 20,
        color: '#414041',
        textAlign: 'center',
        width: '90%',
        lineHeight: 25,
        fontFamily: 'Poppins-Regular',
        fontSize: 18
    },
    DetailTitle: {
        alignSelf: 'center',
        fontSize: 20,
        color: '#414041',
        textAlign: 'center',
        width: '95%',
        lineHeight: 25,
        fontFamily: 'Poppins-Regular',
        fontSize: 18
    },
    OrderStatusTitle: {
        alignSelf: 'center',
        fontSize: 35,
        color: '#61D273',
        textAlign: 'center',
        width: '90%',
        fontFamily: 'Poppins-SemiBold',
        marginRight: 50,
        marginBottom: 40,
        marginTop: 10
    },
    inputArea: {
        width: '90%',
        marginTop: 35,
    },
    statusArea: {
        width: '80%',
        marginTop: 35,
    },
    inputTxt: {
        fontSize: 13,
        color: '#000',
        width: '70%',
        fontFamily: 'Poppins-Regular'
    },
    inputTxt2: {
        fontSize: 13,
        color: '#000',
        width: '70%',
        fontFamily: 'Poppins-Regular',
        textAlign: 'center'
    },

    inputItem: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 55,
        borderRadius: 27.5,
        borderWidth: 1,
        borderColor: '#e9e9e9',
        marginBottom: 22,
        width: '100%'
    },
    inputItem2: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 55,
        borderRadius: 27.5,
        borderWidth: 1,
        borderColor: '#e9e9e9',
        marginBottom: 22,
        width: '32%'
    },
    checkImage: {
        width: 21,
        height: 21,
        borderRadius: 10.5,
        backgroundColor: '#61D273'
    },
    uncheck: {
        width: 21,
        height: 21,
        borderRadius: 10.5,
        backgroundColor: 'red'
    },
    forgotBtn: {
        alignItems: 'flex-end',
        marginTop: -10
    },
    forgotTxt1: {
        fontSize: 13,
        color: "#7E7E7E"
    },
    signinBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 52,
        borderRadius: 26,
        backgroundColor: '#61D273',
        marginTop: 35,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    uploadCod: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 45,
        borderRadius: 26,
        backgroundColor: '#7f6da2',
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        width: 140,
        alignSelf: 'center',
        marginBottom:-20
    },
    signinTxt1: {
        fontSize: 18,
        color: 'white',
        fontFamily: 'Poppins-Regular'
    },
    previewTxt: {
        fontSize: 15,
        color: '#61D273',
        fontFamily: 'Poppins-Regular'
    },
    signinTxt2: {
        fontSize: 14,
        color: '#000000',
        fontFamily: 'Poppins-Regular'
    },
    signinTxt3: {
        fontSize: 14,
        color: 'white',
        fontFamily: 'Poppins-Regular'
    },
    dontaccountTxt: {
        color: '#bdbdc6',
        fontSize: 14,
        marginTop: 18,
        textAlign: 'center',
        fontFamily: 'NunitoSans-Bold'
    },
    signinTxt: {
        fontSize: 14,
        color: '#61D273',
        fontFamily: 'NunitoSans-Bold'
    },
    forgotTxt: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#7E7E7E',
        fontFamily: 'Poppins-Regular'
    },
    wantBtn: {
        justifyContent: 'center',
        height: 55,
        borderRadius: 27.5,
        borderWidth: 1,
        borderColor: '#e9e9e9',
        marginBottom: 22,
        width: '100%',
        alignItems: 'center'
    },
    wantBtn1: {
        justifyContent: 'center',
        height: 55,
        borderRadius: 27.5,
        borderWidth: 1,
        borderColor: '#61D273',
        marginBottom: 22,
        width: '100%',
        alignItems: 'center',
        backgroundColor: '#61D273'
    },
    wantTxt: {
        textAlign: 'center',
        color: '#515151',
        fontSize: 15,
        fontFamily: 'Poppins-Regular'
    },
    personImage: {
        width: 125,
        height: 125,
        borderRadius: 60
    },
    productDetailImage: {
        width: 316,
        height: 214,
        marginTop: 30
    },
    productCartImage: {
        width: 120,
        height: 120,
    },
    productDescription: {
        color: '#1D1C1C',
        fontSize: 16,
        fontFamily: 'Poppins-Regular'
    },
    AddCartBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 39,
        borderRadius: 26,
        backgroundColor: '#61D273',
        marginTop: 35,
        justifyContent: 'center',
        width: 246,
        alignSelf: 'center',
    },
    PreviewtBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 39,
        borderRadius: 26,
        backgroundColor: 'white',
        marginTop: 25,
        marginBottom: -40,
        justifyContent: 'center',
        width: 246,
        alignSelf: 'center',
    },
    AddCartBtn1: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 39,
        borderRadius: 26,
        backgroundColor: '#61D273',
        justifyContent: 'center',
        width: 246,
        alignSelf: 'center',
        position: 'absolute',
        bottom: 140
    },
    SubmitBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 52,
        borderRadius: 26,
        backgroundColor: '#61D273',
        justifyContent: 'center',
        width: 307,
        alignSelf: 'center',
        marginTop: 40
    },
    TimingBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 39,
        borderRadius: 5,
        backgroundColor: '#61D273',
        justifyContent: 'center',
        width: 87,
        marginTop: 20,
        alignSelf: 'center',
    },
    TimingBtn1: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 39,
        borderRadius: 5,
        backgroundColor: '#EAEAEB',
        justifyContent: 'center',
        paddingHorizontal: 10,
        marginTop: 20,
        alignSelf: 'center',
    },
    TimingBtn2: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 39,
        borderRadius: 19.5,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#CFCFCF',
        justifyContent: 'center',
        width: "22%",
        marginTop: 20,
        alignSelf: 'center',
    },
    TimingBtn3: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 39,
        borderRadius: 19.5,
        backgroundColor: '#61D273',
        borderWidth: 1,
        borderColor: '#61D273',
        justifyContent: 'center',
        width: "22%",
        marginTop: 20,
        alignSelf: 'center',
    },
    cartItemArea: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 30,
        width: '90%',
        marginLeft: '5%'
    },
    cartImage: {
        borderRadius: 5,
        borderColor: '#61D273',
        borderWidth: 2,
        marginRight: 20
    },
    personImageArea: {
        width: 143,
        height: 143,
        borderRadius: 72.5,
        borderColor: '#61D273',
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    personImageArea1: {
        width: 127,
        height: 127,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addImage: {
        width: 50,
        height: 50,
    },
    backImage: {
        width: 56,
        height: 40
    },
    arrowdown: {
        width: 15,
        height: 25
    },
    storeImage1: {
        width: "100%",
        height: 109
    },
    storeImage2: {
        width: "100%",
        height: "100%",
        borderRadius: 5
    },
    paymethodAdd: {
        width: 20,
        height: 20
    },
    backBtn: {
        position: 'absolute',
        left: 0,
        zIndex: 100
    },
    paymethodAddBtn: {
        position: 'absolute',
        right: 30,
        top: 10
    },
    addBtn: {
        position: 'absolute',
        bottom: 15,
        right: -18
    },
    addItemBtn: {
        alignSelf: 'flex-end',
        marginRight: '5%'
    },
    addStoreBtn: {
        position: 'absolute',
        bottom: -25,
        right: -22
    },
    personUploadgImage: {
        marginTop: 20
    },
    storeUploadgImage: {
        marginTop: 20,
        width: '85%',
        marginTop: 50
    },
    AddItemImage: {
        marginTop: 20,
        width: 263,
        height: 162,
        marginTop: 75,
        borderWidth: 3,
        borderRadius: 10,
        borderColor: '#61D273'
    },
    arrowleft: {
        height: 15,
        width: 9,
        position: 'absolute',
        right: 35
    },
    downarror: {
        height: 9,
        width: 15,
        position: 'absolute',
        right: 25
    },
    uncheckImage: {
        width: 16,
        height: 15,
        marginRight: 5,
        marginLeft: 10
    },
    termsTxt: {
        fontSize: 10,
        color: '#707070',
        fontFamily: 'Poppins-Regular'
    },
    termsTxt1: {
        fontSize: 10,
        color: '#707070'
    },
    TermsArea: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    modal: {
        height: 400,
        borderTopRightRadius: 45,
        borderTopLeftRadius: 45,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modal1: {
        height: 470,
        borderTopRightRadius: 45,
        borderTopLeftRadius: 45,
        alignItems: 'center'
    },
    closeImage: {
        height: 17,
        width: 17
    },
    closeBtn: {
        position: 'absolute',
        top: 30,
        right: 30,
    },
    homeTitle: {
        fontSize: 25,
        fontFamily: 'Poppins-SemiBold',
        color: '#070707'
    },
    StoreItem: {
        width: '85%',
        marginTop: 30,
        alignItems: 'center',
        alignSelf: 'center'
    },
    StoreItem1: {
        width: '100%',
        marginTop: 30,
        alignItems: 'center',
        alignSelf: 'center',
    },
    storeImage: {
        width: '100%',
        height: 115,
        marginTop: 15
    },
    productImage: {
        width: "100%",
        height: "100%",
        borderTopLeftRadius: 30
    },
    storeDes: {
        width: '100%',
        height: 67,
        backgroundColor: '#61D273',
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        justifyContent: 'center',
        alignItems: 'center'
    },
    storeDes1: {
        width: '100%',
        height: 67,
        backgroundColor: '#61D273',
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -10
    },
    desTxt: {
        color: 'white',
        fontSize: 10,
        fontFamily: 'Poppins-Bold'
    },
    desTxt1: {
        color: '#61D273',
        fontSize: 10,
        fontFamily: 'Poppins-Bold',
        position: 'absolute',
        top: 10,
        right: 7
    },
    countItem: {
        flexDirection: 'row',
        width: 95,
        height: 30,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    cartAccountArea: {
        width: '33.3%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    cartAddBtn: {
        color: '#343434',
        fontSize: 17
    },
    paymenntArea: {
        marginTop: 40,
        width: '85%',
        alignSelf: 'center'
    },
    OrderSummeryTxt: {
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
        color: '#505050'
    },
    ContentItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
        marginBottom: 12
    },
    ItemTxt: {
        color: '#211D18',
        fontFamily: 'Poppins-Regular',
        fontSize: 14
    },
    orderContent: {
        marginTop: 15,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#E5E5E5'
    },
    PromoInput: {
        height: 43,
        width: '65%',
        borderTopLeftRadius: 21.5,
        borderBottomLeftRadius: 21.5,
        borderWidth: 1,
        borderColor: '#e9e9e9',
        paddingLeft: 20,
        fontSize: 13,
        fontFamily: 'Poppins-Regular',
    },
    CardNumberInput: {
        height: 43,
        width: '100%',
        borderRadius: 21.5,
        borderWidth: 1,
        borderColor: '#e9e9e9',
        paddingLeft: 20,
        fontSize: 13,
        fontFamily: 'Poppins-Regular',
        marginTop: -20
    },
    specialInput: {
        height: 43,
        width: '100%',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#e9e9e9',
        paddingLeft: 20,
        fontSize: 13,
        fontFamily: 'Poppins-Regular',
        marginTop: -20,
        height: 86
    },
    contactlInput: {
        height: 101,
        width: '80%',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#e9e9e9',
        paddingLeft: 20,
        fontSize: 13,
        fontFamily: 'Poppins-Regular',
        marginTop: 20,
        backgroundColor: '#F3F3F3'
    },
    ApplyBtn: {
        height: 43,
        width: '35%',
        backgroundColor: '#61D273',
        borderTopRightRadius: 21.5,
        borderBottomRightRadius: 21.5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    applyBtnTxt: {
        color: 'white',
        fontFamily: 'Poppins-Regular',
        fontSize: 14
    },
    ModalBtnArea: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginTop: 35
    },
    sendBtn: {
        width: 135,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#61D273',
        justifyContent: 'center',
        alignItems: 'center'
    },
    sendTxt: {
        color: 'white',
        fontSize: 15,
        fontFamily: 'Poppins-Regular'
    },
    modalBackBtn: {
        height: 40,
        justifyContent: "center"
    },
    modalBackTxt: {
        color: '#3D3D3D',
        fontSize: 15,
        fontFamily: 'Poppins-Regular',
    },
    backArea: {
        borderBottomWidth: 1,
        borderColor: '#3D3D3D',
    },
    backgroundImage: {
        marginTop: 90,
        height: '100%',
        alignSelf: 'center',
        alignItems: 'center'
    },
    historyItem: {
        marginTop: 30,
        width: '90%',
        alignSelf: 'center',
        borderColor: '#D8D8D8',
        borderBottomWidth: 1,
        paddingBottom: 20
    },
    ItemHeader: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16
    },
    ReportTxt: {
        fontFamily: 'Poppins-Regular',
        fontSize: 17,
        color: '#CD5C5C',
        textAlign: 'center',
        marginTop: 10
    },
    OrderTxt: {
        fontFamily: 'Poppins-Regular',
        fontSize: 10,
        color: 'white',
        textAlign: 'center',
    },
    historyContent: {
        flexDirection: 'row',
        marginTop: 20,
        alignItems: 'center'
    },
    histroyImageArea: {
        width: 81,
        height: 81,
        borderWidth: 1,
        borderColor: '#61D273',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        marginRight: 20
    },
    checkArea: {
        width: 31,
        height: 31,
        backgroundColor: '#61D273',
        justifyContent: 'center',
        alignItems: 'center'
    },
    checkLineArea: {
        alignItems: 'center',
        width: 31
    },
    checkIcon: {
        width: 30,
        height: 25
    },
    locationkIcon: {
        width: 15,
        height: 19,
        position:'absolute',
        left:23,
        top:32
    },
    lineArea: {
        height: 70,
        width: 1,
        backgroundColor: 'black',
        marginVertical: 5
    },
    orderStatusItem: {
        flexDirection: 'row',
        alignSelf: 'center',
        width: '95%'
    },
    orderStatus: {
        marginLeft: 30
    },
    statusTitle: {
        color: '#61D273',
        fontFamily: 'Poppins-SemiBold',
        fontSize: 20
    },
    statusDescrition: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        color: '#707070',
        marginTop: 1
    },
    locationTxt: {
        fontFamily: 'Poppins-Regular',
        fontSize: 10,
        color: 'white',
        marginTop:20
    },
    rateTitle: {
        alignSelf: 'center',
        fontSize: 41,
        color: '#61D273',
        textAlign: 'center',
        width: '90%',
        fontFamily: 'Poppins-SemiBold',
        marginTop: 30
    },
    rateArea: {
        width: '85%',
        alignItems: 'center',
        marginTop: 55,
        borderColor: '#D8D8D8',
        borderBottomWidth: 1,
        paddingBottom: 5
    },
    SignInfoTxt: {
        fontFamily: 'Poppins-Medium',
        fontSize: 15,
        color: '#0f0f11'
    },
    SignInfoArea: {
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
        paddingBottom: 10,
        marginBottom: 15
    },
    quantityNum: {
        fontSize: 13,
        color: '#707070',
        fontFamily: 'Poppins-Regular',
        marginRight: 10
    },
    modalView: {
        width: '100%',
        height: 200,
        borderRadius: 5,
        alignSelf: 'center',
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    },
    TitleTxt1: {
        color: '#61D273',
        fontSize: 30,
        marginTop: 30,
        marginBottom: 10,
        width: '100%',
        textAlign: "center",
        fontFamily: 'Poppins-Regular',
    },
    Description: {
        color: "#7a7a7b",
        fontSize: 15,
        marginBottom: 20,
        fontFamily: 'Poppins-Regular',
        textAlign:'center'
    },
    QuitWorkout: {
        width: 100,
        height: 40,
        borderWidth: 2,
        borderColor: '#61D273',
        justifyContent: "center",
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 20,
        marginBottom: 20,
        backgroundColor: '#61D273',
    },
    Dismiss: {
        color: 'black',
        fontSize: 20,
    },
    modalView1: {
        width: '100%',
        height: 300,
        borderRadius: 5,
        alignSelf: 'center',
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    },
    Description1: {
        color: "#000000",
        fontSize: 15,
        marginBottom: 20,
        fontFamily: 'Poppins-Regular',
        alignItems: 'center',
        alignSelf: 'center',
        textAlign: 'center'
    },
    TimePickerRow: {
        flexDirection: 'row',
        marginVertical: 10
    },
    selectArea: {
        width: '23%',
        borderWidth: 1,
        borderColor: '#000',
        paddingVertical: 3,
        flexDirection: 'row'
    },
    selectBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: '5%'
    },
    selectTxt: {
        color: '#000',
        fontSize: 11,
        fontFamily: 'Poppins',
        width:'80%'
    },
    unselectArea: {
        width: '17%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    qualityArea: {
        width: 94,
        height: 22,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#BCBCBC',
        borderRadius: 3,
        marginLeft: 10
    },
    orderBtn: {
        backgroundColor: '#3EA3E1',
        justifyContent: 'center',
        alignItems: 'center',
        width: 132,
        height: 38,
        borderRadius: 19,
        marginRight: 10
    }
})

