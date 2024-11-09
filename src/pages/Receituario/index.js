import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import 'moment/locale/pt-br';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Modal, FlatList } from 'react-native';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import * as DocumentPicker from 'expo-document-picker';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Permissions from 'expo-permissions';

export default function Receituario() {
    const [pdfList, setPdfList] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPdf, setSelectedPdf] = useState('');

    useEffect(() => {
        const loadPdfList = async () => {
            const storedPdfList = await AsyncStorage.getItem('pdfList');
            if (storedPdfList) {
                setPdfList(JSON.parse(storedPdfList));
            }
        };
        loadPdfList();
    }, []);

    const requestPermissions = async () => {
        const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
        if (status !== 'granted') {
            alert('Permission to access media library is required!');
        }
    };

    const _pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
            console.log('Resultado do DocumentPicker:', result);

            if (!result.canceled) { // Verifica se a seleção foi cancelada
                const pdf = result.assets[0]; // Acessa o primeiro arquivo selecionado
                const fileUri = pdf.uri; // URI do arquivo
                
                // Adiciona o arquivo à lista
                const updatedPdfList = [...pdfList, { uri: fileUri, name: pdf.name }];
                
                setPdfList(updatedPdfList);
                await AsyncStorage.setItem('pdfList', JSON.stringify(updatedPdfList));
            } else {
                Alert.alert('Erro', 'Não foi possível selecionar o arquivo.');
            }
        } catch (err) {
            console.error('Erro ao selecionar o arquivo:', err); // Log para capturar qualquer erro
        }
    };

    const _openPdf = (pdfUri) => {
        setSelectedPdf(pdfUri);
        setModalVisible(true);
    };

    return (
        <View style={styles.container}>
            <View style={styles.areaLogo}>
                <Image source={require('../../assets/logo.png')} />
            </View>
            <View style={styles.scroll} showsVerticalScrollIndicator={false}>
                <View style={styles.firstCard}>
                    <View style={styles.areaData}>
                        <Text style={styles.texto}>Receituário</Text>
                    </View>
                    <View style={styles.secondCard}>
                        <TouchableOpacity style={{ width: 50, height: 50, backgroundColor: '#63E6BE', alignItems: 'center', justifyContent: 'center', marginTop: 400, marginLeft: 300}} onPress={_pickDocument}>
                            <FontAwesomeIcon icon={faCirclePlus} size={40} style={{ color: "#FFFFFF" }} />
                        </TouchableOpacity>
                    </View>

                    <View style={{ alignItems: 'center'}}>
                        <FlatList
                            data={pdfList}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => _openPdf(item.uri)}>
                                    <Text style={styles.pdfItem}>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                    
                </View>
            </View>

            <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
                <View style={{ flex: 1 }}>
                    <WebView
                        originWhitelist={['*']}
                        source={{ uri: `file://${selectedPdf}` }} // Corrigido o uso da URL
                        style={{ flex: 1 }}
                    />
                    <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                        <Text style={{ color: 'white' }}>Fechar</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    areaLogo: {
        width: 410,
        height: 110,
        elevation: 5,
        borderBottomLeftRadius: 57,
        borderBottomRightRadius: 57,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    firstCard: {
        backgroundColor: '#fff',
        width: 364,
        height: 550,
        elevation: 5,
        borderRadius: 57,
        borderWidth: 1,
        justifyContent: 'flex-start',
        marginBottom: 50,
    },
    secondCard: {
        backgroundColor: '#fff',
        width: 362,
        height: 500,
        elevation: 5,
        borderBottomLeftRadius: 57,
        borderBottomRightRadius: 57,
        position: 'absolute',
        top: 50,
        borderWidth: 1,
    },
    scroll: {
        flexDirection: 'column',
        alignContent: 'center',
        paddingTop: 35,
    },
    texto: {
        fontSize: 20,
        color: '#222B45',
        alignSelf: 'center'
    },
    areaData: {
        flexDirection: 'column',
        alignItems: 'center',
        margin: 10,
    },
    pdfItem: {
        color: '#007BFF',
        fontSize: 20,
    },
    closeButton: {
        backgroundColor: '#63E6BE',
        padding: 10,
        alignItems: 'center',
        margin: 20,
        borderRadius: 5,
    },
});
