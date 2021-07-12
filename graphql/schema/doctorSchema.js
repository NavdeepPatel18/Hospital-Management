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
  inoutStatus:Boolean!
  createdAt: String!
  updatedAt: String!
}

type DoctorAuthData{
  userId: ID!
  token: String!
  userType: String!
}

input DoctorInput {
  name: String!
  city: String!
  email: String!
  password: String
  phone: String!
  category:String!
}

input UpdateDoctor {
  name: String!
  education: String
  experience: Int
  city: String
  email: String
  category: String
  phone: String
}


`;

exports.doctorType = doctorType;
