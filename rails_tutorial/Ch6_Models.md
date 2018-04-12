## Chapter 6: Modelling Users
### **Rolling Your Own Authentication System**
Examples of authentication and authorization systems include [Clearance](https://github.com/thoughtbot/clearance), [Authlogic](https://github.com/binarylogic/authlogic), [Devise](https://github.com/plataformatec/devise), and [CanCan](http://railscasts.com/episodes/192-authorization-with-cancan) (as well as non-Rails-specific solutions built on top of [OpenID](https://en.wikipedia.org/wiki/OpenID) or [OAuth](https://en.wikipedia.org/wiki/OAuth)).

Why not just use an off-the-shelf solution instead of rolling our own?\
- Authentication on most sites requires extensive customization, and modifying a third-party product is often more work than writing the system from scratch
- Off-the-shelf systems can be “black boxes”, with potentially mysterious innards; when you write your own system, you are far more likely to understand it

### **User Model**
- The first step in signing up users is to make a **data structure** to capture and store their information.
In Rails, the default data structure for a data model is called, naturally enough, a ```model``` (the M in MVC).
- ```ActiveRecord``` comes with a host of methods for creating, saving, and finding data objects, all without having to use the structured query language (SQL) used by relational databases.
- Rails has a feature called ```migrations``` to allow data definitions to be written in pure Ruby, without having to learn an SQL data definition language (DDL)

#### **Database Migrations**
- To store data, Rails uses a relational database by default, which consists of tables composed of data rows, where each row has columns of data attributes
- The analogous command for making a model is generate model, which we can use to generate a User model with name and email attributes:
```
$ rails generate model User name:string email:string
```
- A new file called migration is generated. Migrations provide a way to alter the structure of the database incrementally, so that our data model can adapt to changing requirements
- The migration itself consists of a ```change``` method that determines the change to be made to the database. 
    - ```change``` uses a Rails method called ```create_table``` to create a table in the database for storing users. The ```create_table``` method accepts a block with one block variable, in this case called ```t``` (for “table”). Inside the block, the ```create_table``` method uses the ```t``` object to create ```name``` and ```email``` columns in the database, both of type string.
    -  The final line in the block, ```t.timestamps```, is a special command that creates two magic columns called ```created_at``` and ```updated_at```, which are timestamps that automatically record when a given user is created and updated.
```ruby
class CreateUsers < ActiveRecord::Migration[5.0]
  def change
    create_table :users do |t|
      t.string :name
      t.string :email

      t.timestamps
    end
  end
end
```

**Exercises**
- Rails uses a file called ```schema.rb``` in the ```db/``` directory to keep track of the structure of the database (called the schema, hence the filename). Examine your local copy of ```db/schema.rb``` and compare its contents to the migration code.
> Done!
- Most migrations (including all the ones in this tutorial) are reversible, which means we can “migrate down” and undo them with a single command.
Read more about [migrations](http://edgeguides.rubyonrails.org/active_record_migrations.html).
```
$ rails db:rollback
```

- Re-run the migration by executing ```rails db:migrate``` again. Confirm that the contents of db/schema.rb have been restored.
- In a Rails console, confirm that ```User.new``` is of class ```User``` and inherits from ```ApplicationRecord```
- Confirm that ```ApplicationRecord``` inherits from ```ActiveRecord::Base```
```irb
2.4.1 :001 > user = User.new
 => #<User id: nil, name: nil, email: nil, created_at: nil, updated_at: nil>
2.4.1 :002 > user.class
 => User(id: integer, name: string, email: string, created_at: datetime, updated_at: datetime)
2.4.1 :003 > user.class.superclass
 => ApplicationRecord(abstract)
 2.4.1 :004 > user.class.superclass.superclass
 => ActiveRecord::Base
 ```
- Confirm that ```user.name``` and ```user.email``` are of class String
- Of what class are the ```created_at``` and ```updated_at``` attributes?

```irb
2.4.1 :001 > user = User.new
 => #<User id: nil, name: nil, email: nil, created_at: nil, updated_at: nil>
2.4.1 :002 > user = User.new(name: "Chris", email: "chris@email.com")
 => #<User id: nil, name: "Chris", email: "chris@email.com", created_at: nil, updated_at: nil>
2.4.1 :003 > user.valid?
 => true
2.4.1 :004 > user.save
   (0.1ms)  SAVEPOINT active_record_1
  SQL (1.4ms)  INSERT INTO "users" ("name", "email", "created_at", "updated_at") VALUES (?, ?, ?, ?)  [["name", "Chris"], ["email", "chris@email.com"], ["created_at", "2018-04-10 04:49:40.977309"], ["updated_at", "2018-04-10 04:49:40.977309"]]
   (0.1ms)  RELEASE SAVEPOINT active_record_1
 => true
2.4.1 :005 > user
 => #<User id: 1, name: "Chris", email: "chris@email.com", created_at: "2018-04-10 04:49:40", updated_at: "2018-04-10 04:49:40">
2.4.1 :006 > user.name
 => "Chris"
2.4.1 :007 > user.email
 => "chris@email.com"
2.4.1 :008 > user.updated_at
 => Tue, 10 Apr 2018 04:49:40 UTC +00:00
2.4.1 :009 > User.create(name: "Bel", email: "bel@email.com")
   (0.1ms)  SAVEPOINT active_record_1
  SQL (2.3ms)  INSERT INTO "users" ("name", "email", "created_at", "updated_at") VALUES (?, ?, ?, ?)  [["name", "Bel"], ["email", "bel@email.com"], ["created_at", "2018-04-10 04:51:40.924628"], ["updated_at", "2018-04-10 04:51:40.924628"]]
   (0.1ms)  RELEASE SAVEPOINT active_record_1
 => #<User id: 2, name: "Bel", email: "bel@email.com", created_at: "2018-04-10 04:51:40", updated_at: "2018-04-10 04:51:40">

2.4.1 :013 > user.name.class
 => String
2.4.1 :014 > user.email.class
 => String
2.4.1 :015 > user.created_at.class
 => ActiveSupport::TimeWithZone
2.4.1 :016 > user.updated_at.class
 => ActiveSupport::TimeWithZone
 ```
 - Find the user by name. Confirm that ```find_by_name``` works as well. (You will often encounter this older style of find_by in legacy Rails applications.)
 - For most practical purposes, ```User.all``` acts like an array, but confirm that in fact it’s of class ```User::ActiveRecord_Relation```.
 ```irb
 2.4.1 :021 > User.all.class
 => User::ActiveRecord_Relation
 ```
 - Confirm that you can find the length of```User.all``` by passing it the ```length``` method. Ruby’s ability to manipulate objects based on how they act rather than on their formal class type is called duck typing, based on the aphorism that “If it looks like a duck, and it quacks like a duck, it’s probably a duck.”
 ```irb
 2.4.1 :022 > User.all.length
  User Load (0.2ms)  SELECT "users".* FROM "users"
 => 2
 ```
- Update the user’s name using assignment and a call to save
```irb
2.4.1 :027 > user.name
 => "Luky"
2.4.1 :028 > user.name = "Chou Chou"
 => "Chou Chou"
2.4.1 :029 > user.name
 => "Chou Chou"
 ```
 - Update the user’s email address using a call to update_attributes
 ```irb
 2.4.1 :030 > user.update_attributes(email: "chouchou@email.com")
   (0.1ms)  SAVEPOINT active_record_1
  SQL (0.1ms)  UPDATE "users" SET "name" = ?, "email" = ?, "updated_at" = ? WHERE "users"."id" = ?  [["name", "Chou Chou"], ["email", "chouchou@email.com"], ["updated_at",
"2018-04-10 05:16:39.606988"], ["id", 1]]
   (0.1ms)  RELEASE SAVEPOINT active_record_1
 => true
2.4.1 :031 > user.email
 => "chouchou@email.com"
 ```
 - Confirm that you can change the magic columns directly by updating the ```created_at``` column using assignment and a save. Use the value ```1.year.ago```, which is a Rails way to create a timestamp one year before the present time.
 ```irb
 2.4.1 :032 > user.created_at
 => Tue, 10 Apr 2018 04:49:40 UTC +00:00
2.4.1 :033 > user.created_at = 1.year.ago
 => Mon, 10 Apr 2017 05:18:01 UTC +00:00
2.4.1 :034 > user.created_at
 => Mon, 10 Apr 2017 05:18:01 UTC +00:00
 ```

 ### **User Validations**
 After user validation is added for name:
 ```ruby
class User < ApplicationRecord
  validates :name, presence: true
end
 ```
 Test in Rails console:
 ```irb
 2.4.1 :001 > user = User.new(name: "", email: "hello@email.com")
 => #<User id: nil, name: "", email: "hello@email.com", created_at: nil, updated_at: nil>
2.4.1 :002 > user.valid?
 => false
2.4.1 :003 > user.errors.full_messages
 => ["Name can't be blank"]
 2.4.1 :004 > user.save
   (0.1ms)  SAVEPOINT active_record_1
   (0.1ms)  ROLLBACK TO SAVEPOINT active_record_1
 => false
 ```
**Exercises**
- Make a new user called ```u``` and confirm that it’s initially invalid. What are the full error messages?
- Confirm that ```u.errors.messages``` is a hash of errors. How would you access just the email errors?

### **Length Validation**
To test for length validation:
```ruby
test "name should not be too long" do
    @user.name = "a" * 51
    assert_not @user.valid?
  end
```
Add length validation to model:
```ruby
validates :name,  presence: true, length: { maximum: 50 }
```
**Exercises**
- Make a new user with too-long name and email and confirm that it’s not valid
- What are the error messages generated by the length validation?
```irb
2.4.1 :001 > user = User.new(name: "ccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc", email: "")
 => #<User id: nil, name: "cccccccccccccccccccccccccccccccccccccccccccccccccc...", email: "", created_at: nil, updated_at: nil>
2.4.1 :002 > user.save
   (0.1ms)  SAVEPOINT active_record_1
   (0.1ms)  ROLLBACK TO SAVEPOINT active_record_1
 => false

2.4.1 :004 > user.errors.full_messages
 => ["Name is too long (maximum is 50 characters)", "Email can't be blank"]
```

### **Format Validation**
Table outlining regular expression:
| Expressions | Meaning |
|-------------|---------|
| /\A[\w+\\-.]+@[a-z\d\\-.]+\\.[a-z]+\z/i | full regex |
| / | start of regex |
| \A | match start of a string |
| [\w+\\-.]+ | at least one character, plus, hyphen or dot |
| @ | literal "@" sign |
| [a-z\d\\-.]+ | at least one letter, digit, hyphen, or dot |
| \\. | literal dot |
| [a-z]+ | at least one letter |
| \z | match end of string |
| / | end of regex |
| i | case-insensitive |

Learn regular expression using [Rubular](http://www.rubular.com/)

Email format validation using regex:
```ruby
VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-]+)*\.[a-z]+\z/i
```
**Exercises**
 - By pasting in the valid addresses and invalid addresses into the test string area at Rubular, confirm that the regex matches all of the valid addresses and none of the invalid ones.
```irb
2.4.1 :001 > user = User.new(name: "Hello", email: "user@example,com")
 => #<User id: nil, name: "Hello", email: "user@example,com", created_at: nil, updated_at: nil>
2.4.1 :002 > user.save
   (0.1ms)  SAVEPOINT active_record_1
   (0.1ms)  ROLLBACK TO SAVEPOINT active_record_1
 => false
2.4.1 :003 > user.errors.full_messages
 => ["Email is invalid"]
 ```
 - Add foo@bar..com to the list of addresses at Rubular, and confirm that the regex matches all the valid addresses and none of the invalid ones

### **Uniqueness Validation**
Test for email uniqueness:
```ruby
test "email addresses should be unique" do
    duplicate_user = @user.dup
    duplicate_user.email = @user.email.upcase
    @user.save
    assert_not duplicate_user.valid?
end
```
  The method here is to make a user with the same email address as ```@user``` using ```@user.dup```, which creates a duplicate user with the same attributes. Since we then save ```@user```, the duplicate user has an email address that already exists in the database, and hence should not be valid.

  There's just one small **problem**.\
  ```ActiveRecord``` *uniqueness* validation does not guarantee uniqueness at the database level. Here’s a scenario that explains why:
  - Alice signs up for the sample app, with address alice@wonderland.com
  - Alice accidentally clicks on “Submit” twice, sending two requests in quick succession
  - The following sequence occurs: request 1 creates a user in memory that passes validation, request 2 does the same, request 1’s user gets saved, request 2’s user gets saved
  - Result: two user records with the exact same email address, despite the uniqueness validation

**Database Indices**

To understand a database index, it’s helpful to consider the analogy of a *book index*. In a book, to find all the occurrences of a given string, say “foobar”, you would have to scan each page for “foobar”—the paper version of a *full-table scan*. With a book index, on the other hand, you can just look up “foobar” in the index to see all the pages containing “foobar”. A *database index* works essentially the same way.

What is the ```fixture``` files used for?

More problems:\
- Some database adapters use case-sensitive indices, considering the strings “Foo@ExAMPle.CoM” and “foo@example.com” to be distinct, but our application treats those addresses as the same. To avoid this incompatibility, we’ll standardize on all lower-case addresses, converting “Foo@ExAMPle.CoM” to “foo@example.com” before saving it to the database.
- The way to do this is with a [```callback```](https://en.wikipedia.org/wiki/Callback_(computer_programming)), which is a method that gets invoked at a particular point in the lifecycle of an Active Record object. In the present case, that point is before the object is saved, so we’ll use a ```before_save``` callback to downcase the email attribute before saving the user.

**Exercises**
- By running the test suite, verify that the ```before_save``` callback can be written using the “bang” method ```email.downcase!``` to modify the ```email``` attribute directly

### **Adding a Secure Password**
Most of the secure password machinery will be implemented using a single Rails method called ```has_secure_password```, which we’ll include in the User model.\
This one method adds the following functionality:
- The ability to save a securely hashed ```password_digest``` attribute to the database
- A pair of virtual attributes (```password``` and ```password_confirmation```), including presence validations upon object creation and a validation requiring that they match
- An ```authenticate``` method that returns the user when the password is correct (and ```false``` otherwise)

Note: The only requirement for ```has_secure_password``` to work its magic is for the corresponding model to have an attribute called ```password_digest```. The name digest comes from the terminology of [cryptographic hash functions](https://en.wikipedia.org/wiki/Cryptographic_hash_function). In this context, *hashed password* and *password digest* are synonyms.)

The ideal ```cryptographic hash function``` has five main properties:
- It is deterministic so the same message always results in the same hash
- It is quick to compute the hash value for any given message
- It is infeasible to generate a message from its hash value except by trying all possible messages
- A small change to a message should change the hash value so extensively that the new hash value appears uncorrelated with the old hash value
- It is infeasible to find two different messages with the same hash value

To generate an appropriate migration for the ```password_digest``` column:
```
$ rails generate migration add_password_digest_to_users password_digest:string

$ rails db:migrate
```
To make the password digest, has_secure_password uses a state-of-the-art hash function called [bcrypt](https://en.wikipedia.org/wiki/Bcrypt).

**Exercises**
- Confirm that a user with valid name and email still isn’t valid overall
- What are the error messages for a user with no password?
```irb
2.4.1 :004 > user1 = User.new(name: "Luky", email: "luky@email.com")
 => #<User id: nil, name: "Luky", email: "luky@email.com", created_at: nil, updated_at: nil, password_digest: nil>
2.4.1 :005 > user1.save
   (0.1ms)  SAVEPOINT active_record_1
  User Exists (0.1ms)  SELECT  1 AS one FROM "users" WHERE LOWER("users"."email") = LOWER(?) LIMIT ?  [["email", "luky@email.com"], ["LIMIT", 1]]
   (0.2ms)  ROLLBACK TO SAVEPOINT active_record_1
 => false
2.4.1 :006 > user1.errors.full_messages
 => ["Password can't be blank"]
 ```

### **Minimum Password Standards**
Test to set minimum password standards - presence and minimum length:
```ruby
test "password should be present (nonblank)" do
    @user.password = @user.password_confirmation = " " * 6
    assert_not @user.valid?
end

test "password should have a minimum length" do
    @user.password = @user.password_confirmation = "a" * 5
    assert_not @user.valid?
end
```
In the User model:
```ruby
...
has_secure_password
validates(:password, presence: true, length: { minimum: 6 })
```
**Exercises**
- Confirm that a user with valid name and email but a too-short password isn’t valid.
- What are the associated error messages?
```irb
2.4.1 :001 > user = User.new(name: "Chris", email: "chris@email.com", password: "luky", password_confirmation: "luky")
 => #<User id: nil, name: "Chris", email: "chris@email.com", created_at: nil, updated_at: nil, password_digest: "$2a$10$rcuGxGszCkp1etITRDMbIe596KDX88twAZk4GWm1P8R...">
2.4.1 :002 > user.save
   (0.1ms)  SAVEPOINT active_record_1
  User Exists (0.3ms)  SELECT  1 AS one FROM "users" WHERE LOWER("users"."email") = LOWER(?) LIMIT ?  [["email", "chris@email.com"], ["LIMIT", 1]]
   (0.1ms)  ROLLBACK TO SAVEPOINT active_record_1
 => false
2.4.1 :003 > user.errors.full_messages
 => ["Password is too short (minimum is 6 characters)"]
```
### **Creating and Authenticating a User**
To check the effects of adding ```has_secure_password``` to the User model:
```irb
2.4.1 :001 > user = User.new(name: "Chris", email: "chris@email.com", password: "hello", password_confirmation: "hello")
 => #<User id: nil, name: "Chris", email: "chris@email.com", created_at: nil, updated_at: nil, password_digest: "$2a$10$ocrijnKOHWGPaBa9A1PYeOwNwN6HUFDgRANAN/5sSfY...">

2.4.1 :002 > user.save
   (0.1ms)  SAVEPOINT active_record_1
  User Exists (0.2ms)  SELECT  1 AS one FROM "users" WHERE LOWER("users"."email") = LOWER(?) LIMIT ?  [["email", "chris@email.com"], ["LIMIT", 1]]
  SQL (1.4ms)  INSERT INTO "users" ("name", "email", "created_at", "updated_at", "password_digest") VALUES (?, ?, ?, ?, ?)  [["name", "Chris"], ["email", "chris@email.com"], ["created_at", "2018-04-10 11:39:34.561354"], ["updated_at", "2018-04-10 11:39:34.561354"], ["password_digest", "$2a$10$ocrijnKOHWGPaBa9A1PYeOwNwN6HUFDgRANAN/5sSfY3aS4wT.Bbe"]]
   (0.1ms)  RELEASE SAVEPOINT active_record_1
 => true
2.4.1 :003 > user.password
 => "hello"
```
```has_secure_password``` automatically adds an ```authenticate``` method to the corresponding model objects.
```irb
2.4.1 :004 > user = User.new(name: "Chris", email: "chris@email.com", password: "helloo", password_confirmation: "helloo")
 => #<User id: nil, name: "Chris", email: "chris@email.com", created_at: nil, updated_at: nil, password_digest: "$2a$10$Sp2g0hwUFIf3/5tsLCI6wOlpc8wPfoyQYMzm4SyWHYP...">
2.4.1 :005 > user.save
   (0.1ms)  SAVEPOINT active_record_1
  User Exists (0.1ms)  SELECT  1 AS one FROM "users" WHERE LOWER("users"."email") = LOWER(?) LIMIT ?  [["email", "chris@email.com"], ["LIMIT", 1]]
  SQL (1.5ms)  INSERT INTO "users" ("name", "email", "created_at", "updated_at", "password_digest") VALUES (?, ?, ?, ?, ?)  [["name", "Chris"], ["email", "chris@email.com"], ["created_at", "2018-04-10 11:58:02.994115"], ["updated_at", "2018-04-10 11:58:02.994115"], ["password_digest", "$2a$10$Sp2g0hwUFIf3/5tsLCI6wOlpc8wPfoyQYMzm4SyWHYPwz.GxHJaGS"]]
   (0.1ms)  RELEASE SAVEPOINT active_record_1
 => true

2.4.1 :007 > user.authenticate("foobaz")
 => false
2.4.1 :008 > user.authenticate("helloo")
 => #<User id: 1, name: "Chris", email: "chris@email.com", created_at: "2018-04-10 11:58:02", updated_at: "2018-04-10 11:58:02", password_digest: "$2a$10$Sp2g0hwUFIf3/5tsLCI6wOlpc8wPfoyQYMzm4SyWHYP...">
2.4.1 :009 > !!user.authenticate("helloo")
 => true
```
**Exercises**
- Quit and restart the console, and then find the user created in this section
- Try changing the name by assigning a new name and calling save. Why didn’t it work?
```irb
2.4.1 :003 > user = User.create(name: "Chris", email: "chris@email.com", password: "helloo", password_confirmation: "helloo")
   (0.1ms)  begin transaction
  User Exists (0.3ms)  SELECT  1 AS one FROM "users" WHERE LOWER("users"."email") = LOWER(?) LIMIT ?  [["email", "chris@email.com"], ["LIMIT", 1]]
   (0.1ms)  rollback transaction
 => #<User id: nil, name: "Chris", email: "chris@email.com", created_at: nil, updated_at: nil, password_digest: "$2a$10$PEsTYh58Rb689/OQb.VDaexoLMTTUf5xI1rNiYRbxNN...">
2.4.1 :004 > user.name = "Luky"
 => "Luky"
2.4.1 :005 > user.save
   (0.1ms)  begin transaction
  User Exists (0.3ms)  SELECT  1 AS one FROM "users" WHERE LOWER("users"."email") = LOWER(?) LIMIT ?  [["email", "chris@email.com"], ["LIMIT", 1]]
   (0.1ms)  rollback transaction
 => false
2.4.1 :006 > user.errors.full_messages
 => ["Email has already been taken"]
```
Note: There seems to be some issue with the email validation preventing ```name``` to be updated. See below solution. ```:if => :email_changed?)``` is added to prevent validation to run on data update for ```name```.
```ruby
...
 validates(:email, presence: true, length: { maximum: 255 }, format: { with: VALID_EMAIL_REGEX }, uniqueness: {case_sensitive: false}, :if => :email_changed?)
 ```
- Update user’s name to use your name.
```irb
2.4.1 :007 > user.authenticate("helloo")
 => #<User id: 1, name: "Luky", email: "chris@email.com", created_at: "2018-04-10 12:01:58", updated_at: "2018-04-10 12:01:58", password_digest: "$2a$10$VpndYrvZn51fTZWGU7cZhONoCeb7rZFqQpUYOccDx00...">
2.4.1 :008 > user.name = "Chris"
 => "Chris"
2.4.1 :009 > user.save
   (0.1ms)  begin transaction
   (0.0ms)  rollback transaction
 => false
2.4.1 :010 > user
 => #<User id: 1, name: "Chris", email: "chris@email.com", created_at: "2018-04-10 12:01:58", updated_at: "2018-04-10 12:01:58", password_digest: "$2a$10$VpndYrvZn51fTZWGU7cZhONoCeb7rZFqQpUYOccDx00...">
 ```

 ## **What We Learnt**
 - Migrations allow us to modify our application’s data model
 - ```ActiveRecord``` comes with a large number of methods for creating and manipulating data models
 - Common validations include presence, length, and format
 - Regular expressions are cryptic but powerful
 - Defining a database index improves lookup efficiency while allowing enforcement of uniqueness at the database level
 - We can add a secure password to a model using the built-in ```has_secure_password``` method