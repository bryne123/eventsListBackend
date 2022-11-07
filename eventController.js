const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://Bryn123:Webdev@cluster0.rukmw7w.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const createError = require("http-errors");

let eventlist = [];
let idno = 0;

// To get the initial index of events
exports.index = function (req, res) {
  client.connect(async (err) => {
    const findResult = client.db("EventsList").collection("Events").find();
    const result = await findResult.toArray();
    res.send(result);
  });
};

// To create the event list
exports.create = function (req, res, next) {
  if (!req.body.name) {
    return next(createError(400, "name is required"));
  }
  client.connect((err) => {
    client
      .db("EventsList")
      .collection("Events")
      .insertOne({
        name: req.body.name,
        description: req.body.description,
        location: req.body.location,
        date: req.body.date,
        time: req.body.time,
      })
      .then(() => {
        res.send({ result: true });
      });
  });
};

// To get the event list after creating
exports.show = function (req, res, next) {
  client.connect(async (err) => {
    console.log(req.params.id);
    client
      .db("EventsList")
      .collection("Events")
      .findOne({ id: ObjectId(req.params.id) })
      .then((result) => {
        if (result) {
          return res.send(result);
        }
        return next(createError(404, "no event with that id"));
      });
  });
};
// To delete the eventlist with id
exports.delete = function (req, res, next) {
  client.connect(async (err) => {
    client
      .db("EventsList")
      .collection("Events")
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        if (result.deletedCount) {
          return res.send({ result: true });
        }
        return next(createError(404, "no event with that id"));
      });
  });
};

// To update the eventlist with id
exports.update = function (req, res, next) {
  if (!req.body.name) {
    return next(createError(400, "name is required"));
  }

  client.connect(async (err) => {
    if (err) {
      return next(createError(500, `Error: ${err}`));
    }
    const result = await client
      .db("EventsList")
      .collection("Events")
      .updateOne(
        { _id: ObjectId(req.params.id) },
        {
          $set: {
            name: req.body.name,
            description: req.body.description,
            location: req.body.location,
            date: req.body.date,
            time: req.body.time,
          },
        }
      );

    if (result.matchedCount) {
      return res.send({ result: true });
    }
    return next(createError(404, "no event with that id"));
  });
};
