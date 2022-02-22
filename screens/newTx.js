import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import * as SQLite from 'expo-sqlite';

export default function newTx({ navigation }) {
    const wallet = navigation.getParam('wallet')
    var [selectedWallet, setSelectedWallet] = useState(1);
    var [selectTX, setSelectTX] = useState(true);

    var [filteredWallets, setFilteredWallets] = useState(null);

    var [selectedFromWallet, setSelectedFromWallet] = useState(0);
    var [selectedToWallet, setSelectedToWallet] = useState(0);
    const [TfAmount, setTfAmount] = useState(0);


    const [txReason, setTxReason] = useState('Food');
    const [TxAmount, setTxAmount] = useState(0);
    const [TxType, setTxType] = useState('-');
    const [TxImportance, setTxImportance] = useState('Low');
    console.log('open')

    const filterWallets = (key) => {
        setFilteredWallets(wallet);
        setFilteredWallets((prevTodos) => {
            return prevTodos.filter(todo => todo.key != key);
        })
    }
    const transferDB = () => {
        console.log('from ' + selectedFromWallet + ' to ' + selectedToWallet + ' amount is ' + TfAmount)


        try {
            console.log('before')
            var dbFile = SQLite.openDatabase('WalletAppDb.db');

            dbFile.transaction((tx) => {
                tx.executeSql(
                    "UPDATE wallets SET balance=balance-cast(? as FLOAT)  where id=cast(? as integer);"
                    , [TfAmount, selectedFromWallet], (tx, res) => {
                        console.log(res)
                    }, (tx, err) => {
                        console.log(err)
                    }

                );
                /** */
                tx.executeSql(
                    "UPDATE wallets SET balance=balance+cast(? as FLOAT)  where  id=cast(? as integer);"
                    , [TfAmount, selectedToWallet], (tx, res) => {
                        console.log(res)
                        alert('Transferred Successfully ')
                        navigation.navigate('Home',
                            {
                                counter: Math.floor(Math.random() * 200)
                            })
                    }, (tx, err) => {
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
            <Text>Movement Type : </Text>

            <Picker
                itemStyle={styles.itemStyle}
                style={styles.pickerStyle}
                selectedValue={selectTX}
                onValueChange={(itemValue, itemIndex) => {
                    setSelectTX(itemValue)
                    console.log(itemValue);
                }
                }
            >
                <Picker.Item
                    color="#0087F0"
                    label='new Transaction'
                    value={true}
                    key={0} />
                <Picker.Item
                    color="#0087F0"
                    label='new Transfer'
                    value={false}
                    key={1} />
            </Picker>
            <View style={{ height: 1, backgroundColor: 'black' }} />
            {selectTX ?
                <View>
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

                </View>
                :
                <View>


                    {/**Source */}
                    <Text>Transfer From : </Text>

                    <Picker
                        itemStyle={styles.itemStyle}
                        style={styles.pickerStyle}
                        selectedValue={selectedFromWallet}
                        onValueChange={(itemValue, itemIndex) => {
                            setSelectedFromWallet(itemValue);
                            filterWallets(itemValue)
                            console.log(itemValue);
                        }
                        }
                    >
                        <Picker.Item
                            label={'Please Select'}
                            key={0}
                            value={'disabled'}
                            enabled={false}
                        />
                        {wallet.map((item) => (
                            <Picker.Item
                                color="#0087F0"
                                label={item.text}
                                value={item.key}
                                key={item.key} />
                        ))}
                    </Picker>

                    {/**Transfer To */}

                    <Text>Transfer To : </Text>
                    {filteredWallets != null ?
                        <Picker
                            itemStyle={styles.itemStyle}
                            style={styles.pickerStyle}
                            selectedValue={selectedToWallet}
                            onValueChange={(itemValue, itemIndex) => {
                                setSelectedToWallet(itemValue);
                                console.log(itemValue);
                            }
                            }
                        >
                            <Picker.Item
                                label={'Please Select'}
                                key={0}
                                value={0}
                                enabled={false}
                            />
                            {filteredWallets.map((item) => (
                                <Picker.Item
                                    color="#0087F0"
                                    label={item.text}
                                    value={item.key}
                                    key={item.key} />
                            ))}
                        </Picker>
                        :
                        <Text>Please Select The First Wallet First</Text>
                    }
                    {/**Amount */}

                    <TextInput
                        keyboardType='number-pad'
                        style={styles.input}
                        placeholder='Transaction Amount'
                        onChangeText={setTfAmount}
                        value={TfAmount.toString()}
                    />


                    <Button title='Transfer' onPress={() => {
                        if (filteredWallets != null && selectedToWallet != 0) { transferDB() }
                        else {
                            alert('Please Select First')
                        }
                    }} />


                </View>}
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
