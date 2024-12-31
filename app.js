
const prompt = require('prompt-sync')();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const Customer = require('./modules/Customer')

async function connect(){
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
}

async function disconnect(){
      // Disconnect our app from MongoDB after our queries run.
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    
      // Close our app, bringing us back to the command line.
      process.exit();
}

async function createCustomer(customerName, customerAge){

    const customerData = {
        name: customerName,
        age: customerAge
    }

    const customerCreated = await Customer.create(customerData);
    console.log(customerCreated)
}

async function updateCustomerById(id, newName, newAge){
    const updatedCustomer = await Customer.findByIdAndUpdate(id,
        {name: newName,
            age:newAge
        },
        {new:true}
    )
    console.log(updatedCustomer)
}

async function deletCustomerById(id){
    const deletedCustomer = await Customer.findByIdAndDelete(id)
    console.log(deletedCustomer)
}

async function showCustomers(){
    const customers = await Customer.find({});
    customers.forEach((customer)=>{
        console.log(`id: ${customer._id} -- Name: ${customer.name}, Age: ${customer.age}`);
    })
}

actions = [
    "Create", "View", "Update", "Delete", "Quit"
]

function promptActions(){
    console.log(`Waht would you like to do?`);
    console.log("(1) Create");
    console.log("(2) View");
    console.log("(3) Update");
    console.log("(4) Delete");
    console.log("(5) Quit");
    console.log(`Number of actions to run:`);
    const userAction = prompt(`>`);
    console.log(`You select: ${actions[userAction-1]}`) ;
    return actions[userAction-1];
}
  

async function processInput(action){
    
    switch (action) {
        case "Create":
            console.log('What is the customer name?');
            const customerName = prompt('>');
            console.log('What is the customer age?');
            const customerAge = prompt('>');
            await createCustomer(customerName, customerAge);
            return true;
            break;
        
        case "View":
            await showCustomers();
            return true;
            break;

        case "Update":
            await showCustomers();
            console.log("Copy and paste the id of the customer you would like to update here:")
            const customerId = prompt(">");
            console.log('What is the customer new name?');
            const customerNewName = prompt('>');
            console.log('What is the customer new age?');
            const customerNewAge = prompt('>');
            await updateCustomerById(customerId, customerNewName, customerNewAge);
            return true;
            break;
        case "Delete":
            await showCustomers();
            console.log("Copy and paste the id of the customer you would like to update here:")
            const customerToDeleteId = prompt(">");
            await deletCustomerById(customerToDeleteId);
            return true;
            break;
        default:
            console.log("exiting...")
            return false;
            break;
    }
    
}


async function main(){
    let loopStatus = true;
    await connect();
    while(loopStatus){
        let action = promptActions();
        loopStatus = await processInput(action);
    }
    await disconnect();
}

main();

