import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { styles } from '../components/styles'
import AsyncStorage from '@react-native-community/async-storage';

export default class AppTabBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            usertype: 'consumer',
        };
    }

    componentDidMount() {
        this._retrieveData();
    }

    _retrieveData = async () => {
        var value = await AsyncStorage.getItem('usertype');
        await this.setState({
            usertype: value,
        });
        alert(this.state.usertype)
    };

    render() {
        const { navigation, appState } = this.props;
        const routes = navigation.state.routes;
        const { usertype } = this.state;

        return (
            <View style={styles.container}>
                {routes.map((route, index) => {
                    if (usertype === 'driver' && route.routeName === 'Home') {
                        return null;
                    }
                })}
            </View>
        );
    }

    navigationHandler = name => {
        const { navigation } = this.props;
        navigation.navigate(name);
    };
}