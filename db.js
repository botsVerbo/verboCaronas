import { Sequelize, DataTypes } from "sequelize";
import mysql2 from "mysql2";
import * as dotenv from 'dotenv';
dotenv.config();

const database = process.env.DATABASE
const password = process.env.PASSWORD
const databaseUser = process.env.USER

export const connect = new Sequelize(database, databaseUser, password, {
  host: "localhost",
  dialect: "mysql",
  dialectModule: mysql2,
  logging: false
});

connect.authenticate().then(() => console.log('conexão feita com sucesso'))

export const User = connect.define("User", {
  name: {
    type: Sequelize.STRING,
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  cep: {
    type: Sequelize.STRING,
  },
  lastMessageCode: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  role: {
    type: DataTypes.ENUM("passenger", "driver"),
    allowNull: false,
    defaultValue: "passenger",
  },
  neighborhood: {
    type: Sequelize.STRING,
  }
});

export const Addresses = connect.define("Addresses", {
  name: {
    type: Sequelize.STRING
  },
  startPoint: {
    type: Sequelize.STRING
  },
  waypoint: {
    type: Sequelize.STRING
  },
  duration: {
    type: DataTypes.FLOAT
  },
  distance: {
    type: DataTypes.FLOAT
  }
});

export const Driver = connect.define("drivers", {
  increaseTime: {
    type: DataTypes.FLOAT
  }
});

const UserAddresses = connect.define('UserAddress');

User.hasOne(Driver, { foreignKey: 'userId' });
Driver.belongsTo(User, { foreignKey: 'userId' });

User.belongsToMany(Addresses, { through: UserAddresses})
Addresses.belongsToMany(User, { through: UserAddresses })

//sync tables

connect.sync()

await User.sync({ force: false });
await Driver.sync({ force: false })
await Addresses.sync({ force: false })