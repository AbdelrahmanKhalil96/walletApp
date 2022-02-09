import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import Home from "../screens/home";
import newTx from '../screens/newTx'
import React from 'react';


const screens = {
    Home: {
        screen: Home,
        navigationOptions: {
            headerShown: false,
        }

    },
    ReviewDetails: {
        screen: newTx,
        /*   navigationOptions: {
               headerStyle: { backgroundColor: '#eee' },
           }*/

    }
}
const HomeStack = createStackNavigator(screens);
export default createAppContainer(HomeStack);
