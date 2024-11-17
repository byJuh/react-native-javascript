import { inicializaco } from "./inicializacao";
import { Storage } from "expo-sqlite/kv-store";

export const criandoTabelas = async () => {
    const db = inicializaco.getConnection();

    // Habilitar as chaves estrangeiras
    try {
        // Habilitar as chaves estrangeiras
        await db.execAsync('PRAGMA foreign_keys = ON;');

        // Criar tabelas
        await criar(db);
        console.log("Tabelas criadas com sucesso!");
    } catch (error) {
        console.error("Erro ao criar tabelas:", error);
    } finally {
        await db.closeAsync(); 
    }
}

export const criar = async (db) => {
    await db.execAsync(
        `CREATE TABLE IF NOT EXISTS tbl_Endereco (
            id_endereco INTEGER PRIMARY KEY,
            rua TEXT NULL,
            numero TEXT NULL,
            complemento TEXT NULL,
            cep TEXT NULL,
            cidade TEXT NULL,
            estado TEXT NULL,
            pais TEXT NULL
        );
        
        CREATE TABLE IF NOT EXISTS tbl_Usuario_Completo (
            cpf TEXT PRIMARY KEY,
            rg TEXT NULL,
            sexo_biologico TEXT NULL,
            telefone_residencial TEXT NULL,
            cep TEXT NULL,
            data_nascimento TEXT NULL,
            estado_civil TEXT NULL,
            tbl_Endereco_id_endereco INTEGER,
            FOREIGN KEY (tbl_Endereco_id_endereco) REFERENCES tbl_Endereco(id_endereco)
        );
        
        CREATE TABLE IF NOT EXISTS tbl_remedios_cadastrados (
            id_remedio INTEGER PRIMARY KEY,
            nome_remedio TEXT NULL,
            principios_ativos TEXT NULL,
            laboratorio TEXT NULL,
            quantidade TEXT NULL,
            tipo_de_venda TEXT NULL,
            restricoes TEXT NULL,
            codigo_de_barras TEXT NULL,
            conservar_em TEXT NULL
        );
        
        CREATE TABLE IF NOT EXISTS tbl_receitas (
            id_receita INTEGER PRIMARY KEY,
            nome_medico TEXT NULL,
            data_recebimento DATE NULL,
            data_validade DATE NULL,
            uso_continuo INTEGER NULL,
            horarios TEXT NULL,
            tbl_remedios_cadastrados_id_remedio INTEGER,
            data_inicio TEXT NULL,
            data_fim TEXT NULL,
            local TEXT NULL,
            FOREIGN KEY (tbl_remedios_cadastrados_id_remedio) REFERENCES tbl_remedios_cadastrados(id_remedio)
        );

        CREATE TABLE IF NOT EXISTS tbl_Usuario (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nomeCompleto TEXT NOT NULL,
            cpf TEXT NOT NULL UNIQUE,
            telefone TEXT,
            email TEXT,
            tbl_Usuario_Completo_cpf TEXT NOT NULL,
            tbl_receitas_id_receitas INT,
            FOREIGN KEY (tbl_Usuario_Completo_cpf) REFERENCES tbl_Usuario_Completo(cpf),
            FOREIGN KEY (tbl_receitas_id_receitas) REFERENCES tbl_Receitas(id_receita)
        );

        CREATE TABLE IF NOT EXISTS tbl_alergias (
            id_usuario INTEGER PRIMARY KEY,
            alergia TEXT NULL,
            grau TEXT NULL,
            FOREIGN KEY (id_usuario) REFERENCES tbl_Usuario(id)
        );

        CREATE TABLE IF NOT EXISTS tbl_Ficha_Medica (
            id_usuario INTEGER PRIMARY KEY,
            idade INTEGER NULL,
            sexo_biologico TEXT NULL,
            tipo_sanguineo TEXT NULL,
            doencas_cronicas TEXT NULL,
            doador TEXT NULL,
            gravida TEXT NULL,
            data_gravidez INTEGER NULL,
            FOREIGN KEY (id_usuario) REFERENCES tbl_Usuario(id)
        );

        CREATE TABLE IF NOT EXISTS login (
            senha TEXT,
            tbl_Usuario_email TEXT NOT NULL,
            FOREIGN KEY (tbl_Usuario_email) REFERENCES tbl_Usuario(email)
        )`,
    );

    console.log('criei!!');
    

}

