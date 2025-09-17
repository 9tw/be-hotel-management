const { Op, Sequelize } = require("sequelize");
const { room, user } = require("../models");

const index = async (req, res) => {
  try {
    const users = await user.findAll({ order: [["id", "ASC"]] });
    if (!users || users.length === 0) {
      return res.status(200).send({ message: "User still empty", result: [] });
    }
    return res
      .status(200)
      .send({ message: "Sucessfully fetched users.", result: users });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const getAllUserPagination = async (req, res) => {
  try {
    // get page & limit from query params, default: page=1, limit=10
    let { page, limit } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    // find with pagination
    const { count, rows } = await user.findAndCountAll({
      attributes: ["id", "name", "email"],
      order: [["id", "ASC"]],
      limit,
      offset,
    });

    if (!rows || rows.length === 0) {
      return res.status(200).send({
        message: "User still empty",
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
      message: "Successfully fetched users.",
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

const create = async (req, res) => {
  try {
    const { ...other } = req.body;

    const data = await user.create({ ...other });

    return res.status(200).json({
      success: true,
      message: "Sucessfully created user.",
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

    const data = await user.findByPk(id);
    if (!data) {
      return res.status(404).send({ message: "User not found." });
    }

    const updateData = { ...other };

    await data.update(updateData);

    return res.status(200).json({
      success: true,
      message: "Sucessfully updated user.",
      data: data,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const destroy = async (req, res) => {
  try {
    const { id } = req.params;

    await user.destroy({ where: { id } });

    return res.status(200).send({
      message: "Sucessfully deleted user.",
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
  getAllUserPagination,
};
