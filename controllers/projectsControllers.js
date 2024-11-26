const Project = require("../models/Project");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

/** =============================
  * @desc  Add new project
  * @route  /api/projects
  * @method  POST
=============================*/
const addNewProject = async (req, res) => {
  try {
    const { name, category, description, alt } = req.body;
    const image = req.file;

    if (!name || !category || !alt || !description) {
      return res.status(400).json({ message: "Please fill out all fields." });
    }

    if (!image) {
      return res.status(400).json({ message: "Image is required." });
    }

    const imagePath = `${process.env.SERVER_URL}/uploads/projects/${image.filename}`;

    const project = await Project.create({
      name,
      category,
      description,
      image: {
        url: imagePath,
        alt: alt || "No description provided",
      },
    });

    return res.status(201).json(project);
  } catch (error) {
    console.error("Error during add project:", error);
    res.status(500).json({ message: "Error during add project." });
  }
};

/** =============================
  * @desc  Get all projects
  * @route  /api/projects
  * @method  GET
=============================*/
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    console.error("Error during get all projects:", error);
    res.status(500).json({ message: "Error during get all projects." });
  }
};

/** =============================
  * @desc  Get project by id
  * @route  /api/projects/:id
  * @method  GET
=============================*/
const getProjectById = async (req, res) => {
  try {
    const id = req.params.id;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found..!" });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error("Error during get project:", error);
    res.status(500).json({ message: "Error during get project." });
  }
};

/** =============================
  * @desc  Delete project
  * @route  /api/projects/:id
  * @method  DELETE
=============================*/
const deleteProject = async (req, res) => {
  try {
    const id = req.params.id;

    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found..!" });
    }

    const imagePath = path.join(
      __dirname,
      "../uploads/projects",
      path.basename(project.image.url)
    );
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    res.status(200).json({ message: "Project has been deleted..!" });
  } catch (error) {
    console.error("Error during delete project:", error);
    res.status(500).json({ message: "Error during delete project." });
  }
};

module.exports = {
  addNewProject,
  getAllProjects,
  getProjectById,
  deleteProject,
};
