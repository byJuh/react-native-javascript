import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Storage } from "expo-sqlite/kv-store";
import { obterSenha, redefinirEmail } from '../../database/database';

export default function AlterarEmail({ navigation }) {
  const textoSeguranca = `Você está prestes a alterar seus dados de login. Verifique com atenção antes de confirmar para garantir que todas as informações estejam corretas. Alterações incorretas podem afetar seu acesso e funcionalidades do aplicativo.`;

  const [email, setEmail] = useState('');
  const [emailAtual, setEmailAtual] = useState('');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novoEmail, setNovoEmail] = useState('');
  const [confirmacaoEmail, setConfirmacaoEmail] = useState('');

  useEffect (() => {
    const adicionarEmail = async () => {
        try {
            
            const email = await Storage.getItem('email') || '';
            
            setEmail(email);

            console.log(email);
        } catch (error) {
            console.error('Erro ao carregar o email!!');
          }
        };

      adicionarEmail();
    }, []);

  // Voltar Termo Privacidade (Pronto)
  const handleBackPress = () => {
    navigation.navigate('Tabs', { screen: 'TermoPrivacidade' });
  };

  // Salvar Novo E-mail (Incompleto)
  const handleSalvarEmail = async () => {
    
    if(!emailAtual.trim() || !novoEmail.trim() || !confirmacaoEmail.trim()){
        alert('Preencha todos os campos!!');
        return;
    }

    if(email !== emailAtual){
        alert('Email atual incorreto!!');
        return;
    }

    const senha = await obterSenha(email);

    if (!senha) {
        alert('Senha não encontrada!');
        return;
    }
    

    if(senha !== senhaAtual){
        alert('Senha atual incorreta!!');
        return;
    }

    if(novoEmail !== confirmacaoEmail){
        alert('Emails não são correspondentes!!');
        return;
    }

    if(emailAtual === novoEmail){
        alert('Email atual é a mesma que o novo email!!');
        navigation.navigate('Tabs', { screen: 'TermoPrivacidade' });
    }else{
       
        const result = await redefinirEmail(email, novoEmail, senha);
        
        if(result){
            await Storage.setItem('email', novoEmail);

            showAlert();
            navigation.navigate('Tabs', { screen: 'TermoPrivacidade' });
        }else{
            alert('Não foi possível alterar o Email!!');
        }
        
    }
    
  };

  // Limpar Campos (Pronto)
  const handleLimparCampos = () => {
    setEmailAtual('');
    setSenhaAtual('');
    setNovoEmail('');
    setConfirmacaoEmail('');
  };

  // PopUp de Confirmação
  const showAlert = () => {
    Alert.alert(
      "E-mail alterado com sucesso!",
      "O novo e-mail foi salvo, utilize ele em seu próximo login!",
      [
        {
          text: "OK",
        },
      ],
      { cancelable: false } // Impede que o Pop-up seja fechado tocando fora dele
    );
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
        <Text style={styles.title}>Alteração de E-mail</Text>

        <TextInput
          style={styles.input}
          placeholder="Insira o e-mail atual"
          value={emailAtual}
          onChangeText={setEmailAtual}
        />

        <TextInput
          style={styles.input}
          placeholder="Insira a senha atual"
          secureTextEntry
          value={senhaAtual}
          onChangeText={setSenhaAtual}
        />

        <TextInput
          style={styles.input}
          placeholder="Insira o novo e-mail"
          value={novoEmail}
          onChangeText={setNovoEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirme o novo e-mail"
          value={confirmacaoEmail}
          onChangeText={setConfirmacaoEmail}
        />

        <Text style={styles.caution}>Atenção!</Text>

        <Text style={styles.warningText}>
          {textoSeguranca}
        </Text>

        <TouchableOpacity style={styles.saveButton} onPress={handleSalvarEmail}>
          <Text style={styles.saveButtonText}>Salvar Novo E-mail</Text>
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