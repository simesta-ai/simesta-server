import {
  Table,
  Model,
  Column,
  ForeignKey,
  BelongsTo,
  HasOne,
  DataType,
} from 'sequelize-typescript'
import Course from './Course' // assuming you have a Course model defined elsewhere

@Table
class Topic extends Model<Topic> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare title: string

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare position: number

  @ForeignKey(() => Course)
  @Column({
    type: DataType.UUID,
    references: {
      model: Course,
      key: 'id',
    },
  })
  declare courseId: string

  @BelongsTo(() => Course)
  declare course: Course

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare completed: boolean

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare inProgress: boolean

  @Column({
    type: DataType.UUID,
    references: {
      model: Topic,
      key: 'id',
    },
  })
  declare nextTopicId: string

  @Column({
    type: DataType.UUID,
    references: {
      model: Topic,
      key: 'id',
    },
  })
  declare prevTopicId: string
}

export default Topic
