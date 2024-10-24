import models from "../models";

export default {
    create: async (req, res) => {
        try {

            const Specialitie = await models.Specialitie.create(req.body);
            res.status(200).json({
                Specialitie: Specialitie,
            })
        } catch (error) {
            res.status(500).send({
                message: "OCURRIO UN PROBLEMA",
                error: error.message,
            });
        }
    },
    update: async (req, res) => {
        try {
            let _id = req.params['id'];
            const Specialitie = await models.Specialitie.findByPk(_id);
            if (!Specialitie) {
                return res.status(404).json({
                    message: 'ESPECIALIDAD NO ENCONTRADO',
                });
            }

            const [updated] = await models.Specialitie.update(req.body, {
                where: { id: _id },
            });

            if (updated) {
                const updatedSpecialitie = await models.Specialitie.findByPk(_id);

                return res.status(200).json({
                    message: 'LA ESPECIALIDAD SE EDITÓ CORRECTAMENTE',
                    Specialitie: updatedSpecialitie,
                });
            }

        } catch (error) {
            res.status(500).send({
                message: "OCURRIO UN PROBLEMA",
                error: error.message,
            });
        }
    },
    list: async (req, res) => {
        try {

            let _id = req.params['id'];
            if (_id) {
                const specialitie = await models.Specialitie.findByPk(_id,{
                    include:[{
                        model: models.User,
                    }]
                });
                if (!specialitie) {
                    return res.status(404).json({
                        message: 'Especialida no encontrado',
                    })
                }
                return res.status(200).json({
                    specialitie: specialitie
                })
            } else {
                const specialitie = await models.Specialitie.findAll();
                return res.status(200).json({
                    specialitie: specialitie,
                })
            }
        } catch (error) {
            res.status(500).send({
                message: "OCURRIO UN PROBLEMA",
                error: error.message,
            });
        }

    },
    remove: async (req, res) => {
        try {
            let _id = req.params["id"];

            const result = await models.Specialitie.destroy({
                where: { id: _id }
            });

            if (result === 0) {
                return res.status(404).json({
                    message: 'ESPECIALIDAD NO ENCONTRADO',
                });
            }
            res.status(200).json({
                message: 'LA ESPECIALIDAD SE ELIMINO CORRECTAMENTE',
            });
        } catch (error) {
            res.status(500).send({
                message: "OCURRIO UN PROBLEMA",
                error: error.message,
            });
        }
    }
}