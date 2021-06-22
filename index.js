const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const fs = require("fs");
const prisonsRoutes = require('./prisons.js')
const prisonersRoutes = require('./prisoners.js')
const userRoutes = require('./users.js')
const cookieParser = require("cookie-parser");

const loginCheckMiddleWare = require("./middlewareFunction.js");

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());




app.get("/", (req, res) => {
  console.log(req.params);

  res.json({ id: req.params.id3 }).status(404);
});

app.use('/' ,userRoutes )

app.use('/prisons',loginCheckMiddleWare ,prisonsRoutes )

app.use('/prisoners',loginCheckMiddleWare ,prisonersRoutes )







app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
