import Button from '@/src/components/Button';
import Colors from '@/src/constants/Colors';
import { Link, Stack } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, View } from 'react-native';

const SignInScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'Sign in' }} />

            <Image
                source={require('../../../assets/images/Logo.png')}
                style={styles.logo}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="jane@gmail.com"
                style={styles.input}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder=""
                style={styles.input}
                secureTextEntry
                autoCapitalize="none"
            />

            <Link href="/(user)" asChild>
                <Button text="Sign in" />
            </Link>
            <Link href="./sign-up" style={styles.textButton}>
                Create an account
            </Link>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        justifyContent: 'flex-start',
        flex: 1,
    },
    label: {
        color: 'gray',
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginTop: 5,
        marginBottom: 20,
        backgroundColor: 'white',
        borderRadius: 5,
    },
    textButton: {
        alignSelf: 'center',
        fontWeight: 'bold',
        color: Colors.potato.darker,
        marginVertical: 10,
    },
    logo: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#ccc',
        resizeMode: 'contain',
        alignSelf: 'center',
        marginBottom: 30,
    },
});

export default SignInScreen;