import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default async function ProfileScreen()  {

    const navigation = useNavigation();
    
    // Variáveis para dados
    const nomeCompleto = await AsyncStorage.getItem('nome');
    const dataNascimento = await AsyncStorage.getItem('data');
    const cpf = await AsyncStorage.getItem('cpf');
    const rg = await AsyncStorage.getItem('rg');
    const contato = await AsyncStorage.getItem('contato');
    const email = await AsyncStorage.getItem('email');
    const tipoSanguineo = await AsyncStorage.getItem('tipoSanguineo');
    const doador = await AsyncStorage.getItem('doador');
    const idade = await AsyncStorage.getItem('idade');
    const estadoCivil = await AsyncStorage.getItem('estadoCivil');
    const sexoBiologico = await AsyncStorage.getItem('genero');

    const handleBackPress = () => {
        // Comando para voltar
        navigation.navigate('Tabs', { screen: 'Perfil' });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profileHeader}>
            <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Icon name="arrow-back" size={25} color="#ffffff" />
            </TouchableOpacity>
            
            <Text style={styles.profileTitle}>Perfil</Text>
            <View style={styles.profileImagePlaceholder}>
            <Text style={styles.profileImageIcon}>👤</Text>
            </View>
            <Text style={styles.profileName}>{nomeCompleto}</Text>
            <Text style={styles.profileInfo}>{idade}</Text>
            <Text style={styles.profileInfo}>{estadoCivil}</Text>
            <Text style={styles.profileInfo}>{sexoBiologico}</Text>
        </View>

        <View style={styles.profileDetails}>
            <Text style={styles.detailLabel}>Nome Completo</Text>
            <Text style={styles.detailText}>{nomeCompleto}</Text>

            <Text style={styles.detailLabel}>Data de Nascimento</Text>
            <Text style={styles.detailText}>{dataNascimento}</Text>

            <Text style={styles.detailLabel}>CPF Cadastrado</Text>
            <Text style={styles.detailText}>{cpf}</Text>

            <Text style={styles.detailLabel}>RG Cadastrado</Text>
            <Text style={styles.detailText}>{rg}</Text>

            <Text style={styles.detailLabel}>Contato</Text>
            <Text style={styles.detailText}>{contato}</Text>

            <Text style={styles.detailLabel}>E-mail</Text>
            <Text style={styles.detailText}>{email}</Text>

            <Text style={styles.detailLabel}>Tipo Sanguíneo</Text>
            <Text style={styles.detailText}>{tipoSanguineo}</Text>

            <Text style={styles.detailLabel}>Doenças Crônicas</Text>

            
            <Text style={styles.detailLabel}>O usuário é doador?</Text>
            <Text style={styles.detailText}>{doador}</Text>
        </View>
        </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    paddingBottom: 50,
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 20,
    zIndex: 1,
  },
  profileHeader: {
    backgroundColor: '#00B383',
    width: '100%',
    height: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  profileTitle: {
    color: '#ffffff',
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  profileImagePlaceholder: {
    backgroundColor: '#CDF8FF',
    borderRadius: 120,
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImageIcon: {
    fontSize: 50,
    color: '#ffffff',
  },
  profileName: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  profileInfo: {
    color: '#ffffff',
    fontSize: 15,
    marginTop: 5,
  },
  profileDetails: {
    width: '100%',
    backgroundColor: '#ffffff',
    padding: 15,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 10,
  },
  detailText: {
    fontSize: 16,
    color: '#333',
    marginTop: 5,
  },
});