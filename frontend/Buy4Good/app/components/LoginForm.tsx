import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Dimensions } from "react-native";
import { useAuth } from "@/context/auth";
import React, { useState } from "react";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

// Grid pattern component
const GridPattern = () => {
  const gridSize = 40;
  const rows = Math.ceil((screenHeight * 0.6) / gridSize);
  const cols = Math.ceil(screenWidth / gridSize);
  
  return (
    <View style={styles.gridContainer}>
      {Array.from({ length: rows }, (_, row) =>
        Array.from({ length: cols }, (_, col) => (
          <View
            key={`${row}-${col}`}
            style={[
              styles.gridSquare,
              {
                top: row * gridSize,
                left: col * gridSize,
              },
            ]}
          />
        ))
      )}
    </View>
  );
};

export default function LoginForm() {
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    return (
        <View style={styles.container}>
            {/* Split Background */}
            <View style={styles.topHalf}>
                <GridPattern />
            </View>
            <View style={styles.bottomHalf} />
            
            <ScrollView 
                style={styles.scrollContainer} 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header with logo and title */}
                <View style={styles.header}>
                    <Text style={styles.title}>BUY4</Text>
                    <Text style={styles.title}>GOOD</Text>
                </View>
                
                <Text style={styles.signInTitle}>Sign in to your Account</Text>
                <Text style={styles.signInSubtitle}>Enter your email and password or continue with Google</Text>
                
                {/* Main content card */}
                <View style={styles.card}>
                    {/* Google Sign In Button */}
                    <TouchableOpacity style={styles.googleButton} onPress={signIn}>
                        <Image
                            source={{ uri: 'https://developers.google.com/identity/images/g-logo.png' }}
                            style={styles.googleLogo}
                            contentFit="contain"
                        />
                        <Text style={styles.googleButtonText}>Continue with Google</Text>
                    </TouchableOpacity>
                    
                    {/* Divider */}
                    <View style={styles.dividerContainer}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>Or login with</Text>
                        <View style={styles.dividerLine} />
                    </View>
                    
                    {/* Email Input */}
                    <TextInput
                        style={styles.textInput}
                        placeholder="Email"
                        placeholderTextColor="#999"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    
                    {/* Password Input */}
                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={styles.passwordInput}
                            placeholder="Password"
                            placeholderTextColor="#999"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity 
                            style={styles.eyeIcon}
                            onPress={() => setShowPassword(!showPassword)}
                        >
                            <Ionicons 
                                name={showPassword ? "eye-off" : "eye"} 
                                size={20} 
                                color="#999999" 
                            />
                        </TouchableOpacity>
                    </View>
                    
                    {/* Remember Me and Forgot Password */}
                    <View style={styles.checkboxRow}>
                        <TouchableOpacity 
                            style={styles.checkboxContainer}
                            onPress={() => setRememberMe(!rememberMe)}
                        >
                            <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                                {rememberMe && <Text style={styles.checkmark}>✓</Text>}
                            </View>
                            <Text style={styles.checkboxLabel}>Remember me</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity>
                            <Text style={styles.forgotPassword}>Forgot Password ?</Text>
                        </TouchableOpacity>
                    </View>
                    
                    {/* Log In Button */}
                    <TouchableOpacity style={styles.loginButton}>
                        <Text style={styles.loginButtonText}>Log In</Text>
                    </TouchableOpacity>
                </View>
                
                {/* Sign Up Link */}
                <View style={styles.signUpContainer}>
                    <Text style={styles.signUpText}>Don&apos;t have an account? </Text>
                    <TouchableOpacity>
                        <Text style={styles.signUpLink}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
    topHalf: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '60%',
        backgroundColor: '#1F4A2C', // Dark green background
    },
    bottomHalf: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '40%',
        backgroundColor: '#FFFFFF', // White background
    },
    gridContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    gridSquare: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderWidth: 0.5,
        borderColor: 'rgba(213, 230, 105, 0.1)', // Very light grid using the light green color
    },
    scrollContainer: {
        flex: 1,
        zIndex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 18,
        fontWeight: '800',
        color: '#D5DE69', // Light green color
        letterSpacing: 1,
        lineHeight: 18,
    },
    signInTitle: {
        fontSize: 34,
        fontWeight: '700',
        color: '#D5DE69', // Light green color
        textAlign: 'center',
        marginBottom: 12,
    },
    signInSubtitle: {
        fontSize: 12,
        fontWeight: '500',
        color: '#D5DE69', // Light green color
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 22,
        opacity: 0.9,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 32,
        marginHorizontal: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
    },
    googleButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        marginBottom: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    googleLogo: {
        width: 20,
        height: 20,
        marginRight: 12,
    },
    googleButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E0E0E0',
    },
    dividerText: {
        fontSize: 14,
        color: '#999999',
        paddingHorizontal: 16,
    },
    textInput: {
        backgroundColor: '#F8F9FA',
        borderRadius: 8,
        paddingVertical: 16,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#333333',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    passwordContainer: {
        position: 'relative',
        marginBottom: 20,
    },
    passwordInput: {
        backgroundColor: '#F8F9FA',
        borderRadius: 8,
        paddingVertical: 16,
        paddingHorizontal: 16,
        paddingRight: 50,
        fontSize: 16,
        color: '#333333',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    eyeIcon: {
        position: 'absolute',
        right: 16,
        top: 16,
        padding: 4,
    },
    checkboxRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#E0E0E0',
        marginRight: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
    },
    checkboxChecked: {
        backgroundColor: '#1F4A2C',
        borderColor: '#1F4A2C',
    },
    checkmark: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    checkboxLabel: {
        fontSize: 12,
        color: '#6C7278',
    },
    forgotPassword: {
        fontSize: 12,
        color: '#4A90E2',
        fontWeight: '500',
    },
    loginButton: {
        backgroundColor: '#1F4A2C',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        shadowColor: '#1F4A2C',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    loginButtonText: {
        color: '#D5DE69',
        fontSize: 16,
        fontWeight: '700',
    },
    signUpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
    },
    signUpText: {
        fontSize: 14,
        color: '#D5E69',
    },
    signUpLink: {
        fontSize: 14,
        color: '#D5E69',
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
});