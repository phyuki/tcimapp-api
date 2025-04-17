const PatientService = require('../services/patient.service');

exports.getByEmail = async (req, res) => {
    const result = await PatientService.getByEmail(req.query.emailUser);
    res.json(result);
};

exports.getAllByProfessionalId = async (req, res) => {
    const result = await PatientService.getAllByProfessionalId(req.query.userId);
    res.json(result);
};

exports.create = async (req, res) => {
    const { status, data } = await PatientService.create(req.body);
    res.status(status).json(data);
};

exports.update = async (req, res) => {
    const message = await PatientService.update(req.body);
    res.json(message);
};
