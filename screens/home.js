import { Button, StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import React, { useState, useEffect, useIs } from 'react';
import WalletList from '../components/walletList';
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { useIsFocused } from '@react-navigation/native';

export default function Home({ navigation }) {

    const [count, setcount] = useState(0);

    const [wallet, setWallets] = useState([]);
    var [db, setDb] = useState([]);
    //=>DB
    const WalletAppDb = 'WalletAppDb.db';
    async function openDatabase(pathToDatabaseFile: string): Promise<SQLite.WebSQLDatabase> {
        if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
            await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
        };
        await FileSystem.downloadAsync(
            Asset.fromModule(require('../assets/WalletAppDb.db')).uri,
            FileSystem.documentDirectory + `SQLite/${WalletAppDb}`
        );
        return SQLite.openDatabase('WalletAppDb.db');
    }

    useEffect(() => {
        //alert('app started');
        openDatabase().then((dbFile) => {
            console.log('after')
            loadAllwallets(dbFile)
        })
        /*
        
        {
              db.transaction((tx) => {
                tx.executeSql(
                  "select id,name FROM wallets where wallets.id >2",
                  [],
                  (tx, results) => {
                    var temp = [];
                    for (let i = 0; i < results.rows.length; ++i) {
                      temp.push({ text: results.rows.item(i).name, key: results.rows.item(i).id });
                    }
                    setWallets(temp)
                    console.log(wallet)
                  }
                )
              })
            }*/
        // this code will run once
    }, [])
    /*const connectDb = async () => {
      await openDatabase('../assets/WalletAppDb.db')
  
    }*/
    //==>End 
    const loadAllwallets = (dbFile) => {
        {
            dbFile = SQLite.openDatabase('WalletAppDb.db')
            dbFile.transaction((tx) => {
                tx.executeSql(
                    "select id,name,balance FROM wallets",
                    [],
                    (tx, results) => {
                        var temp = [];
                        for (let i = 0; i < results.rows.length; ++i) {
                            temp.push({ text: results.rows.item(i).name, balance: results.rows.item(i).balance, key: results.rows.item(i).id });
                        }
                        setWallets(temp);
                        setDb(dbFile);
                        console.log('count=' + count)
                        setcount(count + 1)
                    }
                )
            })

        }
    }
    const pressHandler = (wallet) => {
        navigation.navigate('ReviewDetails', {
            wallet: wallet,
            setWallets: setWallets,
            loadAllwallets: loadAllwallets,
            db: db,
            //   loadala: {(props) => <UserProfile axiosUrl={axiosUrl}  {...props}} 
        });
        db._db.close();

        //navigation.push('ReviewDetails');
    }
    return (
        <View style={styles.container}>

            <FlatList
                contentContainerStyle={{
                    borderColor: '#bbb',
                    borderWidth: 1,
                    borderRadius: 10,
                    alignItems: 'flex-start', // Centered horizontally
                }}
                numColumns={3}
                data={wallet}
                renderItem={({ item }) => (
                    <WalletList item={item} loadAllwallets={loadAllwallets} />
                )}
            />

            <View style={styles.content}>
                <Button onPress={() => pressHandler(wallet)} title='New Transaction' color='coral' />

            </View>

            {/*  <FlatList
                data={reviews}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigation.navigate('ReviewDetails', item)}>
                        <Card>
                            <Text style={globalStyles.titleText}>{item.title}</Text>

                        </Card>
                    </TouchableOpacity>
                )}
            /> */}
        </View>
    )
}


const styles = StyleSheet.create({
    content: {
        flex: 1,
        padding: 10,

    }, container: {
        flex: 1,
        backgroundColor: '#fff',
    },

});
