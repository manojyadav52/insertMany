const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT =8080;


app.use(express.json());
app.use(express.urlencoded({extended:true}));


// connect the database mongoose
mongoose.connect('mongodb://localhost:27017/employee-data',
    {useNewUrlParser: true, useUnifiedTopology: true});

// created Schema 
const employeeSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    salary:{
        type:Number,
        required:true,
    },
    phone:{
        type:Number,
        required:true,
        unique:true,
        min:10,
    },
    address:{
        type:String,
        min:3,
    },
    gender:{
        type:String,
        value:['male','femal']
    },
});



// create model 
const Employee =mongoose.model("Employee",employeeSchema);

// post methods 
app.post('/employee',async (req,res)=>{
      try{
        const newEmp =new Employee(req.body);
        await newEmp.save();
        res.status(201).json(newEmp);
      }catch(error){
        res.status(500).json({error:"internal server Issue"});
      }
});



// get methods and  show all data 
app.get('/employee',async (req,res)=>{
      try{
        const showData = await Employee.find();
        if(showData){
            res.json(showData);
        }else{
            res.status(400).json({error:"data not found"});
        }
      }catch(error){
         res.status(500).json({error: "Internal Server issues"});
      }
    
})

// update Employee Data 
app.patch('/employee/:id',async (req,res)=>{
        try{
            const updateOne = await Employee.findByIdAndUpdate(req.params.id, req.body, {new:true});
            if(updateOne){
                res.status(201).json(updateOne);
            }else{
               res.status(404).json({error:"data not found"});
            }
        }catch(error){
            res.status(500).json({error:"internal Server issue"});
        }
});




// updateMany
app.put('/employee',async (req,res)=>{
    try{
        const{filter,updateData} =req.body;
        const updateManyData = await Employee.updateMany(filter,{$set:updateData});
            if(updateManyData){
                res.json(updateManyData);
            }else{
                res.status(400).json({error:"data not updated"});
            }
    }catch(error){
        res.json({error:'internal server Issue'});
    }
})



// DeleteMany
app.delete('/employee',async (req,res)=>{
    try{
        const{filter} = req.body;
        const deleteAll =await Employee.deleteMany(filter);
        if(deleteAll){
            res.end();
        }else{
            res.json({error:"data not deleted"});
        }
    }catch(error){
        res.json({error:"Interanl server issue"});
    }
})


// InsertMany
app.post('/employees',async (req,res)=>{
    try{
         const {instMany} = req.body;
         const inMany = await  Employee.insertMany(instMany);
        if(inMany){
            res.json(inMany);
        }else{
            res.json({error:"data not inserted"});
        }
        
    }catch(error){
        res.status(500).json({error:"Interanl Server Issue"});
    }
})



// insertMany
app.post('/employee',async (req,res)=>{
        try{
            const instMany = await new Employee.insertMany(req.body);
            await instMany.save();
            res.status(201).json(instMany);
        } catch(error){
            res.status(500).json({error:'internal Server issue'});
        }
});

// 



// Delete Employee Data with the help of the Delete Methods
app.delete('/employee/:id',async (req,res)=>{
    try{
        const deleteEmp = await Employee.findByIdAndDelete(req.params.id);
            if(deleteEmp){
                await deleteEmp.status(204).end();
            }else{
                res.status(400).json({error:"data not found"});
            }
        // res.json(deleteEmp);
       
    }catch(error){
        res.status(500).json({error:"Interanal Server Issue...."});
    }

})

// created server 

app.listen(PORT,(req,res)=>console.log(`server will be listening on ${PORT}`));