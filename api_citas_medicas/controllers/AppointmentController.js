import models from "../models";

/* export default {
    create: async (req, res) => {
        try {

            const Appointment = await models.Appointment.create(req.body);
            res.status(200).json({
                Appointment: Appointment,
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
            const Appointment = await models.Appointment.findByPk(_id);
            if (!Appointment) {
                return res.status(404).json({
                    message: 'CITA MEDICA NO ENCONTRADO',
                });
            }

            const [updated] = await models.Appointment.update(req.body, {
                where: { id: _id },
            });

            if (updated) {
                const updatedTutor = await models.Appointment.findByPk(_id);

                return res.status(200).json({
                    message: 'LA CITA MEDICA SE EDITÓ CORRECTAMENTE',
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
                const Appointment = await models.Appointment.findByPk(_id,{
                    include:[{
                        model: models.Patient
                        },
                        {
                            model: models.Specialitie
                        },
                        {
                            model: models.User
                        },
                        {
                            model: models.DayHour
                        }
                    ]
                });
                if (!Appointment) {
                    return res.status(404).json({
                        message: 'Appointment no encontrado',
                    })
                }
                return res.status(200).json({
                    Appointment: Appointment
                })
            } else {
                const Appointment = await models.Appointment.findAll();
                return res.status(200).json({
                    Appointment: Appointment,
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

            const result = await models.Appointment.destroy({
                where: { id: _id }
            });

            if (result === 0) {
                return res.status(404).json({
                    message: 'CITA MEDICA NO ENCONTRADO',
                });
            }
            res.status(200).json({
                message: 'LA CITA MEDICA SE ELIMINO CORRECTAMENTE',
            });
        } catch (error) {
            res.status(500).send({
                message: "OCURRIO UN PROBLEMA",
                error: error.message,
            });
        }
    }
} */
    export default {
        create: async (req, res) => {
            try {
                const { userId, specialitieId, dayHourId, patientId } = req.body;
        
                // Verificar si el usuario existe
                const user = await models.User.findByPk(userId);
                if (!user) {
                    return res.status(404).json({
                        message: 'Usuario no encontrado',
                    });
                }

                if (user.rol !== 'medico'){
                    return res.status(400).json({
                        message: 'El usuario no es un Medico'
                    })
                }
        
                // Verificar que el usuario esté asociado con la especialidad indicada
                if (parseInt(user.specialitieId) !== parseInt(specialitieId)) {
                    return res.status(400).json({
                        message: 'La especialidad no coincide con la del usuario',
                    });
                }
        
                // Verificar si el día y la hora están disponibles
                const dayHour = await models.DayHour.findByPk(dayHourId);
                if (!dayHour) {
                    return res.status(404).json({
                        message: 'Día/Hora no encontrado',
                    });
                }
        
                // Verificar que el día/hora esté asignado al mismo usuario
                if (parseInt(dayHour.userId) !== parseInt(userId)) {
                    return res.status(400).json({
                        message: 'El día/hora no está disponible para este usuario',
                    });
                }
        
                // Verificar si ya existe una cita médica con los mismos userId, specialitieId y dayHourId
                const existingAppointment = await models.Appointment.findOne({
                    where: {
                        userId: userId,
                        specialitieId: specialitieId,
                        dayHourId: dayHourId,
                        dateAppointment: req.body.dateAppointment 
                    },
                });
        
                if (existingAppointment) {
                    return res.status(400).json({
                        message: 'Ya existe una cita médica en la misma fecha y hora.',
                    });
                }
        
                // Si todas las validaciones pasan, crear la cita médica
                const Appointment = await models.Appointment.create(req.body);
        
                res.status(200).json({
                    appointment: Appointment,
                });
            } catch (error) {
                res.status(500).send({
                    message: "OCURRIÓ UN PROBLEMA",
                    error: error.message,
                });
            }
        },
        // Método para listar citas médicas
        list: async (req, res) => {
            try {
                let _id = req.params['id'];
                if (_id) {
                    const appointment = await models.Appointment.findByPk(_id, {
                        include: [
                            { model: models.Patient },
                            { model: models.Specialitie },
                            { model: models.User },
                            { model: models.DayHour,
                                include:[
                                   { 
                                     model: models.Day,
                                     attributes:['name']
                                   },
                                   {
                                    model: models.Hour,
                                    attributes:['name']
                                   }
                                ]
                             }
                        ]
                    });
                    if (!appointment) {
                        return res.status(404).json({
                            message: 'Cita médica no encontrada',
                        });
                    }
                    return res.status(200).json({
                        appointment: appointment
                    });
                } else {
                    const appointments = await models.Appointment.findAll({
                        include: [
                            { model: models.Patient },
                            { model: models.Specialitie },
                            { model: models.User },
                            { model: models.DayHour,
                                include:[
                                    { 
                                      model: models.Day,
                                      attributes:['name']
                                    },
                                    {
                                     model: models.Hour,
                                     attributes:['name']
                                    }
                                 ]
                             }
                        ]
                    });
                    return res.status(200).json({
                        appointments: appointments,
                    });
                }
            } catch (error) {
                res.status(500).send({
                    message: "OCURRIÓ UN PROBLEMA",
                    error: error.message,
                });
            }
        },
    
        // Método para actualizar citas médicas
        update: async (req, res) => {
            try {
                let _id = req.params['id'];
                const appointment = await models.Appointment.findByPk(_id);
                if (!appointment) {
                    return res.status(404).json({
                        message: 'Cita médica no encontrada',
                    });
                }
    
                const [updated] = await models.Appointment.update(req.body, {
                    where: { id: _id },
                });
    
                if (updated) {
                    const updatedAppointment = await models.Appointment.findByPk(_id);
                    return res.status(200).json({
                        message: 'Cita médica actualizada correctamente',
                        appointment: updatedAppointment,
                    });
                }
    
            } catch (error) {
                res.status(500).send({
                    message: "OCURRIÓ UN PROBLEMA",
                    error: error.message,
                });
            }
        },
    
        // Método para eliminar citas médicas
        remove: async (req, res) => {
            try {
                let _id = req.params['id'];
    
                const result = await models.Appointment.destroy({
                    where: { id: _id }
                });
    
                if (result === 0) {
                    return res.status(404).json({
                        message: 'Cita médica no encontrada',
                    });
                }
                res.status(200).json({
                    message: 'Cita médica eliminada correctamente',
                });
            } catch (error) {
                res.status(500).send({
                    message: "OCURRIÓ UN PROBLEMA",
                    error: error.message,
                });
            }
        }
    };