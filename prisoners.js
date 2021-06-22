var express = require('express')
var router = express.Router()
const getDataFromFile = require('./getDataFromFile')
const {DefaultPrisonsList,DefaultPrisonersList} = require('./defaultData')
const fs = require("fs");
const { json } = require('express');



router.get("/", async (req, res) => {
    let a = getDataFromFile("./files/prisoners.txt", DefaultPrisonersList);
    // console.log(result)
    res.json(a);
  });




  router.get("/:id", async (req, res) => {
    let a = getDataFromFile("./files/prisoners.txt", DefaultPrisonersList);
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
    let dataFromFile = getDataFromFile("./files/prisoners.txt", DefaultPrisonersList);
  
    let listOfPrisoner = JSON.parse(dataFromFile);
  
    let length = listOfPrisoner.length + 1;
  
    let object1 = {
      name: req.body.name,
      crime: req.body.crime,
      id: length,
      prisonId:req.body.prisonId
    };
    listOfPrisoner.push(object1);
  
    fs.writeFileSync("./files/prisoners.txt", JSON.stringify(listOfPrisoner));
  
    res.json(JSON.stringify(listOfPrisoner));
  });
  
  router.put("/:id", async (req, res) => {
    let { id } = req.params;
      id = parseInt(id);
    let dataFromFile = getDataFromFile("./files/prisoners.txt", DefaultPrisonersList);
    let listOfPrisoner = JSON.parse(dataFromFile);
  let updated = false
    for (let i = 0; i < listOfPrisoner.length; i++) {
      if (listOfPrisoner[i].id === id) {
        // Update
        updated=true;
        listOfPrisoner[i].crime =
          req.body.crime || listOfPrisoner[i].crime;
          listOfPrisoner[i].prisonId =
          req.body.prisonId || listOfPrisoner[i].prisonId;
        listOfPrisoner[i].name = req.body.name || listOfPrisoner[i].name;
        fs.writeFileSync("./files/prisoners.txt", JSON.stringify(listOfPrisoner));
        res.json(JSON.stringify(listOfPrisoner));
        return
      } else {
       
      }

     
    } if(updated === false){
        res.json({ message: "No Data Found" }).status(404);
        return
      }
  });
  
  
  router.delete("/:id", async (req, res) => {
      let { id } = req.params;
      id = parseInt(id);
      let dataFromFile = getDataFromFile("./files/prisoners.txt", DefaultPrisonersList);
      let listOfPrisoner = JSON.parse(dataFromFile);
      listOfPrisoner.splice(id-1, 1);
      fs.writeFileSync("./files/prisoners.txt", JSON.stringify(listOfPrisoner));
      res.json(JSON.stringify(listOfPrisoner));
  })
  
  
  module.exports = router