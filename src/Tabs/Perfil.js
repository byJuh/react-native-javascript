import React, { useEffect, useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faFilePdf } from '@fortawesome/free-regular-svg-icons';
import { faInbox } from '@fortawesome/free-solid-svg-icons';
import { faClipboard } from '@fortawesome/free-regular-svg-icons';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { Storage } from "expo-sqlite/kv-store";

export default function Perfil(){

    const [nome, setNome] = useState("");
    const [data, setData] = useState("");
    const [genero, setGenero] = useState("");
    const [idade, setIdade] = useState("");

    const navigation = useNavigation();

    useEffect(() => {
        const getDados = async () =>{
            try{
                const nomeCompleto = await Storage.getItem("nome");
                setNome(nomeCompleto);

                const dataDeNascimento = await Storage.getItem("data_nascimento");
                setData(dataDeNascimento);

                const genero = await Storage.getItem("sexo_biologico");
                setGenero(genero);

                const idade = await Storage.getItem("idade");
                setIdade(idade);
            } catch(error){
                console.log("Nao foi possivel pegar os dados!!");
            }
        };

        getDados();

    }, []);

    const logOut = async () => {
        try{
            await Storage.removeItem('authToken');
                navigation.reset({
                    routes: [{ name: 'TelaInicial' }],
                });
            } catch (error){
                console.error('Erro ao fazer logout:', error);
            }
        }

    return(
        <View style={styles.container}>
            <View style={styles.areaNome}>
                <Text style={{fontSize: 20, marginTop: 20}}> 
                    Nome: {nome}
                </Text>

                <Text style={{fontSize: 20}}>
                    {idade} anos ({moment(data).format('DD/MM/YYYY')})
                </Text>

                <Text style={{fontSize: 20}}>
                    {genero}
                </Text>

            </View>

            <TouchableOpacity style={styles.areaFicha}>
                <FontAwesomeIcon icon={faClipboard} size={20} style={styles.icon}/>
                <Text style={styles.texto}> Ficha Médica </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.areaInfos} onPress={() => navigation.navigate('DadosPerfil')}>
                <FontAwesomeIcon icon={faUser} size={20} style={styles.icon}/>
                <Text style={styles.texto}> Informações Pessoais </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.areaLocalizacao}>
                <FontAwesomeIcon icon={faLocationDot} size={20} style={styles.icon}/>
                <Text style={styles.texto}> Localização </Text>   
            </TouchableOpacity>
                
            <TouchableOpacity style={styles.areaHistorico}>
                <FontAwesomeIcon icon={faInbox} size={20} style={styles.icon}/>
                <Text style={styles.texto}> Histórico </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.areaSair} onPress={logOut}>
                <FontAwesomeIcon icon={faCircleXmark} size={20} style={styles.iconSair}/>
                <Text style={styles.textoSair}> Sair/Desconectar </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botaoPdf}>
                <FontAwesomeIcon icon={faFilePdf} size={25} style={styles.pdf}/>
                <Text style={styles.textoBtn}> Exportar PDF </Text>
            </TouchableOpacity>
            
        
        </View>
    );
}


const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
        flexDirection: 'column',
    },
    areaNome:{
        backgroundColor: '#fff',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomLeftRadius: 57,
        borderBottomRightRadius: 57,
        width: 400,
        height: 172,
        elevation: 5,
        zIndex: 6, // Mantém esta View na frente das outras
    },
    areaFicha:{
        backgroundColor: '#fff',
        borderRadius: 57,
        width: 400,
        height: 172,
        elevation: 5,
        zIndex: 5,
        top: -100,
        flexDirection:'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    areaInfos:{
        backgroundColor: '#fff',
        borderRadius: 57,
        width: 400,
        height: 172,
        elevation: 5,
        zIndex: 4,
        top: -200,
        flexDirection:'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    areaLocalizacao:{
        backgroundColor: '#fff',
        borderRadius: 57,
        width: 400,
        height: 172,
        elevation: 5,
        zIndex: 3,
        top: -300,
        flexDirection:'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    areaHistorico:{
        backgroundColor: '#fff',
        borderRadius: 57,
        width: 400,
        height: 172,
        elevation: 5,
        zIndex: 2,
        top: -400,
        flexDirection:'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
    }, 
    areaSair:{
        backgroundColor: '#fff',
        borderRadius: 57,
        width: 400,
        height: 172,
        elevation: 5,
        zIndex: 1,
        top: -500,
        flexDirection:'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    botaoPdf:{
        width:350,
        height: 47,
        backgroundColor: '#F15642',
        borderRadius: 21,
        zIndex: 0,
        marginTop: -430,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    textoBtn:{
        fontSize: 20,
        color: '#E2E5E7'
    },
    pdf:{
        color: '#E2E5E7',
    },
    icon:{
        marginBottom: 28,
        color: '#000',
        marginRight: 5
    },
    texto:{
        marginBottom: 25,
        color: '#222B45',
        fontSize: 20
    },
    iconSair:{
        marginBottom: 28,
        color: '#FF0000',
        marginRight: 5
    },
    textoSair:{
        marginBottom: 25,
        color: '#FF0000',
        fontSize: 20
    },
})