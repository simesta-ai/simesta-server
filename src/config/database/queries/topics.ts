import { Sequelize } from 'sequelize-typescript'

export const addTopicContraints = (dbConnection: Sequelize) => {
  dbConnection.query(`
  ALTER TABLE Topics
  ADD CONSTRAINT FK_Topics_nextTopicId FOREIGN KEY (nextTopicId) REFERENCES Topics (id);

  ALTER TABLE Topics
  ADD CONSTRAINT FK_Topics_prevTopicId FOREIGN KEY (prevTopicId) REFERENCES Topics (id);
`)
}
