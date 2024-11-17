import * as SQLite from "expo-sqlite";

export const inicializaco = {
    getConnection: () => SQLite.openDatabaseSync("remediosja.db")
};

export default inicializaco;
