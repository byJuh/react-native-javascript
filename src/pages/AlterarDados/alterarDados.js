import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
import { alterarDadosGerais, alterarDadosMedicos, obterIdUsuario } from '../../database/database';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';

import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AlteracaoDados({ navigation }) {
  const textoSeguranca = `Você está prestes a alterar seus dados pessoais. Verifique com atenção antes de confirmar para garantir que todas as informações estejam corretas. Alterações incorretas podem afetar seu acesso e funcionalidades do aplicativo.`;

  //Puxar todos os dados atuais do cadastro, deixar tudo em branco para o usuário preencher de novo ou alterar apenas os campos que foram preenchidos com algo?
  //dados gerais
  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [genero, setGenero] = useState('');
  const [estadoCivil, setEstadoCivil] = useState('');
  const [cpf, setCpf] = useState('');
  const [rg, setRg] = useState('');
  const [telefone, setTelefone] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [idade, setIdade] = useState(0);

  //dados médicos
  const [tipoSanguineo, setTipoSanguineo] = useState('');
  const [doencasCronicas, setDoencasCronicas] = useState('');
  const [doador, setDoador] = useState('');
  const [gravidez, setGravidez] = useState('');
  const [tempoGravidez, setTempoGravidez] = useState('');

  // Voltar para Termo Privacidade (Pronto)
  const handleBackPress = () => {
    navigation.navigate('Tabs', { screen: 'TermoPrivacidade' });
  };

    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);

    const handleConfirm = (date) => {
        setDataNascimento(moment(date).format('YYYY-MM-DD'));
        hideDatePicker();
    };


  // Salvar Alterações (Incompleto)
  const handleSalvarDados = async () => {

    if(cpf.trim()){
        if(cpf.length !== 11){
            alert("CPF inválido!!");
            return;
          }else{
            if(!cpfValidator.isValid(cpf)){
              alert("CPF inválido!!");
              return;
            }
          }
    }
    

      const re = /\b[A-Za-zÀ-ú][A-Za-zÀ-ú]+,?\s[A-Za-zÀ-ú][A-Za-zÀ-ú]{2,19}\b/gi;

      if(nome.trim() && !nome.match(re)){
        alert("Nome inválido!!");
        return;
      }

      if(dataNascimento){

        const anoAtual = new Date().getFullYear();
        const anoNascimento = new Date(dataNascimento).getFullYear();

        // Calcular a idade
        const idade = anoAtual - anoNascimento;

        // Verificar se o aniversário já ocorreu este ano
        const mesAtual = new Date().getMonth();
        const diaAtual = new Date().getDate();
        const mesNascimento = new Date(dataNascimento).getMonth();
        const diaNascimento = new Date(dataNascimento).getDate();

        if (mesAtual < mesNascimento || (mesAtual === mesNascimento && diaAtual < diaNascimento)) {
            idade--; // Diminuir 1 da idade
        }
        
      }

      console.log('oi')

      const cpfAtual = await AsyncStorage.getItem('cpf');
      
      const id_usuario = await obterIdUsuario(cpfAtual);

      console.log("id: ", id_usuario);

      const resultGeral = await alterarDadosGerais(id_usuario, nome, dataNascimento, genero, estadoCivil, cpf, rg, telefone, idade);

      console.log(resultGeral);
      
      if(resultGeral){
        const resultMedico = await alterarDadosMedicos(tipoSanguineo, doencasCronicas, doador, gravidez, tempoGravidez, id_usuario);


        console.log(resultMedico);

        if(resultMedico){
            alert('Dados atualizados com sucesso!!');
        }else{
            alert('Não foi possivel atualizar os dados!!');
            return;
        }
      }else{
        alert('Não foi possivel atualizar os dados!!');
        return;
      }

      
    showAlert();
    navigation.navigate('Tabs', { screen: 'TermoPrivacidade' });
  };

  // Limpar Campos (Pronto)
  const handleLimparCampos = () => {
    setNome('');
    setDataNascimento('');
    setGenero('');
    setEstadoCivil('');
    setCpf('');
    setRg('');
    setTelefone('');

    setTipoSanguineo('');
    setDoencasCronicas('');
    setDoador('');
    setGravidez('');
    setTempoGravidez('');
  };

  // PopUp de Confirmação (Pronto)
  const showAlert = () => {
    Alert.alert(
      "Dados alterados com sucesso!",
      "Seus novos dados foram salvos, verifique-os na aba Perfil!",
      [
        {
          text: "OK",
        },
      ],
      { cancelable: false }
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
        <Text style={styles.title}>Alteração de Dados</Text>
        
        <Text style={styles.subtitle}>Dados Gerais</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome Sobrenome"
          value={nome}
          onChangeText={setNome}
        />

        <TouchableOpacity onPress={showDatePicker}>
            <TextInput
            numberOfLines={1}
            editable={false}
            placeholder="📅 Data de nascimento"
            value={dataNascimento ? moment(dataNascimento).format('DD/MM/YYYY') : ''} // Formatação da data correta
            style={styles.input}
            />
            <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            />
        </TouchableOpacity>

        <View style={styles.pickerContainer}>
          <Picker
                selectedValue={genero}
                style={styles.inputPicker}
                onValueChange={setGenero}
                mode='dropdown'
            >
              <Picker.Item label="Genero" value='' enabled={false}/>
              <Picker.Item label="Feminino" value="feminino" />
              <Picker.Item label="Masculino" value="masculino" />
              <Picker.Item label="Outro" value="outro" />
          </Picker>
        </View>

        <View style={styles.pickerContainer}>
          <Picker
                selectedValue={estadoCivil}
                style={styles.inputPicker}
                onValueChange={setEstadoCivil}
                mode='dropdown'
            >
              <Picker.Item label="Estado Civil" value='' enabled={false}/>
              <Picker.Item label="Solteiro(a)" value="solteiro(a)" />
              <Picker.Item label="Casado(a)" value="casado(a)" />
              <Picker.Item label="Separado(a)" value="separado(a)" />
              <Picker.Item label="Divorciado(a)" value="divorciado(a)" />
              <Picker.Item label="Viúvo(a)" value="viúvo(a)" />
          </Picker>
        </View>
        <TextInput
          style={styles.input}
          placeholder="CPF"
          value={cpf}
          onChangeText={setCpf}
        />
        <TextInput
          style={styles.input}
          placeholder="RG"
          value={rg}
          onChangeText={setRg}
        />
        <TextInput
          style={styles.input}
          placeholder="Telefone"
          value={telefone}
          onChangeText={setTelefone}
        />

        <Text style={styles.subtitle}>Dados Médicos</Text>
        <TextInput
          style={styles.input}
          placeholder="Tipo Sanguíneo"
          value={tipoSanguineo}
          onChangeText={setTipoSanguineo}
        />
    
        
            <TextInput 
              style={styles.input}
              placeholder={'Doenças Crônicas'}
              placeholderTextColor={'#989898'}
              value={doencasCronicas}
              onChangeText={setDoencasCronicas}
            />
      
        <View style={styles.pickerContainer}>
          <Picker
                selectedValue={doador}
                style={styles.inputPicker}
                onValueChange={setDoador}
                mode='dropdown'
            >
              <Picker.Item label="Doador?" value='' enabled={false}/>
              <Picker.Item label="Sim" value="sim" />
              <Picker.Item label="Não" value="nao" />
          </Picker>
        </View>
      

      {(genero.toLowerCase() === "feminino") && (
        <View>
          <View style={styles.pickerContainer}>
            <Picker
                selectedValue={gravidez}
                style={styles.inputPicker}
                onValueChange={setGravidez}
                mode='dropdown'
            >
              <Picker.Item label="Gravida?" value='' enabled={false}/>
              <Picker.Item label="Sim" value="sim" />
              <Picker.Item label="Não" value="nao" />
            </Picker>
          </View>

          {(gravidez.toLowerCase() === "sim") && (
              <TextInput 
              style={styles.input}
              placeholder={'Tempo de Gravidez (semanas)'}
              placeholderTextColor={'#989898'}
              value={tempoGravidez}
              onChangeText={setTempoGravidez}
              keyboardType="numeric"
            />
          )}
        </View>
      )}

        <Text style={styles.caution}>Atenção!</Text>

        <Text style={styles.warningText}>
          {textoSeguranca}
        </Text>

        <TouchableOpacity style={styles.saveButton} onPress={handleSalvarDados}>
          <Text style={styles.saveButtonText}>Salvar Alterações</Text>
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
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: '#000000',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '500',
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
  picker: {
    backgroundColor: '#fff', // Fundo branco para o Picker
  },
  inputPicker: {
    color: '#333', // Define a cor do texto
    fontSize: 16,
    textAlign: 'left', // Alinha o texto à esquerda
    textAlignVertical: 'center', // Alinha verticalmente (somente no Android)
    height: 50, // Garante o alinhamento com a altura do container
    paddingLeft: 10, // Move o texto para a esquerda
  },
  pickerContainer: {
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 15,
    height: 50,
    justifyContent: 'center', // Alinha verticalmente
  },
});
