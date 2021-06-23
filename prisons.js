var express = require('express')
var router = express.Router()
const getDataFromFile = require('./getDataFromFile')
const {DefaultPrisonsList, DefaultPrisonersList} = require('./defaultData')

const fs = require("fs");
const loginCheckMiddleWare = require('./middlewareFunction');


router.get("/", async (req, res) => {
    let a = getDataFromFile("./files/prisons.txt", DefaultPrisonsList);
    // console.log(result)
    a=JSON.parse(a)
    res.json(a);
  });




  router.get("/:id", async (req, res) => {
    let a = getDataFromFile("./files/prisons.txt", DefaultPrisonsList);
    // console.log(result)
    
    let {id} = req.params ; 
    let listOfPrisoner = JSON.parse(a);

    for(let i = 0 ; i<listOfPrisoner.length ; i++)
{
  if(listOfPrisoner[i].id === parseInt(id)){
    res.json(JSON.stringify(listOfPrisoner[i]));
    return
  }
}    
    
    
    res.json({message:'No Id Found'}).status(404);
    return


  });




  
  router.post("/", async (req, res) => {
    let dataFromFile = getDataFromFile("./files/prisons.txt", DefaultPrisonsList);
  
    let listOfPrisoner = JSON.parse(dataFromFile);
  
    let length = listOfPrisoner[listOfPrisoner.length-1].id + 1;
  
    let object1 = {
      name: req.body.name,
      occupancy: req.body.occupancy,
      id: length,
    };
    listOfPrisoner.push(object1);
  
    fs.writeFileSync("./files/prisons.txt", JSON.stringify(listOfPrisoner));
  
    res.json(JSON.stringify(listOfPrisoner));
  });
  
  router.put("/:id", async (req, res) => {
    let { id } = req.params;
      id = parseInt(id);
    let dataFromFile = getDataFromFile("./files/prisons.txt", DefaultPrisonsList);
    let listOfPrisoner = JSON.parse(dataFromFile);
  
    for (let i = 0; i < listOfPrisoner.length; i++) {
      if (listOfPrisoner[i].id === id) {
        // Update
        listOfPrisoner[i].occupancy =
          req.body.occupancy || listOfPrisoner[i].occupancy;
        listOfPrisoner[i].name = req.body.name || listOfPrisoner[i].name;
        fs.writeFileSync("./files/prisons.txt", JSON.stringify(listOfPrisoner));
        res.json(JSON.stringify(listOfPrisoner));
        return
      } else {
        res.json({ message: "No Data Found" }).status(404);
          return
      }
    }
  });
  
  
  router.delete("/:id", async (req, res) => {
      let { id } = req.params;
      id = parseInt(id);
      let dataFromFile = getDataFromFile("./files/prisons.txt", DefaultPrisonsList);
      let listOfPrisons = JSON.parse(dataFromFile);


      let dataFromFile1 = getDataFromFile("./files/prisoners.txt", DefaultPrisonersList);
      let listOfPrisoners = JSON.parse(dataFromFile1);

    for(let i=0 ; i<listOfPrisoners.length ;i++){
      if(listOfPrisoners[i].prisonId === id){
        listOfPrisoners.splice(i, 1);
      }
    }

    fs.writeFileSync("./files/prisoners.txt", JSON.stringify(listOfPrisoners));
      listOfPrisons.splice(id-1, 1);
      fs.writeFileSync("./files/prisons.txt", JSON.stringify(listOfPrisons));
      res.json(JSON.stringify(listOfPrisons));
  })
  
  
  module.exports = router