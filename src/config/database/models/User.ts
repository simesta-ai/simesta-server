import {
  Column,
  Model,
  Table,
  DataType,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript'

@Table({
  timestamps: true,
  tableName: 'users',
  modelName: 'User',
})
class User extends Model<IUser> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      len: [3, 50],
    },
  })
  declare name: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  })
  declare email: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      len: [8, 255],
    },
  })
  declare password: string
  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: '',
  })
  declare profilePicture: string
  @Column({
    type: DataType.STRING,
    defaultValue: '',
  })
  declare appropriateLMethod: string
  @Column({
    type: DataType.STRING,
    defaultValue: [],
  })
  declare otherLMethods: string[]

  @CreatedAt
  declare createdAt: Date

  @UpdatedAt
  declare updatedAt?: any
}

export default User

export interface IUser {
  id?: string
  name: string
  email: string
  password: string
  profilePicture?: string
  appropriateLMethod?: string
  otherLMethods?: string[]
  createdAt?: Date
  updatedAt?: Date
}
