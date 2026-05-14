import Button from '@/src/components/Button';
import Colors from '@/src/constants/Colors';
import { signIn } from '@/src/lib/queries/auth';
import { Link, Stack, router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, View, Image} from 'react-native';

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

        const { data, error } = await signIn(email, password)

        //check session, if valid, navigate immediately 
        if (data?.session) {
            router.replace('/(user)')
            return
        }
        
        //only show error if there's no session
        if (error) {
            Alert.alert('Sign in failed', error.message)
            setLoading(false)
            return
        }
    }

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
                autoCapitalize="none"
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