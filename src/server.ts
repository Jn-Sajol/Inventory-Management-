import express, { Request, Response } from "express";
import userRouter from "./Routes/userRoute";
import bodyParser from "body-parser";
import shopRouter from "./Routes/shopRoute";
import customerRouter from "./Routes/customerRoute";
import supplierRouter from "./Routes/supplierRoute";
import unitRouter from "./Routes/unitRoute";
import brandRouter from "./Routes/brandRoute";
import categoryRouter from "./Routes/categoryRoute";
import productRouter from "./Routes/productRoute";
import saleroute from "./Routes/saleRoute";

const app = express();
const port: number = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api/user", userRouter);
app.use("/api/shop", shopRouter);
app.use("/api/customer", customerRouter);
app.use("/api/supplier", supplierRouter);
app.use("/api/unit", unitRouter);
app.use("/api/brand", brandRouter);
app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);
app.use("/api/sale", saleroute);

app.use("/", (req, res) => {
  res.send("this is home ");
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
