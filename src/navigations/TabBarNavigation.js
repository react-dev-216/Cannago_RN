import React from 'react';
import { Image, Dimensions, Text } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import AsyncStorage from '@react-native-community/async-storage';

import HomeScreen from '../screens/Home/HomeScreen'
import ProductScreen from '../screens/Home/ProductScreen'
import ProductDetailScreen from '../screens/Home/ProductDetailScreen'
import AddStoreItemScreen from '../screens/Home/AddStoreItem'
import UpdateItemScreen from '../screens/Home/UpdateItemScreen'
import CoaImageScreen from '../screens/Home/CoaImageScreen'
import ShoppingCartScreen from '../screens/ShopingCart/ShoppingCartScreen'
import CheckOutScreen from '../screens/ShopingCart/CheckOutScreen'
import OrderStatusScreen from '../screens/ShopingCart/OrderStatusScreen'
import RateExperienceScreen from '../screens/ShopingCart/RateExperienceScreen'
import OrderHistoryScreen from '../screens/OrderHistory/OrderHistoryScreen'
import ProfileScreen from '../screens/OrderHistory/ProfileScreen'
import ProfileInfoScreen from '../screens/OrderHistory/ProfileInfoScreen'
import DispensaryUpdateScreen from '../screens/OrderHistory/DispensaryUpdateScreen'
import DriverInformationScreen from '../screens/OrderHistory/DriverInformationScreen'
import ChangePasswordScreen from '../screens/OrderHistory/ChangePasswordScreen'
import ChangeEmailScreen from '../screens/OrderHistory/ChangeEmailScreen'
import UpdateStoreScreen from '../screens/OrderHistory/UpdateStoreScreen'

import AppTabbar from './AppTabBar';

const Device_width = Dimensions.get('window').width
var usertype = ''

AsyncStorage.getItem('usertype')
    .then((value) => {
        usertype = value.toString()

    })
    .catch((error) => {
        console.log("++++++++++++++++++++++++++++++___________________________")
        console.log("++++++++++++++++++++++++++++++___________________________")
        console.log("++++++++++++++++++++++++++++++___________________________")
        console.log("++++++++++++++++++++++++++++++___________________________")
        console.log("++++++++++++++++++++++++++++++10__________________________")
        console.log(error);
    });

const Home = createStackNavigator(
    {
        HomeScreen: {
            screen: HomeScreen,
            navigationOptions: {
                headerShown: false,
            }
        },
        ProductScreen: {
            screen: ProductScreen,
            navigationOptions: {
                headerShown: false,
            }
        },
        ProductDetailScreen: {
            screen: ProductDetailScreen,
            navigationOptions: {
                headerShown: false,
            }
        },
        AddStoreItemScreen: {
            screen: AddStoreItemScreen,
            navigationOptions: {
                headerShown: false,
            }
        },
        UpdateItemScreen: {
            screen: UpdateItemScreen,
            navigationOptions: {
                headerShown: false,
            }
        },
        CoaImageScreen: {
            screen: CoaImageScreen,
            navigationOptions: {
                headerShown: false,
            }
        },
    },
    {
        initialRouteName: 'HomeScreen',
    }
);

Home.navigationOptions = ({ navigation }) => {
    let tabBarVisible;
    if (navigation.state.routes.length > 1) {
        navigation.state.routes.map(route => {
            if (route.routeName == "HomeDropScreen") {
                tabBarVisible = false;
            }
            else {
                tabBarVisible = true;
            }
        });
    }
    return {
        tabBarVisible
    };
};

const ShoppingCart = createStackNavigator(
    {
        ShoppingCartScreen: {
            screen: ShoppingCartScreen,
            navigationOptions: {
                headerShown: false,
            }
        },
        CheckOutScreen: {
            screen: CheckOutScreen,
            navigationOptions: {
                headerShown: false,
            }
        },
        OrderStatusScreen: {
            screen: OrderStatusScreen,
            navigationOptions: {
                headerShown: false,
            }
        },
        RateExperienceScreen: {
            screen: RateExperienceScreen,
            navigationOptions: {
                headerShown: false,
            }
        },
    },
    {
        initialRouteName: 'ShoppingCartScreen',
    }
);

