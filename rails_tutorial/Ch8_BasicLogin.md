## Chapter 8: Basic Login
### **Sessions**
- [HTTP](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol) is a [stateless protocol](https://en.wikipedia.org/wiki/Stateless_protocol), treating each request as an independent transaction that is unable to use information from any previous requests. This means there is no way within the hypertext transfer protocol to remember a user’s identity from page to page; instead, web applications requiring user login must use a [session](https://en.wikipedia.org/wiki/Session_(computer_science)), which is a semi-permanent connection between two computers (such as a client computer running a web browser and a server running Rails).
- The most common techniques for implementing sessions in Rails involve using [cookies](https://en.wikipedia.org/wiki/HTTP_cookie), which are small pieces of text placed on the user’s browser.
    - Cookies were designed to be a reliable mechanism for websites to remember stateful information (such as items added in the shopping cart in an online store) or to record the user's browsing activity (including clicking particular buttons, logging in, or recording which pages were visited in the past). They can also be used to remember arbitrary pieces of information that the user previously entered into form fields such as names, addresses, passwords, and credit card numbers.

### **Sessions Controller**
The elements of logging in and out correspond to particular REST actions of the Sessions controller:
- the login form is handled by the ```new``` action
- logging in is handled by sending a POST request to the ```create``` action
- logging out is handled by sending a DELETE request to the ```destroy``` action

To view the complete list of routes for our application, go ```rails routes```:
```
05:28:31 | ^o^ | sample_app (basic-login)>> rails routes
      Prefix Verb   URI Pattern               Controller#Action
sessions_new GET    /sessions/new(.:format)   sessions#new
   users_new GET    /users/new(.:format)      users#new
        root GET    /                         static_pages#home
        home GET    /home(.:format)           static_pages#home
        help GET    /help(.:format)           static_pages#help
       about GET    /about(.:format)          static_pages#about
     contact GET    /contact(.:format)        static_pages#contact
      signup GET    /signup(.:format)         users#new
             POST   /signup(.:format)         users#create
       login GET    /login(.:format)          sessions#new
             POST   /login(.:format)          sessions#create
      logout DELETE /logout(.:format)         sessions#destroy
       users GET    /users(.:format)          users#index
             POST   /users(.:format)          users#create
    new_user GET    /users/new(.:format)      users#new
   edit_user GET    /users/:id/edit(.:format) users#edit
        user GET    /users/:id(.:format)      users#show
             PATCH  /users/:id(.:format)      users#update
             PUT    /users/:id(.:format)      users#update
             DELETE /users/:id(.:format)      users#destroy
```
**Exercises**
- What is the difference between ```GET login_path``` and ```POST login_path```?
> ```GET login_path``` leads to NEW action while ```POST login_path``` leads to CREATE action
- By piping the results of ```rails routes``` to ```grep```, list all the routes associated with the Users resource. Do the same for Sessions. How many routes does each resource have?
```
05:30:48 | ^o^ | sample_app (basic-login)>> rails routes | grep users
   users_new GET    /users/new(.:format)      users#new
      signup GET    /signup(.:format)         users#new
             POST   /signup(.:format)         users#create
       users GET    /users(.:format)          users#index
             POST   /users(.:format)          users#create
    new_user GET    /users/new(.:format)      users#new
   edit_user GET    /users/:id/edit(.:format) users#edit
        user GET    /users/:id(.:format)      users#show
             PATCH  /users/:id(.:format)      users#update
             PUT    /users/:id(.:format)      users#update
             DELETE /users/:id(.:format)      users#destroy
```
```
05:36:03 | ^o^ | sample_app (basic-login)>> rails routes | grep sessions
sessions_new GET    /sessions/new(.:format)   sessions#new
       login GET    /login(.:format)          sessions#new
             POST   /login(.:format)          sessions#create
      logout DELETE /logout(.:format)         sessions#destroy
```

### **Login Form**
To be build the login page, we will be using the ```form_for``` method again, but this type explicitly specify the corresponding URL after POST:
```html
<% provide(:title, "Log in") %>
<h1>Log in</h1>

<div class="row">
  <div class="col-md-6 col-md-offset-3">
    <%= form_for(:session, url: login_path) do |f| %>

      <%= f.label :email %>
      <%= f.email_field :email, class: 'form-control' %>

      <%= f.label :password %>
      <%= f.password_field :password, class: 'form-control' %>

      <%= f.submit "Log in", class: "btn btn-primary" %>
    <% end %>

    <p>New user? <%= link_to "Sign up now!", signup_path %></p>
  </div>
</div>
```

The generated form HTML appears as:
```html
<form accept-charset="UTF-8" action="/login" method="post">
  <input name="utf8" type="hidden" value="&#x2713;" />
  <input name="authenticity_token" type="hidden"
         value="NNb6+J/j46LcrgYUC60wQ2titMuJQ5lLqyAbnbAUkdo=" />
  <label for="session_email">Email</label>
  <input class="form-control" id="session_email"
         name="session[email]" type="text" />
  <label for="session_password">Password</label>
  <input id="session_password" name="session[password]"
         type="password" />
  <input class="btn btn-primary" name="commit" type="submit"
       value="Log in" />
</form>
```
Note:\
You might be able to guess that submitting this form will result in a ```params``` hash where ```params[:session][:email]``` and ```params[:session][:password]``` correspond to the email and password fields.

**Exercises**
- Submissions from the form will be routed to the Session controller’s ```create``` action. How does Rails know to do this?
> This was specified in the routes where ```post   '/login',   to: 'sessions#create'```

### **Finding and Authenticating a User**
Inside the ```create``` action the ```params``` hash has all the information needed to authenticate users by email and password. Not coincidentally, we already have exactly the methods we need: - The ```User.find_by``` method provided by Active Record
- The ```authenticate``` method provided by ```has_secure_password```

Recalling that ```authenticate``` returns false for an invalid authentication, our strategy for user login can be summarized below:
```ruby
class SessionsController < ApplicationController

  def new
  end

  def create
    user = User.find_by(email: params[:session][:email].downcase)
    if user && user.authenticate(params[:session][:password])
      # Log the user in and redirect to the user's show page.
    else
      # Create an error message.
      render 'new'
    end
  end

  def destroy
  end
end
```
Logic table for login based on above logic (```if``` statement):

| User | Password | a && b |
|:---|:---|:---|
| non-existant | anything | ```(nil && [anything]) == false``` |
|valid user | wrong password | ```(true && false) == false``` |
|valid user | right password | ```(true && true) == true``` |

**Exercises**
- Using the Rails console, confirm each of the values in table above. Start with ```user = nil```, and then use ```user = User.first```. Hint: To coerce the result to a boolean value, use the bang-bang trick as in ```!!(user && user.authenticate(’foobar’))```.
```irb
2.4.1 :019 > !!(user && user.authenticate("123456"))
 => true
```

### **Rendering with Flash Message**
The way to get the failing test to pass is to replace ```flash``` with the special variant ```flash.now```, which is specifically designed for displaying flash messages on ```rendered pages```. Unlike the contents of flash, the contents of ```flash.now``` disappear as soon as there is an additional request.
```ruby
class SessionsController < ApplicationController

  def new
  end

  def create
    user = User.find_by(email: params[:session][:email].downcase)
    if user && user.authenticate(params[:session][:password])
      # Log the user in and redirect to the user's show page.
    else
      flash.now[:danger] = 'Invalid email/password combination'
      render 'new'
    end
  end

  def destroy
  end
end
```
**Exercises**
- Verify in your browser that the sequence works correctly, i.e., that the flash message disappears when you click on a second page
> Done!

### **Logging In**
Implementing sessions will involve defining a large number of related functions for use across multiple controllers and views. Conveniently, a ```Sessions helper``` module was generated automatically when generating the Sessions controller.

Such helpers are automatically included in Rails views; by including the module into the base class of all controllers (the ```Application controller```), we arrange to make them available in our controllers as well:
```ruby
class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  include SessionsHelper
end
```
We can treat ```session``` as if it were a hash, and assign to it as follows:
```ruby
session[:user_id] = user.id
```
This places a temporary cookie on the user’s browser containing an encrypted version of the user’s id, which allows us to retrieve the id on subsequent pages using ```session[:user_id]```.

Because we’ll want to use the same login technique in a couple of different places, we’ll define a method called ```log_in``` in the Sessions helper:
```ruby
module SessionsHelper

  # Logs in the given user.
  def log_in(user)
    session[:user_id] = user.id
  end
end
```
**Exercises**
- Log in with a valid user and inspect your browser’s cookies. What is the value of the session content?
- What is the value of the Expires attribute from the previous exercise?
> Found it under "Application" in the web inspector

Define the ```current_user``` method as follow:
```ruby
def current_user
  User.find_by(id: session[:user_id])
end
```
This would work fine, but it would hit the database multiple times if, e.g., ```current_user``` appeared multiple times on a page. Instead, we’ll follow a common Ruby convention by storing the result of ```User.find_by``` in an instance variable, which hits the database the first time but returns the instance variable immediately on subsequent invocations:
```ruby
if @current_user.nil?
  @current_user = User.find_by(id: session[:user_id])
else
  @current_user
end
```
or
```ruby
@current_user ||= User.find_by(id: session[:user_id])
```
**Exercises**
- Confirm at the console that User.find_by(id: ...) returns nil when the corresponding user doesn’t exist.
- In a Rails console, create a session hash with key :user_id.
```irb
2.4.1 :006 > session[:user_id]
 => nil
2.4.1 :007 > session[:user_id] = User.first.id
  User Load (0.2ms)  SELECT  "users".* FROM "users" ORDER BY "users"."id" ASC LIMIT ?  [["LIMIT", 1]]
 => 1
2.4.1 :008 > @current_user ||= User.find_by(id: session[:user_id])
  User Load (0.2ms)  SELECT  "users".* FROM "users" WHERE "users"."id" = ? LIMIT ?  [["id", 1], ["LIMIT", 1]]
 => #<User id: 1, name: "Rails Tutorial", email: "example@railstutorial.org", created_at: "2018-04-12 03:57:06", updated_at: "2018-04-12 03:57:06", password_digest: "$2a$10$GRkvHlSf6gtNwXAu.qXcL.49NIGWF/3Tq3GEYHd9MBB...">
2.4.1 :009 > @current_user ||= User.find_by(id: session[:user_id])
 => #<User id: 1, name: "Rails Tutorial", email: "example@railstutorial.org", created_at: "2018-04-12 03:57:06", updated_at: "2018-04-12 03:57:06", password_digest: "$2a$10$GRkvHlSf6gtNwXAu.qXcL.49NIGWF/3Tq3GEYHd9MBB...">
```

### **Changing Layout Links**
Let's make the profile page look something like the below:\
![profile page](https://softcover.s3.amazonaws.com/636/ruby_on_rails_tutorial_4th_edition/images/figures/login_success_mockup.png)

Updated header:
```html
<header class="navbar navbar-fixed-top navbar-inverse">
  <div class="container">
    <%= link_to "sample app", root_path, id: "logo" %>
    <nav>
      <ul class="nav navbar-nav navbar-right">
        <li><%= link_to "Home", root_path %></li>
        <li><%= link_to "Help", help_path %></li>
        <% if logged_in? %>
          <li><%= link_to "Users", '#' %></li>
          <li class="dropdown">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown">
              Account <b class="caret"></b>
            </a>
            <ul class="dropdown-menu">
              <li><%= link_to "Profile", current_user %></li>
              <li><%= link_to "Settings", '#' %></li>
              <li class="divider"></li>
              <li>
                <%= link_to "Log out", logout_path, method: :delete %>
              </li>
            </ul>
          </li>
        <% else %>
          <li><%= link_to "Log in", login_path %></li>
        <% end %>
      </ul>
    </nav>
  </div>
</header>
```
**Exercises**
- Using the cookie inspector in your browser, remove the session cookie and confirm that the layout links revert to the non-logged-in state.
> Done!
- Log in again, confirming that the layout links change correctly. Then quit your browser and start it again to confirm that the layout links revert to the non-logged-in state. (If your browser has a “remember where I left off” feature that automatically restores the session, be sure to disable it in this step)

### **Testing Layout Changes**
Let's write a series of steps to verify the following sequence of actions:
- Visit the login path
- Post valid information to the sessions path
- Verify that the login link disappears
- Verify that a logout link appears
- Verify that a profile link appears

In order to see these changes, our test needs to log in as a previously registered user, which means that such a user must already exist in the database. The default Rails way to do this is to use ```fixtures```, which are a way of organizing data to be loaded into the test database.

Example of test:
```ruby
test "login with valid information" do
    get login_path
    post login_path, params: { session: { email:    @user.email,
                                          password: 'password' } }
    assert_redirected_to @user
    follow_redirect!
    assert_template 'users/show'
    assert_select "a[href=?]", login_path, count: 0
    assert_select "a[href=?]", logout_path
    assert_select "a[href=?]", user_path(@user)
  end
```
**Exercises**
- Delete the bang ! in the Session helper’s logged_in? method and confirm that the test is red.
- Restore the ! to get back to green.

### **Login Upon Signup**

### **Logging Out**
Logging out involves undoing the effects of the ```log_in``` method, which involves deleting the user id from the session. To do this, we use the ```delete``` method as follows:
```ruby
session.delete(:user_id)
```
As with ```log_in``` and associated methods, we’ll put the resulting ```log_out``` method in the Sessions helper module:
```ruby
module SessionsHelper

  # Logs in the given user.
  def log_in(user)
    session[:user_id] = user.id
  end
  .
  .
  .
  # Logs out the current user.
  def log_out
    session.delete(:user_id)
    @current_user = nil
  end
end
```
We can put the log_out method to use in the Sessions controller’s ```destroy``` action:
```ruby
def destroy
    log_out
    redirect_to root_url
end
```
To test the logout machinery, we can add some steps to the user login test.
- After logging in, we use ```delete``` to issue a DELETE request to the logout path and
- Verify that the user is logged out and
- Redirected to the root URL
- Check that the login link reappears
- Check that the logout and profile links disappear

**Exercises**
- Confirm in a browser that the “Log out” link causes the correct changes in the site layout. What is the correspondence between these changes and the final three steps?
- By checking the site cookies, confirm that the session is correctly removed after logging out.

### **What We Learnt**
- Rails can maintain state from one page to the next using temporary cookies via the session method
- The login form is designed to create a new session to log a user in
- The ```flash.now``` method is used for flash messages on rendered pages
- Test-driven development is useful when debugging by reproducing the bug in a test
- Using the ```session``` method, we can securely place a user id on the browser to create a temporary session
- We can change features such as links on the layouts based on login status
- Integration tests can verify correct routes, database updates, and proper changes to the layout