const schema = `(
  file_id varchar(40) unique primary key not null,
  file_type varchar(20) not null,
  file_description json not null,
  file_location varchar(255) not null,
  course_id varchar(40) not null,
  owner_id varchar(40) not null,
  created_at timestamp not null,
  updated_at timestamp not null,
  constraint fk_course foreign key(course_id) references courses(course_id),
  constraint fk_user foreign key(owner_id) references users(user_id)
)`;

export default schema;
