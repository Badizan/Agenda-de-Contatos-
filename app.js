const express = require('express');
const { findContatos, atualizarContatos, adicionarContatos, deletarContatos, findById } = require('./projeto/contatos');
const { router: usuarioRouter } = require("./projeto/usuario");
const { auth } = require('./projeto/middlewares/auth');
const { z, ZodError } = require('zod');
const app = express();
const port = 8080;
app.use('/api', usuarioRouter);
app.use(express.json());

app.use((req, res, next) => {
    next();
});

app.get('/contatos/:id', auth, async (req, res) => {
    const id = Number(req.params.id);
    const contato = await findById(id, req.usuario);
    if (!contato) return res.status(404).json({ message: `Contato com o id ${id} não encontrado` });
    res.json(contato);
});

app.get('/v1/contatos', auth, async (req, res) => {
    const contatos = await findContatos(req.usuario);
    res.json(contatos);
});

const contatosSchema = z.object({
    name: z.string({
        message: "name is required",
    }).min(3),
    email: z.string({
        message: "email is required",
    }).max(50),
    phone: z.string({
        message: "phone is required",
    }).min(9),
    
});

app.post('/v1/contatos', auth, async (req, res) => {
    try {
        const data = contatosSchema.parse(req.body);
        const contatos = await adicionarContatos(data, req.usuario);
        res.status(201).json(contatos);
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json(error.errors.map((err) => err.message));
        }
        res.status(500).send();
    }
});

app.put('/contatos/:id', auth, async (req, res) => {
    try {
        const id = Number(req.params.id);
        const data = contatosSchema.parse(req.body);
        const contatos = await atualizarContatos(id, data, req.usuario);
        return res.status(201).json(contatos);
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json(error.errors.map((err) => err.message));
        }
        res.status(200).send();
    }
});

app.delete('/contatos/:id', auth, async (req, res) => {
    const id = parseInt(req.params.id);
    await deletarContatos(id, req.usuario);
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`App ouvindo na porta http://localhost:${port}`);
});
