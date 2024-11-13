import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Modal, FlatList } from 'react-native';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import * as DocumentPicker from 'expo-document-picker';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';

export default function Receituario() {
    const [pdfList, setPdfList] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPdf, setSelectedPdf] = useState('');

    const requestStoragePermission = async () => {
        const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
        if (status !== 'granted') {
            Alert.alert('Permissão necessária', 'É necessário permitir o acesso ao armazenamento para visualizar o PDF.');
        }
    };

    useEffect(() => {
        const loadPdfList = async () => {
            const storedPdfList = await AsyncStorage.getItem('pdfList');
            if (storedPdfList) {
                setPdfList(JSON.parse(storedPdfList));
            }
        };
        loadPdfList();
        requestStoragePermission();
    }, []);

    const _pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
            console.log('Resultado do DocumentPicker:', result);
    
            if (result.type !== 'cancel') {
                const pdfUri = result.uri; // URI do arquivo
                console.log('URI do PDF selecionado:', pdfUri); // Verifica o URI do PDF
    
                // Adiciona o arquivo à lista
                const updatedPdfList = [...pdfList, { uri: pdfUri, name: result.name }];
                setPdfList(updatedPdfList);
                await AsyncStorage.setItem('pdfList', JSON.stringify(updatedPdfList));
            } else {
                Alert.alert('Erro', 'Não foi possível selecionar o arquivo.');
            }
        } catch (err) {
            console.error('Erro ao selecionar o arquivo:', err);
        }
    };
    

    const _openPdf = async (pdfUri) => {
        try {
            const cacheUri = `${FileSystem.cacheDirectory}${pdfUri.split('/').pop()}`;
            await FileSystem.copyAsync({ from: pdfUri, to: cacheUri });
            console.log('Arquivo copiado para o cache:', cacheUri);
    
            const base64 = await FileSystem.readAsStringAsync(cacheUri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            
            console.log('URI do PDF original:', pdfUri);
            console.log('URI do PDF no cache:', cacheUri);
            console.log('Conteúdo base64:', base64 ? base64.slice(0, 100) : 'vazio'); // Mostra os primeiros 100 caracteres
    
            if (base64) {
                const pdfBase64Uri = `data:application/pdf;base64,${base64}`;
                console.log('URI base64 do PDF:', pdfBase64Uri); // Verificação final
    
                setSelectedPdf(pdfBase64Uri);
                setModalVisible(true);
            } else {
                console.error('Erro: Conteúdo base64 do PDF está vazio');
            }
        } catch (error) {
            console.error('Erro ao ler o PDF:', error);
            Alert.alert('Erro', 'Não foi possível abrir o arquivo PDF.');
        }
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
                        <TouchableOpacity 
                            style={{ width: 50, height: 50, backgroundColor: '#63E6BE', alignItems: 'center', justifyContent: 'center', marginTop: 400, marginLeft: 300}} 
                            onPress={_pickDocument}
                        >
                            <FontAwesomeIcon icon={faCirclePlus} size={40} style={{ color: "#FFFFFF" }} />
                        </TouchableOpacity>
                    </View>

                    <View style={{ alignItems: 'center' }}>
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
                        source={{ uri: selectedPdf }} // Use o URI base64 aqui
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
