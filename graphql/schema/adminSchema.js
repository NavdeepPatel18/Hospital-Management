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

exports.adminType = adminType;
