const
  express = require('express'),
  router = express.Router(),
  middlewareObj = require("../middleware"),
  Campground = require("../models/campground"),
  Comment = require("../models/comment");

// CAMPGROUND INDEX
router.get("/", (req, res) => {

  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", { campgrounds: allCampgrounds });
    }
  });
});

// CAMPGROUND CREATE 
router.post("/", middlewareObj.isLoggedIn, (req, res) => {
  const name = req.body.name;
  const image = req.body.image;
  const description = req.body.description;
  const author = {
    id: req.user._id,
    username: req.user.username
  };
  const newCampground = { name, image, description, author }
  Campground.create(newCampground, (err, newlyCreated) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    }
  });
});

// CAMPGROUND NEW 
router.get("/new", middlewareObj.isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

// CAMPGROUND SHOW 
router.get("/:id", (req, res) => {
  Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/show", { campground: foundCampground });
    }
  });
});

// CAMPGROUND EDIT

router.get("/:id/edit", middlewareObj.checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    res.render("campgrounds/edit", { campground: foundCampground });
  })
});

// CAMPGROUND UPDATE
router.put("/:id", middlewareObj.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      console.log("updatedCampground");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

// CAMPGROUND DESTROY
router.delete("/:id", middlewareObj.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndDelete(req.params.id, (err, campgroundRemoved) => {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    }
    Comment.deleteMany({ _id: { $in: campgroundRemoved.comments } }, (err) => {
      if (err) {
        console.log(err);
      }
      res.redirect("/campgrounds");
    });
  });
});

module.exports = router;