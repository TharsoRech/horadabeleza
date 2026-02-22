import {Text, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {COLORS} from "@/constants/theme";
import React from "react";

export const DetailItem = ({ icon, label, value }: any) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <View style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
            <Ionicons name={icon} size={14} color={COLORS.primary} />
        </View>
        <View>
            <Text style={{ fontSize: 9, color: '#999', textTransform: 'uppercase' }}>{label}</Text>
            <Text style={{ fontSize: 13, fontWeight: 'bold', color: COLORS.textMain }}>{value}</Text>
        </View>
    </View>
);