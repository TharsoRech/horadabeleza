import React from 'react';
import { Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router'; // Import the router hook
import { styles } from '../styles';

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter(); // Initialize the router

  return (
      <View style={styles.container}>
        <LinearGradient
            colors={['#FF4B91', '#FF76CE']}
            style={styles.background}
        />

        {/* Manual Safe Area Handling using insets */}
        <View style={[
          styles.content,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }
        ]}>

          {/* Illustration Area */}
          <View style={styles.imageContainer}>
            <View style={styles.illustrationPlaceholder}>
              <Image
                  source={require('../../../assets/images/your-beauty.png')}
                  style={styles.image}
                  resizeMode="contain"
              />
            </View>
          </View>

          {/* Text Section */}
          <View style={styles.textSection}>
            <Text style={styles.title}>Bem Vindo a Hora da Beleza</Text>
            <Text style={styles.subtitle}>Fique bonita do seu jeito.</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>

            {/* Navigate to Register Page */}
            <TouchableOpacity
                activeOpacity={0.8}
                style={styles.signUpBtn}
                onPress={() => router.push('/Pages/Login/RegisterScreen' as any)}
            >
              <Text style={styles.signUpText}>Cadastrar</Text>
            </TouchableOpacity>

            {/* Navigate to Login Page */}
            <TouchableOpacity
                activeOpacity={0.7}
                style={styles.logInBtn}
                onPress={() => router.push('/Pages/Login/LoginScreen' as any)}
            >
              <Text style={styles.logInText}>Entrar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.guestBtn}>
              <Text style={styles.guestText}
                    onPress={() => router.replace('/(tabs)' as any)}
              >Ou continue como convidado</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
  );
}