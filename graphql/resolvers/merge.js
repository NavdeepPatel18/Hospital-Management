const Doctor = require("../../models/doctor");
const Category = require("../../models/category");
const Hospital = require("../../models/hospital");
const CovidCenter = require("../../models/covidcenter");
const Staff = require("../../models/staff");
const User = require("../../models/user");
const Admin = require("../../models/admin");

const admin = async (adminId) => {
  try {
    const admin = await Admin.findById(adminId);
    if (!admin) {
      throw new Error("User not exist!");
    }
    return { ...admin._doc, _id: admin.id, password: null };
  } catch (err) {
    throw err;
  }
};

const category = async (categoryId) => {
  try {
    const category = await Category.findById(categoryId);
    return { ...category._doc, _id: category.id };
  } catch (err) {
    throw err;
  }
};

const doctor = async (staffId) => {
  try {
    const doctor = await Doctor.findById(staffId);
    return { ...doctor._doc, _id: doctor.id, password: null };
  } catch (err) {
    throw err;
  }
};

const user = async (userId) => {
  try {
    const user = await User.findById(userId);
    return { ...user._doc, _id: user.id, password: null };
  } catch (err) {
    throw err;
  }
};

const hospital = async (hospitalId) => {
  try {
    const hospital = await Hospital.findById(hospitalId);
    return { ...hospital._doc, _id: hospital.id };
  } catch (err) {
    throw err;
  }
};

const staff = async (doctorId) => {
  try {
    const staffs = await Staff.findById(doctorId);
    return staffs.map((staff) => {
      return { ...staff._doc, _id: staff.id, password: null };
    });
  } catch (err) {
    throw err;
  }
};

exports.doctor = doctor;
exports.user = user;
exports.category = category;
exports.admin = admin;
exports.hospital = hospital;
