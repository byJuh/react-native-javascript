import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { deletarUsuario, obterIdUsuario } from '../../database/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ExcluirConta({ navigation }) {
  const [isChecked, setIsChecked] = useState(false);

  // Voltar Configurações (Pronto)
  const handleBackPress = () => {
    navigation.navigate('Tabs', { screen: 'Config' });
  };

  // Botão de excluir + Checkbox (incompleto)
  const handleExcluirConta = async () => {
    if (isChecked) {
      Alert.alert(
        "Conta excluída",
        "Sua conta foi excluída permanentemente!",
        [{ text: "Até mais!", onPress: () => navigation.navigate('Login') }],
        { cancelable: false }
      );

      const cpf = await AsyncStorage.getItem('cpf');
      const id = await obterIdUsuario(cpf);

      const result = await deletarUsuario(id);

      if(result) await AsyncStorage.clear();
    } else {
      Alert.alert(
        "Ação não permitida!",
        "É necessário marcar a confirmação antes de excluir sua conta.",
        [{ text: "Entendi" }],
        { cancelable: false }
      );
    }
  };

  // Botão Cancelar = Voltar Configurações (Pronto)
  const handleCancelar = () => {
    navigation.navigate('Tabs', { screen: 'Config' });
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FF0000" barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Icon name="arrow-back" size={30} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Excluir Conta</Text>
      </View>

      <View style={styles.contentContainer}>
        <Icon name="error-outline" size={100} color="#000000" style={styles.icon} />
        <Text style={styles.caution}>Aviso Importante!</Text>
        <Text style={styles.warningText}>
          Você selecionou a opção de Excluir Conta. Esta ação é permanente e não pode ser desfeita. Todos os seus dados, 
          histórico médico e configurações serão removidos do sistema e não poderão ser recuperados.{"\n\n"}
          Tem certeza de que deseja excluir sua conta?
        </Text>

        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={[styles.checkbox, isChecked && styles.checkedCheckbox]}
            onPress={() => setIsChecked(!isChecked)}
          >
            {isChecked && <Icon name="check" size={16} color="#ffffff" />}
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>
            Estou ciente de que a conta será excluída permanentemente e não será possível recuperar meus dados após isso.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={handleExcluirConta}
          >
            <Text style={styles.buttonText}>Excluir</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={handleCancelar}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF0000',
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
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    alignItems: 'center',
  },
  icon: {
    marginBottom: 20,
  },
  caution: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  warningText: {
    fontSize: 20,
    color: '#333',
    textAlign: 'center',
    marginVertical: 20,
    lineHeight: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  checkedCheckbox: {
    backgroundColor: '#FF0000',
    borderColor: '#FF0000',
  },
  checkboxLabel: {
    textAlign: 'justify',
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  deleteButton: {
    backgroundColor: '#FF0000',
  },
  cancelButton: {
    backgroundColor: '#C4C4C4',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
