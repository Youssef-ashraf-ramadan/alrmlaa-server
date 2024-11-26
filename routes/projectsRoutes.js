const express = require("express");
const router = express.Router();
const {
  addNewProject,
  getAllProjects,
  getProjectById,
  deleteProject,
} = require("../controllers/projectsControllers");
const uploadProjectImage = require("../middlewares/uploadProjectImage");

router.post("/", uploadProjectImage.single("image"), addNewProject);
router.get("/", getAllProjects);
router.get("/:id", getProjectById);
router.delete("/:id", deleteProject);

module.exports = router;
