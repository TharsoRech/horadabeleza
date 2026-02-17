import { Redirect } from 'expo-router';

export default function EntryPoint() {
    // This tells Expo: "When the app starts, immediately show the WelcomeScreen"
    return <Redirect href="/Pages/Welcome/WelcomeScreen" />;
}