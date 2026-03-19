import React, { useState, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface CustomAlertProps {
    visible: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
}

interface AlertConfig {
    title: string;
    message: string;
    buttons?: Array<{ text: string; style?: 'default' | 'cancel' | 'destructive'; onPress?: () => void }>;
}

interface CustomAlertComponent extends React.FC<CustomAlertProps> {
    show: (title: string, message: string, buttons?: Array<{ text: string; style?: 'default' | 'cancel' | 'destructive'; onPress?: () => void }>) => Promise<boolean>;
    triggerAlert: (config: AlertConfig) => void;
}

const CustomAlert = (({ visible, title, message, onConfirm }: CustomAlertProps) => {
    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="fade"
            onRequestClose={onConfirm}
        >
            <View style={styles.overlay}>
                <LinearGradient
                    colors={['#FF4B91', '#FF76CE']}
                    style={styles.modalContainer}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={styles.iconContainer}>
                        <Ionicons name="alert-circle" size={40} color="white" />
                    </View>
                    
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>
                    
                    <TouchableOpacity
                        style={styles.button}
                        onPress={onConfirm}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>Entendi</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </View>
        </Modal>
    );
}) as CustomAlertComponent;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    modalContainer: {
        width: '100%',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 8,
    },
    message: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24,
    },
    button: {
        backgroundColor: 'white',
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 25,
        elevation: 3,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FF4B91',
    },
});

// Global alert state management
let alertCallbacks: {
    resolve: (value: boolean) => void;
    reject: (reason?: any) => void;
} | null = null;

// Static method to show alert
CustomAlert.show = (title: string, message: string, buttons?: Array<{ text: string; style?: 'default' | 'cancel' | 'destructive'; onPress?: () => void }>): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        alertCallbacks = { resolve, reject };
        
        // Trigger the alert through a global event or context
        // For now, we'll use a simple console warning
        console.warn('CustomAlert.show() called but no global alert manager is set up');
        console.log(`Title: ${title}, Message: ${message}`);
        
        // Auto-resolve after 3 seconds for now
        setTimeout(() => {
            resolve(true);
        }, 3000);
    });
};

// Function to trigger alert from outside (to be used in context/provider)
CustomAlert.triggerAlert = (config: AlertConfig) => {
    // This would be called by a context provider or global state
    console.log('Alert triggered:', config);
};

export default CustomAlert;
