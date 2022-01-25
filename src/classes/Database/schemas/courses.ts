const schema = `(
  course_id varchar(20) unique primary key not null,
  author_id varchar(20) not null,
  email varchar(255) unique not null,
  firstname varchar(100) not null,
  lastname varchar(100) not null,
  is_verified boolean default false not null,
  created_at timestamp not null,
  updated_at timestamp not null,
  constraint fk_user foreign key(author_id) references users(user_id)
)`;

export default schema;
