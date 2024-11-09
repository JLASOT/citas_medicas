import token from './token'

export default {
    veryfyMedico: async(req,res,next) => {
        if(!req.headers.token){
            res.status(404).send({
                message: 'NO SE ENVIO EL TOKEN',
            });
        }
        const response = await token.decode(req.headers.token);
        if(response){
            if(response.rol == 'medico' || response.rol == 'admin'){
                next()
            }else{
                res.status(403).send({
                    message: 'NO ESTA PERMITIDO VISITAR ESTA PAGINA',
                });
            }
        }else{
            res.status(403).send({
                message: 'EL TOKEN ES INVALIDO',
            });
        }
    },
    veryfyAdmin: async(req,res,next) => {
        if(!req.headers.token){
            res.status(404).send({
                message: 'NO SE ENVIO EL TOKEN',
            });
        }
        const response = await token.decode(req.headers.token);
        //console.log('Decodificación de token:', response); // Verifica el contenido del token decodificado
        
        if(response){
            if(response.rol == 'admin'){
                console.log('Usuario es administrador');
                next()
            }else{
                console.log('Usuario no tiene permisos de administrador');
                res.status(403).send({
                    message: 'NO ESTA PERMITIDO VISITAR ESTA PAGINA',
                });
            }
        }else{
            res.status(403).send({
                message: 'EL TOKEN ES INVALIDO',
            });
        }
    }
}