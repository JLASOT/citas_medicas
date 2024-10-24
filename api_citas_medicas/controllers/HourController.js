import models from "../models";

export default{
    create: async (req, res) => {
        try {
            const hour = await models.Hour.create(req.body);
            return res.status(201).json({
                message: 'Hora creado exitosamente',
                hour: hour,
            });
        } catch (error) {
            return res.status(500).json({
                message: 'Ocurrió un error al crear la hora',
                error: error.message,
            });
        }
    },

    update: async (req, res) => {
        try {
            const _id = req.params.id;
            const hour = await models.Hour.findByPk(_id);
            
            if (!hour) {
                return res.status(404).json({ message: 'Hora no encontrado' });
            }

            const updated = await hour.update(req.body);
            return res.status(200).json({
                message: 'Hora actualizado correctamente',
                hour: updated,
            });
        } catch (error) {
            return res.status(500).json({
                message: 'Ocurrió un error al actualizar la hora',
                error: error.message,
            });
        }
    },

    list: async (req, res) => {
        try {
            const _id = req.params.id;

            if (_id) {
                const hour = await models.Hour.findByPk(_id);
                
                if (!hour) {
                    return res.status(404).json({ message: 'Hora no encontrado' });
                }
                
                return res.status(200).json({ hour: hour });
            } else {
                const hours = await models.Hour.findAll();
                return res.status(200).json({
                    message: 'Lista de hora recuperada con éxito',
                    hours: hours,
                });
            }
        } catch (error) {
            return res.status(500).json({
                message: 'Ocurrió un error al recuperar las horas',
                error: error.message,
            });
        }
    },

    remove: async (req, res) => {
        try {
            const _id = req.params.id;
            const hour = await models.Hour.findByPk(_id);

            if (!hour) {
                return res.status(404).json({ message: 'hora no encontrado' });
            }

            await hour.destroy(); // Si prefieres soft delete, puedes usar un atributo como "state"
            return res.status(200).json({
                message: 'Hora eliminado correctamente',
            });
        } catch (error) {
            return res.status(500).json({
                message: 'Ocurrió un error al eliminar la hora',
                error: error.message,
            });
        }
    }










};