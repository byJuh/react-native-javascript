import React, {Component} from 'react';
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faGear, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faUniversalAccess } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';

export default function Config(){

    return(
        <View style={styles.container}>
            <View style={styles.areaNome}>
                <FontAwesomeIcon icon={faGear} size={40} style={styles.iconConfig}/>
                <Text style={styles.textoPrincipal}> Configurações </Text>
            </View>

            <TouchableOpacity style={styles.areaFicha}>
                <FontAwesomeIcon icon={faGlobe} size={20} style={styles.icon}/>
                <Text style={styles.texto}> Privacidade e Segurança </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.areaInfos}>
                <FontAwesomeIcon icon={faUser} size={20} style={styles.icon}/>
                <Text style={styles.texto}> Preferências </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.areaLocalizacao}>
                <FontAwesomeIcon icon={faUniversalAccess} size={20} style={styles.icon}/>
                <Text style={styles.texto}> Acessibilidade </Text>   
            </TouchableOpacity>
                
            <TouchableOpacity style={styles.areaHistorico}>
                <FontAwesomeIcon icon={faEnvelope} size={20} style={styles.icon}/>
                <Text style={styles.texto}> Notificações </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.areaSair}>
                <FontAwesomeIcon icon={faXmark} size={20} style={styles.iconSair}/>
                <Text style={styles.textoSair}> Excluir a Conta </Text>
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
        flexDirection:'row',
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
    iconConfig:{
        marginTop: 25,
        marginRight: 5
    },
    textoPrincipal:{
        fontSize: 32,
        color: '#222B45',
        marginTop: 25
    }
})