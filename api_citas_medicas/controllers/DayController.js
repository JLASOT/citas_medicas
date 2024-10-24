// controllers/dayController.js

import models from "../models";

export default {
    create: async (req, res) => {
        try {
            const day = await models.Day.create(req.body);
            return res.status(201).json({
                message: 'Día creado exitosamente',
                day: day,
            });
        } catch (error) {
            return res.status(500).json({
                message: 'Ocurrió un error al crear el día',
                error: error.message,
            });
        }
    },

    update: async (req, res) => {
        try {
            const _id = req.params.id;
            const day = await models.Day.findByPk(_id);
            
            if (!day) {
                return res.status(404).json({ message: 'Día no encontrado' });
            }

            const updated = await day.update(req.body);
            return res.status(200).json({
                message: 'Día actualizado correctamente',
                day: updated,
            });
        } catch (error) {
            return res.status(500).json({
                message: 'Ocurrió un error al actualizar el día',
                error: error.message,
            });
        }
    },

    list: async (req, res) => {
        try {
            const _id = req.params.id;

            if (_id) {
                const day = await models.Day.findByPk(_id);
                
                if (!day) {
                    return res.status(404).json({ message: 'Día no encontrado' });
                }
                
                return res.status(200).json({ day: day });
            } else {
                const days = await models.Day.findAll();
                return res.status(200).json({
                    message: 'Lista de días recuperada con éxito',
                    days: days,
                });
            }
        } catch (error) {
            return res.status(500).json({
                message: 'Ocurrió un error al recuperar los días',
                error: error.message,
            });
        }
    },

    remove: async (req, res) => {
        try {
            const _id = req.params.id;
            const day = await models.Day.findByPk(_id);

            if (!day) {
                return res.status(404).json({ message: 'Día no encontrado' });
            }

            await day.destroy(); // Si prefieres soft delete, puedes usar un atributo como "state"
            return res.status(200).json({
                message: 'Día eliminado correctamente',
            });
        } catch (error) {
            return res.status(500).json({
                message: 'Ocurrió un error al eliminar el día',
                error: error.message,
            });
        }
    }
};
