var ObjectID = require("mongodb").ObjectID;

module.exports = function(app, db) {
  app.get("/quotes/:id", (req, res) => {
    const id = req.params.id;
    const details = { _id: new ObjectID(id) };
    db.collection("quotes").findOne(details, (err, item) => {
      if (err) {
        res.send({ error: "An error has occurred" });
      } else {
        res.send(item);
      }
    });
  });

  const collection = app.post("/quotes", (req, res) => {
    const note = {
      body: req.body.body,
      title: req.body.title,
      author: req.body.author
    };
    db.collection("quotes").insertOne(note, (err, result) => {
      if (err) {
        res.send({ error: "An error has occurred" });
      } else {
        res.send(result.ops[0]);
      }
    });
  });

  app.delete("/quotes/:id", (req, res) => {
    const id = req.params.id;
    const details = { _id: new ObjectID(id) };
    db.collection("quotes").deleteOne(details, (err, item) => {
      if (err) {
        res.send({ error: "An error has occurred" });
      } else {
        res.send("Note " + id + " deleted!");
      }
    });
  });

  app.put("/quotes/:id", (req, res) => {
    const id = req.params.id;
    const details = { _id: new ObjectID(id) };
    const note = {
      body: req.body.body,
      title: req.body.title,
      author: req.body.author
    };
    db.collection("quotes").updateOne(details, note, (err, result) => {
      if (err) {
        res.send({ error: "An error has occurred" });
      } else {
        res.send(note);
      }
    });
  });
};
