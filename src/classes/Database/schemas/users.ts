const schema = `(
  user_id varchar(40) unique primary key not null,
  role_id int default 1 not null,
  email varchar(255) unique not null,
  firstname varchar(100) not null,
  lastname varchar(100) not null,
  password varchar(255) not null,
  profile_picture varchar(255),
  is_verified boolean default false not null,
  created_at timestamp not null,
  updated_at timestamp not null,
  constraint fk_role foreign key(role_id) references user_roles(role_id)
)`;

export default schema;
