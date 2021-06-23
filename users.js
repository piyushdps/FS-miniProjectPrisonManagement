const express = require("express");
const router = express.Router();
const fs = require("fs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const getDataFromFile = require("./getDataFromFile");
const { DefaultPrisonsList, DefaultPrisonersList } = require("./defaultData");

var salt = bcrypt.genSaltSync(10);

const defaultList = [{ id: "admin",name:'admin',  password: "$2a$10$cvRyxT4Eu/.VG3kcu3y5reNtAqWLaj3tqpTg1cKkygMvUfARlyklC" }];

//
//

router.get("/logout", (req, res) => {
  res
    .setHeader("Set-Cookie", ["token=; HttpOnly", "x=42; HttpOnly","userName="])
    .json({ message: "Logged Out" });
});

//
//
router.get("/users/", async (req, res) => {
  let a = getDataFromFile("./files/userInfo.txt", defaultList);
 a =  JSON.parse(a)
  // console.log(result)
  res.json(a);
});

//
//

router.post("/register", async (req, res) => {
 const { id, password ,name} = req.body;
    console.log(id, password ,name);
 
 

  let data = new String();
  try {
    data = fs.readFileSync("./files/userInfo.txt", {
      encoding: "utf8",
      flag: "r",
    });
  } catch (error) {
    fs.writeFileSync("./files/userInfo.txt", JSON.stringify(defaultList));
    data = JSON.stringify(defaultList);
  }

  data = JSON.parse(data);
  let i=0

  for(i=0 ; i<data.length ; i++) {

    if(data[i].id  === id){
      res.status(401).json({message:'User Already Exists'});
      return
    }
  }


  try {
    const hashedPassword = await bcrypt.hashSync(password, salt);
  data.push({ id, password: hashedPassword ,name});
  fs.writeFileSync("./files/userInfo.txt", JSON.stringify(data));

  res.setHeader("Set-Cookie", ["token=encryptedstring; HttpOnly" , `userName=${data[i].id}`]).json({ message: "Signed up Succesfully", id, password: hashedPassword });

  } catch (error) {
    res.status(401).json({message: 'NOT WORKING FINE' })
    return
  }

});

 

//
//

router.post("/login", async (req, res) => {
  
  
try {
  const { id, name ,password } = req.body;
  let data = getDataFromFile("./files/userInfo.txt", defaultList);

  data = JSON.parse(data);

  for (let i = 0; i < data.length; i++) {
  
    if (data[i].id == id) {
        let match = await bcrypt.compareSync(password, data[i].password);
      if (match) {
        res
          .setHeader("Set-Cookie", ["token=encryptedstring; HttpOnly" , `userName=${data[i].id}`])
          .json({ message: "Logged in" ,userName :id });
        return;
      } else {
        res.setHeader("Set-Cookie", ["token=; HttpOnly" , "userName="]).json({ message: "Wrong Password" });
        return;
      }
    } else {}
  }

  res.setHeader("Set-Cookie", ["token=; HttpOnly" , "userName="]).json({ message: "No such User Found" });
  return;

} catch (error) {
  res.status(401).json({message:'error'});
  return
}
});


router.get('/checkLogin' , async (req,res) => {
  let dataFromFile1 = getDataFromFile("./files/prisons.txt" ,DefaultPrisonsList);
  
  let listOfPrisons = JSON.parse(dataFromFile1);
  let dataFromFile2 = getDataFromFile("./files/prisoners.txt", DefaultPrisonersList);
  
  let listOfPrisoners = JSON.parse(dataFromFile2);
  let dataFromFile3 = getDataFromFile("./files/prisoners.txt", defaultList);
  
  let listOfUsers = JSON.parse(dataFromFile3);



  if (!req.cookies.token || req.cookies.token !== 'encryptedstring'  ) return res.status(401).json({message:'Please Login ' , status:false});
else{
  const dashboardData = {
    user:listOfUsers.length,
    prison:listOfPrisons.length,
    prisoner:listOfPrisoners.length

  }
return  res.status(200).json({message:'Logged in ✔️' , status:true , data:dashboardData });
}



})

module.exports = router;