const OrderStatusShoppingCart = createStackNavigator(
    {
        ShoppingCartScreen: {
            screen: ShoppingCartScreen,
            navigationOptions: {
                headerShown: false,
            }
        },
        CheckOutScreen: {
            screen: CheckOutScreen,
            navigationOptions: {
                headerShown: false,
            }
        },
        OrderStatusScreen: {
            screen: OrderStatusScreen,
            navigationOptions: {
                headerShown: false,
            }
        },
        RateExperienceScreen: {
            screen: RateExperienceScreen,
            navigationOptions: {
                headerShown: false,
            }
        },
    },
    {
        initialRouteName: 'OrderStatusScreen',
    }
);

ShoppingCart.navigationOptions = ({ navigation }) => {
    let tabBarVisible;
    if (navigation.state.routes.length > 1) {
        navigation.state.routes.map(route => {
            if (route.routeName == "HomeDropScreen") {
                tabBarVisible = false;
            }
            else {
                tabBarVisible = true;
            }
        });
    }
    return {
        tabBarVisible
    };
};

const OrderHistory = createStackNavigator(
    {
        ProfileScreen: {
            screen: ProfileScreen,
            navigationOptions: {
                headerShown: false,
            }
        },
        ProfileInfoScreen: {
            screen: ProfileInfoScreen,
            navigationOptions: {
                headerShown: false,
            }
        },
        OrderHistoryScreen: {
            screen: OrderHistoryScreen,
            navigationOptions: {
                headerShown: false,
            }
        },
        DispensaryUpdateScreen: {
            screen: DispensaryUpdateScreen,
            navigationOptions: {
                headerShown: false,
            }
        },
        ChangePasswordScreen: {
            screen: ChangePasswordScreen,
            navigationOptions: {
                headerShown: false,
            }
        },
        ChangeEmailScreen: {
            screen: ChangeEmailScreen,
            navigationOptions: {
                headerShown: false,
            }
        },
        UpdateStoreScreen: {
            screen: UpdateStoreScreen,
            navigationOptions: {
                headerShown: false,
            }
        },
        DriverInformationScreen: {
            screen: DriverInformationScreen,
            navigationOptions: {
                headerShown: false,
            }
        },
    },
    {
        initialRouteName: 'ProfileScreen',
    }
);

OrderHistory.navigationOptions = ({ navigation }) => {
    let tabBarVisible;
    if (navigation.state.routes.length > 1) {
        navigation.state.routes.map(route => {
            if (route.routeName == "HomeDropScreen") {
                tabBarVisible = false;
            }
            else {
                tabBarVisible = true;
            }
        });
    }
    return {
        tabBarVisible
    };
};

export const TabNavigation = createBottomTabNavigator(
    {
        Home,
        ShoppingCart,
        OrderHistory,
    }, {
    defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, horizontal, tintColor }) => {
            const { routeName } = navigation.state;
            //   let IconComponent = Icon;
            //   let iconName;
            var ImageUrl;
            if (routeName === 'Home') {
                if (focused === true) {
                    tintColor = 'gray';
                    ImageUrl = require('../assets/iamges/ActiveHome.png')
                } else {
                    ImageUrl = require('../assets/iamges/DeActiveHome.png')
                }
                return <Image source={ImageUrl} color={tintColor} style={{ width: 99, height: 46 }} />
            } else if (routeName === 'ShoppingCart') {
                if (focused === true) {
                    tintColor = 'gray';
                    ImageUrl = require('../assets/iamges/ActiveShopping.png')
                } else {
                    ImageUrl = require('../assets/iamges/DeActiveShopping.png')
                }
                return <Image source={ImageUrl} color={tintColor} style={{ width: 99, height: 46 }} />
            } else if (routeName === 'OrderHistory') {
                if (focused === true) {
                    tintColor = 'gray';
                    ImageUrl = require('../assets/iamges/ActiveOrder.png')
                } else {
                    ImageUrl = require('../assets/iamges/DeActiveOrder.png')
                }
                return <Image source={ImageUrl} color={tintColor} style={{ width: 99, height: 46 }} />
            }
        },
    }),
    tabBarOptions: {
        activeTintColor: 'white',
        showLabel: false,
        style: {
            backgroundColor: '#fff',
            //----------add this line------------------------//
            height: 83,
            borderColor: '#e5e5e5',
            borderTopRightRadius: 50,
            borderTopLeftRadius: 50,
            width: '100%',
            position: 'absolute',
            bottom: 0,
            width: Device_width,
            zIndex: 8,
            borderWidth: 1.5
        },
        labelStyle: {
            marginTop: -10,
            marginBottom: 10,
            fontSize: 15,
        },
    },
}
);

