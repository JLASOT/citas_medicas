import models from "../models";

export default {
    create: async (req, res) => {
        try {

            const Payment = await models.Payment.create(req.body);
            res.status(200).json({
                Payment: Payment,
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
            const Payment = await models.Payment.findByPk(_id);
            if (!Payment) {
                return res.status(404).json({
                    message: 'PAGO NO ENCONTRADO',
                });
            }

            const [updated] = await models.Payment.update(req.body, {
                where: { id: _id },
            });

            if (updated) {
                const updatedPayment = await models.Payment.findByPk(_id);

                return res.status(200).json({
                    message: 'EL PAGO SE EDITÓ CORRECTAMENTE',
                    Payment: updatedPayment,
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
                const Payment = await models.Payment.findByPk(_id/* ,{
                    include:[{
                        model: models.Patient,
                    }]
                } */);
                if (!Payment) {
                    return res.status(404).json({
                        message: 'pago no encontrado',
                    })
                }
                return res.status(200).json({
                    Payment: Payment
                })
            } else {
                const Payment = await models.Payment.findAll();
                return res.status(200).json({
                    Payment: Payment,
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

            const result = await models.Payment.destroy({
                where: { id: _id }
            });

            if (result === 0) {
                return res.status(404).json({
                    message: 'PAGO NO ENCONTRADO',
                });
            }
            res.status(200).json({
                message: 'EL PAGO SE ELIMINO CORRECTAMENTE',
            });
        } catch (error) {
            res.status(500).send({
                message: "OCURRIO UN PROBLEMA",
                error: error.message,
            });
        }
    }
}