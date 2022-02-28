import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';

export default function TodoItem({ item, editTodo }) {
    return (
        <TouchableOpacity onLongPress={() => editTodo(item)}>
            <View style={styles.item}>
                <Text style={styles.itemText} >Imp: {item.Importance}</Text>
                <Text style={styles.itemText} >{item.todoItem}</Text>
                <Text style={styles.itemText} >{item.Type}</Text>
                <Text style={styles.itemText} >{item.Price} EGP</Text>
                <Text style={styles.itemText} >{item.State}</Text>

            </View>

        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    item: {
        padding: 16,
        marginTop: 16,
        borderColor: '#bbb',
        borderWidth: 1,
        borderStyle: 'dashed',
        borderRadius: 10,
        flexDirection: 'row',
        flex: 1,
        textAlign: 'left'
    },
    itemText: {
        marginLeft: 5,
        flex: 0.25
    }
})