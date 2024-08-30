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

interface IUser {
  id?: string
  firstName: string
  lastName?: string
  email: string
  password: string
}

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
    unique: false,
  })
  declare firstName: string
  /**
   * This is the column for the first name
   *
   * @property lastName
   */
  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: false,
    defaultValue: '',
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

export default User

User.findOne({})
