const
  express = require('express'),
  //mergeParams merges the params of the campground and comments together
  // basically, a fix for passing :id properly once we refactored into these lines in app.js:
  //app.use("/campgrounds", campgroundRoutes);
  //app.use("/campgrounds/:id/comments", commentRoutes);
  router = express.Router({ mergeParams: true }),
  middlewareObj = require("../middleware"),
  Comment = require("../models/comment"),
  Campground = require("../models/campground");

//Comments New
router.get("/new", middlewareObj.isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { campground: foundCampground });
    }
  });
});

//Comments Create
router.post("/", middlewareObj.isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          //add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          //save comment
          comment.save();

          campground.comments.push(comment);
          campground.save();
          console.log(comment);
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});

//Comments Edit
router.get("/:comment_id/edit", middlewareObj.checkCommentOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      Comment.findById(req.params.comment_id, (err, comment) => {
        if (err) {
          console.log(err);
          res.redirect("back");
        } else {
          res.render("comments/edit", { campground: campground, comment: comment });
        }
      });
    }
  })
});

//Comments Update
router.put("/:comment_id", middlewareObj.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
    if (err) {
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

// Comments Destroy
router.delete("/:comment_id", middlewareObj.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndDelete(req.params.comment_id, (err, theDeparted) => {
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      console.log(theDeparted + " has been deleted!");
      res.redirect("/campgrounds/" + req.params.id);
    }
  })
})

module.exports = router;