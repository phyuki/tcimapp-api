const express = require("express")
const bodyParser = require('body-parser')
const cors = require('cors')
const Sequelize = require('sequelize')
const model = require('./models')
const port = process.env.PORT || 3000

let app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/teste', async(req,res) => {
     res.send(JSON.stringify('OK!'))
})

app.post('/register', async(req,res) => {

    const [user, created] = await model.users.findOrCreate({
         where: { email: req.body.emailUser },
         defaults: {
              password: req.body.passwordUser,
              userType: req.body.userType
         }
    })

    if(created)
     res.status(200).json({ alert: "Sucesso", message: "O usuário foi cadastrado com sucesso!" })
    else
     res.status(400).json({ alert: "Aviso", message: "Email já cadastrado no sistema" })
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
    
     const exists = await model.patients.findOne({
          where: { email: req.body.email }
     })
     
     if(!exists){
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
     }
     else res.send(JSON.stringify(null))
})

app.get('/dass', async(req,res) => {

    const exists = await model.dassQuestions.findAll()

    if(exists){
         const allItems = exists.map(item => item.dataValues)
         res.json(allItems)
    }
})

app.post('/dass', async(req,res) => {
    
     const report = await model.dassscores.create(
          {
               scoreA: req.body.scoreA,
               scoreD: req.body.scoreD,
               scoreE: req.body.scoreE,
               patientId: req.body.patientId
          })
     
     if(report){
          res.send(JSON.stringify(report))
     }
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
          order: [['createdAt', 'DESC']],
          where: { patientId: req.query.patient }
    })
    console.log(exists.dataValues)
    if(exists){
         const allItems = exists.map(item => {
              const date = new Date(item.dataValues.createdAt)
              const onlyDate = date.toISOString().split('T')[0]
              return [item.dataValues.lifetime_criteria, item.dataValues.past_criteria, 
              item.dataValues.disorder, onlyDate]})
          let allDisorders = 0, index = 0
          const allItemsByDate = allItems.reduce((acc, curr) => {
               if (allDisorders === 0) 
                 acc[index] = []
               acc[index].push(curr)
               if(allDisorders === 13){
                    allDisorders = -1
                    index++
               }
               allDisorders++
               return acc
             }, {})
          const resp = Object.values(allItemsByDate).map(subArray => subArray.flat())
          res.json(resp)
    }
    else res.json('')
})

app.get('/reportsByDisorder', async(req,res) => {

     const exists = await model.scidscores.findAll({
          where: { patientId: req.query.patient,
               disorder: req.query.disorder }
     })
     
     if(exists){
          const allItems = exists.map(item => {
               const date = new Date(item.dataValues.createdAt)
               const onlyDate = date.toISOString().split('T')[0]
               return [item.dataValues.lifetime_criteria, item.dataValues.past_criteria, onlyDate]
          })

          res.json(allItems)
     }
     else res.json('')
 })

app.post('/reports', async(req,res) => {
    
     const disorders = req.body.disorders
     const scores = req.body.scores
     const patientId = req.body.patientId
     const reportScores = scores.map((scores, index) => ({lifetime_criteria: scores[0], 
          past_criteria: scores[1], disorder: disorders[index], patientId}))

     const savedScores = await model.scidscores.bulkCreate(reportScores)

     const answers = req.body.answers
     const questionId = req.body.questionId
     let savedAnswers = []
     for(let i=0; i<14; i++){
          const details = questionId[i].map((questionId, index) => ({questionId, 
               answer: answers[i][index], patientId, disorder: disorders[i]}))
          savedAnswers = await model.scidanswers.bulkCreate(details)
     }

     if(savedScores && savedAnswers){
         res.send(JSON.stringify(savedScores))
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