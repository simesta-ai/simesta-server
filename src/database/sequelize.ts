import { Model, ModelStatic, Sequelize } from "sequelize";
import UserScheme from "./models/user.model";
import dotenv from 'dotenv';

// CONFIGURE ENVIRONMENT VARIABLES
dotenv.config();

class SequelizeService {
  sequelize: Sequelize;
  public userModel: ModelStatic<Model<any, any>>;

  constructor() {
    this.sequelize = new Sequelize(
      process.env.DB_NAME as string,
      process.env.DB_USER as string,
      process.env.DB_PASSWORD as string,
      {
        host: process.env.DB_HOST as string,
        dialect: "mssql",
        dialectOptions: {
          encrypt: true,
        },
        port: process.env.DB_PORT as unknown as number,
        logging: false,
      }
    );
    this.userModel = this.sequelize.define("User", UserScheme);
  }
}

const sequelizeService = new SequelizeService();
const models = {
  user: sequelizeService.userModel,
};

export { sequelizeService, models };
