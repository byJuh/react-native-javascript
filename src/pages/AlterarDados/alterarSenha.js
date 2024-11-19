import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { redefinirSenha, obterSenha } from '../../database/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AlterarSenha({ navigation }) {
  const textoSeguranca = `Você está prestes a alterar seus dados de login. Verifique com atenção antes de confirmar para garantir que todas as informações estejam corretas. Alterações incorretas podem afetar seu acesso e funcionalidades do aplicativo.`
  
  const [email, setEmail] = useState('');
  const [senhaAtual, setsenhaAtual] = useState('');
  const [novaSenha, setnovaSenha] = useState('');
  const [confirmacaoSenha, setconfirmacaoSenha] = useState('');

  useEffect (() => {
    const adicionarEmail = async () => {
        try {
            
            const email = await AsyncStorage.getItem('email') || '';
            
            setEmail(email);

            console.log(email);
        } catch (error) {
            console.error('Erro ao carregar o email!!');
          }
        };

      adicionarEmail();
    }, []);

  //Voltar Termo Privacidade (Pronto)
  const handleBackPress = () => {
    navigation.navigate('Tabs', { screen: 'TermoPrivacidade' });
  };

  const handleSalvarSenha = async () => {
    try{
        console.log(email);

        const senha = await obterSenha(email);

        console.log(senha);

        if (!senha) {
          alert('Senha não encontrada!');
          return;
        }
    
        if(!senhaAtual.trim() || !novaSenha.trim() || !confirmacaoSenha.trim()){
            alert('Preencha todos os campos!!');
            return;
        }
    
        if(senha !== senhaAtual){
            alert('Senha atual incorreta!!');
            return;
        }
    
        if(novaSenha !== confirmacaoSenha){
            alert('Senhas não correndem!!');
            return;
        }
    
        if(senhaAtual === novaSenha){
            alert('Senha atual é a mesma que a nova senha!!');
            navigation.navigate('Tabs', { screen: 'TermoPrivacidade' });
        }else{
            const result = await redefinirSenha(email, novaSenha);
    
            if(result){
                alert("Nova senha salva!");
                navigation.navigate('Tabs', { screen: 'TermoPrivacidade' });
            }else{
                alert('Erro ao redefinir senha!!');
            }
        }
    
        
    }catch(error){
        alert('Ocorreu um erro inesperado. Tente novamente.');
    }
    
    
    
  };

  //Limpar Campos (Pronto)
  const handleLimparCampos = () => {
    setsenhaAtual('');
    setnovaSenha('');
    setconfirmacaoSenha('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar backgroundColor="#00B383" barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Icon name="arrow-back" size={30} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dados e Privacidade</Text>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>Redefinição de Senha</Text>

        <TextInput
          style={styles.input}
          placeholder="Insira a senha atual"
          secureTextEntry
          value={senhaAtual}
          onChangeText={setsenhaAtual}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Insira a nova senha"
          secureTextEntry
          value={novaSenha}
          onChangeText={setnovaSenha}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Confirme a nova senha"
          secureTextEntry
          value={confirmacaoSenha}
          onChangeText={setconfirmacaoSenha}
        />

        <Text style={styles.caution}>Atenção!</Text>

        <Text style={styles.warningText}>
          {textoSeguranca}
        </Text>

        <TouchableOpacity style={styles.saveButton} onPress={handleSalvarSenha}>
          <Text style={styles.saveButtonText}>Salvar Nova Senha</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={handleLimparCampos}>
          <Text style={styles.clearButtonText}>Limpar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f2f2f2',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00B383',
    paddingTop: 30,
    paddingBottom: 20,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 22,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
  },
  caution: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30,
    color: '#000000',
    textAlign: 'center',
  },
  warningText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginVertical: 20,
    lineHeight: 20,
  },
  saveButton: {
    backgroundColor: '#00B383',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearButtonText: {
    color: '#9C9C9C',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
});