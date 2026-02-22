import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, ViewStyle, DimensionValue, ScrollView } from 'react-native';

interface SkeletonProps {
    width?: DimensionValue;
    height?: number;
    borderRadius?: number;
    style?: ViewStyle;
}

export const AnimatedSkeleton = ({
                                     width = '100%',
                                     height = 150,
                                     borderRadius = 12,
                                     style
                                 }: SkeletonProps) => {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0.7,
                    duration: 800,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 800,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        );
        pulse.start();
        return () => pulse.stop();
    }, [opacity]);

    return (
        <Animated.View
            style={[
                { width, height, borderRadius, backgroundColor: '#E1E1E1', opacity } as any,
                style
            ]}
        />
    );
};

// Preset para a busca (Cards Verticais)
export const SearchResultSkeleton = () => (
    <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
        {[1, 2, 3].map((i) => (
            <View key={i} style={{ marginBottom: 20, flexDirection: 'row', alignItems: 'center' }}>
                <AnimatedSkeleton width={80} height={80} borderRadius={12} />
                <View style={{ marginLeft: 15, flex: 1 }}>
                    <AnimatedSkeleton height={20} width="60%" borderRadius={4} style={{ marginBottom: 8 }} />
                    <AnimatedSkeleton height={15} width="40%" borderRadius={4} />
                </View>
            </View>
        ))}
    </View>
);

// NOVO: Preset para a Home Principal (Seções Horizontais)
export const HomeSkeleton = () => (
    <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        {/* Skeleton de Serviços (Círculos) */}
        <View style={{ padding: 20 }}>
            <AnimatedSkeleton height={20} width={100} style={{ marginBottom: 15 }} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {[1, 2, 3, 4, 5].map(i => (
                    <View key={i} style={{ alignItems: 'center', marginRight: 20 }}>
                        <AnimatedSkeleton width={60} height={60} borderRadius={30} />
                        <AnimatedSkeleton width={40} height={10} style={{ marginTop: 8 }} />
                    </View>
                ))}
            </ScrollView>
        </View>

        {/* Skeleton de Salões (Cards Grandes) */}
        <View style={{ padding: 20 }}>
            <AnimatedSkeleton height={20} width={150} style={{ marginBottom: 15 }} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {[1, 2].map(i => (
                    <View key={i} style={{ marginRight: 15 }}>
                        <AnimatedSkeleton width={240} height={160} borderRadius={16} />
                        <AnimatedSkeleton width={180} height={15} style={{ marginTop: 10 }} />
                    </View>
                ))}
            </ScrollView>
        </View>
    </ScrollView>
);

export const ModalDetailSkeleton = () => (
    <View style={{ padding: 20 }}>
        <AnimatedSkeleton height={25} width="40%" style={{ marginBottom: 20 }} />
        {[1, 2, 3, 4].map(i => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                <AnimatedSkeleton width={40} height={40} borderRadius={8} />
                <AnimatedSkeleton width="70%" height={20} style={{ marginLeft: 15 }} />
            </View>
        ))}
    </View>
);
