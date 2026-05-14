import { Link } from "expo-router";
import { View } from "react-native";
import Button from "../components/Button";

const index = () => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 10 }}>
            <Link href={'/sign-in'} asChild>
                <Button text="Sign in" />
            </Link>

            <Link href={'./(user)'} asChild>
                <Button text="User" />
            </Link>
        </View>
    )
};

export default index;