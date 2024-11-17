import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Rotas from './src/routes/index'; // Importando o sistema de rotas
import { criandoTabelas } from './src/database/database';
import { inicializaco } from './src/database/inicializacao'; // Certifique-se de que o caminho está correto
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin'; // Importando o Drizzle Studio

export default function App() {
  const [db, setDb] = useState(null);

  // Sempre chamamos o hook, mas passamos o db quando estiver pronto
  useDrizzleStudio(db);

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        await criandoTabelas(); // Aguarda a criação das tabelas
        console.log('Banco de dados inicializado com sucesso!');

        const dbConnection = inicializaco.getConnection(); // Obtém a conexão com o banco de dados
        setDb(dbConnection); // Atualiza o estado com a conexão do banco
      } catch (error) {
        console.error('Erro ao inicializar o banco de dados:', error);
      }
    };

    setupDatabase();
  }, []); // O efeito é executado uma vez quando o componente é montado

  return (
    <NavigationContainer>
      <Rotas />
    </NavigationContainer>
  );
}
