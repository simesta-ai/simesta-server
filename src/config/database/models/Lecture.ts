import {
    Column,
    Model,
    Table,
    DataType,
    HasMany,
    ForeignKey,
    BelongsTo,
  } from 'sequelize-typescript';
  import IdeaContent from './IdeaContent'; // Assuming you have an IdeaContent model
  import { ILecture } from '../../../types';


  @Table({
    timestamps: true,
    tableName: 'videos',
    modelName: 'Video',
  })
  export class Video extends Model {
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
    declare videoId: string;
  
    @ForeignKey(() => Lecture)
    @Column({
      type: DataType.UUID,
      allowNull: false,
    })
    declare lectureId: string;
  
  }
  


  
  @Table({
    timestamps: true,
    tableName: 'lectures',
    modelName: 'Lecture',
  })
  class Lecture extends Model<ILecture> {
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
  
    @HasMany(() => IdeaContent)
    declare ideas: IdeaContent[];

    @HasMany(() => Video)
    declare videos: Video[];
  }
  
  export default Lecture;