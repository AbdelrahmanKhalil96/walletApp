import { Button, StyleSheet, View, FlatList, Text, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import WalletList from '../components/walletList';
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Dialog from "react-native-dialog";
import { Picker } from '@react-native-picker/picker';
import { TextInput } from 'react-native-gesture-handler';

import { Table, Row, Rows } from 'react-native-table-component';

export default function Home({ navigation }) {
    const [showBox, setShowBox] = useState(true);
    const HeadTable = ["No.", "Name", "type", "Amount", "Reason", "Imp", "Date", "BalAfter"];




    const [editedTxWallet, seteditedTxWallet] = useState(null);
    const [editedTxAmount, seteditedTxAmount] = useState(0);
    const [editedTxReason, seteditedTxReason] = useState([]);
    const [editedTxId, seteditedTxId] = useState(null);
    const [editedTxType, seteditedTxType] = useState([]);
    const [editedTxImportance, seteditedTxImportance] = useState([]);
    var [count, setcount] = useState(0);
    var [transactions, setTransactions] = useState([]);
    var [db, setDb] = useState(null);
    var [errr, Seterrr] = useState('hi')
    const [visible, setVisible] = useState(false);
    const [EmpVisible, setEmpVisible] = useState(false);
    const [EmpsecText, setEmpsecText] = useState('');

    const showEmpDialog = () => {
        setEmpVisible(true);
    };

    const handleEmpCancel = () => {
        setEmpVisible(false);
    };



    const showDialog = () => {
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const EmptyDbConf = () => {
        setEmpVisible(false)
        if (EmpsecText == 'Password') {
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
                                initEmptyDB();
                                setEmpVisible(false);
                                setEmpsecText('')
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
                            setEmpsecText('');
                            setEmpVisible(false);
                        },

                    },
                ]
            );
        }
        else {
            alert('Wrong Password');
            setEmpVisible(false);
            setEmpsecText('');
        }
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
                        "select id,name,balance as balance FROM wallets",
                        [],
                        (tx, results) => {
                            var temp = [];
                            for (let i = 0; i < results.rows.length; ++i) {
                                temp.push({ text: results.rows.item(i).name, balance: cutNumber(results.rows.item(i).balance), key: results.rows.item(i).id });
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
    const DeleteDB = async () => {
        const { uri } = await FileSystem.getInfoAsync(
            `${FileSystem.documentDirectory}SQLite/`
        );
        /*  const { uri2 } = await FileSystem.getInfoAsync(
              `${FileSystem.documentDirectory}SQLite/${"WalletAppDb.db-journal"}`
          );*/
        try {
            var v = await FileSystem.deleteAsync(FileSystem.documentDirectory + 'SQLite')
            console.log('Directory deleted' + v)
            setTransactions([])
            setDb(null)
            setWallets([])
            //  await FileSystem.deleteAsync(uri2).then(() => console.log('file2 deleted'))

        }
        catch {
            console.log('already deleted')
        }

        if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite/')).exists) {

            alert('Database Deleted')
        }
    }
    const initEmptyDB = async () => {
        const { uri } = await FileSystem.getInfoAsync(
            `${FileSystem.documentDirectory}SQLite/${"WalletAppDb.db"}`
        );
        try {
            const delRes = await FileSystem.deleteAsync(uri)
            console.log(delRes)

        }
        catch {
            alert('Db Already Deleted')
        }
        try {
            createDB().then(() => alert('initialized Successfully'));
        }
        catch {
            alert('error init')
        }
    }
    const searchForDb = async () => {
        ///
        if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite/')).exists) {
            var v = await FileSystem.readDirectoryAsync(`${FileSystem.documentDirectory}SQLite/`)
            console.log('directory not exist' + v)
            try {
                await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');

            }
            catch {
                console.log('already created')
            }
            alert('db File Dot Found.Initializing...');
            createDB();
        }
        else {
            console.log('db Is Found');
            console.log(await FileSystem.readDirectoryAsync(FileSystem.documentDirectory + 'SQLite'))

        }
        /*  if (!(await FileSystem.getInfoAsync(`${FileSystem.documentDirectory}SQLite/${"WalletAppDb.db"}`)).exists) {
              console.log('File not exist');
              alert('db File Dot Found.Initializing...');
              //  createDB();
          }*/

    }


    /*
        useEffect(() => {
            const backAction = () => {
                Alert.alert("Hold on!", "Are you sure you want to Exit ?", [
                    {
                        text: "Cancel",
                        onPress: () => null,
                        style: "cancel"
                    },
                    { text: "YES", onPress: () => BackHandler.exitApp() }
                ]);
                return true;
            };
    
            const backHandler = BackHandler.addEventListener(
                "hardwareBackPress",
                backAction
            );
    
            return () => backHandler.remove();
        }, []);
    
    */
    const handleUndoTX = (row) => {

        seteditedTxId(row[0]);
        seteditedTxWallet(row[1])
        seteditedTxType(row[2]);
        seteditedTxAmount(row[3]);;
        seteditedTxReason(row[4]);
        seteditedTxImportance(row[5]);
        //ChangedDefault Value


        showDialog();
        console.log(editedTxWallet);
    }
    const createDB = async () => {
        var db = SQLite.openDatabase('WalletAppDb.db')
        setDb(db);
        db.transaction((tx) => {
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS 'wallets' ('id'	INTEGER, 'name'	TEXT, 'balance' REAL, PRIMARY KEY('id' AUTOINCREMENT));",
                [],
                (tx, results) => {
                    Seterrr('1:')
                }
            );
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS 'transactions' ('tid' INTEGER,'walletId' INTEGER,'type' TEXT,'txAmount' REAL, 'txReason' TEXT, 'txImportance' TEXT, 'txDate' TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 'BalanceAfter' REAL, PRIMARY KEY('tid' AUTOINCREMENT), FOREIGN KEY('walletId') REFERENCES 'wallets'('id'));",
                [],
                (tx, results) => {
                    Seterrr('2:')
                }
            );
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS 'TodoList' ( 'id' INTEGER, 'todoItem' TEXT, 'Type' TEXT, 'TxId' INTEGER, 'Price' REAL, 'State' TEXT, 'Importance' INTEGER, PRIMARY KEY('id' AUTOINCREMENT), FOREIGN KEY('TxId') REFERENCES 'transactions'('tid'));",
                [],
                (tx, results) => {
                    Seterrr('3:')
                }
            );
            tx.executeSql(
                "CREATE TRIGGER IF NOT EXISTS txUpdate AFTER INSERT ON transactions BEGIN UPDATE wallets SET balance=(SELECT CASE WHEN transactions.type='+' THEN( wallets.balance + transactions.txAmount) ELSE (wallets.balance -transactions.txAmount) END FROM wallets,transactions  WHERE wallets.id=(SELECT transactions.walletId as wId FROM transactions ORDER by tid desc LIMIT 1 )ORDER by tid desc LIMIT 1) WHERE wallets.id= (SELECT transactions.walletId FROM transactions ORDER by tid desc LIMIT 1); END",
                [],
                (tx, results) => {
                    Seterrr('4:')
                }
            );
            tx.executeSql(
                "INSERT OR IGNORE INTO 'main'.'wallets' ('id', 'name', 'balance') VALUES ('1', 'cibWallet', '0');",
                [],
                (tx, results) => {
                    Seterrr('5:')
                }
            );
            tx.executeSql(
                "INSERT OR IGNORE INTO 'main'.'wallets' ('id', 'name', 'balance') VALUES ('2', 'HomeWallet', '0.0');",
                [],
                (tx, results) => {
                    Seterrr('6:')
                }
            );
            tx.executeSql(
                "INSERT OR IGNORE INTO 'main'.'wallets' ('id', 'name', 'balance') VALUES ('3', 'pocketWallet', '0.0');",
                [],
                (tx, results) => {
                    Seterrr('7:')
                }
            );
            tx.executeSql(
                "INSERT OR IGNORE INTO 'main'.'wallets' ('id', 'name', 'balance') VALUES ('4', 'VFWallet', '0.0');",
                [],
                (tx, results) => {
                    Seterrr('8:')
                }
            );

            tx.executeSql(
                "INSERT OR IGNORE INTO 'main'.'wallets' ('id', 'name', 'balance') VALUES ('5', 'ahlyWallet', '0.0');",
                [],
                (tx, results) => {
                    Seterrr('9:')
                }
            );
            tx.executeSql(
                "INSERT OR IGNORE INTO 'main'.'wallets' ('id', 'name', 'balance') VALUES ('6', 'nourVF', '0.0');",
                [],
                (tx, results) => {
                    Seterrr('10:')
                }
            );
            tx.executeSql(
                "select id,name,balance as balance FROM wallets",
                [],
                (tx, results) => {
                    var temp = [];
                    for (let i = 0; i < results.rows.length; ++i) {
                        temp.push({ text: results.rows.item(i).name, balance: cutNumber(results.rows.item(i).balance), key: results.rows.item(i).id });
                    }
                    setWallets(temp);
                    Seterrr('count=' + count)
                    setcount(count + 1)
                }
            );
            tx.executeSql(
                "SELECT tid,wallets.name, type, txAmount, txReason, txImportance, txDate ,BalanceAfter FROM transactions,wallets WHERE transactions.walletId = wallets.id ORDER by txDate DESC",
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
                            results.rows.item(i).txDate,
                            results.rows.item(i).BalanceAfter,]
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
    const cutNumber = (number) => {
        const str = `${number}`;
        if (str.indexOf('.') !== -1) {
            // would be true. Period found in file name
            console.log("Found . in str index is " + str.indexOf('.'))
            return str.slice(0, str.indexOf('.') + 3);
        }
        else {
            console.log("not Found . in str index is ")

            return str;
        }

    }
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
        console.log('searching')
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
                        "select id,name,balance as balance FROM wallets",
                        [],
                        (tx, results) => {
                            var temp = [];
                            for (let i = 0; i < results.rows.length; ++i) {
                                temp.push({ text: results.rows.item(i).name, balance: cutNumber(results.rows.item(i).balance), key: results.rows.item(i).id });
                            }
                            setWallets(temp);
                            setDb(db);
                            Seterrr('count=' + count)
                            setcount(count + 1)
                        }
                    );
                    tx.executeSql(
                        "SELECT tid,wallets.name, type, txAmount, txReason, txImportance, txDate, BalanceAfter FROM transactions,wallets WHERE transactions.walletId = wallets.id ORDER by txDate DESC",
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
                                    results.rows.item(i).txDate,
                                    results.rows.item(i).BalanceAfter,]
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

    const confirmUndotx = () => {
        /////   if same wallet
        if (editedTxId) {
            try {
                db = SQLite.openDatabase('WalletAppDb.db');
                db.transaction((tx) => {
                    ////////
                    db.transaction((tx) => {
                        tx.executeSql(
                            "UPDATE wallets SET balance = (select CASE WHEN transactions.type='+'THEN( wallets.balance - transactions.txAmount) ELSE ( wallets.balance + transactions.txAmount) END  as n FROM transactions, wallets WHERE tid=? AND transactions.walletId=wallets.id)WHERE name=? ;",
                            [editedTxId, editedTxWallet],
                            (tx, results) => {
                                console.log(results);

                                tx.executeSql(
                                    "DELETE FROM transactions WHERE tid = ?",
                                    [editedTxId],
                                    (tx, results) => {
                                        console.log(results);
                                        /*  tx.executeSql(
                                             "INSERT INTO transactions (walletId, type, txAmount, txReason, txImportance, BalanceAfter) VALUES ((SELECT id FROM wallets WHERE name=?), ?,  cast(? as FLOAT), ?, ?,cast(  ((SELECT balance FROM wallets WHERE name=?)" + editedTxType.replace(/['"]+/g, '') + "  ?) as FLOAT) );"
                                             , [editedTxWalletChanged, editedTxTypeChanged, editedTxAmountChanged, editedTxReasonChanged, editedTxImportanceChanged, editedTxWalletChanged, editedTxAmountChanged], (tx, res) => {
                                                 console.log(res)
 
                                                 tx.executeSql(
                                                     "select id,name,balance as balance FROM wallets",
                                                     [],
                                                     (tx, results) => {
                                                         var temp = [];
                                                         for (let i = 0; i < results.rows.length; ++i) {
                                                             temp.push({ text: results.rows.item(i).name, balance: cutNumber(results.rows.item(i).balance), key: results.rows.item(i).id });
                                                         }
                                                         setWallets(temp);
                                                         setDb(db);
                                                         Seterrr('count=' + count)
                                                         setcount(count + 1)
                                                     }
                                                 );
                                                 tx.executeSql(
                                                     "SELECT tid,wallets.name, type, txAmount, txReason, txImportance, txDate, BalanceAfter FROM transactions,wallets WHERE transactions.walletId = wallets.id ORDER by txDate DESC",
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
                                                                 results.rows.item(i).txDate,
                                                                 results.rows.item(i).BalanceAfter,]
                                                             );
                                                         }
                                                         setTransactions(tempTrans);
                                                         Seterrr('transactions');
                                                         console.log('transactions')
                                                     }
                                                 )
                                             }, (tx, err) => {
                                                 console.log('tx');
 
                                                 console.log(err)
                                             }
 
                                         );*/
                                    }

                                );
                                tx.executeSql(
                                    "select id,name,balance as balance FROM wallets",
                                    [],
                                    (tx, results) => {
                                        var temp = [];
                                        for (let i = 0; i < results.rows.length; ++i) {
                                            temp.push({ text: results.rows.item(i).name, balance: cutNumber(results.rows.item(i).balance), key: results.rows.item(i).id });
                                        }
                                        setWallets(temp);
                                        setDb(db);
                                        Seterrr('count=' + count)
                                        setcount(count + 1)
                                    }
                                );
                                tx.executeSql(
                                    "SELECT tid,wallets.name, type, txAmount, txReason, txImportance, txDate, BalanceAfter FROM transactions,wallets WHERE transactions.walletId = wallets.id ORDER by txDate DESC",
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
                                                results.rows.item(i).txDate,
                                                results.rows.item(i).BalanceAfter,]
                                            );
                                        }
                                        setTransactions(tempTrans);
                                        Seterrr('transactions');
                                        console.log('transactions')
                                    }
                                )
                            }, (tx, err) => {
                                console.log('Error Is ');

                                console.log(err)
                            }
                        );
                    });
                    /*  tx.executeSql(
                          "DELETE FROM transactions WHERE tid = ?",
                          [editedTxId],
                          (tx, results) => {
                              console.log(results);
                          }
                      );*/
                    /*     tx.executeSql(
                            "INSERT INTO transactions (walletId, type, txAmount, txReason, txImportance, BalanceAfter) VALUES ((SELECT id FROM wallets WHERE name=?), ?,  cast(? as FLOAT), ?, ?,cast(  ((SELECT balance FROM wallets WHERE name=?)" + editedTxType.replace(/['"]+/g, '') + "  ?) as FLOAT) );"
                            , [editedTxWallet, editedTxTypeChanged, editedTxAmountChanged, editedTxReasonChanged, editedTxImportanceChanged, editedTxWallet, editedTxAmountChanged], (tx, res) => {
                                console.log(res)
 
                            }, (tx, err) => {
                                console.log('tx');
 
                                console.log(err)
                            }
 
                        ); */
                });


                setVisible(false);


            }
            catch {
                console.log('error editing tx')
            }


        }
        ///// if another wallet



        /*
        
            try {
                db = SQLite.openDatabase('WalletAppDb.db');
                db.transaction((tx) => {
                    tx.executeSql(
                        "select id,name,balance as balance FROM wallets",
                        [],
                        (tx, results) => {
                            var temp = [];
                            for (let i = 0; i < results.rows.length; ++i) {
                                temp.push({ text: results.rows.item(i).name, balance: cutNumber(results.rows.item(i).balance), key: results.rows.item(i).id });
                            }
                            setWallets(temp);
                            setDb(db);
                            Seterrr('count=' + count)
                            setcount(count + 1)
                        }
                    );
                });}
                catch{
                    console.log('error editing tx')
                }*/
    }
    const goToTodoList = () => {
        navigation.navigate('Todos', {
            wallet: wallet,
            db: db,
            tCount: Math.floor(Math.random() * 200),
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
            {/* <Button title='DeleteDb' onPress={() => DeleteDB()} /> */}
            <View style={styles.buttons}>
                <Button onPress={() => pressHandler(wallet)} title='New Tx' color='coral' />
                <View style={styles.sep}></View>
                <Button onPress={() => goToTodoList()} title='Todos' color='#A0E7E5' />
                <View style={styles.sep}></View>

                <Button onPress={() => goToSettings()} title='Settings' color='#676FA3' />
                <View style={styles.sep}></View>

                <Button onPress={() => showEmpDialog()} title='EmptyDB' color='#B33030' />
                <View style={styles.sep}></View>

            </View>

            <Dialog.Container visible={visible} style={{ color: '#000', flex: 1 }}>
                <Dialog.Title>Transaction Undo</Dialog.Title>
                <Text>
                    Do you want to Undo this Transaction? You cannot undo this action. {"\n"}
                </Text>

                <Dialog.Button label="Cancel" onPress={handleCancel} />
                <Dialog.Button label="Undo TX" onPress={() => confirmUndotx()} />
            </Dialog.Container>

            {/* Empty Database Dialog*/}

            <Dialog.Container visible={EmpVisible} style={{ color: '#000', flex: 1 }}>
                <Dialog.Title>Empty Database</Dialog.Title>
                <Text>
                    Do you want to Empty The Database? You cannot undo this action. {"\n"}
                    Type 'Password' To Confirm
                </Text>
                <TextInput placeholder="Input Password" onChangeText={newPass => setEmpsecText(newPass)} />
                <Dialog.Button label="Cancel" onPress={handleEmpCancel} />
                <Dialog.Button label="Empty Database" onPress={() => EmptyDbConf()} />
            </Dialog.Container>



            <View style={styles.tableView} onStartShouldSetResponder={() => true}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <Table borderStyle={{ borderWidth: 1, borderColor: '#ffa1d2' }}>
                        <Row data={HeadTable} style={styles.HeadStyle} textStyle={styles.TableText} />

                        {
                            transactions.map((rowData, index) => (
                                <TouchableOpacity key={index}
                                    onPress={() => { if (index == 0) { handleUndoTX(rowData) } else { alert('can only Undo last record') } }} >
                                    <Row
                                        data={rowData}
                                        borderStyle={{ borderWidth: 1, borderColor: '#ffe0f0' }}
                                        textStyle={styles.TableText}
                                    />
                                </TouchableOpacity>
                            ))
                        }

                        {/*    <Rows data={transactions} textStyle={styles.TableText} /> */}
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
    /*  twoInputs: {
          flexDirection: 'row',
  
      },*/
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
        flex: 1.3,
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
        margin: 2,
        fontSize: 11,
        borderRadius: 1
    },
    itemStyle: {
        fontSize: 10,
        color: "#007aff"
    },
    pickerStyle: {
        width: "60%",
        height: 40,
        color: "#007aff",
        fontSize: 12,
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
    dataWrapper: { marginTop: -1 },
    input: {
        marginBottom: 10,
        paddingHorizontal: 8,
        borderBottomWidth: 2,
        borderBottomColor: '#ddd',
        paddingTop: 0,
        paddingBottom: 0

    },
});
