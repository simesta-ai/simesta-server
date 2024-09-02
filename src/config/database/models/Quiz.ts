import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
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

  @HasMany(() => Option)
  declare options: Option[];

  @HasMany(() => Answer)
  declare answers: Answer[];


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

@Table({
  timestamps: true,
  tableName: 'options',
  modelName: 'Option',
})
export class Option extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare text: string;

  @ForeignKey(() => Quiz)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare quizId: string;

  @BelongsTo(() => Quiz)
  declare quiz: Quiz;

}

@Table({
  timestamps: true,
  tableName: 'answers',
  modelName: 'Answer',
})
export class Answer extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare text: string;

  @ForeignKey(() => Quiz)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare quizId: string;

  @BelongsTo(() => Quiz)
  declare quiz: Quiz;

}

export default Quiz
