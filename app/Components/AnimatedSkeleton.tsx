import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, ViewStyle, DimensionValue } from 'react-native';

interface SkeletonProps {
    width?: DimensionValue;
    height?: number;
    borderRadius?: number;
    style?: ViewStyle;
}

// 1. Componente Base Reutilizável
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

// 2. O PRESET QUE ESTAVA FALTANDO (SearchResultSkeleton)
export const SearchResultSkeleton = () => (
    <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
        {[1, 2, 3].map((i) => (
            <View key={i} style={{ marginBottom: 20 }}>
                <AnimatedSkeleton height={180} />
                <View style={{ marginTop: 10 }}>
                    <AnimatedSkeleton height={20} width="70%" borderRadius={4} style={{ marginBottom: 8 }} />
                    <AnimatedSkeleton height={15} width="40%" borderRadius={4} />
                </View>
            </View>
        ))}
    </View>
);