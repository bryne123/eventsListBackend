const express = require("express");
const router = express.Router();
const events = require("./eventController");

router.get("/event", events.index);
router.post("/event/create", events.create);
router.get("/event/:id", events.show);
router.delete("/event/:id", events.delete);
router.put("/event/:id", events.update);

module.exports = router;
