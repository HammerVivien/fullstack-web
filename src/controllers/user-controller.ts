import { wrap } from "@mikro-orm/core";
import { Router } from "express";
import { User, UserRole } from "../entities/user";
import { generateJwt } from "../security/jwt-generator";
import { hashPassword } from "../security/password-util";

export const userRouter = Router();

userRouter
.use((req, res, next) => {
    req.userRepository = req.orm.em.getRepository(User);
    next();
})
.post('/register', async (req, res) => {
    const user = new User();
    
    const wrappedUser = wrap(user);
    wrappedUser.assign(req.body);
    
    user.role = UserRole.User;
    user.password = await hashPassword(user.password);
    
    await req.userRepository!.persistAndFlush(user);

    res.send(user);
})
.post('/login', async (req, res) => {
    const user = await req.userRepository!.findOne({username: req.body.username});
    if (!user) {
        res.sendStatus(404);
        return;
    }

    const password = await hashPassword(req.body.password);
    if (password != user.password) {
        res.sendStatus(404);
        return;
    }

    res.send({user, token: generateJwt(user)});
});