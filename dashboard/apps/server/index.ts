import express from "express";

const app = express();

app.listen(8080, ()=> {
  console.log("listen in port " + 8080);
})