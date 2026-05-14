import Button from '@/src/components/Button';
import Colors from '@/src/constants/Colors';
import { signIn } from '@/src/lib/queries/auth';
import { Link, Stack, router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, View } from 'react-native';

const SignInScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); 

    const handleSignIn = async () => {
        //basic validation
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields')
            return
        }

        setLoading(true);

        const { error } = await signIn(email, password)

        //handle signIn error (if any)
        if (error) {
            Alert.alert('Sign in failed', error.message)
            setLoading(false)
            return
        }

        //successful login, navigate to home (replace since user can't go back to sign in screen)
        router.replace('/(user)')
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'Sign in' }} />

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

            {/*show spinner while loading, button when not */}
            {loading
                ? <ActivityIndicator size="small" color={Colors.potato.text} />
                : <Button text="Sign in" onPress={handleSignIn} />
            }

            <Link href="/(user)" asChild>
                <Button text="Sign in" onPress={handleSignIn}/>
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
        justifyContent: 'center',
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
});

export default SignInScreen;