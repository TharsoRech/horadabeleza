import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    View,
    Text,
    Modal,
    Image,
    ScrollView,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from "@/constants/theme";

// Repositories & Models
import { Professional } from "../Models/Professional";
import { Salon } from "../Models/Salon";
import { Review } from "../Models/Review";
import { ProfessionalRepository } from "@/app/Repository/ProfessionalRepository";

// Components
import { SalonCard } from "@/app/Components/SalonCard";

// Styles
import { professionalDetailStyles as styles } from "@/app/Styles/ProfessionalDetailStyles";
import {useAuth} from "@/app/Managers/AuthManager";

interface Props {
    visible: boolean;
    professional: Professional | null;
    onClose: () => void;
    onOpenSalon: (salon: Salon) => void;
}

export const ProfessionalDetailModal = ({ visible, professional, onClose, onOpenSalon }: Props) => {
    // Instancia o repositório internamente
    const repository = useMemo(() => new ProfessionalRepository(), []);
    const { currentUser } = useAuth();
    // Referências para o Scroll Automático
    const scrollRef = useRef<ScrollView>(null);
    const [reviewSectionY, setReviewSectionY] = useState(0);

    // Estados de Dados
    const [reviews, setReviews] = useState<Review[]>([]);
    const [fullSalon, setFullSalon] = useState<Salon | null>(null);
    const [canReview, setCanReview] = useState(false);
    const [loading, setLoading] = useState(true);

    // Estados do Formulário de Review
    const [newRating, setNewRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (visible && professional) {
            loadData();
        }
    }, [visible, professional]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [revs, salonData, allowed] = await Promise.all([
                repository.getProfessionalReviews(professional!.id),
                professional!.salon?.id ? repository.getSalonByProfessional(professional!.salon?.id) : Promise.resolve(null),
                repository.canUserReviewProfessional(professional!.id, "user-current-id")
            ]);

            setReviews(revs);
            setFullSalon(salonData);
            setCanReview(allowed);
        } catch (error) {
            console.error("Erro ao carregar ProfessionalDetail:", error);
        } finally {
            setLoading(false);
        }
    };

    // AÇÃO: Rolar até as Reviews
    const scrollToReviews = () => {
        scrollRef.current?.scrollTo({ y: reviewSectionY, animated: true });
    };

    // AÇÃO: Publicar Avaliação
    const handleSendReview = async () => {
        if (newRating === 0 || !professional) {
            Alert.alert("Atenção", "Por favor, selecione uma nota.");
            return;
        }

        // 1. Verificação de segurança: Se não houver usuário logado, interrompe o processo.
        if (!currentUser) {
            Alert.alert("Erro", "Você precisa estar logado para publicar uma avaliação.");
            return;
        }

        setIsSubmitting(true);

        try {
            // 2. Agora o TS sabe que currentUser NÃO é nulo aqui
            const addedReview = await repository.addProfessionalReview(
                professional.id,
                currentUser.id,    // Seguro
                currentUser.name as string,  // Seguro
                {
                    rating: newRating,
                    comment: comment
                }
            );

            // Adiciona na lista local para feedback instantâneo
            setReviews(prev => [addedReview, ...prev]);

            // Reseta campos
            setNewRating(0);
            setComment("");
        } catch (error) {
            Alert.alert("Erro", "Não foi possível publicar sua avaliação.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!professional) return null;

    return (
        <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
            <View style={styles.overlay}>
                <View style={styles.container}>

                    {/* Header bar fixa */}
                    <View style={styles.headerFixed}>
                        <TouchableOpacity style={styles.iconCircle} onPress={onClose}>
                            <Ionicons name="chevron-down" size={24} color={COLORS.textMain} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Perfil do Profissional</Text>
                        <View style={{ width: 40 }} />
                    </View>

                    <ScrollView
                        ref={scrollRef}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 60 }}
                    >

                        {/* Seção Hero - Perfil */}
                        <View style={styles.profileHero}>
                            <View style={styles.avatarContainer}>
                                <Image
                                    source={{ uri: professional.image || 'https://via.placeholder.com/150' }}
                                    style={styles.avatarImage}
                                />
                                <View style={styles.activeIndicator} />
                            </View>

                            <Text style={styles.mainName}>{professional.name}</Text>
                            <View style={styles.tagContainer}>
                                <Text style={styles.tagText}>{professional.specialty}</Text>
                            </View>

                            {/* Grid de Stats Flutuante */}
                            <View style={styles.statsGrid}>
                                <View style={styles.statBox}>
                                    <Ionicons name="star" size={18} color="#FFD700" />
                                    <Text style={styles.statNumber}>{professional.rating.toFixed(1)}</Text>
                                    <Text style={styles.statDesc}>Rating</Text>
                                </View>
                                <View style={styles.statSeparator} />

                                {/* Botão que ativa o Scroll para as reviews */}
                                <TouchableOpacity style={styles.statBox} onPress={scrollToReviews}>
                                    <Ionicons name="chatbubble-ellipses" size={18} color={COLORS.primary} />
                                    <Text style={styles.statNumber}>{professional.reviews}</Text>
                                    <Text style={styles.statDesc}>Reviews</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {loading ? (
                            <ActivityIndicator color={COLORS.primary} style={{ marginTop: 50 }} />
                        ) : (
                            <View style={styles.contentBody}>

                                {/* Seção Sobre */}
                                <View style={styles.contentSection}>
                                    <Text style={styles.contentTitle}>Sobre</Text>
                                    <Text style={styles.aboutBody}>
                                        {professional.bio || "Este profissional ainda não adicionou uma biografia detalhada."}
                                    </Text>
                                </View>

                                {/* Seção Localização / SalonCard */}
                                {fullSalon && (
                                    <View style={styles.contentSection}>
                                        <Text style={styles.contentTitle}>Localização</Text>
                                        <Text style={styles.salonInstruction}>
                                            Agende através do perfil do salão:
                                        </Text>
                                        <View style={styles.salonCardContainer}>
                                            <SalonCard
                                                salon={fullSalon}
                                                onPress={() => {
                                                    onClose();
                                                    onOpenSalon(fullSalon);
                                                }}
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Seção de Reviews com detecção de posição (onLayout) */}
                                <View
                                    style={styles.contentSection}
                                    onLayout={(e) => setReviewSectionY(e.nativeEvent.layout.y)}
                                >
                                    <Text style={styles.contentTitle}>Avaliações</Text>

                                    {canReview ? (
                                        <View style={styles.addReviewBox}>
                                            <Text style={styles.addReviewLabel}>Avaliar atendimento</Text>
                                            <View style={styles.starsRow}>
                                                {[1, 2, 3, 4, 5].map(s => (
                                                    <TouchableOpacity key={s} onPress={() => setNewRating(s)}>
                                                        <Ionicons
                                                            name={s <= newRating ? "star" : "star-outline"}
                                                            size={28} color="#FFD700"
                                                        />
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                            <TextInput
                                                style={styles.textArea}
                                                placeholder="Como foi sua experiência?"
                                                multiline
                                                value={comment}
                                                onChangeText={setComment}
                                                placeholderTextColor="#BBB"
                                            />
                                            <TouchableOpacity
                                                style={[styles.postBtn, { opacity: newRating > 0 && !isSubmitting ? 1 : 0.5 }]}
                                                onPress={handleSendReview}
                                                disabled={newRating === 0 || isSubmitting}
                                            >
                                                {isSubmitting ? (
                                                    <ActivityIndicator color="#FFF" size="small" />
                                                ) : (
                                                    <Text style={styles.postBtnText}>Publicar Avaliação</Text>
                                                )}
                                            </TouchableOpacity>
                                        </View>
                                    ) : (
                                        <View style={styles.infoLocked}>
                                            <Ionicons name="lock-closed-outline" size={16} color="#AAA" />
                                            <Text style={styles.infoLockedText}>
                                                Avaliações disponíveis apenas para clientes confirmados.
                                            </Text>
                                        </View>
                                    )}

                                    {/* Lista de Comentários */}
                                    {reviews.length > 0 ? (
                                        reviews.map(item => (
                                            <View key={item.id} style={styles.reviewCard}>
                                                <View style={styles.reviewTopRow}>
                                                    <Text style={styles.reviewerName}>{item.userName}</Text>
                                                    <View style={styles.reviewRating}>
                                                        <Ionicons name="star" size={10} color="#FFD700" />
                                                        <Text style={styles.reviewRatingValue}>{item.rating}</Text>
                                                    </View>
                                                </View>
                                                <Text style={styles.reviewText}>{item.comment}</Text>
                                            </View>
                                        ))
                                    ) : (
                                        <Text style={{ textAlign: 'center', color: '#BBB', marginTop: 20 }}>
                                            Nenhuma avaliação encontrada.
                                        </Text>
                                    )}
                                </View>
                            </View>
                        )}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};