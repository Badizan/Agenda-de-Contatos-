const { prisma } = require("./prisma")

const findContatosByEmail = async (email) => {
    return await prisma.users.findFirst({
        where: {
            email: email
        }
    })
}

module.exports = {
    findContatosByEmail
}