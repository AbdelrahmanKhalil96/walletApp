import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
export default function Sandbox() {
    return (
        <View style={Styles.container}>

            <Text style={Styles.boxOne}>one</Text>
            <Text style={Styles.boxTwo}>two</Text>
            <Text style={Styles.boxThree}>three</Text>
            <Text style={Styles.boxFour}>four</Text>

        </View>
    )
}
const Styles = StyleSheet.create({
    container: {
        //flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingTop: 40,
        backgroundColor: '#ddd',
    },
    boxOne: {
        backgroundColor: 'violet',
        padding: 10,
    },
    boxTwo: {
        backgroundColor: 'gold',
        padding: 20,
    },
    boxThree: {
        backgroundColor: 'coral',
        padding: 30,
    },
    boxFour: {
        backgroundColor: 'skyblue',
        padding: 40,
    },
});