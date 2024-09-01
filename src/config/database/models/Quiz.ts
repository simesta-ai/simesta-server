import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript'
import IdeaContent from './IdeaContent'
import { IQuiz } from '../../../types'

@Table({
  timestamps: false,
  tableName: 'quizzes',
  modelName: 'Quiz',
})
class Quiz extends Model<IQuiz> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare question: string

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    defaultValue: [],
  })
  declare options: string[]

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    defaultValue: [],
  })
  declare answer: string[]

  @Column({
    type: DataType.STRING,
    defaultValue: '',
  })
  declare explanation: string

  @ForeignKey(() => IdeaContent)
  @Column({
    type: DataType.UUID,
  })
  declare IdeaContentId: string

  @BelongsTo(() => IdeaContent)
  declare ideaContent: IdeaContent
}

export default Quiz
