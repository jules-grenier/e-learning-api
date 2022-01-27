const schema = `(
  course_id varchar(40) unique primary key not null,
  course_title varchar(255) not null,
  course_description json not null,
  author_id varchar(40) not null,
  created_at timestamp not null,
  updated_at timestamp not null,
  constraint fk_user foreign key(author_id) references users(user_id)
)`;

export default schema;
