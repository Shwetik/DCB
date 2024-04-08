// backend/index.jss
// backend/index.js
const express = require('express');
const cors = require("cors");
const rootRouter = require("./routes/index");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", rootRouter);


// Start the server
const PORT = process.env.PORT || 3059;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
