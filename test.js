const bcrypt = require('bcrypt');
const crypto=require("crypto")
const run = async () => {
  const plainPassword = crypto.randomBytes(32).toString("hex");

  // Hash the password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  console.log('Hashed Password:', hashedPassword);

  // Compare the plain password with the hashed password
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  console.log('Do the passwords match?', isMatch);
};

run().catch(console.error);
