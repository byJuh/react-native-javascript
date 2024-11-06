import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios'; // Importando o Axios
import { inserindoDadosEndereco } from '../../database/database';

export default function Cadastro_endereco({ route }) {
  const { cpf, genero } = route.params;
  const navigation = useNavigation();

  const [cep, setCep] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [pais, setPais] = useState("Brasil"); // Definindo o país
  const [isLoading, setIsLoading] = useState(false);
  const [endereco, setEndereco] = useState(null);

  const onChangeCepHandler = (cep) => {
    setCep(cep);
  };

  const buscarCep = async () => {
    setEndereco(null);

    if (cep.length !== 8) {
      alert('O CEP deve ter 8 dígitos.');
      return;
    }

    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      if (response.data.erro) {
        alert('CEP não encontrado.');
      } else {
        setEndereco(response.data);
        // Atualiza os campos com os dados do endereço
        setRua(response.data.logradouro);
        setCidade(response.data.localidade);
        setEstado(response.data.estado);
      }
    } catch (error) {
      alert('Erro ao buscar o CEP. Tente novamente.');
    }
  };

  const onSubmitFormHandler = async () => {
    if (!cep.trim() || !rua.trim() || !numero.trim() || !cidade.trim() || !estado.trim()) {
      alert("Preencha todos os espaços!!");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Enviando dados para o servidor...");

      await inserindoDadosEndereco(cep, rua, numero, complemento, cidade, estado, pais, cpf);

      console.log("Cadastro realizado com sucesso!");

      setIsLoading(false);
      // Limpa os estados
      setCep("");
      setRua("");
      setNumero("");
      setComplemento("");
      setCidade("");
      setEstado("");

      navigation.navigate('CadastroFicha', { cpf, genero });
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      alert("Erro ao cadastrar. Por favor, tente novamente.");
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/logo.png')} />
      <Text style={styles.textoCadastro}> Cadastre-se </Text>

      <TextInput 
        style={styles.input}
        placeholder={'CEP'}
        placeholderTextColor={'#989898'}
        value={cep}
        onChangeText={onChangeCepHandler}
        onBlur={buscarCep}
        editable={!isLoading}
      />

      <TextInput 
        style={styles.input}
        placeholder={'Rua'}
        placeholderTextColor={'#989898'}
        value={rua} 
        onChangeText={setRua}
        editable={!isLoading}
      />

      <TextInput 
        style={styles.input}
        placeholder={'Número'}
        placeholderTextColor={'#989898'}
        value={numero}
        onChangeText={setNumero}
        editable={!isLoading}
        keyboardType="numeric"
      />

      <TextInput 
        style={styles.input}
        placeholder={'Complemento (opcional)'}
        placeholderTextColor={'#989898'}
        value={complemento}
        onChangeText={setComplemento}
        editable={!isLoading}
      />

      <TextInput 
        style={styles.input}
        placeholder={'Cidade'}
        placeholderTextColor={'#989898'}
        value={cidade} 
        onChangeText={setCidade}
        editable={!isLoading}
      />

      <TextInput 
        style={styles.input}
        placeholder={'Estado'}
        placeholderTextColor={'#989898'}
        value={estado}
        onChangeText={setEstado}
        editable={!isLoading}
      />

      <TouchableOpacity 
        style={styles.btnCriar} 
        disabled={isLoading}
        onPress={onSubmitFormHandler}
      >
        <Text style={styles.textoProximo}> Próximo </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: 264,
    height: 48,
    backgroundColor: '#E0E0E0',
    borderColor: '#CDF8FF',
    borderRadius: 8,
    borderWidth: 1,
    margin: 3,
    fontSize: 15,
    paddingLeft: 20,
  },
  btnCriar: {
    width: 185,
    height: 60,
    backgroundColor: '#00B383',
    borderRadius: 100,
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoProximo: {
    color: '#fff',
    fontSize: 20,
  },
  textoCadastro: {
    fontSize: 32,
    marginBottom: 10,
  },
});
