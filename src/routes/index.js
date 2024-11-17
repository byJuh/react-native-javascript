import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from '../pages/Login';
import Cadastro from '../pages/Cadastro';
import TelaIncial from '../pages/Home';
import CadastroInicial from '../pages/Cadastro_geral';
import CadastroEndereco from '../pages/Cadastro_endereco';
import CadastroFicha from '../pages/Cadastro_ficha';
import Tabs from '../Tabs'; // Importando o componente Tabs para a navegação de abas
import Receituario from '../pages/Receituario';
import DadosPerfil from '../pages/DadoPerfil';
import TermoPrivacidade from '../pages/TermoPrivacidade'
import AlterarSenha from '../pages/AlterarDados/alterarSenha'
import AlterarEmail from '../pages/AlterarDados/alterarEmail'

const Stack = createNativeStackNavigator();

export default function Rotas() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name='TelaInicial' 
                component={TelaIncial} 
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name='Login' 
                component={Login} 
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name='CadastroInicial' 
                component={CadastroInicial} 
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name='Receituario' 
                component={Receituario} 
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name='Cadastro' 
                component={Cadastro} 
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name='DadosPerfil' 
                component={DadosPerfil} 
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name='CadastroEndereco' 
                component={CadastroEndereco} 
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name='CadastroFicha' 
                component={CadastroFicha} 
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name='TermoPrivacidade' 
                component={TermoPrivacidade} 
                options={{ headerShown: false }} 
            />
            <Stack.Screen
                name='AlterarSenha' 
                component={AlterarSenha} 
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name='AlterarEmail' 
                component={AlterarEmail} 
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name='Tabs' 
                component={Tabs} 
                options={{ headerShown: false }} 
            />
        </Stack.Navigator>
    );
}
