import { DataTypes } from 'sequelize'
import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  BeforeCreate,
  HasMany,
} from 'sequelize-typescript'

@Table({
  timestamps: true,
  tableName: 'users',
  modelName: 'Travel',
})
export class User extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare firstName: string
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare lastName: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare email: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string

  @CreatedAt
  declare createdAt?: Date

  @UpdatedAt
  declare updatedAt?: Date
}

const UserScheme = {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}

export default UserScheme
