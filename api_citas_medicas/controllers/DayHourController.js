import models from "../models";

export default {
    create: async (req, res) => {
        try {

            const { userId, dayId, hourId } = req.body;
            const user = await models.User.findByPk(userId);
            if(!user){
                return res.status(404).json({
                    message: 'Usuario no encontrado',
                });
            }
            if (user.rol !== 'medico'){
                return res.status(400).json({
                    message: 'El usuario no es un Medico'
                })
            }
    
            // Verificar si ya existe un registro con el mismo userId, dayId y hourId
            const existingDayHour = await models.DayHour.findOne({
                where: {
                    userId: userId,
                    dayId: dayId,
                    hourId: hourId
                }
            });
    
            if (existingDayHour) {
                return res.status(400).json({
                    message: "Ya existe un registro con el mismo usuario, día y hora."
                });
            }
    
            const dayHour = await models.DayHour.create(req.body);
            res.status(200).json({
                dayHour: dayHour,
            });
        } catch (error) {
            res.status(500).send({
                message: "Ocurrió un problema",
                error: error.message,
            });
        }
    },

    update: async (req, res) => {
        try {
            let _id = req.params['id'];
            const dayHour = await models.DayHour.findByPk(_id);
            if (!dayHour) {
                return res.status(404).json({
                    message: 'DayHour no encontrado',
                });
            }

            const [updated] = await models.DayHour.update(req.body, {
                where: { id: _id },
            });

            if (updated) {
                const updatedDayHour = await models.DayHour.findByPk(_id);
                return res.status(200).json({
                    message: 'DayHour actualizado correctamente',
                    dayHour: updatedDayHour,
                });
            }

        } catch (error) {
            res.status(500).send({
                message: "Ocurrió un problema",
                error: error.message,
            });
        }
    },

    list: async (req, res) => {
        try {
            let _id = req.params['id'];
            if (_id) {
                const dayHour = await models.DayHour.findByPk(_id, {
                    include: [
                        { model: models.User },  // Incluye la relación con el modelo User
                        { model: models.Day },   // Incluye la relación con el modelo Day
                        { model: models.Hour }   // Incluye la relación con el modelo Hour
                    ]
                });
                if (!dayHour) {
                    return res.status(404).json({
                        message: 'DayHour no encontrado',
                    });
                }
                return res.status(200).json({
                    dayHour: dayHour,
                });
            } else {
                const dayHours = await models.DayHour.findAll({
                    include: [
                        { model: models.User },
                        { model: models.Day },
                        { model: models.Hour }
                    ]
                });
                return res.status(200).json({
                    dayHours: dayHours,
                });
            }
        } catch (error) {
            res.status(500).send({
                message: "Ocurrió un problema",
                error: error.message,
            });
        }
    },

    remove: async (req, res) => {
        try {
            let _id = req.params["id"];

            const result = await models.DayHour.destroy({
                where: { id: _id }
            });

            if (result === 0) {
                return res.status(404).json({
                    message: 'DayHour no encontrado',
                });
            }
            res.status(200).json({
                message: 'DayHour eliminado correctamente',
            });
        } catch (error) {
            res.status(500).send({
                message: "Ocurrió un problema",
                error: error.message,
            });
        }
    }
};
