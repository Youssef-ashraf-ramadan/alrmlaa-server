const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

/** =============================
  * @desc  Add admin accounts
  * @method  Internal function
=============================*/
const createAdminAccounts = async () => {
  try {
    const adminAccounts = [
      {
        name: "Alramlaa factory",
        email: "Alramlaafactory@alramlaa.com",
        phone: "01024289101",
        location: "Riyad, Saudi Arabia",
        password: "alr@0158",
        isAdmin: true,
      },
    ];

    for (let adminData of adminAccounts) {
      const { email, password } = adminData;

      const existingAdmin = await Admin.findOne({ email });
      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(password, 10);

        await Admin.create({
          ...adminData,
          password: hashedPassword,
        });

        console.log(`Admin account created successfully for ${email}`);
      } else {
        console.log(`Admin account already exists for ${email}`);
      }
    }
  } catch (error) {
    console.error("Error creating admin accounts:", error);
  }
};

module.exports = createAdminAccounts;
