const express = require('express')
const morgan = require('morgan')
const app = express()

const bodyParser = require('body-parser')
app.use(bodyParser.json())

app.use(express.json())
morgan.token('json', function (req, res) { return JSON.stringify(req.body)}) 
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :json '))

let persons = [
  {
    id: 1,
    content: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-64233122"
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Tehtävä 3.1.!</h1>')
})

app.get('/info', (request, response) => {
  let requestTime = new Date()
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${requestTime}</p>`
    )
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    return response.status(400).json({ 
      info: 'no such id in phonebook' 
    })
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const generateId = () => {
  const maxId = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0
  return maxId + 1
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  //console.log(body)
  if (!body.name || !body.number) {
      return response.status(400).json({ 
      error: 'missing name or number' 
      })
  }
  
  if (persons.find(a => a.name === body.name)) {
    //console.log(`Name ${body.name} already exists!`)
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  const person = {
      id: generateId(),
      name: body.name,
      number: body.number
  }

  persons = persons.concat(person)
  response.json(person)


})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})