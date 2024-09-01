import {
    Column,
    Model,
    Table,
    DataType,
    HasMany,
  } from 'sequelize-typescript';
  import IdeaContent from './IdeaContent'; // Assuming you have an IdeaContent model
  import { ILecture } from '../../../types';

  
  @Table({
    timestamps: true,
    tableName: 'lectures',
    modelName: 'Lecture',
  })
  class NewLecture extends Model<ILecture> {
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
    declare title: string;
  
    @Column({
      type: DataType.ARRAY(DataType.STRING),
      defaultValue: [],
    })
    declare videos: string[];
  
    @HasMany(() => IdeaContent)
    declare ideas: IdeaContent[];
  }
  
  export default NewLecture;