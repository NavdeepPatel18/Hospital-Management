const { buildSchema } = require("graphql");
const { Upload } = require("graphql-upload");

const adminType = `
scalar Upload

type File {
  url: String!
}

type Admin{
  _id:ID!
  name: String!
  password: String
}

type Category{
  _id: ID!
  name: String!
}
type AdminAuthData{
  userId: ID!
  token: String!
}
`;
const doctorType = `
type Doctor{
  _id: ID!
  name: String!
  education: String
  experience: Int
  city: String
  email: String!
  password: String
  category: Category
  phone: String!
  createdAt: String!
  updatedAt: String!
}

type Staff{
  _id: ID!
  name: String!
  email: String!
  phone: String!
  password: String
  doctor: Doctor!
  designation: String!
  createdAt: String!
  updatedAt: String!
}
type DoctorAuthData{
  userId: ID!
  token: String!
}
type StaffAuthData{
  userId: ID!
  token: String!
}
input DoctorInput {
  name: String!
  city: String!
  email: String!
  password: String
  phone: String!
}
input StaffInput{
  name: String!
  email: String!
  phone: String!
  designation: String!
}

input UpdateStaff{
  name: String
  email: String
  phone: String
  designation: String
}

`;
const hospitalType = `
type Hospital{
  _id: ID!
  name: String!
  email: String!
  number: String!
  location: String
  address: String!
}
type HospitalPhoto{
  _id: ID!
  name: String!
  photo: String!
  hospital: Hospital!
}

type Facilities{
  _id: ID!
  name: String!
  hospital: Hospital!
}
input HospitalInput {
  name: String!
  email: String!
  number: String!
  location: String
  address: String!
}

input HospitalPhotoInput {
  name: String!
  photo: String!
  hospital: String!
}

input FacilitiesInput {
  name: String!
  hospital: String!
}
`;
const covidType = `
type CovidCenter{
  _id: ID!
  hospital: Hospital!
  totalbed: Int!
  oxygen: Boolean!
  ventilator: Boolean! 
}

type CovidBooking{
  _id: ID!
  user: User!
  center: CovidCenter!
  bedno: Int!
  oxygen: Boolean!
  ventilator: Boolean!
  dateIn: String!
  dateOut: String!
}
input CovidCenterInput{
  hospital: String!
  totalbed: Int!
  oxygen: Boolean!
  ventilator: Boolean! 
}

input CovidBookingInput{
  center: String!
  bedno: Int!
  oxygen: Boolean!
  ventilator: Boolean!
  dateIn: String!
  dateOut: String
}
`;
const attendenceType = `
input AttendenceInput{
  staff: String!
  timeIn: String
  timeOut: String
}
type Attendence{
  _id: ID!
  doctor: Doctor!
  staff: Staff!
  timeIn: String
  timeOut: String
}

type Day{
  _id: ID!
  name: String!
  avability: [Avability!]!
}

type Avability{
  _id: ID!
  doctor: Doctor!
  slot: String!
  day: Day!
}
`;
const advertismentType = `
type Advertisment{
  _id: ID!
  doctor: Doctor
  startDate: String!
  endDate: String!
  title: String!
  detail: String!
  status: String!
}

type AdvertismentPhoto{
  _id: ID!
  advertisment: Advertisment!
  photo: String!
}

type Payment{
  _id: ID!
  advertisment: Advertisment!
  status: String!
  token: String!
  date: String!
}
input AdvertismentInput{
  doctor: String!
  startDate: String!
  endDate: String!
  title: String!
  detail: String!
}

input AdvertismentPhotoInput{
  advertisment: String!
  photo: String!
}

input PaymentInput{
  advertisment: String!
  token: String!
  date: String!
}
`;
const userType = `
type User{
  _id: ID!
  name: String!
  city: String
  address: String
  email: String!
  password: String
  age: Int
  gender: String
  phone: String!
  createdAt: String!
  updatedAt: String!
}
type UserAuthData{
  userId: ID!
  token: String!
}
input UserInput{
  name: String!
  city: String!
  address: String!
  email: String!
  password: String
  age: Int!
  gender: String!
  phone: String!
}
`;
const appoinmentType = `
type Appoinment{
  _id: ID!
  doctor: Doctor
  user: User!
  problem: String
  bp: Float
  caseType: String!
  suger: Float
  allergy: String
  history: String
  date: String!
  time: String!
  tocken: Int!
  conformby: String
  status: String
  statusDate: String
}

input AppoinmentInput{
  doctor: String!
  problem: String
  bp: Float
  caseType: String!
  suger: Float
  allergy: String
  history: String
  date: String!
  time: String!
  tocken: Int!
}
`;
const reviewType = `
type Review{
  _id: ID!
  doctor: Doctor!
  user: User!
  text: String!
  rating: Int!
  createdAt: String!
  updatedAt: String!
} 
input ReviewInput{
  doctor: String!
  text: String!
  rating: Int!
}
`;

const schema = `

  ${adminType}
  ${doctorType}
  ${hospitalType}
  ${covidType}
  ${attendenceType}
  ${advertismentType}
  ${userType}
  ${appoinmentType}
  ${reviewType}

  type RootQuery {
    adminlogin(username: String! , password: String! ): AdminAuthData!
    categorys: [Category!]!
    doctor: Doctor!
    doctorProfile : Doctor!
    staffProfile(staffId:String!) : Staff!
    staffs : [Staff!]!
    adminProfile : Admin!
    userProfile : User!
    hospitalDetail(userId: String!) : Hospital!
    doctorlogin(username: String! , password: String! ): DoctorAuthData!
    stafflogin(username: String! , password: String! ): StaffAuthData!
    userlogin(username: String! , password: String! ): UserAuthData!

  }
    
  type RootMutation {
    uploadImage(file: Upload!): File!
    createCategory(name: String!): Category!
    createAdvertisment(advertismentInput: AdvertismentInput): Advertisment!
    createAdvertismentPhoto(advertismentPhotoInput: AdvertismentPhotoInput): AdvertismentPhoto!
    createAppoinment(appoinmentInput: AppoinmentInput): Appoinment!
    attendence(attendenceInput: AttendenceInput): Attendence!
    createCovidCenter(covidCenterInput: CovidCenterInput): CovidCenter!
    createCovidBooking(covidBookingInput: CovidBookingInput): CovidBooking!
    createDoctor(doctorInput: DoctorInput): Doctor!
    createStaff(staffInput: StaffInput): Staff!
    createHospital(hospitalInput: HospitalInput): Hospital!
    createHospitalPhoto(hospitalPhotoInput: HospitalPhotoInput): HospitalPhoto!
    createFacilities(facilitiesInput: FacilitiesInput): Facilities!
    createReview(reviewInput: ReviewInput): Review!
    createUser(userInput: UserInput): User!
    
    changePassword(oldpassword: String! , newpassword: String!):Boolean!
    updateAdmin(name: String , password: String): Admin!
    updateStaff(updateStaff: UpdateStaff):Staff!
    deleteStaff(staffId: String):Boolean!
  }
    
  schema {
      query: RootQuery
      mutation: RootMutation
  }
`;

module.exports = buildSchema(schema);
