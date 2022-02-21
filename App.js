import { StyleSheet, View, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React from 'react';
import Header from './components/header';
import Navigator from './routes/homeStack';
/*
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://9b152bcc933440228b10f90ab8f4549c@o1143498.ingest.sentry.io/6204136',
  enableInExpoDevelopment: true,
  debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
  enableNative: false
});*/
export default function App() {

  /*
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
  
  */
  return (
    //  <Sandbox />
    <TouchableWithoutFeedback onPress={() => {
      Keyboard.dismiss();
      console.log('dismissed Keyboard')
    }}>
      <View style={styles.container}>
        <Header />
        <Navigator />

      </View>
    </TouchableWithoutFeedback>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

