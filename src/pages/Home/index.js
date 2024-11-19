import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Home(){

  const navigation = useNavigation();

    return(
      <View style={styles.container}>

      <Image 
        source={require('../../assets/logo.png')}
        style={styles.logo}
      />

      <Image 
        source={require('../../assets/imagemInicio.png')}
        style={styles.img}
      />

      
        <TouchableOpacity style={styles.btnGoogle}>
          <Image 
            source={require('../../assets/google.png')}
            style={styles.imgGoogle}
          />

          <Text style={styles.btnTexto}> Entre com o Google </Text>

        </TouchableOpacity>

        <TouchableOpacity style={styles.btnLogin} onPress={ () => navigation.navigate('Login') }>
          
          <Text style={styles.btnTexto2}> Faça Login/Cadastre-se </Text>

        </TouchableOpacity>
      
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
  btnGoogle:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderRadius: 21,
    width: 350,
    height: 47,
    borderColor: 'gray'
  },
  imgGoogle:{
    width: 32,
    height: 32,
    margin: 3
  },
  btnLogin:{
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00B383',
    borderWidth: 1,
    borderRadius: 21,
    width: 350,
    height: 47,
    borderColor: 'gray'
  },
  btnTexto2:{
    color: '#fff',
    fontSize: 18
  },
  btnTexto:{
    color: '#282828',
    fontSize: 18,
  }
});
