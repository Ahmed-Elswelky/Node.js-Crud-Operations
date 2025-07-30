const db = require("../config/db");

const getNotifications = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM notifications");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
  // res.json(Notifications);
};
const getNotificationById = async (req, res) => {
  const NotificationId = parseInt(req.params.id, 10);
  console.log(NotificationId);

  try {
    const [result] = await db.query(
      `SELECT * FROM notifications WHERE id=${NotificationId}`
    );
    if (!result[0]) {
      return res.status(404).json({ error: "Notification not found" });
    }
    res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
  // const Notification = Notifications.find((c) => c.id === NotificationId);
  // if (!Notification) {
  //   return res.status(404).send("Notification not found");
  // }
  // res.json(Notification);
};

const addNotification = async (req, res) => {
  const { title, body } = req.body;
  try {
    console.log(title, body);

    const [result] = await db.query(
      "INSERT INTO notifications (title, body) VALUES (?, ?)",
      [title, body]
    );
    res.status(201).json({ id: result.insertId, title, body });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
  // const newNotification = {
  //   id: Notifications.length + 1,
  //   ...body,
  // };

  // Notifications.push(newNotification);
  // res.status(201).json(newNotification);
};

const editNotification = async (req, res) => {
  const NotificationId = parseInt(req.params.id, 10);
  const { title, body: messageBody } = req.body;
  const fields = [];
  const values = [];

  if (title !== undefined) {
    fields.push("title = ?");
    values.push(title);
  }

  if (messageBody !== undefined) {
    fields.push("body = ?");
    values.push(messageBody);
  }

  // ✅ لو مفيش ولا حقل اتبعت
  if (fields.length === 0) {
    return res.status(400).json({ error: "No fields provided for update" });
  }

  values.push(NotificationId);

  try {
    const [result] = await db.query(
      `UPDATE notifications SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Notification not found" });
    }
    const [notification] = await getNotificationById(req, res);
    res.status(200).json(notification);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const deleteNotification = async (req, res) => {
  const NotificationId = parseInt(req.params.id, 10);
  try {
    const [result] = await db.query(`DELETE FROM notifications WHERE id = ?`, [
      NotificationId,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).send("Notification not found");
    }
    res.status(200).send("Notification deleted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
  //   const NotificationIndex = Notifications.findIndex((c) => c.id === NotificationId);
  //   if (NotificationIndex === -1) {
  //     return res.status(404).send("Notification not found");
  //   }
  //   Notifications.splice(NotificationIndex, 1);
  //   res.status(200).send("Notification deleted successfully");
};

module.exports = {
  getNotifications,
  getNotificationById,
  addNotification,
  editNotification,
  deleteNotification,
};