export const OrderStatusTabNavigation = createBottomTabNavigator(
    {
        Home,
        OrderStatusShoppingCart,
        OrderHistory,
    }, {
    initialRouteName: 'OrderStatusShoppingCart',
    defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, horizontal, tintColor }) => {
            const { routeName } = navigation.state;
            //   let IconComponent = Icon;
            //   let iconName;
            var ImageUrl;
            if (routeName === 'Home') {
                if (focused === true) {
                    tintColor = 'gray';
                    ImageUrl = require('../assets/iamges/ActiveHome.png')
                } else {
                    ImageUrl = require('../assets/iamges/DeActiveHome.png')
                }
                return <Image source={ImageUrl} color={tintColor} style={{ width: 99, height: 46 }} />
            } else if (routeName === 'OrderStatusShoppingCart') {
                if (focused === true) {
                    tintColor = 'gray';
                    ImageUrl = require('../assets/iamges/ActiveShopping.png')
                } else {
                    ImageUrl = require('../assets/iamges/DeActiveShopping.png')
                }
                return <Image source={ImageUrl} color={tintColor} style={{ width: 99, height: 46 }} />
            } else if (routeName === 'OrderHistory') {
                if (focused === true) {
                    tintColor = 'gray';
                    ImageUrl = require('../assets/iamges/ActiveOrder.png')
                } else {
                    ImageUrl = require('../assets/iamges/DeActiveOrder.png')
                }
                return <Image source={ImageUrl} color={tintColor} style={{ width: 99, height: 46 }} />
            }
        },
    }),
    tabBarOptions: {
        activeTintColor: 'white',
        showLabel: false,
        style: {
            backgroundColor: '#fff',
            //----------add this line------------------------//
            height: 83,
            borderColor: '#e5e5e5',
            borderTopRightRadius: 50,
            borderTopLeftRadius: 50,
            width: '100%',
            position: 'absolute',
            bottom: 0,
            width: Device_width,
            zIndex: 8,
            borderWidth: 1.5
        },
        labelStyle: {
            marginTop: -10,
            marginBottom: 10,
            fontSize: 15,
        },
    },
}
);


export const TabDriverNavigation = createBottomTabNavigator(
    {
        ShoppingCart,
        OrderHistory,
    }, {
    initialRouteName: 'OrderHistory',
    defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, horizontal, tintColor }) => {
            const { routeName } = navigation.state;
            //   let IconComponent = Icon;
            //   let iconName;
            var ImageUrl;
            if (routeName === 'ShoppingCart') {
                if (focused === true) {
                    tintColor = 'gray';
                    ImageUrl = require('../assets/iamges/ActiveShopping.png')
                } else {
                    ImageUrl = require('../assets/iamges/DeActiveShopping.png')
                }
                return <Image source={ImageUrl} color={tintColor} style={{ width: 99, height: 46 }} />
            } else if (routeName === 'OrderHistory') {
                if (focused === true) {
                    tintColor = 'gray';
                    ImageUrl = require('../assets/iamges/ActiveOrder.png')
                } else {
                    ImageUrl = require('../assets/iamges/DeActiveOrder.png')
                }
                return <Image source={ImageUrl} color={tintColor} style={{ width: 99, height: 46 }} />
            }
        },
    }),
    tabBarOptions: {
        activeTintColor: 'white',
        showLabel: false,
        style: {
            backgroundColor: '#fff',
            //----------add this line------------------------//
            height: 83,
            borderColor: '#e5e5e5',
            borderTopRightRadius: 50,
            borderTopLeftRadius: 50,
            width: '100%',
            position: 'absolute',
            bottom: 0,
            width: Device_width,
            zIndex: 8,
            borderWidth: 1.5
        },
        labelStyle: {
            marginTop: -10,
            marginBottom: 10,
            fontSize: 15,
        },
    },
}
);
