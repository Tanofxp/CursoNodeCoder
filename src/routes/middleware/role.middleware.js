export const rolesMiddlewareAdmin = (req, res, next) => {
    if (req.user.role === "admin") {
        next();
    } else {
        res.send({ error: `you don't have access` });
    }
};
