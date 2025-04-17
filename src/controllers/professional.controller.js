const ProfessionalService = require('../services/professional.service');

exports.getByEmailOrId = async (req, res) => {
    const result = await ProfessionalService.getByEmailOrId(req.query);
    res.json(result);
};

exports.getAll = async (req, res) => {
    const result = await ProfessionalService.getAll();
    res.json(result);
};

exports.create = async (req, res) => {
    const result = await ProfessionalService.create(req.body);
    res.json(result);
};

exports.update = async (req, res) => {
    const message = await ProfessionalService.update(req.body);
    res.json(message);
};
