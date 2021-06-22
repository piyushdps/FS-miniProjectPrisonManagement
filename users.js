const express = require("express");
const router = express.Router();
const fs = require("fs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const getDataFromFile = require("./getDataFromFile");

var salt = bcrypt.genSaltSync(10);

const defaultList = [{ id: "admin", password: "admin" }];

//
//

router.get("/logout", (req, res) => {
  res
    .setHeader("Set-Cookie", ["token=; HttpOnly", "x=42; HttpOnly", "y=88"])
    .json({ message: "Logged Out" });
});

//
//

router.post("/register", async (req, res) => {
  const { id, password } = req.body;
  console.log(id, password);

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

  const hashedPassword = await bcrypt.hashSync(password, salt);
  data.push({ id, password: hashedPassword });

  fs.writeFileSync("./files/userInfo.txt", JSON.stringify(data));

  res.setHeader("Set-Cookie", ["token=encryptedstring; HttpOnly" , `userName=${data[i].id}`]).json({ message: "Signed up Succesfully", id, password: hashedPassword });
});

//
//

router.post("/login", async (req, res) => {
  const { id, password } = req.body;
  

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
        res.setHeader("Set-Cookie", ["token=; HttpOnly"]).json({ message: "Wrong Password" });
        return;
      }
    } else {}
  }

  res.setHeader("Set-Cookie", ["token=; HttpOnly"]).json({ message: "No such User Found" });
  return;
});

module.exports = router;
