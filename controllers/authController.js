const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { user } = require("../models");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const findUser = await user.findOne({
      where: { email },
    });

    if (!findUser || !bcrypt.compareSync(password, findUser.password)) {
      return res.status(401).send({
        message: "Incorrect email or password!",
      });
    }

    const user_id = findUser.id;

    // START: GENERATE TOKEN
    const secretKey = process.env.JWT_SECRET;
    const expiresIn = "7d";

    const payload = {
      id: user_id,
    };

    const token = jwt.sign(payload, secretKey, { expiresIn });
    // END: GENERATE TOKEN

    await user.update(
      { token },
      {
        where: {
          id: user_id,
        },
      }
    );

    return res.status(200).send({
      message: "Login successful",
      user: {
        id: user_id,
        name: findUser.name,
        role_id: findUser.role_id,
      },
      token,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const logout = async (req, res) => {
  try {
    const { id } = req.user;

    // Clear the token field for the user in the database
    await user.update({ token: null }, { where: { id } });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

module.exports = {
  login,
  logout,
};
