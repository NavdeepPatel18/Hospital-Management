const Doctor = require("../../models/doctor");
const Category = require("../../models/category");
const Hospital = require("../../models/hospital");
const CovidCenter = require("../../models/covidcenter");
const Staff = require("../../models/staff");
const User = require("../../models/user");
const Admin = require("../../models/admin");
const Review = require("../../models/review");
const Appoinment = require("../../models/appoinment");
const CovidAppoinment = require("../../models/covidappoinment");

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

const singledoctor = async (staffId) => {
  try {
    const doctor = await Doctor.findById(staffId);
    return { ...doctor._doc, _id: doctor.id, password: null };
  } catch (err) {
    throw err;
  }
};

const staff = async (doctorId) => {
  try {
    const staff = await Staff.findById(doctorId);
    return { ...staff._doc, _id: staff.id, password: null };
  } catch (err) {
    throw err;
  }
};

const singleuser = async (userId) => {
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

const covidcenter = async (covidcenterId) => {
  try {
    const covidcenters = await CovidCenter.findById(covidcenterId);
    return { ...covidcenters._doc, _id: covidcenters.id };
  } catch (err) {
    throw err;
  }
};

const review = async (reviewId) => {
  try {
    const reviews = await Review.findById(reviewId);
    return { ...reviews._doc, _id: reviews.id };
  } catch (err) {
    throw err;
  }
};

const singleappoinment = async (appoinmentId) => {
  try {
    const appoinments = await Appoinment.findById(appoinmentId);
    return { ...appoinments._doc, _id: appoinments.id };
  } catch (err) {
    throw err;
  }
};

const singlecovidappoinment = async (covidappoinmentId) => {
  try {
    const covidappoinments = await CovidAppoinment.findById(covidappoinmentId);
    return { ...covidappoinments._doc, _id: covidappoinments.id };
  } catch (err) {
    throw err;
  }
};

exports.admin = admin;
exports.category = category;
exports.singledoctor = singledoctor;
exports.staff = staff;
exports.singleuser = singleuser;
exports.hospital = hospital;
exports.covidcenter = covidcenter;
exports.review = review;
exports.singleappoinment = singleappoinment;
exports.singlecovidappoinment = singlecovidappoinment;
