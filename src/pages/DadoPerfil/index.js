import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { Storage } from "expo-sqlite/kv-store";

export default function ProfileScreen()  {

    const navigation = useNavigation();
    
    // Variáveis para dados
    const[nomeCompleto, setNomeCompleto] = useState('');
    const[dataNascimento, setDataNascimento] = useState('');
    const[cpf, setCpf] = useState('');
    const[rg, setRg] = useState('');
    const[contato, setContato] = useState('');
    const[email, setEmail] = useState('');
    const[tipoSanguineo, setTipoSanguineo] = useState('')
    const[doador, setDoador] = useState('');
    const[idade, setIdade] = useState('');
    const[estadoCivil, setEstadoCivil] = useState('');
    const[sexoBiologico, setSexoBiologico] = useState('');
    const[gravidez, setGravidez] = useState('');
    const[doencasCronicas, setDoencasCronicas] = useState('');
    const[tempoGravidez, setTempoGravidez] = useState('')

    useEffect (() => {
      const adicionarDados = async () => {
        try {
            const nome = await Storage.getItem('nome') || '';
            const data = await Storage.getItem('data_nascimento') || '';
            const cpf = await Storage.getItem('cpf') || '';
            const rg = await Storage.getItem('rg') || '';
            const contato = await Storage.getItem('telefone') || '';
            const email = await Storage.getItem('email') || '';
            const tipoSanguineo = await Storage.getItem('tipo_sanguineo') || '';
            const doador = await Storage.getItem('doador') || '';
            const idade = await Storage.getItem('idade') || '';
            const estadoCivil = await Storage.getItem('estado_civil') || '';
            const genero = await Storage.getItem('sexo_biologico') || '';
            const gravidez = await Storage.getItem('gravida') || '';
            const doencasCronicas = await Storage.getItem('doencas_cronicas') || '';
    
            // Setando os estados
            setNomeCompleto(nome);
            setDataNascimento(data);
            setCpf(cpf);
            setRg(rg);
            setContato(contato);
            setEmail(email);
            setTipoSanguineo(tipoSanguineo);
            setDoador(doador);
            setIdade(idade);
            setEstadoCivil(estadoCivil);
            setSexoBiologico(genero);
            setGravidez(gravidez);
            setDoencasCronicas(doencasCronicas);

            if(gravidez === 'sim'){
              const tempo = await Storage.getItem('data_gravidez');
              setTempoGravidez(tempo);
            }
    
          } catch (error) {
            console.error("Erro ao carregar os dados: ", error);
          }
        };
      adicionarDados();
    }, []);

    const handleBackPress = () => {
        navigation.navigate('Tabs', { screen: 'Perfil' });
    };

    function formatCpf(value)
    {
      const cpf = value.replace(/\D/g, '');
      
      if (cpf.length === 11) {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "\$1.\$2.\$3-\$4");
      } 
      
      return cpf.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "\$1.\$2.\$3/\$4-\$5");
    }

    const formatTelefone = (value) => {
      value = value.replace(/\D/g,'')
      value = value.replace(/(\d{2})(\d)/,"($1) $2")
      value = value.replace(/(\d)(\d{4})$/,"$1-$2")
      return value
    }

    function formatRg(v0,errChar='?'){
      const v = v0.toUpperCase().replace(/[^\dX]/g,'');
      return (v.length==8 || v.length==9)?
         v.replace(/^(\d{1,2})(\d{3})(\d{3})([\dX])$/,'$1.$2.$3-$4'):
         (errChar+v0)
      ;
    } 

    return (
        <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profileHeader}>
            <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Icon name="arrow-back" size={25} color="#ffffff" />
            </TouchableOpacity>
            
            <Text style={styles.profileTitle}>Perfil</Text>
            <View style={styles.profileImagePlaceholder}>
            <Text style={styles.profileImageIcon}>👤</Text>
            </View>
            <Text style={styles.profileName}>{nomeCompleto}</Text>
            <Text style={styles.profileInfo}>{idade}</Text>
            <Text style={styles.profileInfo}>{estadoCivil}</Text>
            <Text style={styles.profileInfo}>{sexoBiologico}</Text>
        </View>

        <View style={styles.profileDetails}>
            <Text style={styles.detailLabel}>Nome Completo</Text>
            <Text style={styles.detailText}>{nomeCompleto}</Text>

            <Text style={styles.detailLabel}>Data de Nascimento</Text>
            <Text style={styles.detailText}>{moment(dataNascimento).format('DD/MM/YYYY')}</Text>

            <Text style={styles.detailLabel}>CPF Cadastrado</Text>
            <Text style={styles.detailText}>{formatCpf(cpf)}</Text>

            <Text style={styles.detailLabel}>RG Cadastrado</Text>
            <Text style={styles.detailText}>{formatRg(rg)}</Text>

            <Text style={styles.detailLabel}>Contato</Text>
            <Text style={styles.detailText}>{formatTelefone(contato)}</Text>

            <Text style={styles.detailLabel}>E-mail</Text>
            <Text style={styles.detailText}>{email}</Text>

            <Text style={styles.detailLabel}>Tipo Sanguíneo</Text>
            <Text style={styles.detailText}>{tipoSanguineo}</Text>

            <Text style={styles.detailLabel}>Doenças Crônicas</Text>

            {(doencasCronicas.toLowerCase() === "") ? (
                <Text style={styles.detailText}> Não apresenta doenças cronicas</Text>
            ) : (
                <Text style={styles.detailText}>{doencasCronicas}</Text>
                
            )}

            {(sexoBiologico.toLowerCase() === 'feminino') && (
              <View style={styles.profileDetails}>
                <Text style={styles.detailLabel}>Grávida</Text>
                {(gravidez === 'sim') ? (
                  <Text style={styles.detailText}>{tempoGravidez}</Text>
                ) : (
                  <Text style={styles.detailText}> Não está grávida </Text>
                )}
              </View>
            )}
            <Text style={styles.detailLabel}>O usuário é doador?</Text>
            <Text style={styles.detailText}>{doador}</Text>
        </View>
        </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    paddingBottom: 50,
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 20,
    zIndex: 1,
  },
  profileHeader: {
    backgroundColor: '#00B383',
    width: '100%',
    height: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  profileTitle: {
    color: '#ffffff',
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  profileImagePlaceholder: {
    backgroundColor: '#CDF8FF',
    borderRadius: 120,
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImageIcon: {
    fontSize: 50,
    color: '#ffffff',
  },
  profileName: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  profileInfo: {
    color: '#ffffff',
    fontSize: 15,
    marginTop: 5,
  },
  profileDetails: {
    width: '100%',
    backgroundColor: '#ffffff',
    padding: 15,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 10,
  },
  detailText: {
    fontSize: 16,
    color: '#333',
    marginTop: 5,
  },
});

