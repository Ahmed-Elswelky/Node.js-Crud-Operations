const courses = require("../models/courses.json");
const { validationResult } = require("express-validator");
const db = require('../dataBase/db');

const getCourses = async (req, res) => {
   try {
    const [rows] = await db.query('SELECT *  FROM courses');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
  // res.json(courses);
};
const getCourseById = async (req, res) => {
  const courseId = parseInt(req.params.id, 10);
   try {
    const [result] = await db.query(`SELECT * FROM courses WHERE id=${courseId}`);
    if (!result[0]) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
  // const course = courses.find((c) => c.id === courseId);
  // if (!course) {
  //   return res.status(404).send("Course not found");
  // }
  // res.json(course);
};

const addCourse = async(req, res) => {
  const {title, price} = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO courses (title, price) VALUES (?, ?)',
      [title, price]
    );
    res.status(201).json({ id: result.insertId, title, price });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Insert failed' });
  }
  // const newCourse = {
  //   id: courses.length + 1,
  //   ...body,
  // };

  // courses.push(newCourse);
  // res.status(201).json(newCourse);
};

const editCourse = async (req, res) => {
  const courseId = parseInt(req.params.id, 10);
  const { title, price: messageBody } = req.body;
    const fields = [];
    const values = [];
  
    if (title !== undefined) {
      fields.push("title = ?");
      values.push(title);
    }
  
    if (messageBody !== undefined) {
      fields.push("price = ?");
      values.push(messageBody);
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: "No fields provided for update" });
    }
  
    values.push(courseId);
  
    try {
      const [result] = await db.query(
        `UPDATE courses SET ${fields.join(", ")} WHERE id = ?`,
        values
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Course not found" });
      }
      const [course] = await getCourseById(req, res);
      res.status(200).json(course);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  // let course = courses.find((c) => c.id === courseId);
  // const body = req.body;
  
  // course = {
  //   ...course,
  //   ...body,
  // };
  // res.json(course);
};

const deleteCourse = async (req, res) => {
  const courseId = parseInt(req.params.id, 10);
  try {
      const [result] = await db.query(`DELETE FROM courses WHERE id = ?`, [courseId]);
      if (result.affectedRows === 0) {
      return res.status(404).send("Course not found");
      }
      res.status(200).send("Course deleted successfully");
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
  }
  // const courseIndex = courses.findIndex((c) => c.id === courseId);
  // if (courseIndex === -1) {
  //   return res.status(404).send("Course not found");
  // }
  // courses.splice(courseIndex, 1);
  // res.status(200).send("Course deleted successfully");
};

module.exports = {
  getCourses,
  getCourseById,
  addCourse,
  editCourse,
  deleteCourse,
};
