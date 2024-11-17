import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function PrivacyScreen() {

    const navigation = useNavigation();

    const textoPrivacidade = `
        Coletamos apenas as informações necessárias para fornecer uma experiência completa e personalizada. Nunca coletamos dados sensíveis sem seu consentimento explícito, e todos os dados fornecidos são armazenados de forma segura.
        Regularmente revisamos e atualizamos nossos sistemas de segurança para garantir que estejam sempre em conformidade com as melhores práticas do setor. Caso tenha alguma dúvida ou preocupação sobre a segurança e privacidade dos seus dados, nossa equipe de suporte está sempre disponível para ajudar. 
        
        Trabalhamos continuamente para resolver qualquer questão de forma rápida e eficiente.
    `;

    const handleBackPress = () => {
        navigation.navigate('Tabs', { screen: 'Config' }); 
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                <Icon name="arrow-back" size={30} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Dados e Privacidade</Text>
        </View>

        <View style={styles.iconContainer}>
            <Icon name="groups" size={100} color="#000000" />
        </View>

        <View style={styles.textContainer}>
            <Text style={styles.textoPrivacidade}>{textoPrivacidade}</Text>
        </View>

        <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('AlterarSenha')}>
            <View>
                <Text style={styles.optionTitle}>Senha</Text>
                <Text style={styles.optionText}>Clique aqui para redefinir sua senha</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#333" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.option}>
            <View>
                <Text style={styles.optionTitle}>E-mail</Text>
                <Text style={styles.optionText}>Clique aqui para alterar seu e-mail</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#333" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.option}>
            <View>
                <Text style={styles.optionTitle}>Informações de perfil</Text>
                <Text style={styles.optionText}>Clique aqui para alterar o perfil</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#333" />
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
  iconContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  textContainer: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: 10,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dcdcdc',
  },
  textoPrivacidade: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    textAlign: 'justify',
  },
  optionsContainer: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  option: {
    backgroundColor: '#ffffff',
    paddingVertical: 15,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#dcdcdc',
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  optionText: {
    fontSize: 14,
    color: '#9C9C9C',
  },
});
