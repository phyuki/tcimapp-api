'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('scidanswers', 'answer', {
      type: Sequelize.STRING,
      allowNull: true,
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      "UPDATE scidanswers SET answer = '' WHERE answer IS NULL"
    );
    
    await queryInterface.changeColumn('scidanswers', 'answer', {
      type: Sequelize.STRING, 
      allowNull: false, 
    });
  }
};
