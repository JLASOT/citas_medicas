import models from "../models";

export default {
    create: async (req, res) => {
        try {

            const Tutor = await models.Tutor.create(req.body);
            res.status(200).json({
                tutor: Tutor,
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
            const tutor = await models.Tutor.findByPk(_id);
            if (!tutor) {
                return res.status(404).json({
                    message: 'TUTOR NO ENCONTRADO',
                });
            }

            const [updated] = await models.Tutor.update(req.body, {
                where: { id: _id },
            });

            if (updated) {
                const updatedTutor = await models.Tutor.findByPk(_id);

                return res.status(200).json({
                    message: 'EL TUTOR SE EDITÓ CORRECTAMENTE',
                    Patient: updatedTutor,
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
                const tutor = await models.Tutor.findByPk(_id,{
                    include:[{
                        model: models.Patient,
                    }]
                });
                if (!tutor) {
                    return res.status(404).json({
                        message: 'Tutor no encontrado',
                    })
                }
                return res.status(200).json({
                    tutor: tutor
                })
            } else {
                const tutor = await models.Tutor.findAll();
                return res.status(200).json({
                    tutor: tutor,
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

            const result = await models.Tutor.destroy({
                where: { id: _id }
            });

            if (result === 0) {
                return res.status(404).json({
                    message: 'TUTOR NO ENCONTRADO',
                });
            }
            res.status(200).json({
                message: 'EL TUTOR SE ELIMINO CORRECTAMENTE',
            });
        } catch (error) {
            res.status(500).send({
                message: "OCURRIO UN PROBLEMA",
                error: error.message,
            });
        }
    }
}