import React, { useState, useEffect } from 'react';
import { View, Text, Modal, Image, ScrollView, TouchableOpacity, Linking, TextInput, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { salonDetailStyles as styles } from "@/app/Styles/salonDetailStyles";
import { COLORS } from "@/constants/theme";

import { Salon } from '../Models/Salon';
import { Professional } from "@/app/Models/Professional";
import { Service } from "@/app/Models/Service";
import { Review } from "@/app/Models/Review";
import { SalonRepository } from "@/app/Repository/SalonRepository";
import { ModalDetailSkeleton } from "@/app/Components/AnimatedSkeleton";

type TabType = 'Serviços' | 'Sobre' | 'Local' | 'Reviews';

interface Props {
    visible: boolean;
    salon: Salon | null;
    onClose: () => void;
    repository: SalonRepository;
}

export const SalonDetailModal = ({ visible, salon, onClose, repository }: Props) => {
    const [activeTab, setActiveTab] = useState<TabType>('Serviços');
    const [loading, setLoading] = useState(true);
    const [allServices, setAllServices] = useState<Service[]>([]);
    const [allProfessionals, setAllProfessionals] = useState<Professional[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
    const [selectedProfessionalId, setSelectedProfessionalId] = useState<string | null>(null);

    const [newRating, setNewRating] = useState(0);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        if (visible && salon) {
            async function fetchData() {
                setLoading(true);
                try {
                    const [services, pros, revs] = await Promise.all([
                        repository.getSalonServices(salon?.serviceIds ?? []),
                        repository.getSalonProfessionals(salon?.professionalIds ?? []),
                        repository.getSalonReviews(salon?.id ?? "")
                    ]);
                    setAllServices(services);
                    setAllProfessionals(pros);
                    setReviews(revs);
                } catch (e) {
                    console.error(e);
                } finally {
                    setLoading(false);
                }
            }
            fetchData();
        }
    }, [visible, salon]);

    const handleContact = async () => {
        if (!salon) return;
        const phone = salon.whatsApp || salon.phone;
        if (!phone) return;

        const cleanPhone = phone.replace(/\D/g, '');
        const whatsappUrl = `whatsapp://send?phone=${cleanPhone}`;
        const webUrl = `https://wa.me/${cleanPhone}`;

        // Verifica se é simulador para evitar logs de erro no console
        if (Platform.OS === 'ios' && !Platform.isPad && cleanPhone.length > 0) {
            // Opcional: Você pode usar uma lib como expo-device para checar se é real
            // Mas por padrão, vamos tentar o catch de forma mais limpa:
        }

        try {
            // Tenta WhatsApp primeiro
            const canOpenWhatsApp = await Linking.canOpenURL(whatsappUrl);

            if (canOpenWhatsApp) {
                return await Linking.openURL(whatsappUrl);
            }

            // Se não tem o App, tenta o link da Web (funciona no Simulador abrindo o Safari)
            const canOpenWeb = await Linking.canOpenURL(webUrl);
            if (canOpenWeb) {
                return await Linking.openURL(webUrl);
            }

            // Se chegar aqui, tenta ligar
            await Linking.openURL(`tel:${cleanPhone}`);

        } catch (error) {
            // Se der erro (como no simulador), mostra o número para o desenvolvedor/usuário
            Alert.alert(
                "Contato",
                `Simulador detectado ou App indisponível.\nNúmero: ${phone}`,
                [{ text: "OK" }]
            );
        }
    };

    const handleOpenMap = () => {
        if (!salon) return;
        const addr = encodeURIComponent(salon.address);
        // Link universal que funciona em qualquer lugar
        const url = Platform.select({
            ios: `http://maps.apple.com/?q=${addr}`,
            android: `geo:0,0?q=${addr}`,
            default: `https://www.google.com/maps/search/?api=1&query=${addr}`
        });

        Linking.openURL(url!).catch(() => Alert.alert("Erro", "Não foi possível abrir o mapa."));
    };

    const handleSendReview = () => {
        if (newRating === 0) return;
        const reviewObj: Review = {
            salonId: salon?.id ?? "",
            id: String(Date.now()),
            userName: "Você",
            rating: newRating,
            comment: newComment,
            createdAt: new Date().toISOString(),
            userId: "current"
        };
        setReviews([reviewObj, ...reviews]);
        setNewRating(0);
        setNewComment("");
        Alert.alert("Sucesso", "Avaliação publicada!");
    };

    if (!salon) return null;
    const canBook = selectedServiceId && selectedProfessionalId;

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.content}>

                    <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                        <Ionicons name="close" size={22} color={COLORS.textMain} />
                    </TouchableOpacity>

                    <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[2]}>
                        <View style={styles.imageHeader}>
                            <Image source={{ uri: salon.image }} style={styles.bannerImage} />
                        </View>

                        <View style={styles.profileSection}>
                            <View style={styles.logoContainer}>
                                <Image source={{ uri: salon.image }} style={{ width: '100%', height: '100%' }} />
                            </View>
                            <View style={styles.headerInfoRow}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.salonName}>{salon.name}</Text>
                                    <View style={styles.addressRow}>
                                        <Ionicons name="location" size={14} color={COLORS.primary} />
                                        <Text style={styles.addressText} numberOfLines={1}>{salon.address}</Text>
                                        {reviews.length > 0 && (
                                            <View style={styles.ratingBadge}>
                                                <Ionicons name="star" size={10} color="#FFA800" />
                                                <Text style={styles.ratingText}>{salon.rating} ({reviews.length})</Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                                <TouchableOpacity
                                    style={[styles.contactBtn, { backgroundColor: salon.whatsApp ? '#25D366' : COLORS.primary }]}
                                    onPress={handleContact}
                                >
                                    <Ionicons name={salon.whatsApp ? "logo-whatsapp" : "call"} size={20} color="#FFF" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.tabBarWrapper}>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabBar}>
                                {(['Serviços', 'Sobre', 'Local', 'Reviews'] as TabType[]).map((tab) => (
                                    <TouchableOpacity
                                        key={tab}
                                        onPress={() => setActiveTab(tab)}
                                        style={[styles.tabItem, activeTab === tab && styles.activeTabItem]}
                                    >
                                        <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        {loading ? <ModalDetailSkeleton /> : (
                            <View style={{ padding: 20 }}>
                                {activeTab === 'Serviços' && (
                                    <View>
                                        <Text style={styles.sectionTitle}>1. Escolha o serviço</Text>
                                        {allServices.map(s => (
                                            <TouchableOpacity
                                                key={s.id}
                                                style={[styles.serviceRow, selectedServiceId === s.id && styles.selectedItem]}
                                                onPress={() => { setSelectedServiceId(s.id); setSelectedProfessionalId(null); }}
                                            >
                                                <Ionicons name={s.icon as any} size={20} color={selectedServiceId === s.id ? COLORS.primary : "#999"} />
                                                <Text style={[styles.serviceLabel, { marginLeft: 12 }]}>{s.name}</Text>
                                            </TouchableOpacity>
                                        ))}

                                        {selectedServiceId && (
                                            <View style={{ marginTop: 20 }}>
                                                <Text style={styles.sectionTitle}>2. Escolha o profissional</Text>
                                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                                    {allProfessionals.filter(p => p.serviceIds?.includes(selectedServiceId)).map(p => (
                                                        <TouchableOpacity
                                                            key={p.id}
                                                            style={[styles.profCard, selectedProfessionalId === p.id && styles.selectedItem]}
                                                            onPress={() => setSelectedProfessionalId(p.id)}
                                                        >
                                                            <Image source={{ uri: p.image || salon.image }} style={styles.profImageSmall} />
                                                            <Text style={styles.profName} numberOfLines={1}>{p.name}</Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </ScrollView>
                                            </View>
                                        )}
                                    </View>
                                )}

                                {activeTab === 'Sobre' && (
                                    <View>
                                        <Text style={styles.sectionTitle}>Galeria</Text>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
                                            {[salon.image, salon.image, salon.image].map((img, idx) => (
                                                <TouchableOpacity key={idx} onPress={() => setSelectedImage(img as string)}>
                                                    <Image source={{ uri: img }} style={styles.galleryImage} />
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                        <Text style={styles.sectionTitle}>História</Text>
                                        <Text style={styles.descriptionText}>{salon.description}</Text>
                                    </View>
                                )}

                                {activeTab === 'Local' && (
                                    <View style={styles.localContainer}>
                                        <Ionicons name="map" size={48} color={COLORS.primary} />
                                        <Text style={styles.localTitle}>{salon.address}</Text>
                                        <TouchableOpacity style={styles.mapBtn} onPress={handleOpenMap}>
                                            <Text style={styles.bookBtnText}>Abrir no GPS</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}

                                {activeTab === 'Reviews' && (
                                    <View>
                                        {salon.userHasVisited ? (
                                            <View style={styles.reviewForm}>
                                                <Text style={styles.sectionTitle}>Sua Avaliação</Text>
                                                <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
                                                    {[1, 2, 3, 4, 5].map(s => (
                                                        <TouchableOpacity key={s} onPress={() => setNewRating(s)}>
                                                            <Ionicons name={s <= newRating ? "star" : "star-outline"} size={26} color="#FFA800" />
                                                        </TouchableOpacity>
                                                    ))}
                                                </View>
                                                <TextInput
                                                    style={styles.reviewInput}
                                                    placeholder="Como foi seu atendimento?"
                                                    multiline
                                                    value={newComment}
                                                    onChangeText={setNewComment}
                                                />
                                                {newRating > 0 && (
                                                    <TouchableOpacity style={styles.sendReviewBtn} onPress={handleSendReview}>
                                                        <Text style={styles.sendReviewBtnText}>Publicar agora</Text>
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                        ) : (
                                            <View style={styles.lockWarning}>
                                                <Ionicons name="lock-closed" size={18} color="#999" />
                                                <Text style={styles.lockText}>Somente clientes que ja são clientes podem avaliar.</Text>
                                            </View>
                                        )}
                                        {reviews.map(r => (
                                            <View key={r.id} style={styles.reviewCard}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <Text style={{ fontWeight: 'bold' }}>{r.userName}</Text>
                                                    <Text style={{ color: '#FFA800' }}>★ {r.rating}</Text>
                                                </View>
                                                <Text style={styles.reviewComment}>{r.comment}</Text>
                                            </View>
                                        ))}
                                    </View>
                                )}
                            </View>
                        )}
                    </ScrollView>

                    {/* FullScreen Image Modal - FIX AQUI */}
                    <Modal visible={!!selectedImage} transparent animationType="fade" onRequestClose={() => setSelectedImage(null)}>
                        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center' }}>
                            <TouchableOpacity style={{ position: 'absolute', top: 50, right: 25, zIndex: 10 }} onPress={() => setSelectedImage(null)}>
                                <Ionicons name="close-circle" size={44} color="#FFF" />
                            </TouchableOpacity>
                            {selectedImage && (
                                <Image source={{ uri: selectedImage }} style={{ width: '100%', height: '80%', resizeMode: 'contain' }} />
                            )}
                        </View>
                    </Modal>

                    {activeTab === 'Serviços' && (
                        <View style={styles.footer}>
                            <TouchableOpacity
                                style={[styles.bookBtn, !canBook && { backgroundColor: '#EEE' }]}
                                disabled={!canBook}
                                onPress={() => Alert.alert("Sucesso", "Agendamento realizado!")}
                            >
                                <Text style={[styles.bookBtnText, !canBook && { color: '#999' }]}>
                                    {canBook ? "Confirmar Agendamento" : "Complete a seleção"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
};