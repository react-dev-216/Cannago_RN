import React, { Component } from 'react';

import RootNavigator from './navigations/RootNavigation';
export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usertype: 'consumer',
        };
    }
    render() {
        return (
            <>
                <RootNavigator />
            </>
        );
    }
}