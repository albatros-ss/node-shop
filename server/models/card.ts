export {};
const path = require("path");
const fs = require("fs");

const p: string = path.join(__dirname, "..", "data", "card.json");

type CourseType = {
  title: string;
  price: number;
  img: string;
  _id: string;
  count: number;
};

type CardType = {
  courses: Array<CourseType>;
};

class Card {
  static async add(course: CourseType): Promise<CardType> {
    const card: CardType = await Card.fetch();

    const idx: number = card.courses.findIndex(
      (c: CourseType) => c._id === course._id
    );
    const candidate: CourseType = card.courses[idx];

    if (candidate) {
      candidate.count++;
      card.courses[idx] = candidate;
    } else {
      course.count = 1;
      card.courses.push(course);
    }

    return new Promise<Promise<any>>((resolve, reject) => {
      fs.writeFile(p, JSON.stringify(card), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  static async remove(_id: string): Promise<CardType> {
    const card: CardType = await Card.fetch();

    const idx: number = card.courses.findIndex(
      (c: CourseType) => c._id === _id
    );
    const course: CourseType = card.courses[idx];

    if (course.count === 1) {
      card.courses = card.courses.filter((c) => c._id !== _id);
    } else {
      card.courses[idx].count--;
    }

    return new Promise((resolve, reject) => {
      fs.writeFile(p, JSON.stringify(card), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(card);
        }
      });
    });
  }

  static async fetch(): Promise<CardType> {
    return new Promise<Promise<CardType>>((resolve, reject) => {
      fs.readFile(p, "utf-8", (err, content) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(content));
        }
      });
    });
  }
}

module.exports = Card;
