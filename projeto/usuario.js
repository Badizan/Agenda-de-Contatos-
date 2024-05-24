const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { z, ZodError } = require('zod');
const router = express.Router();
const { prisma } = require("./prisma");
const { findContatosByEmail } = require("./login");

router.use(express.json());

const usuarioSchema = z.object({
    email: z.string().email({message: "Email inválido" }),
    password: z.string().min(6, "A senha precisa ter 6 caracteres"),
});

router.post("/registro", async (req, res) => {
    try {

        const { email, password } = req.body;
        if (!email) return res.status(400).json({ message: "Email é necessário" });
        if (!password) return res.status(400).json({ message: "Senha é necessária" });

        const data = usuarioSchema.parse(req.body);
        const usuarioJaCadastrado = await findContatosByEmail(data.email);
        if (usuarioJaCadastrado) return res.status(400).json({ message: "Email já cadastrado" });
        const hash = bcrypt.hashSync(data.password, 10);
        const usuario = await prisma.users.create({
            data: {
                email: data.email,
                password: hash
            }
        });
        delete usuario.password;
        res.send(usuario);
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json(error.errors.map((err) => err.message));
        }
        res.status(500).send();
    }
});

router.post("/login", async (req, res) => {
    try {

        const { email, password } = req.body;
        if (!email) return res.status(400).json({ message: "Email é necessário" });
        if (!password) return res.status(400).json({ message: "Senha é necessária" }); 
        
        const data = usuarioSchema.parse(req.body);
        const usuario = await findContatosByEmail(data.email);
        if (!usuario) return res.status(401).json({ message: "Credencial inválida" });
        const senhaCorreta = bcrypt.compareSync(data.password, usuario.password);
        if (!senhaCorreta) return res.status(401).json({ message: "Credencial inválida" });
        const token = jwt.sign({ id: usuario.id, email: usuario.email }, "pastel");
        res.json({
            message: `seja Bem-vindo!!!`,
            token
        });
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json(error.errors.map((err) => err.message));
        }
        res.status(500).send()
    }
});

module.exports = { router };
