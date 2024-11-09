import jwt from 'jsonwebtoken'
import models from '../models'

export default {
    encode: async (_id,rol,email) => {
        const token = jwt.sign({_id:_id,rol:rol,email:email},'courses_udemy',{expiresIn: '1d'});
        return token;
    },
    decode: async(token) => {
        try {
            const decoded = jwt.verify(token, 'courses_udemy');
            //const {_id} = await jwt.verify(token,'courses_udemy');

            //const user = models.User.findOne({_id: _id,state : 1});
            const user = await models.User.findOne({ where: { id: decoded._id, state: 1 } });
            if(user){
                return user;
            }
            return false;
        } catch (error) {
            console.log(error);
            return  false;
        }
    }
}