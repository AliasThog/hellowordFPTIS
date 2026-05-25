# W1D3 - Database & PostgreSQL Practice

## 1. Domain

Bài tập thiết kế database PostgreSQL cho hệ thống đăng ký sự kiện câu lạc bộ trong campus.

Sinh viên có thể:

- Xem danh sách câu lạc bộ.
- Xem danh sách event do câu lạc bộ tổ chức.
- Đăng ký tham gia event.
- Không được đăng ký cùng một event nhiều lần.

## 2. Local environment

Môi trường local đã dùng:

- PostgreSQL version: PostgreSQL 16
- Database name: `w1d3_database_postgresql`
- Tool chạy SQL: pgAdmin4, Navicat 16.2.15



## 3. Cách tạo database local

Mở terminal hoặc PowerShell rồi chạy:

```bash
psql -U postgres
```

Trong PostgreSQL shell, tạo database:

```sql
CREATE DATABASE w1d3_database_postgresql;
```

Kết nối vào database:

```sql
\c w1d3_database_postgresql
```


Nếu dùng pgAdmin, có thể tạo database tên `w1d3-database-postgresql` bằng giao diện rồi mở Query Tool để chạy file SQL.

## 4. Thứ tự chạy SQL file

Phải chạy theo đúng thứ tự sau:

```bash
psql -U postgres -d w1d3_database_postgresql -f sql/schema.sql
psql -U postgres -d w1d3_database_postgresql -f sql/seed.sql
psql -U postgres -d w1d3_database_postgresql -f sql/queries.sql
```
hoặc là: vào folder sql và chạy file lần lượt các file: schema -> seed -> queries 
## 5. Relationship chính trong schema

Schema có 4 bảng chính:

| Table | Mục đích |
|---|---|
| `students` | Lưu thông tin sinh viên |
| `clubs` | Lưu thông tin câu lạc bộ |
| `events` | Lưu sự kiện do club tổ chức |
| `event_registrations` | Lưu lượt đăng ký event của student |

Relationship chính:

- Một `club` có nhiều `events`.
- Một `event` thuộc về một `club`.
- Một `student` có thể đăng ký nhiều `events`.
- Một `event` có thể có nhiều `students` đăng ký.
- Quan hệ giữa `students` và `events` là many-to-many, được tách qua bảng trung gian `event_registrations`.

Các constraint quan trọng:

- Mỗi bảng có primary key.
- `events.club_id` là foreign key tham chiếu `clubs.id`.
- `event_registrations.student_id` là foreign key tham chiếu `students.id`.
- `event_registrations.event_id` là foreign key tham chiếu `events.id`.
- `students.email` là unique.
- `students.student_code` là unique.
- `events.capacity` phải lớn hơn 0.
- `registration_status` chỉ nhận một trong các giá trị: `REGISTERED`, `CANCELLED`, `ATTENDED`.
- Một student không được đăng ký cùng một event 2 lần nhờ unique constraint trên `(student_id, event_id)`.
- `created_at` và `registered_at` có default timestamp.