export const inserindoDadosGeral = async (nomeCompleto, dataDeNascimento, sexo_biologico, estado_civil, cpf, rg, idade) =>{
    const db = inicializaco.getConnection();

    try {

        await db.runAsync(`INSERT INTO tbl_Usuario_Completo (cpf, rg, sexo_biologico, data_nascimento, estado_civil) VALUES (?, ?, ?, ?, ?)`, cpf, rg, sexo_biologico, dataDeNascimento, estado_civil);
       
        const result = await db.runAsync(`INSERT INTO tbl_Usuario (nomeCompleto, cpf, tbl_Usuario_Completo_cpf) VALUES (?, ?, ?)`, nomeCompleto, cpf, cpf);

        console.log(result.lastInsertRowId, result.changes);
        let lastId = result.lastInsertRowId;

        await db.runAsync(`INSERT INTO tbl_Ficha_Medica (id_usuario, idade, sexo_biologico) VALUES (?, ?, ?)`, lastId, idade, sexo_biologico);

        
    } catch (error) {
        console.error('Erro ao inserir dados:', error);
    }
}

export const inserindoDadosEndereco = async (cep, rua, numero, complemento, cidade, estado, pais, cpf) => {
    const db = inicializaco.getConnection();
    try {
        const result = await db.runAsync( `INSERT INTO tbl_Endereco (rua, numero, complemento, cep, cidade, estado, pais) VALUES (?, ?, ?, ?, ?, ?, ?)`, rua, numero, complemento, cep, cidade, estado, pais);
        
        console.log(result.lastInsertRowId, result.changes);
        let lastId = result.lastInsertRowId;

        await db.runAsync(`UPDATE tbl_Usuario_Completo SET tbl_Endereco_id_endereco = ?, cep = ? WHERE cpf = ? `, lastId, cep, cpf);         
        
    } catch (error) {
        console.error('Erro ao inserir dados:', error);
    }
}

export const inserindoDadosFicha = async (tipo_sanguineo, doencas_cronicas, doador, gravida, tempoGravidez, id_usuario) => {
    const db = inicializaco.getConnection();
    try {
        await db.runAsync(`UPDATE tbl_Ficha_Medica SET tipo_sanguineo = ?, doencas_cronicas = ?, doador = ?, gravida = ?, data_gravidez = ? WHERE id_usuario = ?`,
                tipo_sanguineo, doencas_cronicas, doador, gravida, tempoGravidez, id_usuario);
    } catch (error) {
        console.error('Erro ao inserir dados:', error);
    }
}

export const inserindoDadosCadastro = async (cpf, email, senha, telefone) =>{
    const db = inicializaco.getConnection();

    console.log(cpf);
    console.log(email);
    console.log(senha);
    console.log(telefone);

    try {

        const resultUsuarioCompleto = await db.runAsync(`UPDATE tbl_Usuario_Completo SET telefone_residencial = ? WHERE cpf = ?`, telefone, cpf);
        console.log(`Linhas afetadas na tbl_Usuario_Completo: ${resultUsuarioCompleto.changes}`);

        const resultUsuario = await db.runAsync(`UPDATE tbl_Usuario SET telefone = ?, email = ? WHERE cpf = ?`, telefone, email, cpf);
        console.log(`Linhas afetadas na tbl_Usuario: ${resultUsuario.changes}`);

        await db.runAsync(`INSERT INTO login VALUES (?, ?)`, senha, email);


    } catch (error) {
        console.error('Erro ao inserir dados:', error);
    }      
      
}

export const obterIdUsuario = async (cpf) => {
    const db = inicializaco.getConnection();

    const firstRow = await db.getFirstAsync(`SELECT id, cpf FROM tbl_Usuario WHERE cpf = ? `, cpf);

    if (firstRow.cpf === cpf) {
        return firstRow.id;  // Retorna o id encontrado
    } else {
        return null;  // Retorna null caso o CPF não seja encontrado
    }
}

