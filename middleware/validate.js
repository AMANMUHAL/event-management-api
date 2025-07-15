export const validateRequest = (fields = []) => {
    return (req, res, next) => {
        const missing = [];

        fields.forEach((field) => {
            if (!req.body[field]) {
                missing.push(field);
            }
        });

        if (missing.length > 0) {
            return res.status(400).json({
                error: `Missing required field(s): ${missing.join(', ')}`,
            });
        }

        next();
    };
};
