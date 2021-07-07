const staffType = `

type Staff{
  _id: ID!
  name: String!
  email: String!
  phone: String!
  status: String!
  password: String
  doctor: Doctor!
  designation: String!
  createdAt: String!
  updatedAt: String!
}

type StaffAuthData{
  userId: ID!
  token: String!
  userType: String!
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

exports.staffType = staffType;
