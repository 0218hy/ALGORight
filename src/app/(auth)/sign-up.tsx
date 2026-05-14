import { signUp } from '@/src/lib/queries/auth';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import Button from '../../components/Button';
import Colors from '../../constants/Colors';

const SignUpScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        //basic validation 
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields')
            return
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters')
            return
        }

        setLoading(true)

        const { error } = await signUp(email, password)

        //Handle signUp error 
        if (error) {
            Alert.alert('Sign up failed', error.message)
            setLoading(false)
            return
        }

        //successful signUp
        Alert.alert(
            'Account created!',
            'Please check your email to confirm your account',
            [
                { text: 'OK', onPress: () => router.replace('/sign-in') }
            ]
        )
    }
    return (
        <View>
            <Image
                source={require('../../../assets/images/Logo.png')}
                style={styles.logo}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="jon@gmail.com"
                style={styles.input}
                autoCapitalize="none"
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder=""
                style={styles.input}
                autoCapitalize="none"
                secureTextEntry
            />

            {loading
                ? <ActivityIndicator size="small" color={Colors.potato.text} />
                : <Button text="Create account" onPress={handleSignUp} />
            }

            <Link href="./sign-in" style={styles.textButton}>
                Sign in
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
        color: Colors.potato.text,
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

export default SignUpScreen;