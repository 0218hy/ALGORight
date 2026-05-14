
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/Colors';
import { forwardRef } from 'react';

type ButtonProps = {
  text: string;
} & React.ComponentPropsWithoutRef<typeof TouchableOpacity>;

const Button = forwardRef<View | null, ButtonProps>(
  ({ text, ...pressableProps }, ref) => {
    return (
      <Pressable ref={ref} {...pressableProps} style={styles.container}>
        <Text style={styles.text}>{text}</Text>
      </Pressable>
    );
  }
);

const styles = StyleSheet.create({
    container: {
      backgroundColor: Colors.potato.tabIconSelected,
      padding: 15,
      alignItems: 'center',
      borderRadius: 100,
      marginVertical: 10,
      width: '100%', 
    },
    text: {
      fontSize: 16,
      fontWeight: '600',
      color: 'white',
    },
  });

export default Button;