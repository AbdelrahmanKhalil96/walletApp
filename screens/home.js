import { Button, StyleSheet, View, FlatList, ScrollView, Text, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import WalletList from '../components/walletList';
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { Table, Row, Rows } from 'react-native-table-component';

export default function Home({ navigation }) {
    const [showBox, setShowBox] = useState(true);
    const HeadTable = ["tid", "Name", "type", "txAmount", "txReason", "txImportance", "txDate"];
    var [count, setcount] = useState(0);
    var [transactions, setTransactions] = useState([]);
    var [db, setDb] = useState(null);
    var [errr, Seterrr] = useState('hi')
    const showConfirmDialog = () => {
        return Alert.alert(
            "Please Confirm ",
            "Are you sure you want to Empty The \n DB File",
            [
                // The "Yes" button
                {
                    text: "Yes",
                    onPress: () => {
                        setShowBox(false);
                        try {
                            setDb(SQLite.openDatabase('WalletAppDb.db'));
                            initEmptyDB();

                        }
                        catch {
                            console.log('closedDB Error')
                        }

                    },
                },
                // The "No" button
                // Does nothing but dismiss the dialog when tapped
                {
                    text: "No",
                    onPress: () => {
                        alert('nothing Changed')
                    },

                },
            ]
        );
    };
    const editfromDB = async (wallet, balance) => {
        if (wallet != null && balance != null) {
            console.log('wal' + wallet + 'b ' + balance)
            try {
                var db = SQLite.openDatabase('WalletAppDb.db');
                console.log('opened')
                db.transaction((tx) => {
                    tx.executeSql(
                        "UPDATE wallets SET balance= cast(? as FLOAT)  where id= cast(? as integer);",
                        [balance, wallet],
                        (tx, results) => {
                            console.log(results)
                        }
                    );
                    tx.executeSql(
                        "select id,name,balance FROM wallets",
                        [],
                        (tx, results) => {
                            var temp = [];
                            for (let i = 0; i < results.rows.length; ++i) {
                                temp.push({ text: results.rows.item(i).name, balance: results.rows.item(i).balance, key: results.rows.item(i).id });
                            }
                            setWallets(temp);
                            setDb(db);
                        }
                    );
                })
            }
            catch {
                alert('db is close')
            }
        }
    }
    const initEmptyDB = async () => {
        const { uri } = await FileSystem.getInfoAsync(
            `${FileSystem.documentDirectory}SQLite/${"WalletAppDb.db"}`
        );
        const delRes = await FileSystem.deleteAsync(uri)
        try {
            createDB().then(() => alert('initialized Successfully'));
        }
        catch {
            alert('error init')
        }
    }
    const searchForDb = async () => {
        ///
        if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
            console.log('directory not exist')
            await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
        }
        if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite/WalletAppDb.db')).exists) {
            console.log('File not exist');
            alert('db File Dot Found.Initializing...');
            createDB();
        }
    }
    const createDB = async () => {
        db.transaction((tx) => {
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS 'wallets' ('id'	INTEGER, 'name'	TEXT, 'balance' REAL, PRIMARY KEY('id' AUTOINCREMENT));",
                [],
                (tx, results) => {
                    Seterrr('1:')
                }
            );
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS 'transactions' ('tid' INTEGER,'walletId' INTEGER,'type' TEXT,'txAmount' REAL, 'txReason' TEXT, 'txImportance' TEXT, 'txDate'	TIMESTAMP DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY('tid' AUTOINCREMENT), FOREIGN KEY('walletId') REFERENCES 'wallets'('id'));",
                [],
                (tx, results) => {
                    Seterrr('2:')
                }
            );
            tx.executeSql(
                "CREATE TRIGGER IF NOT EXISTS txUpdate AFTER INSERT ON transactions BEGIN UPDATE wallets SET balance=(SELECT CASE WHEN transactions.type='+' THEN( wallets.balance + transactions.txAmount) ELSE (wallets.balance -transactions.txAmount) END FROM wallets,transactions  WHERE wallets.id=(SELECT transactions.walletId as wId FROM transactions ORDER by tid desc LIMIT 1 )ORDER by tid desc LIMIT 1) WHERE wallets.id= (SELECT transactions.walletId FROM transactions ORDER by tid desc LIMIT 1); END",
                [],
                (tx, results) => {
                    Seterrr('3:')
                }
            );
            tx.executeSql(
                "INSERT OR IGNORE INTO 'main'.'wallets' ('id', 'name', 'balance') VALUES ('1', 'cibWallet', '0');",
                [],
                (tx, results) => {
                    Seterrr('4:')
                }
            );
            tx.executeSql(
                "INSERT OR IGNORE INTO 'main'.'wallets' ('id', 'name', 'balance') VALUES ('2', 'HomeWallet', '0.0');",
                [],
                (tx, results) => {
                    Seterrr('5:')
                }
            );
            tx.executeSql(
                "INSERT OR IGNORE INTO 'main'.'wallets' ('id', 'name', 'balance') VALUES ('3', 'pocketWallet', '0.0');",
                [],
                (tx, results) => {
                    Seterrr('6:')
                }
            );
            tx.executeSql(
                "INSERT OR IGNORE INTO 'main'.'wallets' ('id', 'name', 'balance') VALUES ('4', 'VFWallet', '0.0');",
                [],
                (tx, results) => {
                    Seterrr('7:')
                }
            );

            tx.executeSql(
                "INSERT OR IGNORE INTO 'main'.'wallets' ('id', 'name', 'balance') VALUES ('5', 'ahlyWallet', '0.0');",
                [],
                (tx, results) => {
                    Seterrr('8:')
                }
            );
            tx.executeSql(
                "INSERT OR IGNORE INTO 'main'.'wallets' ('id', 'name', 'balance') VALUES ('6', 'nourVF', '0.0');",
                [],
                (tx, results) => {
                    Seterrr('9:')
                }
            );
            tx.executeSql(
                "select id,name,balance FROM wallets",
                [],
                (tx, results) => {
                    var temp = [];
                    for (let i = 0; i < results.rows.length; ++i) {
                        temp.push({ text: results.rows.item(i).name, balance: results.rows.item(i).balance, key: results.rows.item(i).id });
                    }
                    setWallets(temp);
                    Seterrr('count=' + count)
                    setcount(count + 1)
                }
            );
            tx.executeSql(
                "SELECT tid,wallets.name, type, txAmount, txReason, txImportance, txDate FROM transactions,wallets WHERE transactions.walletId = wallets.id",
                [],
                (tx, results) => {
                    var tempTrans = [];
                    for (let i = 0; i < results.rows.length; ++i) {
                        tempTrans.push([
                            results.rows.item(i).tid,
                            results.rows.item(i).name,
                            results.rows.item(i).type,
                            results.rows.item(i).txAmount,
                            results.rows.item(i).txReason,
                            results.rows.item(i).txImportance,
                            results.rows.item(i).txDate,]
                        );
                    }
                    setTransactions(tempTrans);
                    Seterrr('transactions');
                    console.log('transactions')
                }
            )
            try {
                setDb(SQLite.openDatabase('WalletAppDb.db'));
            }
            catch {
                console.log('error Openeing Db File')
            }
        })

    }

    const [wallet, setWallets] = useState([]);
    useEffect(() => {
        db = SQLite.openDatabase('WalletAppDb.db');
        loadAllwallets();
    }
        , [navigation.getParam('counter')]); // The second parameters are the variables this useEffect is listening to for changes.//JSON.stringify(navigation.getParam('wallets'))
    //=>DB
    /*  const WalletAppDb = 'WalletAppDb.db';
      async function openDatabase(pathToDatabaseFile: string): Promise<SQLite.WebSQLDatabase> {
          if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
              alert('database Exists')
              await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
          };
          await FileSystem.downloadAsync(
              Asset.fromModule(require('../assets/WalletAppDb.db')).uri,
              FileSystem.documentDirectory + `SQLite/${WalletAppDb}`
          );
          alert('database Loaded')
          return SQLite.openDatabase('WalletAppDb.db');
      }
  */
    useEffect(() => {
        //alert('app started');
        searchForDb()/*.then(() => {
            loadAllwallets()
        })*/
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
    const loadAllwallets = () => {
        {
            try {
                db = SQLite.openDatabase('WalletAppDb.db');
                db.transaction((tx) => {
                    tx.executeSql(
                        "select id,name,balance FROM wallets",
                        [],
                        (tx, results) => {
                            var temp = [];
                            for (let i = 0; i < results.rows.length; ++i) {
                                temp.push({ text: results.rows.item(i).name, balance: results.rows.item(i).balance, key: results.rows.item(i).id });
                            }
                            setWallets(temp);
                            setDb(db);
                            Seterrr('count=' + count)
                            setcount(count + 1)
                        }
                    );
                    tx.executeSql(
                        "SELECT tid,wallets.name, type, txAmount, txReason, txImportance, txDate FROM transactions,wallets WHERE transactions.walletId = wallets.id",
                        [],
                        (tx, results) => {
                            var tempTrans = [];
                            for (let i = 0; i < results.rows.length; ++i) {
                                tempTrans.push([
                                    results.rows.item(i).tid,
                                    results.rows.item(i).name,
                                    results.rows.item(i).type,
                                    results.rows.item(i).txAmount,
                                    results.rows.item(i).txReason,
                                    results.rows.item(i).txImportance,
                                    results.rows.item(i).txDate,]
                                );
                            }
                            setTransactions(tempTrans);
                            Seterrr('transactions');
                            console.log('transactions')
                        }
                    )
                })
            }
            catch {
                console.log('catch')
            }
            finally {
                console.log('done')

            }


        }
    }
    const pressHandler = (wallet) => {
        navigation.navigate('TransactionDetails', {
            wallet: wallet,
            db: db,
            //   loadala: {(props) => <UserProfile axiosUrl={axiosUrl}  {...props}} 
        });
        db._db.close();
        console.log('close')
        //navigation.push('TransactionDetails');
    }
    const goToSettings = () => {
        navigation.navigate('Settings', {
            wallet: wallet,
            db: db,
            //   loadala: {(props) => <UserProfile axiosUrl={axiosUrl}  {...props}} 
        });
        try {
            db._db.close();
        }
        catch {
            console.log('already closed')

        }
        //navigation.push('TransactionDetails');
    }


    const goToTodoList = () => {
        navigation.navigate('Todos', {
            wallet: wallet,
            db: db,
            //   loadala: {(props) => <UserProfile axiosUrl={axiosUrl}  {...props}} 
        });
        try {
            db._db.close();
        }
        catch {
            console.log('already closed')

        }
        //navigation.push('TransactionDetails');
    }
    return (
        <View style={styles.container}>
            <View style={styles.list}>
                <Text>{errr}</Text>
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
                        <WalletList item={item} loadAllwallets={loadAllwallets} editfromDB={editfromDB} />
                    )}
                />
            </View>
            {showBox && <View style={styles.box}></View>}

            <View style={styles.buttons}>
                <Button onPress={() => pressHandler(wallet)} title='New Tx' color='coral' />
                <View style={styles.sep}></View>
                <Button onPress={() => goToTodoList()} title='Todos' color='#A0E7E5' />
                <View style={styles.sep}></View>

                <Button onPress={() => goToSettings()} title='Settings' color='#676FA3' />
                <View style={styles.sep}></View>

                <Button onPress={() => showConfirmDialog()} title='EmptyDB' color='#B33030' />
                <View style={styles.sep}></View>

            </View>
            <View style={styles.tableView}>
                <ScrollView>
                    <Table borderStyle={{ borderWidth: 1, borderColor: '#ffa1d2' }}>
                        <Row data={HeadTable} style={styles.HeadStyle} textStyle={styles.TableText} />
                        <Rows data={transactions} textStyle={styles.TableText} />
                    </Table>

                </ScrollView>
            </View>
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
    buttons: {
        flexDirection: 'row',
        margin: 10,
    },
    list: {
        flex: 0.4,
        marginTop: 10,
        marginBottom: 10,
        padding: 6,
        height: 300,

    },
    tableView: {
        flex: 1,
        marginTop: 10,
        marginBottom: 10,
        padding: 6,
    },
    HeadStyle: {
        height: 50,
        alignContent: "center",
        backgroundColor: '#ffe0f0'
    },
    TableText: {
        margin: 2
    },
    sep: {
        marginRight: 10
    },
    dataWrapper: {
        marginTop: -1
    },
    screen: {
        justifyContent: "center",
        alignItems: "center",
    },
    box: {

        marginBottom: 10,
    },
});
