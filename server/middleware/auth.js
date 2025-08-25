import jwt from 'jsonwebtoken';


export const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) { return res.status(401).json({ message: 'Token no proporcionado' }); }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id; 
        next();
    } catch (error) {
        console.error('❌ Error al verificar el token:', error);
            return res.status(403).json({ message: 'Token inválido' });
        }   
    };