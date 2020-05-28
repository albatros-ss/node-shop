export {};
const { Schema, model } = require("mongoose");

const courseSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
  },
  img: {
    type: String,
    required: [true, "Img is required"],
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

courseSchema.method("toClient", function () {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const course = this.toObject();

  course.id = course._id;
  delete course._id;

  return course;
});

courseSchema.path("img").validate((val) => {
  const urlRegex = /(ftp|http|https):\/\/(\w+:?\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
  return urlRegex.test(val);
}, "Invalid URL.");

module.exports = model("Course", courseSchema);
