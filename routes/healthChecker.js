const express = require('express');
const router = express.Router();

router.get("/", async(req, res)=>{
    const healthcheck = {
        uptime: process.uptime(),
        responsetime: process.hrtime(),
        message: 'Okay',
        timestamp: Date.now()
    };
    try{
        res.send(healthcheck);
    } catch{
        healthcheck.message = Error;
        res.status(200).send();
    }
});

module.exports = router;