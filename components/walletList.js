import { StyleSheet, Text, TouchableOpacity, View, Keyboard } from 'react-native';
import React, { useState } from 'react';
import Dialog from "react-native-dialog";
import { TextInput } from 'react-native-gesture-handler';


export default function WalletList({ item, loadAllwallets, editfromDB }) {
    const [visible, setVisible] = useState(false);
    const [text, setText] = useState('');
    const showDialog = () => {
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
    };

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
    const editBalance = (wallet) => {
        console.log(text + '' + wallet);
        editfromDB(wallet, text)
        setVisible(false);

    }

    return (
        <View>
            <Dialog.Container visible={visible} style={{ color: '#000', flex: 1 }}>
                <Dialog.Title>Adjust Balance</Dialog.Title>
                <Text>
                    Do you want to Edit this Wallet? You cannot undo this action. {"\n"}
                </Text>
                <TextInput keyboardType='numeric' defaultValue={item.balance.toString()} onChangeText={newText => setText(newText)} />
                <Dialog.Button label="Cancel" onPress={handleCancel} />
                <Dialog.Button label="Edit Balance" onPress={() => editBalance(item.key)} />
            </Dialog.Container>

            <TouchableOpacity onPress={() => loadAllwallets()} onLongPress={() => showDialog()}        >
                <View style={[styles.item, { backgroundColor: getColor(item.key) }]}>
                    <Text style={styles.itemText} >{item.text}</Text>
                    <Text style={styles.itemText} >{item.balance}</Text>
                </View>

            </TouchableOpacity>
        </View>

    )
}
const styles = StyleSheet.create({
    item: {
        width: 105,
        padding: 3,
        margin: 5,
        borderColor: '#bbb',
        borderWidth: 1,
        borderRadius: 10,
    },
    itemText: {
        marginLeft: 10,
    }
})