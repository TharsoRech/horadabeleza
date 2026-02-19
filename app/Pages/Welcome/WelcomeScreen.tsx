import React from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

// Clean Style System Imports
import { authStyles } from "@/app/Styles/authStyles";

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
      <View style={authStyles.container}>
        {/* Using standard theme colors recovered from your original gradient */}
        <LinearGradient
            colors={['#FF4B91', '#FF76CE']}
            style={authStyles.background}
        />

        {/* Dynamic Safe Area Handling */}
        <View style={[
          authStyles.content,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }
        ]}>

          {/* Illustration Area - Recovered Dimension logic in style file */}
          <View style={authStyles.imageContainer}>
            <View style={authStyles.illustrationPlaceholder}>
              <Image
                  source={require('../../../assets/images/your-beauty.png')}
                  style={authStyles.image}
                  resizeMode="contain"
              />
            </View>
          </View>

          {/* Text Section */}
          <View style={authStyles.textSection}>
            <Text style={authStyles.title}>Bem Vindo a Hora da Beleza</Text>
            <Text style={authStyles.subtitle}>Fique bonita do seu jeito.</Text>
          </View>

          {/* Action Buttons */}
          <View style={authStyles.buttonContainer}>

            {/* Navigate to Register Page */}
            <TouchableOpacity
                activeOpacity={0.8}
                style={authStyles.signUpBtn}
                onPress={() => router.push('/Pages/Login/RegisterScreen' as any)}
            >
              <Text style={authStyles.signUpText}>Cadastrar</Text>
            </TouchableOpacity>

            {/* Navigate to Login Page */}
            <TouchableOpacity
                activeOpacity={0.7}
                style={authStyles.logInBtn}
                onPress={() => router.push('/Pages/Login/LoginScreen' as any)}
            >
              <Text style={authStyles.logInText}>Entrar</Text>
            </TouchableOpacity>

            {/* Guest Access */}
            <TouchableOpacity
                style={authStyles.guestBtn}
                onPress={() => router.replace('/(tabs)' as any)}
            >
              <Text style={authStyles.guestText}>
                Ou continue como convidado
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
  );
}