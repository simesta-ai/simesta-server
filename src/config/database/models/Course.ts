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
  ForeignKey,
} from 'sequelize-typescript'
import User from './User'
import { ICourse } from '../../../types'

@Table({
  timestamps: true,
  tableName: 'course_files',
  modelName: 'CourseFile',
})
export class CourseFile extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare url: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare fileUrl: string

  @ForeignKey(() => Course)
  declare courseId: number
}

@Table({
  timestamps: true,
  tableName: 'courses',
  modelName: 'Course',
})
class Course extends Model<ICourse> {
  /**
   * Unique identifier for the course.
   *
   * @type {string}
   * @example '123e4567-e89b-12d3-a456-426655440000'
   */
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

  @HasMany(() => CourseFile)
  declare courseFiles: CourseFile[]

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

  @ForeignKey(() => User)
  declare user: string
  //   @HasOne(() => User)
  //   declare user: User

  @CreatedAt
  declare createdAt: Date

  @UpdatedAt
  declare updatedAt: Date
}

export default Course
