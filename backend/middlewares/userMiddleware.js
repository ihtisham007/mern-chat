
exports.checkUser = (req, res, next) => {
    const user = req.body;
    if (!user.email || !user.password) {
        return res.status(400).json({
            message: 'Email and password are required',
        });
    }
    next();
}