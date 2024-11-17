import * as SQLite from "expo-sqlite";

export const inicializaco = {
    getConnection: () => SQLite.openDatabaseSync("remediosja.db")
};
<<<<<<< HEAD
=======

export default inicializaco;
>>>>>>> 23d1e68 (arrumandoBD)
