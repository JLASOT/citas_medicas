import models from "../models";

export default {
    create: async (req, res) => {
        try {

            const Patient = await models.Patient.create(req.body);
            res.status(200).json({
                patient: Patient,
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
            const patient = await models.Patient.findByPk(_id);
            if (!patient) {
                return res.status(404).json({
                    message: 'PACIENTE NO ENCONTRADO',
                });
            }

            const [updated] = await models.Patient.update(req.body, {
                where: { id: _id },
            });

            if (updated) {
                const updatedPatient = await models.Patient.findByPk(_id);

                return res.status(200).json({
                    message: 'EL PACIENTE SE EDITÓ CORRECTAMENTE',
                    Patient: updatedPatient,
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

            /* let _id = req.params['id'];
            if (_id) {
                const patient = await models.Patient.findByPk(_id);
                if (!patient) {
                    return res.status(404).json({
                        message: 'Paciente no encontrado',
                    })
                }
                return res.status(200).json({
                    patient: patient
                })
            } else { */
                const patient = await models.Patient.findAll();
                return res.status(200).json({
                    patient: patient,
                })
            // }
        } catch (error) {
            res.status(500).send({
                message: "OCURRIO UN PROBLEMA",
                error: error.message,
            });
        }

    },
    listPatient: async (req, res) => {
        try {
            let _id = req.params['id'];
            if (_id) {
                const patient = await models.Patient.findByPk(_id,{
                    include: [{ 
                        model: models.Tutor, 
                        as: 'tutors' // Asegúrate de que el alias coincida con el definido en la asociación 
                    }]
                });
                if (!patient) {
                    return res.status(404).json({
                        message: 'Paciente no encontrado',
                    })
                }
                return res.status(200).json({
                    patient: patient
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

            const result = await models.Patient.destroy({
                where: { id: _id }
            });

            if (result === 0) {
                return res.status(404).json({
                    message: 'USUARIO NO ENCONTRADO',
                });
            }
            res.status(200).json({
                message: 'EL USUARIO SE ELIMINO CORRECTAMENTE',
            });
        } catch (error) {
            res.status(500).send({
                message: "OCURRIO UN PROBLEMA",
            });
        }
    }
}