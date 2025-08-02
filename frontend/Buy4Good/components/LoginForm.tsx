import { View, Text, Button } from "react-native";
import { useAuth } from "@/context/auth";

export default function LoginForm() {
    const { signIn } = useAuth();
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text>Please log in to continue</Text>
            <Button title="Sign In with Google" onPress={signIn} />
        </View>
    );
}