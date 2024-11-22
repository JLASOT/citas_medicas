import models from "../models";
import bcrypt from "bcryptjs";
import token from "../service/token";
import { Op } from "sequelize";

export default {
  register: async (req, res) => {
    try {
      // ENCRIPTACIÓN DE CONTRASEÑA
      if (!req.body.password) {
        throw new Error("Password no proporcionado");
      }
      // ENCRIPTACIÓN DE CONTRASEÑA 12345678 -> fhjsdhf34j534jbj34bf34
      req.body.password = await bcrypt.hash(req.body.password, 10);

      // Asegurarse de que specialitieId es un número 
      /* const specilitieId = parseInt(req.body.specialitieId, 10); if (isNaN(specilitieId)) { return res.status(400).json({ message: 'specialitieId debe ser un número' }); }
 */
      console.log(req.body.password);

      const VALID_USER = await models.User.findOne({
        where: {
          email: req.body.email,
        },
      });
      if (VALID_USER) {
        res.status(200).json({
          message: 403,
          message_text: "EL USUARIO INGRESADO YA EXISTE",
        });
      }
      const User = await models.User.create(req.body);
      res.status(200).json({
        user: User,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "OCURRIO UN PROBLEMA",
        error: error.message,
      });
    }
  },
  login: async (req, res) => {
    try {
      // email y contraseña
      // req.body.email y req.body.password
      const user = await models.User.findOne({
        where: {
          email: req.body.email,
          state: 1,
        },
      });
      if (user) {
        // COMPARAR LAS CONTRASEÑA
        let compare = await bcrypt.compare(req.body.password, user.password);
        if (compare) {
          // UN USUARIO EXISTENTE Y ACTIVO
          let tokenT = await token.encode(user.id, user.rol, user.email);

          const USER_BODY = {
            token: tokenT,
            user: {
              name: user.name,
              surname: user.surname,
              email: user.email,
              id: user.id,
              rol: user.rol,
              // avatar: user.avatar
            },
          };
          res.status(200).json({
            USER: USER_BODY,
          });
        } else {
          res.status(500).send({
            message: "EL USUARIO INGRESADO NO EXISTE",
          });
        }
      } else {
        res.status(500).send({
          message: "EL USUARIO INGRESADO NO EXISTE",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "HUBO UN ERROR",
      });
    }
  },
  update: async (req, res) => {
    try {
      // aba@gmail.com
      const userId = req.params.id;
      // Verificar si el email ya está en uso por otro usuario
      const VALID_USER = await models.User.findOne({
        where: {
          email: req.body.email,
          id: { [Op.ne]: userId }, // Asegúrate de no encontrar al usuario actual
        },
      });
      if (VALID_USER) {
        res.status(200).json({
          message: 403,
          message_text: "EL USUARIO INGRESADO YA EXISTE",
        });
      }
      // Si se proporciona una nueva contraseña, hashearla
      if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
      }

      const [updated] = await models.User.update(req.body, {
        where: { id: userId },
      });

      if (updated) {
        // Si el usuario fue actualizado, obtener los nuevos datos
        const updatedUser = await models.User.findByPk(userId);

        return res.status(200).json({
          message: "EL USUARIO SE EDITÓ CORRECTAMENTE",
          user: updatedUser,
        });
      }

      res.status(404).json({
        message: "USUARIO NO ENCONTRADO",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "OCURRIO UN PROBLEMA",
        error: error.message,
      });
    }
  },

  list: async (req, res) => {
    try {
      /* const search = req.query.search || ''; // Maneja el caso donde no hay búsqueda

            // Utiliza findAll para obtener los usuarios con condiciones
            const USERS = await models.User.findAll({
                where: {
                    state: 1,
                    [Op.or]: [
                        { name: { [Op.like]: `%${search}%` } },
                        { surname: { [Op.like]: `%${search}%` } },
                        { email: { [Op.like]: `%${search}%` } },
                    ]
                },
                order: [['createdAt', 'DESC']], // Ordenar por createdAt en orden descendente
                include: [{
                    model: models.Specialitie, // Incluye el modelo de Speciality
                    //attributes: ['id', 'name'], // Especifica los atributos que deseas obtener de la especialidad
                }],
            });
            res.status(200).json({
                users: USERS,
            }); */

      let _id = req.params["id"];
      if (_id) {
        const user = await models.User.findByPk(_id, {
          include: [{ model: models.Specialitie }],
        });
        if (!user) {
          return res.status(404).json({
            message: "Usuario no encontrado",
          });
        }
        res.status(200).json({
          users: user,
        });
      } else {
        const users = await models.User.findAll({
          include: [{ model: models.Specialitie }],
        });
        return res.status(200).json({
          users: users,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "OCURRIO UN PROBLEMA",
        error: error.message,
      });
    }
  },
  remove: async (req, res) => {
    try {
      let _id = req.params["id"];
      // Busca el usuario por ID y elimina el registro
      const result = await models.User.destroy({
        where: { id: _id }, // Cambia 'id' si el campo clave primaria tiene otro nombre
      });

      if (result === 0) {
        return res.status(404).json({
          message: "USUARIO NO ENCONTRADO",
        });
      }
      res.status(200).json({
        message: "EL USUARIO SE ELIMINO CORRECTAMENTE",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "OCURRIO UN PROBLEMA",
        error: error.message,
      });
    }
  },
};
