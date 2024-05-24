const { prisma } = require("./prisma");

const findContatos = async (usuarioID) => {
    const contatos = await prisma.contatos.findMany({
        where: {
            usuario: {
                id: usuarioID
            }
        },
        include: {
            usuario: {
                select: {
                    id: true,
                    email: true,
                }
            }
        }
    });

    return contatos;
}

const findById = async (id, usuarioID) => {
    const contatos = await prisma.contatos.findFirst({
        where: {
            id,
            usuarioID
        }
    });
    return contatos;
}

const adicionarContatos = async (data, usuarioID) => {
    const contatos = await prisma.contatos.create({
        data: {
            ...data,
            usuario: {
                connect: {
                    id: usuarioID
                }
            }
        }
    });
    return contatos;
}

const atualizarContatos = async (id, data, usuarioID) => {
    const contatoAtualizado = await prisma.contatos.update({
        data,
        where: {
            id,
            usuarioID
        }
    });
    return contatoAtualizado;
}

const deletarContatos = async (id, usuarioID) => {
    await prisma.contatos.deleteMany({
        where: {
            id,
            usuarioID
        }
    });
}

module.exports = {
    findContatos,
    adicionarContatos,
    atualizarContatos,
    deletarContatos,
    findById
}
