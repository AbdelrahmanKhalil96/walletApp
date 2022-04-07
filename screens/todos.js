import { StyleSheet, Text, View, Button, BackHandler, FlatList, Alert, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import TodoItem from '../components/todoitem';
import * as SQLite from 'expo-sqlite';
import AddTodo from '../components/addTodo';
import Dialog from "react-native-dialog";
import { Picker } from '@react-native-picker/picker';
import { TextInput } from 'react-native-gesture-handler';

export default function Todos({ navigation }) {
    const [todos, setTodos] = useState([]);
    const [solved, setSolved] = useState(false);
    const [showBox, setShowBox] = useState(true);

    const [totals, settotals] = useState([]);
    const [todoItem, settodoItem] = useState('');
    const [todoType, settodoType] = useState('');
    const [todoPrice, settodoPrice] = useState(0);

    const [todoImp, settodoImp] = useState(1);
    const [edittodoImp, setedittodoImp] = useState(1);

    const [editsolved, seteditSolved] = useState('Pending');

    const [edittodoID, setedittodoID] = useState(0);

    const [edittodoItem, setedittodoItem] = useState('');
    const [edittodoType, setedittodoType] = useState('');
    const [edittodoPrice, setedittodoPrice] = useState(0);
    /*  const [isEnabled, setIsEnabled] = useState(false);
      const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  */
    const [visible, setVisible] = useState(false);
    const [visibleEdit, setVisibleEdit] = useState(false);
    const editTodo = (item) => {
        console.log(item)
        setedittodoID(item.key);
        setedittodoItem(item.todoItem);
        setedittodoType(item.Type);
        setedittodoPrice(item.Price);
        if (item.Importance != null) {
            setedittodoImp(item.Importance);

        }
        else {
            setedittodoImp(1)
        }
        console.log(item.Importance)

        seteditSolved(item.State);
        console.log(edittodoImp)
        setVisibleEdit(true);
    }


    /*
        useEffect(() => {
            const backAction = () => {
                navigation.navigate('Home',
                    {
                        counter: Math.floor(Math.random() * 200)
                    })
                return true;
            };
    
            const backHandler = BackHandler.addEventListener(
                "hardwareBackPress",
                backAction
            );
    
            return () => backHandler.remove();
        }, []);
    
    
    */
    const applyEditTodo = () => {


        if (edittodoItem != '') {
            console.log('item ' + edittodoItem + ' type ' + edittodoType + ' price ' + edittodoPrice + ' solved is ' + editsolved + ' Imp is ' + edittodoImp)

            try {

                var dbFile = SQLite.openDatabase('WalletAppDb.db');

                dbFile.transaction((tx) => {
                    tx.executeSql(
                        "UPDATE TodoList SET todoItem=?,Type=?,Price=cast(? as FLOAT),State=?,Importance=cast(? as integer) WHERE id =? ;"
                        , [edittodoItem, edittodoType, edittodoPrice, editsolved, edittodoImp, edittodoID], (tx, results) => {
                            // console.log(results)
                            loadTodos()
                            setVisibleEdit(false);

                        }, (tx, err) => {
                            console.log(err)
                        }

                    );
                    tx.executeSql(
                        "SELECT Importance, sum(Price) as total FROM TodoList WHERE State ='Pending' GROUP by Importance ORDER by Importance desc"
                        , [], (tx, results) => {
                            //console.log(results)
                            var tempTotals = [];
                            for (let i = 0; i < results.rows.length; ++i) {
                                //   console.log(results.rows.item(i).total)
                                tempTotals.push({
                                    key: results.rows.item(i).Importance,
                                    total: results.rows.item(i).total
                                });

                            }
                            settotals(tempTotals);
                            console.log(tempTotals)
                        }, (tx, err) => {
                            console.log(err)
                        }

                    );
                    tx.executeSql(
                        "SELECT Importance, sum(Price) as total FROM TodoList WHERE State ='Pending' GROUP by Importance ORDER by Importance desc"
                        , [], (tx, results) => {
                            //console.log(results)
                            var tempTotals = [];
                            for (let i = 0; i < results.rows.length; ++i) {
                                //   console.log(results.rows.item(i).total)
                                tempTotals.push({
                                    key: results.rows.item(i).Importance,
                                    total: results.rows.item(i).total
                                });

                            }
                            settotals(tempTotals);
                            console.log(tempTotals)
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
        else {
            alert('cant add empty')
        }


    }
    const showDialog = () => {
        settodoItem('');;
        settodoType('');
        settodoPrice(0);
        settodoImp(1);
        setSolved(false);
        setVisible(true);
    };
    const addNewTodo = () => {
        if (todoItem != '') {
            console.log('item ' + todoItem + ' type ' + todoType + ' price ' + todoPrice + ' solved is ' + solved)

            try {
                var dbFile = SQLite.openDatabase('WalletAppDb.db');
                var editedval;
                if (solved) {
                    editedval = "Solved"
                }
                else {
                    editedval = "Pending"
                }
                console.log('Imp' + todoImp)
                dbFile.transaction((tx) => {
                    tx.executeSql(
                        "INSERT INTO 'TodoList' ('todoItem', 'Type', 'Price', 'State' ,'Importance') VALUES (?,? , cast(? as FLOAT), ?,cast(? as integer));"
                        , [todoItem, todoType, todoPrice, editedval, todoImp], (tx, results) => {
                            //console.log(results)
                            loadTodos()
                            setVisible(false);

                        }, (tx, err) => {
                            console.log(err)
                        }

                    );
                    tx.executeSql(
                        "SELECT Importance, sum(Price) as total FROM TodoList WHERE State ='Pending' GROUP by Importance ORDER by Importance desc"
                        , [], (tx, results) => {
                            //console.log(results)
                            var tempTotals = [];
                            for (let i = 0; i < results.rows.length; ++i) {
                                //   console.log(results.rows.item(i).total)
                                tempTotals.push({
                                    key: results.rows.item(i).Importance,
                                    total: results.rows.item(i).total
                                });

                            }
                            settotals(tempTotals);
                            console.log(tempTotals)
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
        else {
            alert('cant add empty')
        }
    }
    const handleCancel = () => {
        setVisible(false);
    };

    const handleCanceledit = () => {
        setVisibleEdit(false);
    };


    const DeleteTodo = () => {

        if (edittodoID != 0) {


            return Alert.alert(
                "Please Confirm ",
                "Are you sure you want to Delete the todo",
                [
                    // The "Yes" button
                    {
                        text: "Yes",
                        onPress: () => {
                            setShowBox(false);
                            try {
                                var dbFile = SQLite.openDatabase('WalletAppDb.db');

                                dbFile.transaction((tx) => {
                                    tx.executeSql(
                                        "delete from TodoList  WHERE id =? ;"
                                        , [edittodoID], (tx, results) => {
                                            //console.log(results)
                                            loadTodos()
                                            setVisibleEdit(false);

                                        }, (tx, err) => {
                                            console.log(err)
                                        }

                                    );
                                    tx.executeSql(
                                        "SELECT Importance, sum(Price) as total FROM TodoList WHERE State ='Pending' GROUP by Importance ORDER by Importance desc"
                                        , [], (tx, results) => {
                                            //console.log(results)
                                            var tempTotals = [];
                                            for (let i = 0; i < results.rows.length; ++i) {
                                                //   console.log(results.rows.item(i).total)
                                                tempTotals.push({
                                                    key: results.rows.item(i).Importance,
                                                    total: results.rows.item(i).total
                                                });

                                            }
                                            settotals(tempTotals);
                                            console.log(tempTotals)
                                        }, (tx, err) => {
                                            console.log(err)
                                        }

                                    );
                                })

                            }
                            catch {
                                console.log('Delete Error')
                            }

                        },
                    },
                    // The "No" button
                    // Does nothing but dismiss the dialog when tapped
                    {
                        text: "No",
                        onPress: () => {
                            alert('nothing Deleted')
                        },

                    },
                ]
            );

        }
        else {
            alert('cant add empty')
        }


    }
    const loadTodos = () => {
        try {
            var dbFile = SQLite.openDatabase('WalletAppDb.db');

            dbFile.transaction((tx) => {
                tx.executeSql(
                    "SELECT * FROM TodoList ORDER by Importance desc;"
                    , [], (tx, results) => {
                        //console.log(results)
                        var tempTodos = [];
                        for (let i = 0; i < results.rows.length; ++i) {
                            tempTodos.push({
                                key: results.rows.item(i).id,
                                todoItem: results.rows.item(i).todoItem,
                                Type: results.rows.item(i).Type,
                                TxId: results.rows.item(i).TxId,
                                State: results.rows.item(i).State,
                                Price: results.rows.item(i).Price,
                                Importance: results.rows.item(i).Importance,
                            });
                        }
                        setTodos(tempTodos);
                    }, (tx, err) => {
                        console.log(err)
                    }

                );

                tx.executeSql(
                    "SELECT Importance, sum(Price) as total FROM TodoList WHERE State ='Pending' GROUP by Importance ORDER by Importance desc"
                    , [], (tx, results) => {
                        //console.log(results)
                        var tempTotals = [];
                        for (let i = 0; i < results.rows.length; ++i) {
                            //   console.log(results.rows.item(i).total)
                            tempTotals.push({
                                key: results.rows.item(i).Importance,
                                total: results.rows.item(i).total
                            });

                        }
                        settotals(tempTotals);
                        console.log(tempTotals)
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



    useEffect(() => {
        loadTodos();
    }
        , []);
    return (
        <View style={styles.container}>
            {/** Add Todo */}
            <Dialog.Container visible={visible} style={{ color: '#000', flex: 1 }}>
                <Dialog.Title>Add New Todo</Dialog.Title>
                <Text>Item Name :-</Text>
                <TextInput placeholder='Enter todoItem Name' onChangeText={newItem => settodoItem(newItem)} />
                <Text>Item Type :-</Text>
                <TextInput placeholder='Enter Type' onChangeText={newType => settodoType(newType)} />
                <Text>Item Price :-</Text>
                <TextInput defaultValue={todoPrice.toString()} keyboardType='numeric' placeholder='Enter Price' onChangeText={newPrice => settodoPrice(newPrice)} />
                <Text>Importance</Text>
                <Picker
                    itemStyle={styles.itemStyle}
                    style={styles.pickerStyle}
                    selectedValue={todoImp}
                    onValueChange={(itemValue, itemIndex) => {
                        settodoImp(itemValue)
                        console.log(itemValue);
                    }
                    }
                >
                    <Picker.Item
                        color="#0087F0"
                        label='1 - Less Important'
                        value={1}
                        key={1} />
                    <Picker.Item
                        color="#0087F0"
                        label='2'
                        value={2}
                        key={2} />
                    <Picker.Item
                        color="#0087F0"
                        label='3 - Moderate Importance'
                        value={3}
                        key={3} />
                    <Picker.Item
                        color="#0087F0"
                        label='4'
                        value={4}
                        key={4} />
                    <Picker.Item
                        color="#0087F0"
                        label='5 - High Importance'
                        value={5}
                        key={5} />
                </Picker>




                <Text>Todo State:- </Text>


                <Picker
                    itemStyle={styles.itemStyle}
                    mode={"dropdown"}
                    style={styles.pickerStyle}
                    selectedValue={solved}
                    onValueChange={(itemValue, itemIndex) => {
                        setSolved(itemValue)
                        console.log(itemValue);
                    }
                    }
                >
                    <Picker.Item
                        color="#0087F0"
                        label='Pending'
                        value={false}
                        key={0} />
                    <Picker.Item
                        color="#0087F0"
                        label='Solved'
                        value={true}
                        key={1} />
                </Picker>
                <Dialog.Button label="Cancel" onPress={handleCancel} />
                <Dialog.Button label="Add Todo" onPress={() => addNewTodo()} />
            </Dialog.Container>
            {showBox && <View style={styles.box}></View>}

            {/** Edit Todo */}
            <Dialog.Container visible={visibleEdit} style={{ color: '#000', flex: 1 }}>

                <Dialog.Title>Edit Todo</Dialog.Title>
                <Text>Item Name :-</Text>

                <TextInput placeholder='Enter todoItem Name' defaultValue={edittodoItem} onChangeText={newItem => setedittodoItem(newItem)} />
                <Text>Item Type :-</Text>

                <TextInput placeholder='Enter Type' defaultValue={edittodoType} onChangeText={newType => setedittodoType(newType)} />
                <Text>Item Price :-</Text>

                <TextInput defaultValue={edittodoPrice.toString()} keyboardType='numeric' placeholder='Enter Price' onChangeText={newPrice => setedittodoPrice(newPrice)} />

                <Text>Importance</Text>
                <Picker
                    itemStyle={styles.itemStyle}
                    style={styles.pickerStyle}
                    selectedValue={edittodoImp}
                    onValueChange={(itemValue, itemIndex) => {
                        setedittodoImp(itemValue)
                        console.log(itemValue);
                    }
                    }
                >
                    <Picker.Item
                        color="#0087F0"
                        label='1 - Less Important'
                        value={1}
                        key={1} />
                    <Picker.Item
                        color="#0087F0"
                        label='2'
                        value={2}
                        key={2} />
                    <Picker.Item
                        color="#0087F0"
                        label='3 - Moderate Importance'
                        value={3}
                        key={3} />
                    <Picker.Item
                        color="#0087F0"
                        label='4'
                        value={4}
                        key={4} />
                    <Picker.Item
                        color="#0087F0"
                        label='5 - High Importance'
                        value={5}
                        key={5} />
                </Picker>




                <Picker
                    itemStyle={styles.itemStyle}
                    mode={"dropdown"}
                    style={styles.pickerStyle}
                    selectedValue={editsolved}
                    onValueChange={(itemValue, itemIndex) => {
                        seteditSolved(itemValue)
                        console.log(itemValue);
                    }
                    }
                >
                    <Picker.Item
                        color="#0087F0"
                        label='Pending'
                        value='Pending'
                        key={0} />
                    <Picker.Item
                        color="#0087F0"
                        label='Solved'
                        value='Solved'
                        key={1} />
                </Picker>
                <Dialog.Button label="Delete Todo" onPress={() => DeleteTodo()} />

                <Dialog.Button label="Cancel" onPress={handleCanceledit} />
                <Dialog.Button label="Edit Todo" onPress={() => applyEditTodo()} />
            </Dialog.Container>

            <View style={styles.content}>
                <AddTodo showDialog={showDialog} />

                <View onStartShouldSetResponder={() => true}>
                    <Text>{"\n"}</Text>
                    <FlatList
                        horizontal
                        data={totals}
                        renderItem={({ item }) => (
                            <View style={styles.item}>
                                <Text style={styles.itemText} >Imp: {item.key} Total is : {item.total} </Text>
                            </View>
                        )}
                    />
                </View>
                <View style={styles.list}>

                    <FlatList
                        data={todos}
                        renderItem={({ item }) => (
                            <TodoItem item={item} editTodo={editTodo} />
                        )}
                    />
                </View>
            </View>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        padding: 40,

    },
    list: {
        flex: 1,
        marginTop: 20,
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
    box: {

        marginBottom: 10,
    },
    item: {

        borderColor: '#00FFC6',
        borderWidth: 1,
        borderStyle: 'dashed',
        borderRadius: 10,
        marginRight: 5,
        textAlign: 'left'
    },

});
