import jwt from "jsonwebtoken";

const CreateJWT = (user) => {
  console.log(user);
  const token = jwt.sign(
    {
      ...user,
    },
    process.env.TokenCode,
    {
      expiresIn: "8h",
    }
  );
  return token;
};

export default CreateJWT;
