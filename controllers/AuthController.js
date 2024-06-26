const User = require("../models/User");

const bcrypt = require("bcryptjs");

module.exports = class AuthController {
  static login(req, res) {
    res.render("auth/login");
  }
  static register(req, res) {
    res.render("auth/register");
  }
  static async registerPost(req, res) {
    const { name, email, password, confirmpassword } = req.body;
    //password match validation
    if (password != confirmpassword) {
      req.flash("message", "Senha incorreta, tente novamente!!!");
      res.render("auth/register");
      return;
    }

    //validar usuario
    const checkIfUserExists = await User.findOne({ where: { email: email } });
    if (checkIfUserExists) {
      req.flash("message", "O e-mail já está em uso.");
      res.render("auth/register");
      return;
    }

    //create a password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const user = {
      name,
      email,
      password: hashedPassword,
    };

    try {
      await User.create(user);
      req.flash("message", "Cadastro registrado com sucesso");
      res.redirect("/");
    } catch (error) {
      console.log(`Erro ao salvar usuario, ${error}`);
    }
  }
};
