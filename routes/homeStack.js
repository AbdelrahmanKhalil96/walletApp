import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import Home from "../screens/home";
import newTx from '../screens/newTx';
import Settings from '../screens/settings';
import Todos from '../screens/todos';
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
    },
    Todos: {
        screen: Todos
    }

}
const HomeStack = createStackNavigator(screens);
export default createAppContainer(HomeStack);
