import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';


export default function WalletList({ item, loadAllwallets }) {

    const getColor = (key) => {
        switch (key) {
            case 1: {
                return '#A0E7E5';
            }
            case 2: {
                return '#B4F8C8';
            }
            case 3: {
                return '#FBE7C6';
            }
            case 4: {
                return '#ffe5d9';
            }
            case 5: {
                return '#ffba08';
            }
            case 6: {
                return '#ffafcc';
            }
        }
    }
    return (
        <TouchableOpacity onPress={() => loadAllwallets()}>
            <View style={[styles.item, { backgroundColor: getColor(item.key) }]}>
                <Text style={styles.itemText} >{item.text}{'\n'}</Text>
                <Text style={styles.itemText} >{item.balance}</Text>
            </View>

        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    item: {
        width: 110,
        padding: 6,
        margin: 8,
        borderColor: '#bbb',
        borderWidth: 1,
        borderRadius: 10,
    },
    itemText: {
        marginLeft: 10,
    }
})