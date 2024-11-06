import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Rotas from './src/routes/index'; // Importando o sistema de rotas
import { criandoTabelas } from './src/database/database'

export default function App() {

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        await criandoTabelas(); // Aguarda a criação das tabelas
        console.log('Banco de dados inicializado com sucesso!');
      } catch (error) {
        console.error('Erro ao inicializar o banco de dados:', error);
      }
    };

    setupDatabase();
  }, []);

  return (
    <NavigationContainer> 
        <Rotas />
    </NavigationContainer>
  );
  
}


