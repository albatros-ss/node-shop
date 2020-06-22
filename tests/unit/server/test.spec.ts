export {};
const app = require("../../../server/index");
const session = require("supertest-session");

let testSession;
let authenticatedSession;

beforeAll(function (done) {
  testSession = session(app);

  testSession
    .post("/api/auth/login")
    .send({
      email: "vv@mail.ru",
      password: "123",
    })
    .expect(200)
    .end(function (err) {
      if (err) return done(err);
      authenticatedSession = testSession;
      return done();
    });
});

describe("courses", function () {
  it("add valid id course", function () {
    return authenticatedSession
      .post("/api/card/add")
      .send({
        id: "5ecd2a9212643f24da213167",
      })
      .expect("")
      .expect(200);
  });

  it("add invalid id course", function () {
    return authenticatedSession
      .post("/api/card/add")
      .send({ id: "" })
      .expect("")
      .expect(500);
  });

  it("get course", async (done) => {
    const course = {
      title: expect.any(String),
      img: expect.any(String),
      userId: expect.any(String),
      price: expect.any(Number),
    };

    const res = await authenticatedSession.get(
      "/api/course/5ecd2a9212643f24da213167"
    );

    expect(JSON.parse(res.text).course).toMatchObject(course);
    done();
  });
});
