const express = require('express'); //Import Express
const Joi = require('joi'); //Impoer Joi
const app = express(); //Create Express Application on the app variable
app.use(express.json()); //used the json file

//Give data to the server
const customers = [
    {title: 'George', id: 1},
    {title: 'Josh', id: 2},
    {title: 'Tyler', id: 3},
    {title: 'Alice', id: 4},
    {title: 'Candice', id: 5},
]

//Read Request Handlers
// Display the message when the URL consist of '/'
app.get('/', (req, res) => {
    res.send('<h2 style="font-family: Malgun Gothic; color: darked;">Welcome to Tapan REST API</h2>');
  
});


// Display the List of customers when URL consists of api customers
app.get('/api/customers', (req,res) => {
    res.send(customers);
});

// Display the Information of Specific customers when you mention the id.
app.get('/api/customers/:id', (req,res) => {
    const customer = customers.find(c => c.id === parseInt(req.params.id));
    //If there is no valid customer ID, then display an error with the following
    if (!customer) res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darkred;">Oooops... Cant find what your are looking for!</h2>');
    res.send(customer);
});


//CREATE Request Handler
//CREATE New Customer Information
app.post('/api/customers', (req, res) => {
    const { error } = ValidateCustomer(req.body);
    if (error){
        res.status(400).send(error.details[0].message)
        return;
    }
    //Increment the customer id
    const customer = {
        title: req.body.title,
        id: customers.length + 1
    };
    customers.push(customer);
    res.send(customer);
});


//Update Request Handler
//Update Existing Customer Information
app.put('/api/customers/:id', (req, res) => {
    const customer = customers.find(c=> c.id === parseInt(req.params.id));
    if (!customer) res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darked;">Oooops... Cant find what your are looking for!</h2>');

    const { error} = ValidateCustomer(req.body);
    if (error){
        res.status(400).send(error.details[0].message);
        return;
    }

    customer.title = req.body.title;
    res.send(customer);
});



//Delete Customer Details
app.delete('/api/customers/:id', (req, res) => {

    const customer = customers.find( c=> c.id === parseInt(req.params.id));
    if(!customer) res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darked;">Oooops... Cant find what your are looking for!</h2>');

    const index =customers.indexOf(customer);
    customers.splice(index,1);

    res.send(customer);
});


//Validate Information
function ValidateCustomer(customer) {
    const schema = {
        title: Joi.string().min(3).required()
    };
    return Joi.validate(customer, schema);
}

//PORT Env Variable
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Listening on port ${port} . .`));