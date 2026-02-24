import { Redirect } from "expo-router";

export default function RootIndex() {
    // Ele apenas empurra para o lugar certo baseado no Layout
    return <Redirect href="/Pages/Welcome/WelcomeScreen" />;
}