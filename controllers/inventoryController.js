const { Op, literal } = require("sequelize");
const { inventory } = require("../models");

const index = async (req, res) => {
  try {
    const data = await inventory.findAll();

    if (!data || data.length === 0) {
      return res.status(200).send({
        message: "Inventory still empty",
        result: [],
      });
    }

    return res.status(200).send({
      message: "Sucessfully fetched inventories.",
      result: data,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const getAllInventoryPagination = async (req, res) => {
  try {
    // get page & limit from query params, default: page=1, limit=10
    let { id, page, limit } = req.query;
    id = parseInt(id);
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    // find with pagination
    const { count, rows } = await inventory.findAndCountAll({
      where: {
        room_id: id,
      },
      order: [["id", "ASC"]],
      limit,
      offset,
    });

    if (!rows || rows.length === 0) {
      return res.status(200).send({
        message: "Inventory still empty",
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
      message: "Successfully fetched inventories.",
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

    const data = await inventory.create({ ...other });

    return res.status(200).json({
      success: true,
      message: "Sucessfully created inventory.",
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

    const data = await inventory.findByPk(id);
    if (!data) {
      return res.status(404).send({ message: "Inventory not found." });
    }

    const updateData = { ...other };

    await data.update(updateData);

    return res.status(200).json({
      success: true,
      message: "Sucessfully updated inventory.",
      data: data,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const destroy = async (req, res) => {
  try {
    const { id } = req.params;

    await inventory.destroy({ where: { id } });

    return res.status(200).send({
      message: "Sucessfully deleted inventory.",
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
  getAllInventoryPagination,
};
