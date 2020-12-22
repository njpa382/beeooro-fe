if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = require("./app/app");

const main = () => {
  try {
    app.listen(app.get("port"), () => {
      console.log(`Server on Port: ${app.get("port")}`);
    });
  } catch (err) {
    console.log(err);
  }
};

main();
