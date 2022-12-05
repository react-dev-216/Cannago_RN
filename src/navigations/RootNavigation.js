import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import DispensariesSignupScreen from '../screens/DispensariesSignupScreen';
import DriverSignupScreen from '../screens/DriverSignupScreen';
import SelectStoreHourScreen from '../screens/SelectStoreHourScreen';

import { TabNavigation, TabDriverNavigation, OrderStatusTabNavigation } from './TabBarNavigation'

const MainTabNav = createAppContainer(TabNavigation)
const DriverTabNav = createAppContainer(TabDriverNavigation)
const OrderStatusTabNav = createAppContainer(OrderStatusTabNavigation)

const AuthStack = createStackNavigator(
    {
        LoginScreen: {
            screen: LoginScreen,
            navigationOptions: {
                headerShown: false
            }
        },
        SignUpScreen: {
            screen: SignUpScreen,
            navigationOptions: {
                headerShown: false
            }
        },
        ForgotPasswordScreen: {
            screen: ForgotPasswordScreen,
            navigationOptions: {
                headerShown: false
            }
        },
        DispensariesSignupScreen: {
            screen: DispensariesSignupScreen,
            navigationOptions: {
                headerShown: false
            }
        },
        SelectStoreHourScreen: {
            screen: SelectStoreHourScreen,
            navigationOptions: {
                headerShown: false
            }
        },
        DriverSignupScreen: {
            screen: DriverSignupScreen,
            navigationOptions: {
                headerShown: false
            }
        },
    },
    {
        initialRouteName: 'LoginScreen'
    }
)

const MainStack = createStackNavigator({
    Tabbar: {
        screen: MainTabNav,
        navigationOptions: {
            headerShown: false
        }
    },
})

const DriverStack = createStackNavigator({
    TabBar: {
        screen: DriverTabNav,
        navigationOptions: {
            headerShown: false
        }
    }
})

// const App = createAppContainer(RootNavigation);
// export default App;

export default createAppContainer(
    createSwitchNavigator(
        {
            Splash: SplashScreen,
            Auth: AuthStack,
            Main: MainStack,
            Driver: DriverStack,
            OrderStatus:OrderStatusTabNav
        },
        {
            initialRouteName: 'Splash'
        }
    )
);