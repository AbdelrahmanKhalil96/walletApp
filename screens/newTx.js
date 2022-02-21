import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import * as SQLite from 'expo-sqlite';

export default function newTx({ navigation }) {
    const wallet = navigation.getParam('wallet')
    var [selectedWallet, setSelectedWallet] = useState(1);
    const [txReason, setTxReason] = useState('Food');
    const [TxAmount, setTxAmount] = useState(0);
    const [TxType, setTxType] = useState('-');
    const [TxImportance, setTxImportance] = useState('Low');
    console.log('open')
    const InsertToDb = () => {
        try {
            console.log('before')
            var dbFile = SQLite.openDatabase('WalletAppDb.db');

            dbFile.transaction((tx) => {
                tx.executeSql(
                    "INSERT INTO transactions (walletId, type, txAmount, txReason, txImportance) VALUES ( cast(? as integer), ?,  cast(? as integer), ?, ?);"
                    , [selectedWallet, TxType, TxAmount, txReason, TxImportance], (tx, res) => {
                        navigation.navigate('Home',
                            { counter: res["insertId"] })
                    }, (tx, err) => {
                        console.log('tx');
                        console.log(tx)
                        console.log(err)
                    }

                );
            })
        } catch {
            console.log('error')
        } finally {
            console.log('done')
        }

    }
    return (
        <View style={styles.container}>
            {/**Source */}
            <Text>Transaction Source : </Text>

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
            {/**Amount */}

            <TextInput
                keyboardType='number-pad'
                style={styles.input}
                placeholder='Transaction Amount'
                onChangeText={setTxAmount}
                value={TxAmount.toString()}
            />
            {/**Type */}

            <Text>Transaction Type : </Text>
            <Picker
                itemStyle={styles.itemStyle}
                style={styles.pickerStyle}
                selectedValue={TxType}
                onValueChange={(itemValue, itemIndex) => {
                    setTxType(itemValue);
                    console.log(TxType);
                }
                }
            >
                <Picker.Item
                    color="#0087F0"
                    label='Expanse'
                    value='-'
                />
                <Picker.Item
                    color="#0087F0"
                    label='Income'
                    value='+'
                />
            </Picker>
            {/**Importance */}
            <Text>Transaction Importance : </Text>
            <Picker
                itemStyle={styles.itemStyle}
                style={styles.pickerStyle}
                selectedValue={TxImportance}
                onValueChange={(itemValue, itemIndex) => {
                    setTxImportance(itemValue);
                    console.log(TxImportance);
                }
                }
            >
                <Picker.Item
                    color="#0087F0"
                    label='LOW'
                    value='Low'
                />
                <Picker.Item
                    color="#0087F0"
                    label='MODERATE'
                    value='Moderate'
                />
                <Picker.Item
                    color="#0087F0"
                    label='HIGH'
                    value='High'
                />
            </Picker>
            {/**Reason */}

            <TextInput
                style={styles.input}
                placeholder='Transaction Reason'
                onChangeText={setTxReason}
                value={txReason}

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
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        margin: 10,
    },

    itemStyle: {
        fontSize: 10,
        color: "#007aff"
    },
    pickerStyle: {
        width: "80%",
        height: 40,
        color: "#007aff",
        fontSize: 12,
    },
    textStyle: {
        fontSize: 12,
    },
    input: {
        marginBottom: 10,
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderBottomWidth: 2,
        borderBottomColor: '#ddd'

    },
});
