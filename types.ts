export interface Topic {
  id : Number
  uid: String;
  name: String;
  content: String;
}

export interface Comment {
  id : Number
  uid: String;
  content: String;
  parent: String;
}
