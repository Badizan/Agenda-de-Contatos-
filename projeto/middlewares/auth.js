// arquivo middlewares/auth.js
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) return res.status(401).json({ error: "Token de autorização não fornecido." });
        const payload = jwt.verify(token, "pastel");
        req.usuario = payload.id;
        next();
    } catch (error) {
        res.status(401).json({ error: "Falha na autenticação." });
    }
}

module.exports = {
    auth
}
