import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { inserindoDadosFicha, obterIdUsuario } from '../../database/database';
import { Picker } from '@react-native-picker/picker';

export default function Cadastro_endereco({ route }) {

  const navigation = useNavigation();
  const { genero, cpf } = route.params;

  console.log(genero);

  const [tipoSanguineo, setTipo] = useState("");
  const [doencas, setDoencas] = useState("");
  const [doencaCronica, setDoencaCronica] = useState("");
  const [doador, setDoador] = useState("");
  const [gravida, setGravida] = useState("");
  const [tempo, setTempo] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const onChangeTipoHandler = (tipo) => setTipo(tipo);
  const onChangeTempoHandler = (tempo) => setTempo(tempo);
  const onChangeDoadorHandler = (doador) => setDoador(doador);
  const onChangeGravidaHandler = (gravida) => setGravida(gravida);
  const onChangeDoencasHandler = (doencas) => setDoencas(doencas);
  const onChangeDoencasCronicasHandler = (doencaCronica) => setDoencaCronica(doencaCronica);

  const onSubmitFormHandler =  async () => {
      
    if(!tipoSanguineo.trim() || !doencaCronica.trim() || !doador.trim()){
      alert("Preencha todos os espaços!!");
      return;
    }

    if(doencaCronica === "sim"){
      if(!doencas.trim()){
        alert("Preencha todos os espaços!!");
        return;
      }
    }

    setIsLoading(true);

    try {
      console.log("Enviando dados para o servidor...");

      const id_usuario = obterIdUsuario(cpf);
      
      inserindoDadosFicha(tipoSanguineo, doencas, doador, gravida, tempo, id_usuario);
      
      console.log("Cadastro realizado com sucesso!");
      console.log(tipoSanguineo, doencas, doador, gravida, tempo, id_usuario);

      setIsLoading(false);

      setTipo("");
      setDoencas("");
      setDoador("");
      setGravida("");
      setTempo("");

      navigation.navigate('Cadastro', { cpf });

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
        placeholder={'Tipo Sanguíneo'}
        placeholderTextColor={'#989898'}
        value={tipoSanguineo}
        onChangeText={onChangeTipoHandler}
        editable={!isLoading}
      />

      
        <View style={styles.pickerContainer}>
          <Picker
                selectedValue={doencaCronica}
                style={styles.input}
                onValueChange={onChangeDoencasCronicasHandler}
                mode='dropdown'
                editable={!isLoading}
            >
              <Picker.Item label="Doencas Cronicas?" value='' enabled={false}/>
              <Picker.Item label="Sim" value="sim" />
              <Picker.Item label="Não" value="nao" />
          </Picker>
        </View>

        {(doencaCronica.toLowerCase() === "sim") && (
            <TextInput 
              style={styles.input}
              placeholder={'Doenças Crônicas'}
              placeholderTextColor={'#989898'}
              value={doencas}
              onChangeText={onChangeDoencasHandler}
              editable={!isLoading}
            />
    
        )}
      
        <View style={styles.pickerContainer}>
          <Picker
                selectedValue={doador}
                style={styles.input}
                onValueChange={onChangeDoadorHandler}
                mode='dropdown'
                editable={!isLoading}
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
                selectedValue={gravida}
                style={styles.input}
                onValueChange={onChangeGravidaHandler}
                mode='dropdown'
                editable={!isLoading}
            >
              <Picker.Item label="Gravida?" value='' enabled={false}/>
              <Picker.Item label="Sim" value="sim" />
              <Picker.Item label="Não" value="nao" />
            </Picker>
          </View>

          {(gravida.toLowerCase() === "sim") && (
              <TextInput 
              style={styles.input}
              placeholder={'Tempo de Gravidez (semanas)'}
              placeholderTextColor={'#989898'}
              value={tempo}
              onChangeText={onChangeTempoHandler}
              editable={!isLoading}
              keyboardType="numeric"
            />
          )}
        </View>
      )}
      

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
  textoCadastro:{
    fontSize: 32,
    marginBottom: 10
  },
  picker: {
    backgroundColor: '#fff', // Fundo branco para o Picker
  },
  pickerContainer:{
    justifyContent: 'center',
    width: 264,
    height: 48,
    backgroundColor: '#E0E0E0',
    borderColor: '#CDF8FF',
    borderRadius: 8,
    borderWidth: 1,
    margin: 3,
    overflow: 'hidden', // Para arredondar os cantos do Picker
  }
});
