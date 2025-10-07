"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      booking.belongsTo(models.room, {
        foreignKey: "room_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  booking.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      room_id: DataTypes.INTEGER,
      name: DataTypes.STRING,
      guest: DataTypes.INTEGER,
      from: DataTypes.DATE,
      to: DataTypes.DATE,
      notes: DataTypes.STRING,
      status: DataTypes.INTEGER,
      created_by: DataTypes.STRING,
      updated_by: DataTypes.STRING,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
      deleted_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "booking",
      tableName: "bookings",
      timestamps: true,
      paranoid: true,
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );
  return booking;
};
