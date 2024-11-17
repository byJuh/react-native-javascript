import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, useAnimatedValue} from 'react-native';
import Checkbox from 'expo-checkbox';
import { useState } from 'react';
import { inserindoDadosCadastro } from '../../database/database';
import { useNavigation } from '@react-navigation/native';

const validator = require('validator')

export default function Cadastro({ route }){

  const navigation = useNavigation();
 
  const [isChecked, setChecked] = useState(false);
  const { cpf, id_usuario} = route.params;

  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const onChangeTelefoneHandler = (telefone) => setTelefone (telefone);

  const onChangeEmailHandler = (email) => setEmail (email);

  const onChangeSenhaHandler = (senha) => setSenha (senha);
  
  const onChangeConfirmarSenhaHandler = (senha) => setConfirmarSenha (senha);

  function validatePhone (phone) {
    var regex = new RegExp('^((1[1-9])|([2-9][0-9]))((3[0-9]{3}[0-9]{4})|(9[0-9]{3}[0-9]{5}))$'); 
    return regex.test(phone);
  }

  const onSubmitFormHandler = async () => {
    if (isChecked === false) {
      alert("Para se cadastrar aceite os termos de uso!!");
      return;
    } 

    if(!email.trim() || !telefone.trim() || !senha.trim() || !confirmarSenha.trim()){
      alert("Preencha todos os dados!!");
      return;
    }

    if(validatePhone(telefone)){
      alert("Númeor inválido!!");
      return;
    }

    if(senha !== confirmarSenha){
      alert("Senhas diferentes!!");
      return;
    }

    if(validator.isEmail(email)){
      setIsLoading(true);

      try {
        console.log("Enviando dados para o servidor...");
  
        if(senha.length < 6 && senha.length > 16){
          alert("senha tem que ter no minino 6 digitos!!");
          return;
        }
        
        await inserindoDadosCadastro(cpf, email, senha, telefone);
        
        console.log("Cadastro realizado com sucesso!");
        console.log(cpf, email, senha, telefone);
            
        setIsLoading(false);
  
        setTelefone("");
        setEmail("");
        setSenha("");
        setConfirmarSenha("");
        
        navigation.navigate('Login', {cpf, id_usuario});
  
      } catch (error) {
        console.error("Erro ao cadastrar:", error);
        alert("Erro ao cadastrar. Por favor, tente novamente.");
        setIsLoading(false);
      }
    }else{
      alert("email inválido!");
      return;
    }
  };

  return(
      <View style={styles.container}>
        <Image source={require('../../assets/logo.png')}/>
        <Text style={styles.textoCadastro}> Cadastre-se </Text>

        <TextInput 
          style={styles.input}
          placeholder={'Contato (+55)'}
          placeholderTextColor={'#989898'}
          value={telefone}
          onChangeText={onChangeTelefoneHandler}
          editable={!isLoading}
        />

        <TextInput 
          style={styles.input}
          placeholder={'E-mail'}
          placeholderTextColor={'#989898'}
          value={email}
          onChangeText={onChangeEmailHandler}
          editable={!isLoading}
        />

        <TextInput 
          style={styles.input}
          placeholder={'Senha'}
          placeholderTextColor={'#989898'}
          value={senha}
          onChangeText={onChangeSenhaHandler}
          editable={!isLoading}
          secureTextEntry={true}
        />

        <TextInput 
          style={styles.input}
          placeholder={'Confirme a Senha'}
          placeholderTextColor={'#989898'}
          value={confirmarSenha}
          onChangeText={onChangeConfirmarSenhaHandler}
          editable={!isLoading}
          secureTextEntry={true}
        />

        <TouchableOpacity>
          <Text style={styles.termosTexto}> Termos de Uso </Text>
        </TouchableOpacity>

        <View style={styles.areaTermo}>
          <Checkbox 
            value={isChecked} // Acessando o valor atual do checkbox do estado
            onValueChange={setChecked} // Atualizando o estado
          />
          <Text style={styles.textoCheck}> 
            Li e concordo com os termos e condições de uso
          </Text>
        </View> 
         
 
        <TouchableOpacity 
          style={styles.btnCriar} 
          onPress={onSubmitFormHandler}
          disabled={isLoading}
        >
          <Text style={styles.textoCriar}> 
            Criar Conta
          </Text> 
        </TouchableOpacity>

      </View>
    );
}

const styles = StyleSheet.create({
  container:{
    flex: 1, //pega toda a tela
    justifyContent: 'center',
    alignItems: 'center',
  },
  input:{
    width: 264,
    height: 48,
    backgroundColor: '#E0E0E0',
    borderColor: '#CDF8FF',
    borderRadius: 8,
    borderWidth: 1,
    margin: 3,
    fontSize: 15,
    paddingLeft: 20
  },
  btnCriar:{
    width:185,
    height: 60,
    backgroundColor: '#00B383',
    borderRadius: 100,
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textoCriar:{
    color: '#fff',
    fontSize: 20
  },
  areaTermo:{
    flexDirection: 'row',
    paddingTop: 5
  },
  termosTexto:{
    marginTop: 10,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    fontSize: 15
  }, 
  textoCheck:{
    fontSize: 13,
    color: '#989898',
    textDecorationLine: 'underline',
    marginLeft: 5
  },
});