const ReportService = require('../services/report.service');

exports.getAllByPatient = async (req, res) => {
    const result = await ReportService.getAllByPatient(req.query.patient);
    res.json(result);
};

exports.getByDisorder = async (req, res) => {
    const result = await ReportService.getByDisorder(req.query.patient, req.query.disorder);
    res.json(result);
};

exports.create = async (req, res) => {
    const savedReports = await ReportService.create(req.body);
    res.json(savedReports);
};
