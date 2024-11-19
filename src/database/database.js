import AsyncStorage from "@react-native-async-storage/async-storage";
import { inicializaco } from "./inicializacao";

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
            cpf TEXT NOT NULL,
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

    try {

        const resultUsuarioCompleto = await db.runAsync(`UPDATE tbl_Usuario_Completo SET telefone_residencial = ? WHERE cpf = ?`, telefone, cpf);
        
        if(resultUsuarioCompleto.changes > 0){
            const resultUsuario = await db.runAsync(`UPDATE tbl_Usuario SET telefone = ?, email = ? WHERE cpf = ?`, telefone, email, cpf);

            if(resultUsuario.changes > 0){
                const inserir = await db.runAsync(`INSERT INTO login VALUES (?, ?)`, senha, email);
            }
        }

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

    console.log(email);
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

export const deletarUsuario = async (id) => {
    const db = inicializaco.getConnection();

    try {
        // Inicia uma transação
        await db.runAsync('BEGIN TRANSACTION');

        // Exclui registros dependentes
        await db.runAsync(`DELETE FROM tbl_Ficha_Medica WHERE id_usuario = ?`, [id]);
        await db.runAsync(
            `DELETE FROM login 
             WHERE tbl_Usuario_email = (SELECT email FROM tbl_Usuario WHERE id = ?)`,
            [id]
        );
        await db.runAsync(
            `DELETE FROM tbl_Usuario_Completo 
             WHERE cpf = (SELECT cpf FROM tbl_Usuario WHERE id = ?)`,
            [id]
        );
        await db.runAsync(
            `DELETE FROM tbl_Endereco 
             WHERE id_endereco = (
                 SELECT tbl_Endereco_id_endereco 
                 FROM tbl_Usuario_Completo 
                 WHERE cpf = (SELECT cpf FROM tbl_Usuario WHERE id = ?)
             )`,
            [id]
        );

        // Exclui o usuário principal
        await db.runAsync(`DELETE FROM tbl_Usuario WHERE id = ?`, [id]);

        // Confirma a transação
        await db.runAsync('COMMIT');
        console.log('Usuário deletado com sucesso!');

        return true;
    } catch (error) {
        // Em caso de erro, desfaz a transação
        await db.runAsync('ROLLBACK');
        console.error('Erro ao deletar usuário:', error.message);
        throw error; // Repassa o erro para o chamador
    }
};


export const verificarSeUsuarioExiste = async (email) => {
    const db = inicializaco.getConnection();

    const firstRow = await db.getFirstAsync(`SELECT tbl_Usuario_email FROM login WHERE tbl_Usuario_email = ?`, email);
    
    if (firstRow && firstRow.tbl_Usuario_email) {
        return true;  // Usuário encontrado
    } else {
        return false;  // Usuário não encontrado
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

export const redefinirEmail = async (email, novoEmail, senha) => {
    const db = inicializaco.getConnection();

    try {

        const cpf = await obterCpf(email);
        

        const result = await db.runAsync(`UPDATE login SET tbl_Usuario_email = ? WHERE tbl_Usuario_email = ? and senha = ?`, novoEmail, email, senha);
        
        if(result.changes > 0){
            console.log('Login alterado com sucesso!!');

            const id = await obterIdUsuario(cpf);

            console.log(id);

            const resultUsuario = await db.runAsync(`UPDATE tbl_Usuario SET email = ? WHERE id = ?`, novoEmail, id);        
        
            if(resultUsuario.changes > 0){
                return true;
            }else{
                return false;
            }
        }else{
            console.log('Login não foi alterado!!');
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
            await AsyncStorage.setItem('nome', firstRow.nomeCompleto);
            await AsyncStorage.setItem('cpf', firstRow.cpf);
            await AsyncStorage.setItem('telefone', firstRow.telefone);
            await AsyncStorage.setItem('email', firstRow.email);
        }else{
            console.log('Erro 1 ao pegar dados!!');
            certo =  false;
        }

        const secondRow = await db.getFirstAsync(`SELECT cpf, rg, sexo_biologico, data_nascimento, cep, estado_civil FROM tbl_Usuario_Completo WHERE cpf = ?`, cpf);
        
        console.log(secondRow);

        if(secondRow.cpf === cpf){
            await AsyncStorage.setItem('rg', secondRow.rg);
            await AsyncStorage.setItem('sexo_biologico', secondRow.sexo_biologico);
            await AsyncStorage.setItem('data_nascimento', secondRow.data_nascimento);
            await AsyncStorage.setItem('cep', secondRow.cep);
            await AsyncStorage.setItem('estado_civil', secondRow.estado_civil);
        }else{
            console.log('Erro 2 ao pegar dados!!');
            certo =  false;
        }

        const thirdRow = await db.getFirstAsync(`SELECT id_usuario, idade, tipo_sanguineo, doencas_cronicas, doador, gravida, data_gravidez FROM tbl_Ficha_Medica WHERE id_usuario = ?`, id);
        
        console.log(thirdRow);

        if(thirdRow.id_usuario === id){
            await AsyncStorage.setItem('idade', JSON.stringify(thirdRow.idade));
            await AsyncStorage.setItem('tipo_sanguineo', thirdRow.tipo_sanguineo);
            await AsyncStorage.setItem('doencas_cronicas', thirdRow.doencas_cronicas);
            await AsyncStorage.setItem('doador', thirdRow.doador);
            await AsyncStorage.setItem('gravida', thirdRow.gravida);
            await AsyncStorage.setItem('data_gravidez', thirdRow.data_gravidez);
        }else{
            console.log('Erro 3 ao pegar dados!!');
            certo =  false;
        }

        return certo;
    
    } catch (error) {
       console.error('Erro ao inserir dados:', error);
    }       
}


export const alterarDadosGerais = async (id, nome, dataNascimento, genero, estadoCivil, cpf, rg, telefone, idade) => {
    const db = inicializaco.getConnection();
    let sucesso = true;

    try {
        // Atualizar Nome
        if (nome) {
            const result = await db.runAsync(`UPDATE tbl_Usuario SET nomeCompleto = ? WHERE id = ?`, [nome, id]);
            if (result.changes > 0) {
                console.log('Nome modificado!');
                await AsyncStorage.setItem('nome', nome);
            } else {
                console.log('Não foi possível modificar o nome!');
                sucesso = false;
            }
        }

        // Atualizar Data de Nascimento e Idade
        if (dataNascimento) {
            const email = await AsyncStorage.getItem('email');
            const cpfAtual = await obterCpf(email);

            const result = await db.runAsync(
                `UPDATE tbl_Usuario_Completo SET data_nascimento = ? WHERE cpf = ?`,
                [dataNascimento, cpfAtual]
            );
            if (result.changes > 0) {
                console.log('Data de nascimento modificada!');
                await AsyncStorage.setItem('data_nascimento', dataNascimento);

                if (idade) {
                    const resultIdade = await db.runAsync(
                        `UPDATE tbl_Ficha_Medica SET idade = ? WHERE id_usuario = ?`,
                        [idade, id]
                    );
                    if (resultIdade.changes > 0) {
                        console.log('Idade modificada!');
                        await AsyncStorage.setItem('idade', JSON.stringify(idade));
                    } else {
                        console.log('Não foi possível modificar a idade!');
                        sucesso = false;
                    }
                }
            } else {
                console.log('Não foi possível modificar a data de nascimento!');
                sucesso = false;
            }
        }

        // Atualizar Gênero
        if (genero) {
            const resultGenero = await db.runAsync(
                `UPDATE tbl_Ficha_Medica SET sexo_biologico = ? WHERE id_usuario = ?`,
                [genero, id]
            );
            if (resultGenero.changes > 0) {
                console.log('Gênero modificado!');
                await AsyncStorage.setItem('sexo_biologico', genero);

                const cpfAtual = await obterCpf(await AsyncStorage.getItem('email'));
                await db.runAsync(
                    `UPDATE tbl_Usuario_Completo SET sexo_biologico = ? WHERE cpf = ?`,
                    [genero, cpfAtual]
                );
            } else {
                console.log('Não foi possível modificar o gênero!');
                sucesso = false;
            }
        }

        // Atualizar Estado Civil
        if (estadoCivil) {
            const cpfAtual = await obterCpf(await AsyncStorage.getItem('email'));
            const resultEstadoCivil = await db.runAsync(
                `UPDATE tbl_Usuario_Completo SET estado_civil = ? WHERE cpf = ?`,
                [estadoCivil, cpfAtual]
            );
            if (resultEstadoCivil.changes > 0) {
                console.log('Estado civil modificado!');
                await AsyncStorage.setItem('estado_civil', estadoCivil);
            } else {
                console.log('Não foi possível modificar o estado civil!');
                sucesso = false;
            }
        }

        // Atualizar RG
        if (rg) {
            const cpfAtual = await obterCpf(await AsyncStorage.getItem('email'));
            const resultRg = await db.runAsync(
                `UPDATE tbl_Usuario_Completo SET rg = ? WHERE cpf = ?`,
                [rg, cpfAtual]
            );
            if (resultRg.changes > 0) {
                console.log('RG modificado!');
                await AsyncStorage.setItem('rg', rg);
            } else {
                console.log('Não foi possível modificar o RG!');
                sucesso = false;
            }
        }

        // Atualizar Telefone
        if (telefone) {
            const cpfAtual = await obterCpf(await AsyncStorage.getItem('email'));
            const resultTelefone = await db.runAsync(
                `UPDATE tbl_Usuario_Completo SET telefone_residencial = ? WHERE cpf = ?`,
                [telefone, cpfAtual]
            );
            if (resultTelefone.changes > 0) {
                console.log('Telefone modificado!');
                await db.runAsync(`UPDATE tbl_Usuario SET telefone = ? WHERE id = ?`, [telefone, id]);
                await AsyncStorage.setItem('telefone', telefone);
            } else {
                console.log('Não foi possível modificar o telefone!');
                sucesso = false;
            }
        }

        // Atualizar CPF
        if (cpf) {
            const cpfAtual = await obterCpf(await AsyncStorage.getItem('email'));
            const resultCpf = await db.runAsync(
                `UPDATE tbl_Usuario_Completo SET cpf = ? WHERE cpf = ?`,
                [cpf, cpfAtual]
            );
            if (resultCpf.changes > 0) {
                console.log('CPF modificado!');
                await db.runAsync(`UPDATE tbl_Usuario SET cpf = ? WHERE id = ?`, [cpf, id]);
                await AsyncStorage.setItem('cpf', cpf);
            } else {
                console.log('Não foi possível modificar o CPF!');
                sucesso = false;
            }
        }
    } catch (error) {
        console.error('Erro ao atualizar os dados:', error);
        sucesso = false;
    }

    return sucesso;
};


export const alterarDadosMedicos = async (tipoSanguineo, doencasCronicas, doador, gravidez, tempoGravidez, id) => {
    const db = inicializaco.getConnection();
    let sucesso = true; // Inicializa como verdadeiro

    try {
        if (tipoSanguineo !== "") {
            const result = await db.runAsync(
                `UPDATE tbl_Ficha_Medica SET tipo_sanguineo = ? WHERE id_usuario = ?`,
                tipoSanguineo,
                id
            );

            if (result.changes > 0) {
                console.log("Tipo sanguíneo atualizado!");
                await AsyncStorage.setItem("tipo_sanguineo", tipoSanguineo);
            } else {
                console.log("Falha ao atualizar o tipo sanguíneo.");
                sucesso = false;
            }
        }

        if (doencasCronicas !== "") {
            const result = await db.runAsync(
                `UPDATE tbl_Ficha_Medica SET doencas_cronicas = ? WHERE id_usuario = ?`,
                doencasCronicas,
                id
            );

            if (result.changes > 0) {
                console.log("Doenças crônicas atualizadas!");
                await AsyncStorage.setItem("doencas_cronicas", doencasCronicas);
            } else {
                console.log("Falha ao atualizar doenças crônicas.");
                sucesso = false;
            }
        }

        if (doador !== "") {
            const result = await db.runAsync(
                `UPDATE tbl_Ficha_Medica SET doador = ? WHERE id_usuario = ?`,
                doador,
                id
            );

            if (result.changes > 0) {
                console.log("Doador atualizado!");
                await AsyncStorage.setItem("doador", doador);
            } else {
                console.log("Falha ao atualizar doador.");
                sucesso = false;
            }
        }

        if (gravidez !== "") {
            const result = await db.runAsync(
                `UPDATE tbl_Ficha_Medica SET gravida = ? WHERE id_usuario = ?`,
                gravidez,
                id
            );

            if (result.changes > 0) {
                console.log("Gravidez atualizada!");
                await AsyncStorage.setItem("gravida", gravidez);
            } else {
                console.log("Falha ao atualizar gravidez.");
                sucesso = false;
            }
        }

        if (tempoGravidez !== "") {
            const result = await db.runAsync(
                `UPDATE tbl_Ficha_Medica SET data_gravidez = ? WHERE id_usuario = ?`,
                tempoGravidez,
                id
            );

            if (result.changes > 0) {
                console.log("Tempo de gravidez atualizado!");
                await AsyncStorage.setItem("data_gravidez", tempoGravidez);
            } else {
                console.log("Falha ao atualizar tempo de gravidez.");
                sucesso = false;
            }
        }
    } catch (error) {
        console.error("Erro ao atualizar os dados médicos:", error);
        sucesso = false; // Se algum erro ocorrer, indica falha
    }

    return sucesso;
};
