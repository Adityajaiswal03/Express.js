const express= require('express');
const mongoose= require('mongoose');
const fs = require("fs").promises;
// require("dotenv").config();

// const userName = process.env.UserName;

// mongoose.connect(`${userName}`)
// .then(()=>{
//     console.log('Connected to MongoDB...')
// }).catch((err)=>{
//     console.log('Could not connect to MongoDB...', err)
// });

const app = express();

app.use(express.json());


// const productScheme = new mongoose.Schema({
//     product_name: {
//         type: String,
//         required: true
//     },
//     product_price:{
//         type: String,
//         required: true
//     },
//     // isInStock:{
//     //     type: String,
//     //     required: true
//     // },
//     Category:{
//         type: String,
//         required: true
    
//     }
// });

// const productModel = mongoose.model('products', productScheme);

// app.post('/api/products', async (req, res)=>{
//     productModel.create({
//         product_name:req.body.product_name,
//         product_price:req.body.product_price,
//         isInStock:req.body.isInStock,
//         Category:req.body.Category
//         }
//     );
//     return res.status(201).json({message:"Product Created"});
// });


let courses = [];

const filename = "Course.txt";
readDataFromFile(filename);
async function readDataFromFile(filename) {
    try {
        const data = await fs.readFile(filename, { encoding: "utf8" });

        // Split data by lines assuming each line is a JSON object
        const jsonObjects = data.trim().split("\n");


        // Parse each JSON object and store in courses array
        courses = jsonObjects
            .map((jsonString) => {
                try {
                    return JSON.parse(jsonString);
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                    return null;
                }
            })
            .filter((obj) => obj !== null); // Filter out any failed parses

        console.log("Data loaded successfully:", courses);
    } catch (error) {
        console.error("Error reading file:", error);
    }
}



app.get('/courses', (req, res)=>{
    res.json(courses);
})

async function writeDataToFile(filename, data) {
    try {
        const jsonStrings = data.map((obj) => JSON.stringify(obj));
        const jsonString = jsonStrings.join("\n");
        await fs.writeFile(filename, jsonString, "utf8");
        console.log("Data written to file successfully.");
    } catch (error) {
        console.error("Error writing to file:", error);
        throw error; 
    }
}


app.post("/courses", async (req, res) => {
    const newCourse = req.body;
    console.log("New course:", newCourse);
    try {
        courses.push(newCourse);
        await writeDataToFile(filename, courses); 
        res.status(201).json(newCourse); 
    } catch (error) {
        console.error("Error adding course:", error);
        res.status(500).send("Error adding course");
    }
});

app.put('/courses/:id', (req, res)=>{
    const course= courses.find(c=>c.id===req.params.id);
    if(!course) return res.status(404).send('The course with the given ID was not found');
    course.name=req.body.name;
    res.send(course);
});

app.delete('/courses/:id', (req, res)=>{
    const course= courses.find(c=>c.id===req.params.id);
    if(!course) return res.status(404).send('The course with the given ID was not found');
    const index= courses.indexOf(course);
    courses.splice(index, 1);
    res.send(course);
});

function middleware(req, res, next) {
    console.log("called");
    next();
}
/**
 * logger 
 * method,ip,hostname,date
 * put call update id 1 to spurng 
 * delete call delete id 2
 */

app.listen(3000, ()=>console.log('listening on port 3000...'));