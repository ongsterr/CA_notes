## **Chapter 9: Advanced Login
### **Remember Me**
Information stored using ```session``` is automatically secure, but this is not the case with information stored using ```cookies```. 
- In particular, persistent cookies are vulnerable to [session hijacking](https://en.wikipedia.org/wiki/Session_hijacking), in which an attacker uses a stolen remember token to log in as a particular user.\
There are four main ways to steal ```cookies```:
- Using a [packet sniffer](https://en.wikipedia.org/wiki/Packet_analyzer) to detect cookies being passed over insecure networks
- Compromising a database containing remember tokens
- Using [cross-site scripting (XSS)](https://en.wikipedia.org/wiki/Cross-site_scripting)
- Gaining physical access to a machine with a logged-in user

With these design and security considerations in mind, our plan for creating persistent sessions appears as follows:
- Create a random string of digits for use as a remember token
- Place the token in the browser cookies with an expiration date far in the future
- Save the hash digest of the token to the database
- Place an encrypted version of the uder's id in the browser cookies
- When presented with a cookie containing persistent user id, find the user in database using the given id, and verify that the remember token cookie matches the associated hash digest from the database

We’ll start by adding the required ```remember_digest``` attribute to the User model:
```
$ rails generate migration add_remember_digest_to_users remember_digest:string
```
We’ve used a migration name that ends ```in _to_users``` to tell Rails that the migration is designed to alter the ```users``` table in the database.
```ruby
class AddRememberDigestToUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :remember_digest, :string
  end
end
```
We have to decide what to use as a ```remember token```. Any long random string will do.
- The ```urlsafe_base64``` method from the ```SecureRandom``` module in the Ruby standard library fits the bill: it returns a random string of length 22 composed of the characters A–Z, a–z, 0–9, “-”, and “_” (for a total of 64 possibilities, thus “[base64](https://en.wikipedia.org/wiki/Base64)”).\
A typical base64 string appears as follows:
```irb
$ rails console
>> SecureRandom.urlsafe_base64
=> "q5lt38hQDc_959PVoo6b7A"
```

Remembering users involves creating a remember token and saving the digest of the token to the database.
- We’ve already defined a ```digest``` method for use in the test fixtures
- We can use the results of the discussion above to create a ```new_token``` method to create a new token. The ```User``` model:
```ruby
class User < ApplicationRecord
  before_save { self.email = email.downcase }
  validates :name,  presence: true, length: { maximum: 50 }
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  validates :email, presence: true, length: { maximum: 255 },
                    format: { with: VALID_EMAIL_REGEX },
                    uniqueness: { case_sensitive: false }
  has_secure_password
  validates :password, presence: true, length: { minimum: 6 }

  # Returns the hash digest of the given string.
  def User.digest(string)
    cost = ActiveModel::SecurePassword.min_cost ? BCrypt::Engine::MIN_COST :
                                                  BCrypt::Engine.cost
    BCrypt::Password.create(string, cost: cost)
  end

  # Returns a random token.
  def User.new_token
    SecureRandom.urlsafe_base64
  end
end
```
Our plan for the implementation is to make a ```user.remember``` method that associates a remember token with the user and saves the corresponding remember digest to the database.
- We need a way to make a token available via ```user.remember_token``` (for storage in the cookies) without storing it in the database. (Recall what we did with passwords)

So how can we do this?
```ruby
class User < ApplicationRecord
  attr_accessor :remember_token
  before_save { self.email = email.downcase }
  validates :name,  presence: true, length: { maximum: 50 }
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  validates :email, presence: true, length: { maximum: 255 },
                    format: { with: VALID_EMAIL_REGEX },
                    uniqueness: { case_sensitive: false }
  has_secure_password
  validates :password, presence: true, length: { minimum: 6 }

  # Returns the hash digest of the given string.
  def User.digest(string)
    cost = ActiveModel::SecurePassword.min_cost ? BCrypt::Engine::MIN_COST :
                                                  BCrypt::Engine.cost
    BCrypt::Password.create(string, cost: cost)
  end

  # Returns a random token.
  def User.new_token
    SecureRandom.urlsafe_base64
  end

  # Remembers a user in the database for use in persistent sessions.
  def remember
    self.remember_token = User.new_token
    update_attribute(:remember_digest, User.digest(remember_token))
  end
end
```
**Exercises**
- In the console, assign ```user``` to the first user in the database, and verify by calling it directly that the ```remember``` method works. How do ```remember_token``` and ```remember_digest``` compare?
```irb
2.4.1 :001 > user = User.first
  User Load (0.4ms)  SELECT  "users".* FROM "users" ORDER BY "users"."id" ASC LIMIT ?  [["LIMIT", 1]]
 => #<User id: 1, name: "Rails Tutorial", email: "example@railstutorial.org", created_at: "2018-04-12 03:57:06", updated_at: "2018-04-13 00:56:38", password_digest: "$2a$10$GRkvHlSf6gtNwXAu.qXcL.49NIGWF/3Tq3GEYHd9MBB...", remember_digest: "$2a$10$TePei5UXlVufUfS8ps887esFoVkco5HRCvdFIFG36d0...">
2.4.1 :002 > user.remember_token
 => nil
2.4.1 :003 > user.remember
   (0.1ms)  begin transaction
  SQL (1.7ms)  UPDATE "users" SET "updated_at" = ?, "remember_digest" = ? WHERE "users"."id" = ?  [["updated_at", "2018-04-13 00:58:11.479400"], ["remember_digest", "$2a$10$QAZ4gArAofqcAGOXyPa4DuJMw7LPWwgOKANu7tZ/vEe/RndZHLrVW"], ["id", 1]]
   (16.7ms)  commit transaction
 => true
2.4.1 :004 > user.remember_token
 => "YH1ua2M8wcx8kU-64sYZng"
```
- We defined the new token and digest class methods by explicitly prefixing them with User. This works fine and, because they are actually *called* using ```User.new_token``` and ```User.digest```, it is probably the clearest way to define them. But there are two perhaps more idiomatically correct ways to define class methods, one slightly confusing and one extremely confusing. By running the test suite, verify that the implementations in Listing 9.4 (slightly confusing) and Listing 9.5 (extremely confusing) are correct. (Note that, in the context of Listing 9.4 and Listing 9.5, ```self``` is the ```User``` class, whereas the other uses of ```self``` in the ```User``` model refer to a ```user object instance```. This is part of what makes them confusing.)

Listing 9.4
```ruby
class User < ApplicationRecord
  .
  .
  .
  # Returns the hash digest of the given string.
  def self.digest(string)
    cost = ActiveModel::SecurePassword.min_cost ? BCrypt::Engine::MIN_COST :
                                                  BCrypt::Engine.cost
    BCrypt::Password.create(string, cost: cost)
  end

  # Returns a random token.
  def self.new_token
    SecureRandom.urlsafe_base64
  end
  .
  .
  .
end
```
Listing 9.5
```ruby
class User < ApplicationRecord
  .
  .
  .
  class << self
    # Returns the hash digest of the given string.
    def digest(string)
      cost = ActiveModel::SecurePassword.min_cost ? BCrypt::Engine::MIN_COST :
                                                    BCrypt::Engine.cost
      BCrypt::Password.create(string, cost: cost)
    end

    # Returns a random token.
    def new_token
      SecureRandom.urlsafe_base64
    end
  end
  .
  .
  .
```
Test for ```remember_token``` and ```remember_digest```:
```ruby
test "remember token is encrypted and added to remember_digest " do
    @user.remember
    assert_not @user.remember_digest.nil?
end
```

### **Login with Remembering**
A cookie consists of two pieces of information, a ```value``` and an optional ```expires``` date.
```
cookies[:remember_token] = { value:   remember_token, expires: 20.years.from_now.utc }
```
This pattern of setting a cookie that expires 20 years in the future is so common that Rails has a special ```permanent``` method to implement it, so that we can simply write:
```ruby
cookies.permanent[:remember_token] = remember_token
```
A *signed* cookie, which securely encrypts the cookie before placing it on the browser:
```ruby
cookies.permanent.signed[:user_id] = user.id
```
After the cookies are set, on subsequent page views we can retrieve the user with code like:
```ruby
User.find_by(id: cookies.signed[:user_id])
```
where ```cookies.signed[:user_id]``` automatically decrypts the user id cookie.

The final piece of the puzzle is to verify that a given remember token matches the user’s remember digest:
```ruby
BCrypt::Password.new(password_digest) == unencrypted_password
BCrypt::Password.new(remember_digest) == remember_token
BCrypt::Password.new(remember_digest).is_password?(remember_token)
```
The above discussion suggests putting the digest–token comparison into an ```authenticated?``` method in the ```User``` model, which plays a role similar to that of the ```authenticate``` method provided by ```has_secure_password``` for authenticating a user:
```ruby
# Returns true if the given token matches the digest.
  def authenticated?(remember_token)
    BCrypt::Password.new(remember_digest).is_password?(remember_token)
  end
```
We’re now in a position to remember a logged-in user, which we’ll do by adding a ```remember``` helper to go along with ```log_in```:
```ruby
class SessionsController < ApplicationController

  def new
  end

  def create
    user = User.find_by(email: params[:session][:email].downcase)
    if user && user.authenticate(params[:session][:password])
      log_in user
      remember user
      redirect_to user
    else
      flash.now[:danger] = 'Invalid email/password combination'
      render 'new'
    end
  end

  def destroy
    log_out
    redirect_to root_url
  end
end
```
Define the ```remember(user)``` method in ```sessions_helper```:
```ruby
# Remembers a user in a persistent session.
  def remember(user)
    user.remember
    cookies.permanent.signed[:user_id] = user.id
    cookies.permanent[:remember_token] = user.remember_token
  end
```
In the case of persistent sessions, we want to retrieve the user from the temporary session if ```session[:user_id]``` exists, but otherwise we should look for ```cookies[:user_id]``` to retrieve (and log in) the user corresponding to the persistent session.
```ruby
if (user_id = session[:user_id])
  @current_user ||= User.find_by(id: user_id)
elsif (user_id = cookies.signed[:user_id])
  user = User.find_by(id: user_id)
  if user && user.authenticated?(cookies[:remember_token])
    log_in user
    @current_user = user
  end
end
```
**Exercises**
- After logging out, verify that the corresponding cookies have been removed from your browser.
- Comment out the fix in Listing 9.16 and then verify that the first subtle bug is present by opening two logged-in tabs, logging out in one, and then clicking “Log out” link in the other.
- Comment out the fix in Listing 9.19 and verify that the second subtle bug is present by logging out in one browser and closing and opening the second browser.
- Uncomment the fixes and confirm that the test suite goes from red to green.

### **Remember Me Checkbox**
To write the implementation, we start by adding a checkbox to the login form. As with labels, text fields, password fields, and submit buttons, checkboxes can be created with a Rails helper method.
```html
<%= f.label :remember_me, class: "checkbox inline" do %>
  <%= f.check_box :remember_me %>
  <span>Remember me on this computer</span>
<% end %>
```
We’ve included the CSS classes checkbox and inline, which Bootstrap uses to put the checkbox and the text (“Remember me on this computer”) in the same line.
```ruby
params[:session][:remember_me]
```
is ’```1```’ if the box is checked and ’```0```’ if it isn’t.

By testing the relevant value of the params hash, we can now remember or forget the user based on the value of the submission:
```ruby
params[:session][:remember_me] == "1" ? remember(user) : forget(user)
```
**Exercises**
- By inspecting your browser’s cookies directly, verify that the “remember me” checkbox is having its intended effect
- At the console, invent examples showing both possible behaviors of the ternary operator

### **Remember Tests**

**Exercises**
- As mentioned above, the application currently doesn’t have any way to access the virtual ```remember_token``` attribute in the integration test. It is possible, though, using a special test method called ```assigns```. Inside a test, you can access instance variables defined in the controller by using ```assigns``` with the corresponding symbol. For example, if the ```create``` action defines an ```@user``` variable, we can access it in the test using ```assigns(:user)```. Right now, the Sessions controller ```create``` action defines a normal (non-instance) variable called ```user```, but if we change it to an instance variable we can test that ```cookies``` correctly contains the user’s remember token. By filling in the missing elements in Listing 9.27 and Listing 9.28 (indicated with question marks ? and FILL_IN), complete this improved test of the “remember me” checkbox.

By changing the local variable ```user``` to instance variable ```@user``` in the ```create``` method (Sessions controller):
```ruby
  def create
    @user = User.find_by(email: params[:session][:email].downcase)
    if @user && @user.authenticate(params[:session][:password])
      # Log the user in and redirect to the user's show page.
      log_in @user
      params[:session][:remember_me] == "1" ? remember(@user) : forget(@user)
      redirect_to @user
    else
      # Create an error message.
      flash.now[:danger] = 'Invalid email/password combination'
      render 'new'
    end
  end
```
Update test_helper:
```ruby
require 'test_helper'

class UsersLoginTest < ActionDispatch::IntegrationTest
  def setup
    @user = users(:michael)
  end
  
  test 'login with invalid information' do
    get login_path
    assert_template 'sessions/new'
    post login_path, params: {session: {email: "", password: ""}}
    assert_template 'sessions/new'
    assert flash.any?
    get root_path
    assert flash.empty?
  end

  test 'login with valid information followed by logout' do
    get login_path
    post login_path, params: {session: {email: @user.email, password: 'password'}}
    assert is_logged_in?
    assert_redirected_to @user
    follow_redirect!
    assert_template 'users/show'
    assert_select "a[href=?]", login_path, count: 0
    assert_select "a[href=?]", logout_path
    assert_select "a[href=?]", user_path(@user)

    delete logout_path
    assert_not is_logged_in?
    assert_redirected_to root_path
    # Simulate a user clicking logout in a second window.
    delete logout_path
    follow_redirect!
    assert_select "a[href=?]", login_path
    assert_select "a[href=?]", logout_path, count: 0
    assert_select "a[href=?]", user_path(@user), count: 0

  end

  test 'login with remembering' do
    log_in_as(@user, remember_me: '1')
    assert_not_empty cookies['remember_token']
    assert_equal cookies['remember_token'], assigns[:user].remember_token
  end

  test 'login without remembering' do
    # Log in to set the cookie
    log_in_as(@user, remember_me: '1')
    # Log in again and verify that the cookie is deleted
    log_in_as(@user, remember_me: '0')
    assert_empty cookies['remember_token']
  end

end
```

### **Testing the Remember Branch**
My favorite way to handle untested code is to ```raise``` an exception in the suspected untested block of code: if the code isn’t covered, the tests will still pass; if it is covered, the resulting error will identify the relevant test.
```ruby
module SessionsHelper
  .
  .
  .
  # Returns the user corresponding to the remember token cookie.
  def current_user
    if (user_id = session[:user_id])
      @current_user ||= User.find_by(id: user_id)
    elsif (user_id = cookies.signed[:user_id])
      raise       # The tests still pass, so this branch is currently untested.
      user = User.find_by(id: user_id)
      if user && user.authenticated?(cookies[:remember_token])
        log_in user
        @current_user = user
      end
    end
  end
  .
  .
  .
end
```
Testing the “remember” branch of the ```current_user``` method is difficult in an integration test. Luckily, we can bypass this restriction by testing the ```current_user``` method directly in a Sessions helper test:
```
touch test/helpers/sessions_helper_test.rb
```
Test sequence is simple:
- Define a ```user``` variable using the fixtures
- Call the ```remember``` method to remember the given user
- Verify that ```current_user``` is equal to the given user

```ruby
require 'test_helper'

class SessionsHelperTest < ActionView::TestCase

  def setup
    @user = users(:michael) # references the fixture user
    remember(@user)
  end

  test "current_user returns right user when session is nil" do
    assert_equal @user, current_user
    assert is_logged_in?
  end

  test "current_user returns nil when remember digest is wrong" do
    @user.update_attribute(:remember_digest, User.digest(User.new_token))
    assert_nil current_user
  end
end
```
The conventional order for the arguments to assert_equal is expected, actual:
```ruby
assert_equal <expected>, <actual>
```
**Exercises**
- Verify by removing the ```authenticated?``` expression in Listing 9.33 that the second test in Listing 9.31 fails, thereby confirming that it tests the right thing.
> Done! Need to understand the tests a bit better

### **What We Learnt**
- Rails can maintain state from one page to the next using persistent cookies via the ```cookies``` method
- We associate to each user a remember token and a corresponding remember digest for use in persistent sessions
- Using the ```cookies``` method, we create a persistent session by placing a permanent remember token cookie on the browser
- Login status is determined by the presence of a current user based on the temporary session’s user id or the permanent session’s unique remember token
- The application signs users out by deleting the session’s user id and removing the permanent cookie from the browser
- The ternary operator is a compact way to write simple if-then statements