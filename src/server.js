import app from "./app";
import sequelize from "./config/Database";

// Db connection
// sequelize
//   .sync()
//   .then(() => {
//     console.log("Connection has been established successfully.");
    app.listen(process.env.PORT, () => {
      console.log(
        `The server is running on port ${process.env.PORT} in ${process.env.STAGE} mode`
      );
    });
  // })
  // .catch((err) => {
  //   console.error(
  //     `Unable to connect to the database in ${process.env.STAGE} mode:`,
  //     err
  //   );
  // });

