import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript'
import User from './User'

@Table({
  timestamps: true,
  tableName: 'learning_methods',
  modelName: 'LearningMethod',
})
class LearningMethod extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string

  @Column({
    type: DataType.STRING,
  })
  declare name: string

  @ForeignKey(() => User)
  declare uderId: string
}

export default LearningMethod
