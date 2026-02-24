import React from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { authStyles } from "@/app/Styles/authStyles";
import {useAuth} from "@/app/Managers/AuthManager";

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { setIsGuest } = useAuth();

  return (
      <View style={authStyles.container}>
        <LinearGradient colors={['#FF4B91', '#FF76CE']} style={authStyles.background} />

        <View style={[authStyles.content, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}>

            <View style={authStyles.imageContainer}>
                <View style={authStyles.illustrationPlaceholder}>
                    <Image
                        source={require('../../../assets/images/your-beauty.png')}
                        style={authStyles.image}
                        resizeMode="contain"
                    />
                </View>
            </View>

          <View style={authStyles.textSection}>
            <Text style={authStyles.title}>Bem Vindo a Hora da Beleza</Text>
            <Text style={authStyles.subtitle}>Fique bonita do seu jeito.</Text>
          </View>

          <View style={authStyles.buttonContainer}>
            <TouchableOpacity
                activeOpacity={0.8}
                style={authStyles.signUpBtn}
                onPress={() => router.push('/Pages/Login/RegisterScreen' as any)}
            >
              <Text style={authStyles.signUpText}>Cadastrar</Text>
            </TouchableOpacity>

            <TouchableOpacity
                activeOpacity={0.7}
                style={authStyles.logInBtn}
                onPress={() => router.push('/Pages/Login/LoginScreen' as any)}
            >
              <Text style={authStyles.logInText}>Entrar</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={authStyles.guestBtn}
                onPress={() => {
                  setIsGuest(true); // Ativa o modo convidado
                  // Não precisa dar replace para /(tabs) aqui se o seu index já renderiza a Home
                  // Mas se quiser ir direto para as abas:
                  router.replace('/(tabs)' as any);
                }}
            >
              <Text style={authStyles.guestText}>Ou continue como convidado</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
  );
}