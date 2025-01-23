import express, { Request, Response } from "express";
import userRouter from "./Routes/userRoute";
import bodyParser from "body-parser";
import shopRouter from "./Routes/shopRoute";

const app = express();
const port: number = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api/user", userRouter);
app.use("/api/shop", shopRouter);

app.use("/", (req, res) => {
  res.send("this is home ");
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
