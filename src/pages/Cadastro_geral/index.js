import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import { inserindoDadosGeral } from '../../database/database';
import { Picker } from '@react-native-picker/picker';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';

export default function Cadastro_geral() {

    const navigation = useNavigation();

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [birthDate, setBirthDate] = useState("");
    const [nomeCompleto, setNomeCompleto] = useState("");
    const [cpf, setCpf] = useState("");
    const [genero, setGenero] = useState("");
    const [estadoCivil, setEstadoCivil] = useState("");
    const [rg, setRg] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const onChangeNameHandler = (nomeCompleto) => setNomeCompleto(nomeCompleto);
    const onChangeCpfHandler = (cpf) => setCpf(cpf);
    const onChangeGeneroHandles = (genero) => setGenero(genero);
    const onChangeEstadoCiviloHandles = (estadoCivil) => setEstadoCivil(estadoCivil);
    const onChangeRgHandles = (rg) => setRg(rg);
    
    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);

    const handleConfirm = (date) => {
        setBirthDate(moment(date).format('YYYY-MM-DD'));
        hideDatePicker();
    };

    const onSubmitFormHandler =  async () => {
      
      if(!nomeCompleto.trim() || !birthDate.trim() || !cpf.trim() || !rg.trim() || !genero.trim() || !estadoCivil.trim()){
        alert("Preencha todos os espaços!!");
        return;
      }


      if(cpf.length !== 11){
        alert("CPF inválido!!");
        return;
      }else{
        if(!cpfValidator.isValid(cpf)){
          alert("CPF inválido!!");
          return;
        }
      }

      const re = /\b[A-Za-zÀ-ú][A-Za-zÀ-ú]+,?\s[A-Za-zÀ-ú][A-Za-zÀ-ú]{2,19}\b/gi;

      if(!nomeCompleto.match(re)){
        alert("Nome inválido!!");
        return;
      }

      setIsLoading(true);

      try {
        console.log("Enviando dados para o servidor...");

        const anoAtual = new Date().getFullYear();
        const anoNascimento = new Date(birthDate).getFullYear();

        // Calcular a idade
        let idade = anoAtual - anoNascimento;

        // Verificar se o aniversário já ocorreu este ano
        const mesAtual = new Date().getMonth();
        const diaAtual = new Date().getDate();
        const mesNascimento = new Date(birthDate).getMonth();
        const diaNascimento = new Date(birthDate).getDate();

        if (mesAtual < mesNascimento || (mesAtual === mesNascimento && diaAtual < diaNascimento)) {
            idade--; // Diminuir 1 da idade
        }
        
       
        await inserindoDadosGeral(nomeCompleto, birthDate, genero, estadoCivil, cpf, rg, idade);
        
        console.log("Cadastro realizado com sucesso!");
        console.log(nomeCompleto, birthDate, genero, estadoCivil, cpf, rg);
            
        setIsLoading(false);

        setNomeCompleto("");
        setCpf("");
        setRg("");
        setGenero("");
        setEstadoCivil("");
        setBirthDate("");

        navigation.navigate('CadastroEndereco', { cpf, genero });

      } catch (error) {a
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
            placeholder={'Nome Completo'}
            placeholderTextColor={'#989898'}
            value={nomeCompleto}
            onChangeText={onChangeNameHandler}
            editable={!isLoading}
        />

        <TouchableOpacity onPress={showDatePicker}>
            <TextInput
            numberOfLines={1}
            editable={false}
            placeholder="📅 Data de nascimento"
            value={birthDate ? moment(birthDate).format('DD/MM/YYYY') : ''} // Formatação da data correta
            style={styles.input}
            />
            <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            />
        </TouchableOpacity>

        <TextInput 
            style={styles.input}
            placeholder={'CPF'}
            placeholderTextColor={'#989898'}
            value={cpf}
            onChangeText={onChangeCpfHandler}
            editable={!isLoading}
        />

        <TextInput 
            style={styles.input}
            placeholder={'RG'}
            placeholderTextColor={'#989898'}
            value={rg}
            onChangeText={onChangeRgHandles}
            editable={!isLoading}
        />

        <View style={styles.pickerContainer}>
          <Picker
                selectedValue={genero}
                style={styles.input}
                onValueChange={onChangeGeneroHandles}
                mode='dropdown'
                editable={!isLoading}
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
                style={styles.input}
                onValueChange={onChangeEstadoCiviloHandles}
                mode='dropdown'
                editable={!isLoading}
            >
              <Picker.Item label="Estado Civil" value='' enabled={false}/>
              <Picker.Item label="Solteiro(a)" value="solteiro(a)" />
              <Picker.Item label="Casado(a)" value="casado(a)" />
              <Picker.Item label="Separado(a)" value="separado(a)" />
              <Picker.Item label="Divorciado(a)" value="divorciado(a)" />
              <Picker.Item label="Viúvo(a)" value="viúvo(a)" />
          </Picker>
        </View>
        
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
    marginBottom: 20
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
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
