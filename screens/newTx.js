import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import SelectDropdown from 'react-native-select-dropdown'
import * as SQLite from 'expo-sqlite';
import { NavigationActions } from 'react-navigation';

export default function newTx({ navigation }) {
    var [selectedWallet, setSelectedWallet] = useState(1);
    var wallet = navigation.getParam('wallet');
    var setWallets = () => navigation.getParam('setWallets');

    const db = navigation.getParam('db');
    const pressHandler = () => {
        navigation.goBack();
        //navigation.push('ReviewDetails');

    }
    var dbFile = SQLite.openDatabase('WalletAppDb.db');
    const InsertToDb = () => {
        dbFile.transaction((tx) => {
            tx.executeSql(
                "INSERT INTO transactions (walletId, type, txAmount, txReason, txImportance) VALUES (3, '+', 10, 'Health', 'High');",

                (_, error) => {
                    console.log(error);
                    return true;
                }
            );
        })
        console.log('s')
        dbFile.transaction((tx) => {
            tx.executeSql(
                "select id,name,balance FROM wallets",
                [],
                (tx, results) => {
                    var temp = [];
                    for (let i = 0; i < results.rows.length; ++i) {
                        temp.push({ text: results.rows.item(i).name, balance: results.rows.item(i).balance, key: results.rows.item(i).id });
                    }
                    wallet = temp
                    console.log(wallet)
                }
            )

            console.log('o')


        })
        navigation.navigate(Home,
            { wallets: wallet })
    }
    return (
        <View >
            <Text>TTTTTTTTTTTT</Text>
            <Picker
                itemStyle={styles.itemStyle}
                style={styles.pickerStyle}
                selectedValue={selectedWallet}
                onValueChange={(itemValue, itemIndex) => {
                    setSelectedWallet(itemValue);
                    console.log(itemValue);
                }
                }
            >
                {wallet.map((item) => (
                    <Picker.Item
                        color="#0087F0"
                        label={item.text}
                        value={item.key}
                        key={item.key} />
                ))}
            </Picker>
            <TextInput
                keyboardType='number-pad'
                style={styles.input}
                placeholder='Transaction Amount'
            />
            <Button title='Proceed' onPress={() => InsertToDb()} />


            {/*    <Text>{navigation.getParam('title')}</Text>
            <Text>{navigation.getParam('body')}</Text>
            <Text>{navigation.getParam('rating')}</Text>
            <Button title='Back Home' onPress={pressHandler} />
 */}
        </View>
    )
}

const styles = StyleSheet.create({
    viewStyle: {
        flex: 1,
        alignSelf: "center",
        flexDirection: "row",
        width: "92%",
        justifyContent: "space-between",
        alignItems: "center"
    },
    itemStyle: {
        fontSize: 10,
        color: "#007aff"
    },
    pickerStyle: {
        width: "100%",
        height: 40,
        color: "#007aff",
        fontSize: 14,
    },
    textStyle: {
        fontSize: 14,
    },
    input: {
        marginBottom: 10,
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderBottomWidth: 2,
        borderBottomColor: '#ddd'

    },
});
