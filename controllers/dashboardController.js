const { Op } = require("sequelize");
const { room, booking } = require("../models");

const index = async (req, res) => {
  try {
    const today = new Date();

    const bookings = await booking.count({
      where: {
        from: { [Op.lte]: today }, // from ≤ today
        to: { [Op.gte]: today }, // to ≥ today
      },
    });

    const paid = await booking.count({
      where: {
        from: { [Op.lte]: today }, // from ≤ today
        to: { [Op.gte]: today }, // to ≥ today
        status: 2,
      },
    });

    const rooms = await room.count();

    const roomMaintenance = await room.count({
      where: {
        status: 3,
      },
    });

    const roomUnavailable = await room.count({
      where: {
        status: 2,
      },
    });

    const roomPaid = paid + "/" + bookings;

    const roomAvailable = rooms - roomMaintenance - roomUnavailable - bookings;

    const guests = await booking.sum("guest", {
      where: {
        from: { [Op.lte]: today }, // from ≤ today
        to: { [Op.gte]: today }, // to ≥ today
      },
    });

    return res.status(200).send({
      message: "Sucessfully fetched dashboard data.",
      result: {
        roomPaid,
        roomAvailable,
        roomUnavailable,
        roomMaintenance,
        guests,
      },
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const dashboardNotPayYet = async (req, res) => {
  try {
    const today = new Date();
    const notPaid = await booking.findAll({
      where: {
        from: { [Op.lte]: today },
        to: { [Op.gte]: today },
        status: 1,
      },
      attributes: ["name"],
    });

    return res.status(200).send({
      message: "Sucessfully fetched dashboard not pay yet data.",
      result: notPaid,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

module.exports = {
  index,
  dashboardNotPayYet,
};
