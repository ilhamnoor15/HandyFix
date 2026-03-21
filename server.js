const express = require("express");
const app = express();
require("dotenv").config();

const path = require("path");
app.use(express.static(path.join(__dirname, "frontend")));
const PORT = process.env.PORT || 3000;

const db = require("./routes/database");

app.use(express.json());

const loginRouter = require("./routes/login");
app.use("/api/", loginRouter);

const registerRouter = require("./routes/register");
app.use("/api/",registerRouter);

const testRouter =require("./routes/test");
app.use("/api/", testRouter);

const userPagesRouter = require("./routes/pages/userPages");
app.use("/user", userPagesRouter);

const publicPagesRouter = require("./routes/pages/publicPages");
app.use("/", publicPagesRouter);

const adminPagesRouter = require("./routes/pages/adminPages");
app.use("/admin", adminPagesRouter);

const contractPagesRouter = require("./routes/pages/contractPages");
app.use("/contract", contractPagesRouter);



app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
