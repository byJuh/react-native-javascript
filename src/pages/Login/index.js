import React, {useState} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { login, obterDadosDoUsuario, obterIdUsuario, redefinirSenha, obterCpf } from '../../database/database';
import { Modal } from 'react-native';

const validator = require('validator')

export default function Login(){

    const navigation = useNavigation();

    const [senha, setSenha] = useState();
    const [email, setEmail] = useState();
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisibleSenha, setModalVisibleSenha] = useState(false);
    const [novaSenha, setNovaSenha] = useState('');

    const onChangeEmailHandler = (email) => setEmail(email);
    const onChangeSenhaHandler = (senha) => setSenha(senha);
    const onChangeNovaSenhaHandler = (novaSenha) => setNovaSenha(novaSenha);
    
    const esqueceuEmail = async () => {
      setModalVisible(!modalVisible);
    }

    const mostrarTelaRedefinicao = async () => {
      console.log("mostrarTelaRedefinição2");
      if (!email.trim()) {
          alert("Campo vazio!!");
          return;
      }
  
      setModalVisible(false); // Fecha o modal do email primeiro
  
      // Usa o setTimeout para garantir a troca de modais após o estado ser atualizado
      setTimeout(() => {
          setModalVisibleSenha(true); // Abre o modal de redefinição de senha
          console.log("Abrindo modal de redefinição de senha");
      }, 300); // Aumente o tempo para garantir que o primeiro modal esteja completamente fechado
    };
  

    const redefinirSenhaBotao = async () => {

        try {
          console.log("Tentando redefinir a senha para:", email, novaSenha);
  
          
          const result = await redefinirSenha(email, novaSenha);

          if(result){
            alert("Senha redefinida com sucesso!");
          }else{
            alert("Erro ao redefinir. Tente mais tarde!");
          }
          
        } catch (error) {
          console.error("Erro ao redefinir senha:", error.message);
          alert("Erro ao redefinir a senha. Tente novamente.");
        } finally {
          setModalVisibleSenha(false);  // Fecha o modal após a ação
        }
        
    };

  const verificarAcesso = async () => {
    if (!email.trim() || !senha.trim()) {
        alert("Campos vazios!!");
        return;
    }

    if(validator.isEmail(email)){
      try {
          const entrar = await login(email, senha);

          console.log(entrar);

          if(entrar){
            setEmail("");
            setSenha("");

            const cpf = await obterCpf(email);
            console.log('cpf: ', cpf);

            const id_usuario = await obterIdUsuario(cpf);
            console.log('id: ', id_usuario);

            const result = await obterDadosDoUsuario(cpf, id_usuario);

            console.log(result);

            if(result){
              navigation.navigate('Tabs', { screen: 'Principal' });
            }else{
              alert('Erro ao pegar dados!!');
            }

            
          }

          
      } catch (error) {
          alert("Senha ou email incorretos!!");
      }

    }else{
      alert("email inválido!");
      return;
    }

    
    };

    return(
      <View style={styles.container}>
        <Image source={require('../../assets/logo.png')}/>
        <Text style={styles.textoLogin}> Login </Text>

        <TextInput 
          style={styles.input}
          placeholder={'Email'}
          placeholderTextColor={'#989898'}
          value={email}
          onChangeText={onChangeEmailHandler}
        />

        <TextInput 
          style={styles.input}
          placeholder={'Senha'}
          placeholderTextColor={'#989898'}
          value={senha}
          onChangeText={onChangeSenhaHandler}
          secureTextEntry
        />

        <TouchableOpacity onPress={esqueceuEmail}>
          <Text style={styles.textoSenha}> 
            Esqueceu a sua senha? 
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.btnEntrar} 
          onPress={verificarAcesso}
        >
          <Text style={styles.textoEntrar}> 
            Entrar
          </Text>
        </TouchableOpacity>

        <View style={styles.areaCadastro}>
          <Text style={styles.pergunta}>
            Não está cadastrado ainda?
          </Text>

          <TouchableOpacity onPress={ () => navigation.navigate('CadastroInicial')}>
            <Text style={styles.texto}> 
              Cadastre-se aqui
            </Text>
          </TouchableOpacity>
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(!modalVisible)}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}> 
                Digite o email para a redefinição:
              </Text>
              <TextInput 
                value={email} 
                onChangeText={onChangeEmailHandler} 
                style={styles.input}
                placeholder={'Email'}
                placeholderTextColor={'#989898'}
              />
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    style ={styles.btnEnviar}
                    onPress={mostrarTelaRedefinicao}>
                  <Text style={styles.textoEntrar}> Enviar </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style ={styles.btnFechar}
                    onPress={() => setModalVisible(false)}>
                  <Text style={styles.textoEntrar}>
                    Fechar
                  </Text>
                  </TouchableOpacity>
                </View>
            </View>
          </View>
      </Modal>

      <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisibleSenha}
          onRequestClose={() => setModalVisible(!modalVisibleSenha)}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}> 
                Digite a nova senha:
              </Text>
              <TextInput 
                value={novaSenha} 
                onChangeText={onChangeNovaSenhaHandler} 
                style={styles.input}
                placeholder={'Senha'}
                secureTextEntry
                placeholderTextColor={'#989898'}
              />
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    style ={styles.btnEnviar}
                    onPress={redefinirSenhaBotao}>
                  <Text style={styles.textoEntrar}>
                    Enviar
                  </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style ={styles.btnFechar}
                    onPress={() => setModalVisibleSenha(false)}>
                  <Text style={styles.textoEntrar}>
                    Fechar
                  </Text>
                  </TouchableOpacity>
                </View>
                
             
            </View>
          </View>
      </Modal>
      
      </View>
    );
  }

const styles = StyleSheet.create({
  container:{
    flex: 1, //pega toda a tela
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  input:{
    width: 264,
    height: 48,
    backgroundColor: '#E0E0E0',
    borderColor: '#CDF8FF',
    borderRadius: 8,
    borderWidth: 1,
    margin: 10,
    fontSize: 15,
    paddingLeft: 20
  },
  textoSenha:{
    fontSize: 12,
    color: '#989898',
    textDecorationLine: 'underline'
  },
  btnEntrar:{
    width:185,
    height: 60,
    backgroundColor: '#00B383',
    borderRadius: 100,
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnFechar:{
    width:100,
    height: 50,
    backgroundColor: '#00B383',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10
  },
  textoEntrar:{
    color: '#fff',
    fontSize: 20
  },
  areaCadastro:{
    flexDirection: 'row',
    marginTop: 45
  },
  pergunta:{
    fontSize: 12,
    color: '#989898'
  },
  texto:{
    fontSize: 12,
    color: '#32AB6C',
    textDecorationLine: 'underline',
    marginLeft: 5
  },
  textoLogin:{
    fontSize: 32,
    marginTop: 70,
    marginBottom: 10
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    borderColor: '#000',
    borderWidth: 1,
    width: 300,
    height: 200
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnEnviar: {
    width:100,
    height: 50,
    backgroundColor: '#00B383',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalText:{
    fontSize: 17
  }
});