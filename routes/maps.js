/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();
const {
  getUserById,
  getMapPoints,
  getMap,
  getAllFavourites,
} = require("../helpers");

module.exports = (db) => {
  ///////////////////
  // GET Requests //
  /////////////////

  function hasUser(userId, cb, res) {
    getUserById(db, userId)
      .then(cb)
      .catch((err) => {
        res.status(500).send("Error: err.message");
      });
  }

  // GET Route for MAPS
  router.get("/", (req, res) => {
    const userId = req.session.user_id;
    const userName = req.session.name;

    getUserById(db, userId).then((user) => {
      if (user) {
        getMap(db, userId)
          .then((data) => {
            res.render("maps", { userId, userName, data });
          })
          .catch((err) => {
            res.status(500).send("Error: err.message");
          });
      }
    });

    /*     hasUser(userId,() => {
        res.render("index", { userId, userName });
      }); */
  });

  // GET Route for CREATE
  router.get("/create", (req, res) => {
    const userId = req.session.user_id;
    const userName = req.session.name;

    getUserById(db, userId)
      .then((data) => {
        res.render("create-maps", { userId, userName });
      })
      .catch((err) => {
        res.status(500).send("Error: err.message");
      });
  });

  // GET Route for FAVOURITES
  router.get("/favourites", (req, res) => {
    const userId = req.session.user_id;
    const userName = req.session.name;

    getUserById(db, userId).then((user) => {
      if (user) {
        getAllFavourites(db, userId)
          .then((data) => {
            res.render("favourites", { userId, userName, data });
          })
          .catch((err) => {
            res.status(500).send("Error: err.message");
          });
      }
    });
  });

  // GET Route for POINTS
  router.get("/:id/points", (req, res) => {
    getMapPoints(db, req.params.id, res).then((points) => {
      res.json(points);
    });
  });

  // GET Route for EDIT
  router.get("/:mapId/edit", (req, res) => {
    const userId = req.session.user_id;
    const userName = req.session.name;

    getUserById(db, userId)
      .then((data) => {
        console.log("mapId", req.params.mapId);
        res.render("edit-maps", { userId, userName, id: req.params.mapId });
      })
      .catch((err) => {
        res.status(500).send("Error: err.message");
      });
  });

  // GET Route for /maps/user_id
  router.get("/:id", (req, res) => {
    const userId = req.session.user_id;
    const userName = req.session.name;

    getUserById(db, userId)
      .then((data) => {
        res.render("maps", { userId, userName, id: req.params.id });
      })
      .catch((err) => {
        res.status(500).send("Error: err.message");
      });
  });

  /////////////////////
  // POST Requests //
  ///////////////////

  // POST Route to CREATE a MAP
  router.post("/create", (req, res) => {
    const user_id = req.session.user_id;
    const title = req.body.title;
    const description = req.body.description;

    getUserById(db, user_id);

    /*       .then(user => {
        if (user) {
          return res.status(400).send("E-mail already on our database.");
        }
        if (userName === "" | userEmail === "" || userPassword === "") {
          return res.status(400).send("Name, E-mail and Password can not be blank. Please try again.");
        } */

    db.query(
      `INSERT INTO maps (
          user_id, title, description)
          VALUES ($1, $2, $3)
          RETURNING id`,
      [user_id, title, description]
    ).then((result) => {
      console.log(result.rows[0].id);
      res.redirect(`/maps/${result.rows[0].id}/edit`);
    });
  });



  // POST Route to ADD POINTS to a MAP
  router.post("/:mapId/points", (req, res) => {
    const map_id = req.params.mapId;
    const description = req.body.description;
    const title = req.body.title;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    console.log("Map id", map_id);
    db.query(
      `INSERT INTO points (
      map_id, description, title, latitude, longitude)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;`,
      [map_id, description, title, latitude, longitude]
    )
      .then((data) => {
        res.status(200).send();
      })
      .catch((err) => {
        res.status(500).send("Error: err.message");
        console.log(err);
      });
  });

  // POST Route to DELETE a FAVOURITE
  router.post("/favourites/:favId/delete", (req, res) => {
    console.log("This is the delete route")
    const fav_id = 2;
    const userId = req.session.user_id;
    const userName = req.session.name;

    console.log("favourite id", fav_id);
    getUserById(db, userId).then((user) => {
      if (user) {
        db.query(`DELETE FROM favourites WHERE id = $1`, [fav_id]);
        getAllFavourites(db, userId)
          .then((data) => {
            console.log("data2", data);
            res.render("favourites", { userId, userName, map_id, data });
          })
          .catch((err) => {
            res.status(500).send("Error: err.message");
          });
      }
    });
  });

  // POST Route to DELETE a MAP
  router.post("/:mapId/delete", (req, res) => {
    console.log("This is delete also")
    const map_id = req.params.mapId;
    const userId = req.session.user_id;
    const userName = req.session.name;
    getUserById(db, userId).then((user) => {
      if (user) {
        db.query(`DELETE FROM maps WHERE id = $1`, [map_id]);
        getMap(db, userId)
          .then((data) => {
            console.log("data2", data);
            res.render("maps", { userId, userName, map_id, data });
          })
          .catch((err) => {
            res.status(500).send("Error: err.message");
          });
      }
    });
  });



  return router;
};
