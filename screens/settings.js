import { StyleSheet, Text, View, Button, BackHandler } from 'react-native';
import React from 'react';
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import * as Sharing from 'expo-sharing';

import * as Permissions from 'expo-permissions';

import * as MediaLibrary from 'expo-media-library';
import * as DocumentPicker from 'expo-document-picker';

export default function Settings({ navigation }) {
    //  const [status, requestPermission] = MediaLibrary.usePermissions();
    const [status, requestPermission] = MediaLibrary.usePermissions();

    const handleShare = async () => {

        const perm = await requestPermission();
        console.log(perm)
        if (perm.status == 'granted') {
            console.log('inside')
            await Sharing.shareAsync(
                FileSystem.documentDirectory + 'SQLite/WalletAppDb.db',
                { dialogTitle: 'share or copy your DB via' }
            ).catch(error => {
                console.log(error);
            })
        }
        else {
            alert('no perm')
        }

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

    const newDb = async () => {
        /*   const { uri } = await FileSystem.getInfoAsync(
               `${FileSystem.documentDirectory}SQLite/${"WalletAppDb.db"}`
             );
             FileSystem.deleteAsync(uri)
   */
        const result = await DocumentPicker.getDocumentAsync({
            type: '*/*',
            copyToCacheDirectory: false,
        });
        console.log('URI IS : ' + result.uri)
        if (result.type == 'success') {
            const { uri } = await FileSystem.getInfoAsync(
                `${FileSystem.documentDirectory}SQLite/${'WalletAppDb.db'}`
            );
            const delRes = await FileSystem.deleteAsync(uri)
            console.log(delRes)
            console.log('file' + (await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite/WalletAppDb.db')).exists)
            ///
            if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
                console.log('directory not exist')
                await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
            }
            await FileSystem.copyAsync({
                from: result.uri,
                to: `${FileSystem.documentDirectory}SQLite/`
                ////  to: `${FileSystem.documentDirectory}SQLite/${"WalletAppDb.db"}`

            }).then(() => {
                //     alert('file Imported Successfully');
                navigation.navigate('Home',
                    {
                        counter: Math.floor(Math.random() * 200)
                    })
            });
            //   let dir = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
            //      console.log(dir)

        }
    }
    const sh = async () => {

        const perm = await requestPermission();
        console.log(perm)
        if (perm.status == 'granted') {
            console.log('inside')
            const downloadedFile = FileSystem.documentDirectory + 'SQLite/WalletAppDb.db';
            const asset = await MediaLibrary.createAssetAsync(downloadedFile);
            MediaLibrary.createAlbumAsync("Download", asset)
                .then(() => {
                    alert('Backup To DCIM Is Successful!');
                })
                .catch(error => {
                    console.log('err', error);
                });
        }
        else {
            alert('no perm')
        }


        /*
           const perm = await requestPermission();
           if (perm.status != 'granted') {
               console.log('granted');
           }*/

        /*  await Sharing.shareAsync(
                FileSystem.documentDirectory + 'SQLite/WalletAppDb.db',
                { dialogTitle: 'share or copy your DB via' }
            ).catch(error => {
                console.log(error);
            })*/
    }
    return (
        <View style={styles.container}>
            <Text>Settings Screen</Text>
            <View style={styles.buttons}>
                <Button title='Backup Database' onPress={() => sh()} />
                <View style={styles.sep}></View>

                <Button title='Share Database' onPress={() => handleShare()} />
                <View style={styles.sep}></View>

                <Button title='Import Database' onPress={() => newDb()} />
                <View style={styles.sep}></View>

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
        margin: 10,
    },
    sep: {
        margin: 10,
    },
});
