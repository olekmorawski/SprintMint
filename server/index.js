const PORT = 8000
const express = require("express")
const app = express()

app.get("/", (res, req) => {
    res.json("Dupa")
})
app.listen(PORT, () => console.log("Server runnig on" + PORT))