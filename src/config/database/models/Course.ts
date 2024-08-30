import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  BeforeCreate,
  HasMany,
  HasOne,
} from 'sequelize-typescript'
import User from './User'
import { ICourse } from '../../../types'

@Table({
  timestamps: true,
  tableName: 'courses',
  modelName: 'Course',
})
class Course extends Model<ICourse> {
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
  declare title: string

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    defaultValue: '',
  })
  declare description: string

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  })
  declare completed: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  declare inProgress: boolean

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    defaultValue: '',
  })
  declare courseType: string

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    defaultValue: '',
  })
  declare difficultyLevel: string

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    defaultValue: '',
  })
  declare notes: string

  @Column({
    type: DataType.ARRAY,
    allowNull: true,
    defaultValue: '',
  })
  declare courseFiles: string[]

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare img: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare category: string

  @HasOne(() => User)
  declare user: User

  @CreatedAt
  declare createdAt: Date

  @UpdatedAt
  declare updatedAt: Date
}

export default Course

// Compare this snippet from src/config/database/models/User.ts:
