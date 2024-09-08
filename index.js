const express = require("express")
const bodyParser = require('body-parser')
const cors = require('cors')
const model = require('./models')
const { sequelize, Score } = require('./models')

const port = process.env.PORT || 3000

let app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/register', async(req,res) => {

    const [user, created] = await model.users.findOrCreate({
         where: { email: req.body.emailUser },
         defaults: {
              password: req.body.passwordUser,
              userType: req.body.userType
         }
    })

    if(created)
         res.send(JSON.stringify('O usuário foi cadastrado com sucesso!'))
    else
         res.send(JSON.stringify('Email já cadastrado no sistema'))
})

app.get('/login', async(req,res) => {

    const exists = await model.users.findOne({ where: { 
         email: req.query.emailUser, 
         password: req.query.passwordUser } 
    })

    if(exists) res.send(JSON.stringify(exists.dataValues.userType))
    else res.send(JSON.stringify('F'))
    
})

app.get('/professional', async(req,res) => {

    const exists = await model.professionals.findOne({ 
         where: { id: req.query.userId } 
    })

    if(exists) {
         res.send(JSON.stringify(exists.dataValues))
    }

})

app.get('/professionals', async(req,res) => {

    const exists = await model.professionals.findOne({ 
         where: { email: req.query.emailUser } 
    })

    if(exists) {
         res.send(JSON.stringify(exists.dataValues.id))
    }
    else { 
         res.send(JSON.stringify(req.query.userId))
    }     
})

app.get('/allProfessionals', async(req,res) => {

    const exists = await model.professionals.findAll()
    if(exists) {
         const allItems = exists.map(item => item.dataValues)
         res.json(allItems)
    }
    
})

app.post('/professionals', async(req,res) => {

    const user = await model.professionals.create({
         name: req.body.name,
         email: req.body.email,
         phone: req.body.phone
    })

    if(user)
         res.send(JSON.stringify(user))
      
})

app.put('/professionals', async(req,res) => {

    await model.professionals.update(
         {
              name: req.body.name,
              phone: req.body.phone,
              email: req.body.email,
         },
         { where: { id: req.body.id } }
    ).then(result => {
         if(result == 1) res.send(JSON.stringify('Seus dados foram atualizados com sucesso!'))
    })
})

app.get('/professionalByEmail', async(req,res) => {
    const exists = await model.professionals.findOne({ 
         where: { email: req.query.emailUser } 
    })

    if(exists) {
         res.send(JSON.stringify(exists.dataValues))
    }
    else{
         res.send(JSON.stringify(''))
    }
})

app.get('/patientByEmail', async(req,res) => {

    const exists = await model.patients.findOne({ 
         where: { email: req.query.emailUser } 
    })

    if(exists) {
         res.send(JSON.stringify(exists.dataValues))
    } 
    else{
         res.send(JSON.stringify(''))
    }
})

app.get('/patients', async(req,res) => {

    const exists = await model.patients.findAll({ 
         where: { professionalId: req.query.userId } 
    })

    if(exists){
         const allItems = exists.map(item => item.dataValues)
         res.json(allItems)
    }
})

app.put('/patients', async(req,res) => {

    await model.patients.update(
         {
              name: req.body.name,
              phone: req.body.phone,
              address: req.body.address,
              professionalId: req.body.professionalId
         },
         { where: { id: req.body.id } }
    ).then(result => {
         if(result == 1) res.send(JSON.stringify('O paciente foi atualizado com sucesso!'))
    })

})

app.post('/patients', async(req,res) => {
    
    const newPatient = await model.patients.create(
         {
              name: req.body.name,
              phone: req.body.phone,
              email: req.body.email,
              address: req.body.address,
              professionalId: req.body.professionalId
         })
    
    if(newPatient){
         res.send(JSON.stringify(newPatient))
    }
})

app.get('/dass', async(req,res) => {

    const exists = await model.dassQuestions.findAll()

    if(exists){
         const allItems = exists.map(item => item.dataValues)
         res.json(allItems)
    }
})

app.post('/dass', async(req,res) => {

    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: 'scidapp' });     

    const scoreA = req.body.scoreA; 
    const scoreD = req.body.scoreD; 
    const scoreE = req.body.scoreE; 
    const patientId = req.body.patientId; 

    const query = 'INSERT INTO dassscores (scoreA, scoreD, scoreE, patientId, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())';
    const values = [scoreA, scoreD, scoreE, patientId];

    await connection.execute(query, values);
    await connection.end();

    res.send(JSON.stringify("Success"))

})

app.get('/disorders', async(req,res) => {

    const exists = await model.scidQuestions.findAll({
         where: { disorder: req.query.disorder }
    })

    if(exists){
         const allItems = exists.map(item => [item.dataValues.id, item.dataValues.cod, item.dataValues.question])
         res.json(allItems)
    }
})

app.get('/dassscores', async(req,res) => {

    const exists = await model.dassscores.findAll({
         where: { patientId: req.query.patient }
    })

    if(exists){
         const allItems = exists.map(item => {
              const date = new Date(item.dataValues.createdAt)
              const onlyDate = date.toISOString().split('T')[0]
              return [item.dataValues.scoreA, item.dataValues.scoreD, 
              item.dataValues.scoreE, onlyDate]})
         res.json(allItems)
    }
    else res.json('')
})

app.get('/reports', async(req,res) => {

    const exists = await model.scidscores.findAll({
         where: { patientId: req.query.patient }
    })

    if(exists){
         const allItems = exists.map(item => {
              const date = new Date(item.dataValues.createdAt)
              const onlyDate = date.toISOString().split('T')[0]
              return [item.dataValues.lifetime_criteria, item.dataValues.past_criteria, 
              item.dataValues.disorder, onlyDate]})
         res.json(allItems)
    }
    else res.json('')
})

app.post('/reports', async(req,res) => {
    
    const report = await model.scidscores.create(
         {
              lifetime_criteria: req.body.lifetime,
              past_criteria: req.body.past,
              disorder: req.body.disorder,
              patientId: req.body.patientId
         })
    
    if(report){
         res.send(JSON.stringify(report))
    }
})

app.post('/answers', async(req,res) => {
    
    const disorder = req.body.disorder
    const answers = req.body.answers
    const patientId = req.body.patientId
    const questionId = req.body.questionId

    const reportDetails = questionId.map((questionId, index) => ({questionId, answer: answers[index],
                                                      patientId, disorder}))

    const report = await model.scidanswers.bulkCreate(reportDetails)
    
    if(report){
         res.send(JSON.stringify(report))
    }
})

app.post('/dassanswers', async(req,res) => {
    
    const answers = req.body.answers
    const patientId = req.body.patientId
    const questionId = req.body.questionId

    const reportDetails = questionId.map((questionId, index) => ({questionId, answer: answers[index],
                                                      patientId}))

    const report = await model.dassanswers.bulkCreate(reportDetails)
    
    if(report){
         res.send(JSON.stringify(report))
    }
})

app.post('/details', async(req,res) => {
    
    const allCriteria = req.body.criteria.map((value) => (value === undefined ? null : value))
    const allScores = req.body.score.map((value) => (value === undefined ? null : value))

    const reportDetails = allCriteria.map((criteria, ind) => ({criteria, score: allScores[ind], 
                                                      disorder: req.body.disorder, patientId: req.body.patientId}));

    const report = await model.scidcriteria.bulkCreate(reportDetails)
    
    if(report){
         res.send(JSON.stringify(report))
    }
})

app.listen(port, () => {
    console.log("Servidor está rodando...")
})