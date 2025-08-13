const { booking } = require("../models");

const index = async (req, res) => {
  try {
    const bookings = await booking.findAll();

    if (!bookings || bookings.length === 0) {
      return res.status(200).send({
        message: "Booking still empty",
        result: [],
      });
    }

    return res.status(200).send({
      message: "Sucessfully fetched bookings.",
      result: bookings,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { ...other } = req.body;

    const data = await booking.create({ ...other });

    return res.status(200).json({
      success: true,
      message: "Sucessfully created booking.",
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

    const data = await booking.findByPk(id);
    if (!data) {
      return res.status(404).send({ message: "Booking not found." });
    }

    const updateData = { ...other };

    await data.update(updateData);

    return res.status(200).json({
      success: true,
      message: "Sucessfully updated booking.",
      data: data,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const destroy = async (req, res) => {
  try {
    const { id } = req.params;

    await booking.destroy({ where: { id } });

    return res.status(200).send({
      message: "Sucessfully deleted booking.",
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
