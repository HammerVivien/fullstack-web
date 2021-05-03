import { User } from "../entities/user";
import { secret } from "./secret";
import jsonwebtoken from 'jsonwebtoken';


export function generateJwt(user: User) {
    const payload = {
        sub: user.id,
        role: user.role,
        username: user.username
    };

    const token = jsonwebtoken.sign(payload, secret);
    return token;
}