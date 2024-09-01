import {
    Column,
    Model,
    Table,
    DataType,
    ForeignKey,
    BelongsTo,
    HasMany,
  } from 'sequelize-typescript';
  import { Optional } from 'sequelize';
  import Lecture from './Lecture'; // Assuming you have a Lecture model
  import Quiz from './Quiz'; // Import the Quiz model
  
  interface IdeaContentAttributes {
    id: string;
    text: string;
    image: string;
    quizzes: Quiz[];
  }
  
  
  @Table({
    timestamps: false,
    tableName: 'idea_contents',
    modelName: 'IdeaContent',
  })
  class IdeaContent extends Model<IdeaContentAttributes> {
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
  
    @Column({
      type: DataType.STRING,
      defaultValue: '',
    })
    declare image: string;
  
    @HasMany(() => Quiz)
    declare quizzes: Quiz[];
  
    @ForeignKey(() => Lecture)
    @Column({
      type: DataType.UUID,
    })
    declare lectureId: string;
  
    @BelongsTo(() => Lecture)
    declare lecture: Lecture;
  }
  
  export default IdeaContent;