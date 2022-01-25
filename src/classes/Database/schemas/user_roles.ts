const schema = `(
  role_id serial unique primary key not null,
  role_name varchar(50) unique not null,
  role_permissions json not null,
  created_at timestamp not null,
  updated_at timestamp not null
)`;

export default schema;
