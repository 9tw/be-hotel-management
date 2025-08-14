const { room } = require("../models");

const index = async (req, res) => {
  try {
    const rooms = await room.findAll({
      order: [["id", "ASC"]],
    });

    if (!rooms || rooms.length === 0) {
      return res.status(200).send({
        message: "Room still empty",
        result: [],
      });
    }

    return res.status(200).send({
      message: "Sucessfully fetched rooms.",
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
};