export const obterCpf = async (email) => {
    const db = inicializaco.getConnection();

    const firstRow = await db.getFirstAsync(`SELECT email, cpf FROM tbl_Usuario WHERE email = ? `, email);

    if (firstRow.email === email) {
        return firstRow.cpf;  // Retorna o id encontrado
    } else {
        return null;  // Retorna null caso o CPF não seja encontrado
    }
}

export const obterSenha = async (email) => {
    const db = inicializaco.getConnection();

    const firstRow = await db.getFirstAsync(`SELECT * FROM login WHERE tbl_Usuario_email = ? `, email);

    if (firstRow.tbl_Usuario_email === email) {
        return firstRow.senha;  // Retorna o id encontrado
    } else {
        return null;  // Retorna null caso o CPF não seja encontrado
    }
}

export const login = async (email, senha) => {
    const db = inicializaco.getConnection();

    const firstRow = await db.getFirstAsync(`SELECT * FROM login WHERE tbl_Usuario_email = ? and senha = ?`, email, senha);
    
    if (firstRow.tbl_Usuario_email === email && firstRow.senha === senha) {
        return true;  // Retorna o id encontrado
    } else {
        return false;  // Retorna null caso o CPF não seja encontrado
    }
}

export const redefinirSenha = async (email, senha) => {
    const db = inicializaco.getConnection();

    try {

      const result = await db.runAsync(`UPDATE login SET senha = ? WHERE tbl_Usuario_email = ?`, senha, email);

      if(result.changes > 0){
        return true;
      }else{
        return false;
      }
    } catch (error) {
       console.error('Erro ao inserir dados:', error);
    }       
};

export const obterDadosDoUsuario = async (cpf, id) => {
    const db = inicializaco.getConnection();

    const certo = true;

    try {
        const firstRow = await db.getFirstAsync(`SELECT nomeCompleto, cpf, telefone, email FROM tbl_Usuario WHERE id = ?`, id);
        
        console.log(firstRow);

        if(firstRow.cpf === cpf){
            await Storage.setItem('nome', firstRow.nomeCompleto);
            await Storage.setItem('cpf', firstRow.cpf);
            await Storage.setItem('telefone', firstRow.telefone);
            await Storage.setItem('email', firstRow.email);
        }else{
            console.log('Erro 1 ao pegar dados!!');
            certo =  false;
        }

        const secondRow = await db.getFirstAsync(`SELECT cpf, rg, sexo_biologico, data_nascimento, cep, estado_civil FROM tbl_Usuario_Completo WHERE cpf = ?`, cpf);
        
        console.log(secondRow);

        if(secondRow.cpf === cpf){
            await Storage.setItem('rg', secondRow.rg);
            await Storage.setItem('sexo_biologico', secondRow.sexo_biologico);
            await Storage.setItem('data_nascimento', secondRow.data_nascimento);
            await Storage.setItem('cep', secondRow.cep);
            await Storage.setItem('estado_civil', secondRow.estado_civil);
        }else{
            console.log('Erro 2 ao pegar dados!!');
            certo =  false;
        }

        const thirdRow = await db.getFirstAsync(`SELECT id_usuario, idade, tipo_sanguineo, doencas_cronicas, doador, gravida, data_gravidez FROM tbl_Ficha_Medica WHERE id_usuario = ?`, id);
        
        console.log(thirdRow);

        if(thirdRow.id_usuario === id){
            await Storage.setItem('idade', thirdRow.idade);
            await Storage.setItem('tipo_sanguineo', thirdRow.tipo_sanguineo);
            await Storage.setItem('doencas_cronicas', thirdRow.doencas_cronicas);
            await Storage.setItem('doador', thirdRow.doador);
            await Storage.setItem('gravida', thirdRow.gravida);
            await Storage.setItem('data_gravidez', thirdRow.data_gravidez);
        }else{
            console.log('Erro 3 ao pegar dados!!');
            certo =  false;
        }

        return certo;
    
    } catch (error) {
       console.error('Erro ao inserir dados:', error);
    }       
}