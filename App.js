import { StyleSheet, Text, Button, View, FlatList, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import Header from './components/header';
import Home from './screens/home';
import AddTodo from './components/addTodo';
import Sandbox from './components/sandbox';
import Navigator from './routes/homeStack';
export default function App() {

  const pressHandler = (key) => {
    setWallets((prevwallet) => {
      return prevwallet.filter(todo => todo.key != key);
    })
  }
  const submitHandler = (text) => {
    if (text.length > 3) {
      setWallets((prevwallet) => {
        return [

          { text: text, key: Math.random().toString() }, ...prevwallet

        ]
      });
    }
    else {
      Alert.alert('OOPS!', 'wallet Must Be Over 3 Chars Long', [{ text: 'understood', onPress: () => console.log('alert closed') }])
    }

  }


  return (
    //  <Sandbox />
    <TouchableWithoutFeedback onPress={() => {
      Keyboard.dismiss();
      console.log('dismissed Keyboard')
    }}>
      <View style={styles.container}>
        <Header />
        <View style={styles.list}>
          <Navigator />
        </View>

      </View>
    </TouchableWithoutFeedback>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  list: {
    flex: 0.4,
    marginTop: 10,
    marginBottom: 10,
    padding: 6,
    height: 300

  },
});
