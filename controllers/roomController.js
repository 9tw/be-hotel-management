const { Op, Sequelize } = require("sequelize");
const { room, booking } = require("../models");

const index = async (req, res) => {
  try {
    const rooms = await room.findAll({ order: [["id", "ASC"]] });
    if (!rooms || rooms.length === 0) {
      return res.status(200).send({ message: "Room still empty", result: [] });
    }
    return res
      .status(200)
      .send({ message: "Sucessfully fetched rooms.", result: rooms });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const getRoomFilter = async (req, res) => {
  try {
    const { from, to } = req.query;

    const fromChange = new Date(from);
    fromChange.setDate(fromChange.getDate() + 1);

    const rooms = await room.findAll({
      include: [
        {
          model: booking,
          as: "bookings",
          required: false,
          where: {
            [Op.and]: [
              { from: { [Op.lte]: new Date(to) } },
              { to: { [Op.gte]: fromChange } },
            ],
          },
        },
      ],
      where: {
        status: { [Op.notIn]: [2, 3] },
        [Op.and]: Sequelize.where(Sequelize.col("bookings.id"), null),
      },
      order: [["id", "ASC"]],
    });

    if (!rooms || rooms.length === 0) {
      return res.status(200).send({ message: "Room still empty", result: [] });
    }
    return res
      .status(200)
      .send({ message: "Sucessfully fetched rooms.", result: rooms });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const getAllRoomPagination = async (req, res) => {
  try {
    // get page & limit from query params, default: page=1, limit=10
    let { page, limit } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    // find with pagination
    const { count, rows } = await room.findAndCountAll({
      order: [["id", "ASC"]],
      limit,
      offset,
    });

    if (!rows || rows.length === 0) {
      return res.status(200).send({
        message: "Room still empty",
        result: [],
        pagination: {
          total: count,
          page,
          limit,
          totalPages: Math.ceil(count / limit),
        },
      });
    }

    return res.status(200).send({
      message: "Successfully fetched rooms.",
      result: rows,
      pagination: {
        total: count, // total number of rooms
        page, // current page
        limit, // items per page
        totalPages: Math.ceil(count / limit), // total pages
      },
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const getAllRoomName = async (req, res) => {
  try {
    const rooms = await room.findAll({
      attributes: ["name"],
      order: [["id", "ASC"]],
      raw: true,
    });

    if (!rooms || rooms.length === 0) {
      return res.status(200).send({
        message: "Room still empty",
        result: [],
      });
    }

    return res.status(200).send({
      message: "Sucessfully fetched rooms name.",
      result: rooms,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { ...other } = req.body;

    const data = await room.create({ ...other });

    return res.status(200).json({
      success: true,
      message: "Sucessfully created room.",
      data: data,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { ...other } = req.body;

    const data = await room.findByPk(id);
    if (!data) {
      return res.status(404).send({ message: "Room not found." });
    }

    const updateData = { ...other };

    await data.update(updateData);

    return res.status(200).json({
      success: true,
      message: "Sucessfully updated room.",
      data: data,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const destroy = async (req, res) => {
  try {
    const { id } = req.params;

    await room.destroy({ where: { id } });

    return res.status(200).send({
      message: "Sucessfully deleted room.",
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

module.exports = {
  index,
  create,
  update,
  destroy,
  getAllRoomName,
  getAllRoomPagination,
  getRoomFilter,
};
