const { Op, Sequelize } = require("sequelize");
const { staff } = require("../models");

const index = async (req, res) => {
  try {
    const staffs = await staff.findAll({ order: [["id", "ASC"]] });
    if (!staffs || staffs.length === 0) {
      return res
        .status(200)
        .send({ message: "Staff lists still empty", result: [] });
    }
    return res
      .status(200)
      .send({ message: "Sucessfully fetched staffs.", result: staffs });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const getAllStaffPagination = async (req, res) => {
  try {
    // get page & limit from query params, default: page=1, limit=10
    let { page, limit } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    // find with pagination
    const { count, rows } = await staff.findAndCountAll({
      order: [["id", "ASC"]],
      limit,
      offset,
    });

    if (!rows || rows.length === 0) {
      return res.status(200).send({
        message: "Staff lists still empty",
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
      message: "Successfully fetched staffs.",
      result: rows,
      pagination: {
        total: count, // total number of staffs
        page, // current page
        limit, // items per page
        totalPages: Math.ceil(count / limit), // total pages
      },
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const getStaffById = async (req, res) => {
  try {
    const { id } = req.params;
    const staffs = await staff.findAll({
      where: {
        id: id,
      },
    });

    if (!staffs || staffs.length === 0) {
      return res.status(200).send({ message: "Staff still empty", result: [] });
    }

    return res
      .status(200)
      .send({ message: "Sucessfully fetched staff.", result: staffs });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { ...other } = req.body;

    const data = await staff.create({ ...other });

    return res.status(200).json({
      success: true,
      message: "Sucessfully created staff.",
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

    const data = await staff.findByPk(id);
    if (!data) {
      return res.status(404).send({ message: "Staff not found." });
    }

    const updateData = { ...other };

    await data.update(updateData);

    return res.status(200).json({
      success: true,
      message: "Sucessfully updated staff.",
      data: data,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const destroy = async (req, res) => {
  try {
    const { id } = req.params;

    await staff.destroy({ where: { id } });

    return res.status(200).send({
      message: "Sucessfully deleted staff.",
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
  getAllStaffPagination,
  getStaffById,
};
