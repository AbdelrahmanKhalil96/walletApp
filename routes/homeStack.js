import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import Home from "../screens/home";
import newTx from '../screens/newTx';
import Settings from '../screens/settings';
import React from 'react';


const screens = {
    Home: {
        screen: Home,
        navigationOptions: {
            headerShown: false,
        }

    },
    TransactionDetails: {
        screen: newTx

        /*   navigationOptions: {
               headerStyle: { backgroundColor: '#eee' },
           }*/

    },
    Settings: {
        screen: Settings
    }

}
const HomeStack = createStackNavigator(screens);
export default createAppContainer(HomeStack);
