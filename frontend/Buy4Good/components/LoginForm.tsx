import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "@/context/auth";

export default function LoginForm() {
    const { signIn } = useAuth();
    
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {/* Logo and Title */}
                <View style={styles.header}>
                    <Text style={styles.title}>BUY4</Text>
                    <Text style={styles.title}>GOOD</Text>
                </View>
                
                <Text style={styles.subtitle}>
                    Shop, earn cashback, and support the causes you care about
                </Text>
                
                {/* Sign In Button */}
                <TouchableOpacity style={styles.signInButton} onPress={signIn}>
                    <View style={styles.buttonContent}>
                        <Text style={styles.buttonText}>Continue with Google</Text>
                    </View>
                </TouchableOpacity>
                
                <Text style={styles.termsText}>
                    By continuing, you agree to our Terms of Service and Privacy Policy
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    content: {
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#1a1a1a',
        letterSpacing: 2,
    },
    subtitle: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
        marginBottom: 60,
        lineHeight: 24,
        paddingHorizontal: 20,
    },
    signInButton: {
        backgroundColor: '#000000',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 32,
        width: '100%',
        marginBottom: 24,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    termsText: {
        fontSize: 12,
        color: '#999999',
        textAlign: 'center',
        lineHeight: 18,
        paddingHorizontal: 40,
    },
});