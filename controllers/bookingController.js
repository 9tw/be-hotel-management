const { Op, literal } = require("sequelize");
const { room, booking } = require("../models");

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

const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const bookings = await booking.findAll({
      where: {
        id: id,
      },
    });

    if (!bookings || bookings.length === 0) {
      return res.status(200).send({
        message: "Booking still empty",
        result: [],
      });
    }

    return res.status(200).send({
      message: "Sucessfully fetched booking.",
      result: bookings,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const getCheckInToday = async (req, res) => {
  try {
    // Get today at 00:00
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // Get tomorrow at 00:00
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const bookings = await booking.findAll({
      where: {
        from: {
          [Op.gte]: todayStart, // from >= today 00:00
          [Op.lt]: todayEnd, // from < tomorrow 00:00
        },
      },
      include: [
        {
          model: room,
          as: "room",
          required: false,
          attributes: ["id", "name"],
        },
      ],
      attributes: {
        include: [[literal(`DATE_PART('day', "to" - "from")`), "night"]],
      },
    });

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

const getBookingToday = async (req, res) => {
  try {
    const { view, search, from, to } = req.query;
    let { page, limit } = req.query;
    let bookings;
    let counts;
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    if (view === "list") {
      const today = new Date();

      if (search && from != "null" && to != "null") {
        const { count, rows } = await booking.findAndCountAll({
          where: {
            name: { [Op.iLike]: `%${search}%` },
            from: { [Op.between]: [from, to] },
          },
          include: [
            {
              model: room,
              as: "room",
              required: false,
              attributes: ["id", "name"],
            },
          ],
          attributes: {
            include: [[literal(`DATE_PART('day', "to" - "from")`), "night"]],
          },
          limit,
          offset,
        });

        counts = count;
        bookings = rows;
      } else if (search) {
        const { count, rows } = await booking.findAndCountAll({
          where: {
            name: { [Op.iLike]: `%${search}%` },
            from: { [Op.lte]: today }, // from ≤ today
            to: { [Op.gte]: today }, // to ≥ today
          },
          include: [
            {
              model: room,
              as: "room",
              required: false,
              attributes: ["id", "name"],
            },
          ],
          attributes: {
            include: [[literal(`DATE_PART('day', "to" - "from")`), "night"]],
          },
          limit,
          offset,
        });

        counts = count;
        bookings = rows;
      } else {
        const { count, rows } = await booking.findAndCountAll({
          where: {
            from: { [Op.lte]: today }, // from ≤ today
            to: { [Op.gte]: today }, // to ≥ today
          },
          include: [
            {
              model: room,
              as: "room",
              required: false,
              attributes: ["id", "name"],
            },
          ],
          attributes: {
            include: [[literal(`DATE_PART('day', "to" - "from")`), "night"]],
          },
          limit,
          offset,
        });

        counts = count;
        bookings = rows;
      }

      if (!bookings || bookings.length === 0) {
        return res.status(200).send({
          message: "Booking still empty",
          result: [],
          pagination: {
            total: counts,
            page,
            limit,
            totalPages: Math.ceil(counts / limit),
          },
        });
      }

      return res.status(200).send({
        message: "Sucessfully fetched bookings.",
        result: bookings,
        pagination: {
          total: counts,
          page,
          limit,
          totalPages: Math.ceil(counts / limit),
        },
      });
    } else if (view === "table") {
      if (from && to) {
        const filterFrom = new Date(from);
        const filterTo = new Date(to);

        // 1. Fetch all rooms with overlapping bookings
        const rooms = await room.findAll({
          order: [["id", "ASC"]],
          include: [
            {
              model: booking,
              as: "bookings",
              where: {
                [Op.or]: [
                  { from: { [Op.between]: [filterFrom, filterTo] } },
                  { to: { [Op.between]: [filterFrom, filterTo] } },
                  {
                    from: { [Op.lte]: filterFrom },
                    to: { [Op.gte]: filterTo },
                  },
                ],
              },
              required: false,
              attributes: ["id", "name", "from", "to"],
            },
          ],
        });

        // 2. Generate dates in range
        function getDatesBetween(start, end) {
          const dates = [];
          let current = new Date(start);
          while (current <= end) {
            dates.push(new Date(current));
            current.setDate(current.getDate() + 1);
          }
          return dates;
        }

        const dates = getDatesBetween(filterFrom, filterTo);

        // 3. Build result grouped by date
        const result = dates.map((d) => {
          const dayString = d.toISOString().split("T")[0]; // YYYY-MM-DD
          return {
            date: dayString,
            rooms: rooms.map((r) => {
              const bookingsForDay = r.bookings.filter(
                (b) => new Date(b.from) <= d && new Date(b.to) >= d
              );
              return {
                id: r.id,
                name: r.name,
                bookings: bookingsForDay,
                status: r.status,
              };
            }),
          };
        });

        bookings = result;
      } else {
        const today = new Date();
        bookings = await room.findAll({
          order: [["id", "ASC"]],
          include: [
            {
              model: booking,
              as: "bookings", // alias must match your association
              where: {
                from: { [Op.lte]: today },
                to: { [Op.gte]: today },
              },
              required: false, // 👈 so rooms without bookings still appear
              attributes: ["id", "name", "from", "to"],
            },
          ],
        });
      }

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
    }
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
  getBookingById,
  getCheckInToday,
  getBookingToday,
};
