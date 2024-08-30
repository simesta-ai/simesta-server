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

const CourseSchema = {
  category: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    default: '',
  },
  completed: {
    type: Boolean,
    default: false,
  },
  inProgress: {
    type: Boolean,
    default: false,
  },
  courseType: {
    type: String,
    default: '',
  },
  difficultyLevel: {
    type: String,
    default: '',
  },
  notes: {
    type: String,
    default: '',
  },
  courseFiles: {
    type: [String],
    default: [],
  },
}

@Table({
  timestamps: true,
  tableName: 'courses',
  modelName: 'Course',
})
class Course extends Model {
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
  declare descriiption: string

  @HasOne(() => User)
  declare user: User

  @CreatedAt
  declare createdAt: Date

  @UpdatedAt
  declare updatedAt: Date
}

export default Course

// Compare this snippet from src/config/database/models/User.ts:
