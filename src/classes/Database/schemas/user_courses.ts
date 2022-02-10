const schema = `(
  id serial unique primary key not null,
  course_id varchar(40) unique not null,
  user_id varchar(40) not null,
  ongoing boolean not null default false,
  finished boolean not null default false,
  created_at timestamp not null,
  updated_at timestamp not null,
  constraint fk_course foreign key(course_id) references courses(course_id),
  constraint fk_user foreign key(user_id) references users(user_id)
)`;

export default schema;
