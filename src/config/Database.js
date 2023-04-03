import Sequelize from "sequelize";

// console.log('df')
// let connectString = "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST   = oracle.wpi.edu)(PORT =1521))(CONNECT_DATA =(SID=ORCL)))"
// const sequelize = new Sequelize({
//   dialect: 'oracle',
//   username:  process.env.Db_user,
//   password:  process.env.Db_pass,
//   dialectOptions: {connectString: connectString}});

const sequelize = new Sequelize(process.env.Db_Name, null, null, {
  dialect: process.env.Db_dialect,
  host: process.env.host,
  username: process.env.Db_user,
  password: process.env.Db_pass,

  logging: false,
  pool: {
    max: 30,
    min: 0,
    idle: 10000,
    acquire: 60000,
  },
});

export default sequelize;
