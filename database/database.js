const sql = require('mssql');
// const config = require('../config/config');

// const database = async () => {
//     try {
//         await sql.connect(config);
//         console.log('Connected to the database successfully!');
//     } catch (err) {
//         console.error('Failed to connect to the database:', err);
//     } finally {
//         await sql.close();
//     }
// }

class Database {
    config = {};
    poolconnection = null;
    connected = false;

    constructor(config){
        this.config = config;
        console.log(`Database: Config: ${JSON.stringify(config)}`);
    }
    async connect(){
        try{
            console.log(`Database connecting....${this.connected}`);
            if(this.connected === false){
                this.poolconnection = await sql.connect(this.config);
                this.connected = true;
                console.log('Database connection successful');
            } else {
                console.log('Database already connected')
            }
            // await sql.connect(config);
            // console.log('Connected to db successfully');

        } catch(error){
            console.error(`Error connecting to database: ${JSON.stringify(error)}`);
        }
    }

    async disconnect(){
        try{
            this.poolconnection.close();
            console.log('Database connection closed');
        } catch(error){
            console.log(`Error closing database ${error}`);
        }
    }

}

module.exports = Database;