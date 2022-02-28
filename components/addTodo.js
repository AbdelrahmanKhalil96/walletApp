import { StyleSheet, Text, TextInput, Button, View } from 'react-native';
import React, { useState } from 'react';

export default function AddTodo({ showDialog }) {
    return (

        <View>

            <Button onPress={() => showDialog()} title='add todo' color='coral' />
        </View>
    )
}