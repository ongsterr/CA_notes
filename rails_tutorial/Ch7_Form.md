## Chapter 7: Sign up
### **Debug and Rails Environments**
As preparation for adding dynamic pages to our sample application now is a good time to add some ```debug information``` to our site layout. This displays some useful information about each page using the built-in ```debug``` method and ```params``` variable.

```html
<!DOCTYPE html>
<html>
  .
  .
  .
  <body>
    <%= render 'layouts/header' %>
    <div class="container">
      <%= yield %>
      <%= render 'layouts/footer' %>
      <%= debug(params) if Rails.env.development? %>
    </div>
  </body>
</html>
```
What is ```debug(params)```?\
```if Rails.env.development?``` restrict the debug information to the development environment, which is one of three environments defined by default in Rails.

#### **Rails Environment**
Rails comes equipped with three environments: ```test```, ```development```, and ```production```. The default environment for the Rails console is ```development```.
```irb
$ rails console
  Loading development environment
  >> Rails.env
  => "development"
  >> Rails.env.development?
  => true
  >> Rails.env.test?
  => false
```
To run console in a different environment i.e. "test":
```irb
$ rails console test
  Loading test environment
  >> Rails.env
  => "test"
  >> Rails.env.test?
  => true
```
Can also run Rails server in a different environment:
```irb
$ rails server --environment production
```
If you view your app running in production, it won’t work without a production database, which we can create by running ```rails db:migrate``` in production:
```irb
$ rails db:migrate RAILS_ENV=production
```
This is a ```YAML``` representation of ```params```, which is basically a hash, and in this case identifies the controller and action for the page.\
Note:\
[YAML](http://yaml.org/): YAML Ain't Markup Language\
**What It Is**: YAML is a human friendly data serialization standard for all programming languages.

**Exercises**
- Visit ```/about``` in your browser and use the debug information to determine the controller and action of the ```params``` hash
```
controller: static_pages
action: about
```
- In the Rails console, pull the first user out of the database and assign it to the variable ```user```. What is the output of ```puts user.attributes.to_yaml```? Compare this to using the ```y``` method via ```y user.attributes```
```irb
2.4.1 :003 > user.attributes.to_yaml
 => "---\nid: 1\nname: Chris\nemail: chris@email.com\ncreated_at: !ruby/object:ActiveSupport::TimeWithZone\n  utc: &1 2018-04-10 12:01:58.974699000 Z\n  zone: &2 !ruby/object:ActiveSupport::TimeZone\n    name: Etc/UTC\n  time: *1\nupdated_at: !ruby/object:ActiveSupport::TimeWithZone\n  utc: &3 2018-04-10 12:01:58.974699000 Z\n  zone: *2\n  time: *3\npassword_digest: \"$2a$10$VpndYrvZn51fTZWGU7cZhONoCeb7rZFqQpUYOccDx00aebCBs0arO\"\n"
2.4.1 :004 > y user.attributes
---
id: 1
name: Chris
email: chris@email.com
created_at: !ruby/object:ActiveSupport::TimeWithZone
  utc: &1 2018-04-10 12:01:58.974699000 Z
  zone: &2 !ruby/object:ActiveSupport::TimeZone
    name: Etc/UTC
  time: *1
updated_at: !ruby/object:ActiveSupport::TimeWithZone
  utc: &3 2018-04-10 12:01:58.974699000 Z
  zone: *2
  time: *3
password_digest: "$2a$10$VpndYrvZn51fTZWGU7cZhONoCeb7rZFqQpUYOccDx00aebCBs0arO"
 => nil
```

### **Users Resource**
We’ll follow the conventions of the REST architecture favored in Rails applications, which means representing data as resources that can be created, shown, updated, or destroyed—four actions corresponding to the four fundamental operations ```POST```, ```GET```, ```PATCH```, and ```DELETE``` defined by the [HTTP standard](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol).

By adding ```resources :users``` to the routes file, it generates a bunch of URLs, actions, and named routes.

**Exercises**
- Using embedded Ruby, add the ```created_at``` and ```updated_at``` “magic column” attributes to the user show page
- Using embedded Ruby, add ```Time.now``` to the user show page. What happens when you refresh the browser?

### **Debugger**
**Exercises**
- With the debugger in the ```show``` action, hit ```/users/1```. Use ```puts``` to display the value of the YAML form of the ```params``` hash. How does it compare to the debug information shown by the ```debug``` method in the site template?
```irb
(byebug) params.to_yaml
"--- !ruby/object:ActionController::Parameters\nparameters: !ruby/hash:ActiveSupport::HashWithIndifferentAccess\n  controller: users\n  action: show\n  id: '1'\npermitted:
false\n"
```
Debug info on site template:
```
--- !ruby/object:ActionController::Parameters
parameters: !ruby/hash:ActiveSupport::HashWithIndifferentAccess
  controller: users
  action: show
  id: '1'
permitted: false
```

### **Gravatar Image and Sidebar**
What is a [Gravatar](http://en.gravatar.com/) or "globally recognised avatar"?

[Gravatar](http://en.gravatar.com/) is a free service that allows users to upload images and associate them with email addresses they control. As a result, Gravatars are a convenient way to include user profile images without going through the trouble of managing image upload, cropping, and storage; all we need to do is construct the proper Gravatar image URL using the user’s email address and the corresponding Gravatar image will automatically appear.

- By default, methods defined in any helper file are automatically available in any view, but for convenience we’ll put the ```gravatar_for``` method in the file for helpers associated with the Users controller. 
- As noted in the [Gravatar documentation](http://en.gravatar.com/site/implement/hash/), Gravatar URLs are based on an [MD5 hash](https://en.wikipedia.org/wiki/MD5) of the user’s email address. In Ruby, the MD5 hashing algorithm is implemented using the ```hexdigest``` method, which is part of the ```Digest``` library:
```ruby
>> email = "MHARTL@example.COM"
>> Digest::MD5::hexdigest(email.downcase)
=> "1fda4469bcbec3badf5418269ffc5968"
```
Since email addresses are case-insensitive but MD5 hashes are not we’ve used the ```downcase``` method to ensure that the argument to ```hexdigest``` is all lower-case.
```ruby
module UsersHelper

  # Returns the Gravatar for the given user.
  def gravatar_for(user)
    gravatar_id = Digest::MD5::hexdigest(user.email.downcase)
    gravatar_url = "https://secure.gravatar.com/avatar/#{gravatar_id}"
    image_tag(gravatar_url, alt: user.name, class: "gravatar")
  end
end
```
Example of adding Gravatar into the ```show``` view:
```html
<% provide(:title, @user.name) %>
<div class="row">
  <aside class="col-md-4">
    <section class="user_info">
      <h1>
        <%= gravatar_for(@user) %>
        <%= @user.name %>
      </h1>
    </section>
  </aside>
</div>
```

**Exercises**
- Associate a Gravatar with your primary email address if you haven’t already. What is the MD5 hash associated with the image?
```irb
2.4.1 :009 > user
 => #<User id: 2, name: "Chris Ong", email: "ong.chris11@gmail.com", created_at: "2018-04-11 10:28:17", updated_at: "2018-04-11 10:29:39", password_digest: "$2a$10$zHzaDYX6riZ1QynYVhUZGumbPFoM301ycmPls6STFoN...">
2.4.1 :010 > Digest::MD5::hexdigest(user.email.downcase)
 => "00df42d65b3e4657ee5ec3a6cea399d0"
```
- Verify that the code below allows the ```gravatar_for``` helper defined to take an optional ```size``` parameter, allowing code like ```gravatar_for user, size: 50``` in the view.
```ruby
module UsersHelper

  # Returns the Gravatar for the given user.
  def gravatar_for(user, options = { size: 80 })
    gravatar_id = Digest::MD5::hexdigest(user.email.downcase)
    size = options[:size]
    gravatar_url = "https://secure.gravatar.com/avatar/#{gravatar_id}?s=#{size}"
    image_tag(gravatar_url, alt: user.name, class: "gravatar")
  end
end
```
- The options hash used in the previous exercise is still commonly used, but as of Ruby 2.0 we can use keyword arguments instead. Confirm that the code below can be used in place of the code above. What are the diffs between the two?
```ruby
module UsersHelper

  # Returns the Gravatar for the given user.
  def gravatar_for(user, size: 80)
    gravatar_id = Digest::MD5::hexdigest(user.email.downcase)
    gravatar_url = "https://secure.gravatar.com/avatar/#{gravatar_id}?s=#{size}"
    image_tag(gravatar_url, alt: user.name, class: "gravatar")
  end
end
``` 

### **Using** ```form_for```
Recalling that the signup page ```/signup``` is routed to the ```new``` action in the Users controller, our first step is to create the User object required as an argument to ```@user```.

Example of a form in HTML using ERB:
```html
<% provide(:title, 'Sign up') %>
<h1>Sign up</h1>

<div class="row">
  <div class="col-md-6 col-md-offset-3">
    <%= form_for(@user) do |f| %>
      <%= f.label :name %>
      <%= f.text_field :name %>

      <%= f.label :email %>
      <%= f.email_field :email %>

      <%= f.label :password %>
      <%= f.password_field :password %>

      <%= f.label :password_confirmation, "Confirmation" %>
      <%= f.password_field :password_confirmation %>

      <%= f.submit "Create my account", class: "btn btn-primary" %>
    <% end %>
  </div>
</div>
```
**Exercises**
- Replace ```:name``` with ```:nome```. What error message do you get as a result?
```
undefined method `nome' for #<User:0x007ffc7a250250>
Did you mean?  name
```
- Confirm by replacing all occurrences of ```f``` with ```foobar``` that the name of the block variable is irrelevant as far as the result is concerned. Why might ```foobar``` nevertheless be a bad choice?

### **Signup Form HTML**
The form built in Rails using ERB gets translated to the below HTML syntax:
```html
<form accept-charset="UTF-8" action="/users" class="new_user"
      id="new_user" method="post">
  <input name="utf8" type="hidden" value="&#x2713;" />
  <input name="authenticity_token" type="hidden"
         value="NNb6+J/j46LcrgYUC60wQ2titMuJQ5lLqyAbnbAUkdo=" />
  <label for="user_name">Name</label>
  <input id="user_name" name="user[name]" type="text" />

  <label for="user_email">Email</label>
  <input id="user_email" name="user[email]" type="email" />

  <label for="user_password">Password</label>
  <input id="user_password" name="user[password]"
         type="password" />

  <label for="user_password_confirmation">Confirmation</label>
  <input id="user_password_confirmation"
         name="user[password_confirmation]" type="password" />

  <input class="btn btn-primary" name="commit" type="submit"
         value="Create my account" />
</form>
```
The key to creating a user is the special ```name``` attribute in each input:
```html
<input id="user_name" name="user[name]" - - - />
.
.
.
<input id="user_password" name="user[password]" - - - />
```
These ```name``` values allow Rails to construct an initialization hash (via the ```params``` variable) for creating users using the values entered by the user.

The second important element is the ```form``` tag itself. Rails creates the ```form``` tag using the ```@user``` object: because every Ruby object knows its own class, Rails figures out that ```@user``` is of class User; moreover, since ```@user``` is a new user, Rails knows to construct a ```form``` with the ```post``` method, which is the proper verb for creating a new object:
```html
<form action="/users" class="new_user" id="new_user" method="post">
```
Here the ```class``` and ```id``` attributes are largely irrelevant; what’s important is ```action="/users"``` and ```method="post"```. Together, these constitute instructions to issue an HTTP ```POST``` request to the ```/users``` URL.

Note: inside the form tag:
```html
<input name="utf8" type="hidden" value="&#x2713;" />
<input name="authenticity_token" type="hidden" value="NNb6+J/j46LcrgYUC60wQ2titMuJQ5lLqyAbnbAUkdo=" />
```
Briefly, it uses the Unicode character ```&#x2713;``` (a checkmark ✓) to force browsers to submit data using the right character encoding, and then it includes an authenticity token, which Rails uses to thwart an attack called a [cross-site request forgery (CSRF)](https://en.wikipedia.org/wiki/Cross-site_request_forgery).

To get a better picture of how Rails handles the submission, let’s take a closer look at the ```user``` part of the parameters hash from the debug information:
```
"user" => { "name" => "Foo Bar",
            "email" => "foo@invalid",
            "password" => "[FILTERED]",
            "password_confirmation" => "[FILTERED]"
          }
```
- This hash gets passed to the Users controller as part of ```params```.
- In the case of a URL like /users/1, the value of ```params[:id]``` is the ```id``` of the corresponding user (1 in this example). In the case of posting to the signup form, ```params``` instead contains a hash of hashes
- The debug information above shows that submitting the form results in a ```user``` hash with attributes corresponding to the submitted values, where the keys come from the ```name``` attributes of the ```input``` tags:
```html
<input id="user_email" name="user[email]" type="email" />
```
- Name "```user[email]```" is precisely the ```email``` attribute of the ```user``` hash.
- Although the hash keys appear as strings in the debug output, we can access them in the ```Users``` controller as symbols, so that ```params[:user]``` is the hash of user attributes—in fact, exactly the attributes needed as an argument to ```User.new```:
```ruby
@user = User.new(params[:user])
```
is equivalent to
```ruby
@user = User.new(name: "Foo Bar", email: "foo@invalid",
                 password: "foo", password_confirmation: "bar")
```

### **Strong Parameters**
This allows us to specify which parameters are required and which ones are permitted. In addition, passing in a raw ```params``` hash as above will cause an error to be raised, so that Rails applications are now immune to mass assignment vulnerabilities by default.

In the present instance, we want to require the params hash to have a :user attribute, and we want to permit the name, email, password, and password confirmation attributes (but no others). We can accomplish this as follows:
```
params.require(:user).permit(:name, :email, :password, :password_confirmation)
@user = User.new(user_params)
```
Since user_params will only be used internally by the Users controller and need not be exposed to external users via the web, we’ll make it private using Ruby’s private keyword:
```ruby
class UsersController < ApplicationController
  .
  .
  .
  def create
    @user = User.new(user_params)
    if @user.save
      # Handle a successful save.
    else
      render 'new'
    end
  end

  private

    def user_params
      params.require(:user).permit(:name, :email, :password,
                                   :password_confirmation)
    end
end
```

### **Signup Error Message**
**Exercises**
- Confirm by changing the minimum length of passwords to 5 that the error message updates automatically as well.
- How does the URL on the unsubmitted signup form (Figure 7.12) compare to the URL for a submitted signup form (Figure 7.18)? Why don’t they match?
  - When form is not submitted, the URL shows ```/signup``` because this is the URL when you click the button "signup" in ```home```
  - When the form is submitted, see below defined actions in the User controller:
```ruby
def create
  @user = User.new(user_params)
  if @user.save
    # Handle a successful save.
  else
    render 'new'
  end
end
```
**Recall**:\
When ```resources :users``` is inserted into the routes,

| HTTP Request | URL | Action | Named Route | Purpose |
|---|---|---|---|---|
| GET | /users | ```index``` | ```users_path``` | page to list all users |
| GET | /users/1 | ```show``` | ```user_path(users)``` | page to show user |
| GET | /users/new | ```new``` | ```new_user_path``` | page to make new user (signup) |
| POST | /users | ```create``` | ```users_path``` | create a new user |
| GET | /users/1/edit | ```edit``` | ```edit_user_path(user)``` | page to edit user with id 1 |
| PATCH | /users/1 | ```udpate``` | ```user_path(user)``` | update user |
| DELETE | /users/1 | ```destroy``` | ```user_path(user)``` | delete user |

### **Test for Invalid Submission**
Here's an extract of the assertions you can use with [Minitest](https://github.com/seattlerb/minitest), the default testing library used by Rails. The ```[msg]``` parameter is an optional string message you can specify to make your test failure messages clearer.

| Assertion |	Purpose |
|---|---|
| assert_select( *args, &block ) | An assertion that selects elements and makes one or more equality tests. See more info in [docs](http://api.rubyonrails.org/v4.1/classes/ActionDispatch/Assertions/SelectorAssertions.html).
| assert( test, [msg] ) |	Ensures that test is true. |
| assert_not( test, [msg] ) |	Ensures that test is false. |
| assert_equal( expected, actual, [msg] ) |	Ensures that expected == actual is true. |
| assert_not_equal( expected, actual, [msg] ) |	Ensures that expected != actual is true. |
| assert_same( expected, actual, [msg] ) |	Ensures that expected.equal?(actual) is true. |
| assert_not_same( expected, actual, [msg] ) |	Ensures that expected.equal?(actual) is false. |
| assert_nil( obj, [msg] ) |	Ensures that obj.nil? is true. |
| assert_not_nil( obj, [msg] ) |	Ensures that obj.nil? is false. |
| assert_empty( obj, [msg] ) |	Ensures that obj is empty?. |
| assert_not_empty( obj, [msg] ) |	Ensures that obj is not empty?. |
| assert_match( regexp, string, [msg] ) |	Ensures that a string matches the regular expression. |
| assert_no_match( regexp, string, [msg] ) |	Ensures that a string doesn't match the regular expression. |
| assert_includes( collection, obj, [msg] ) |	Ensures that obj is in collection. |
| assert_not_includes( collection, obj, [msg] ) |	Ensures that obj is not in collection. |
| assert_in_delta( expected, actual, [delta], [msg] ) |	Ensures that the numbers expected and actual are within delta of each other. |
| assert_not_in_delta( expected, actual, [delta], [msg] ) |	Ensures that the numbers expected and actual are not within delta of each other. |
| assert_in_epsilon ( expected, actual, [epsilon], [msg] ) |	Ensures that the numbers expected and actual have a relative error less than epsilon. |
| assert_not_in_epsilon ( expected, actual, [epsilon], [msg] ) |	Ensures that the numbers expected and actual don't have a relative error less than epsilon. |
| assert_throws( symbol, [msg] ) { block } |	Ensures that the given block throws the symbol. |
| assert_raises( exception1, exception2, ... ) { block } |	Ensures that the given block raises one of the given exceptions. |
| assert_instance_of( class, obj, [msg] ) |	Ensures that obj is an instance of class. |
| assert_not_instance_of( class, obj, [msg] ) |	Ensures that obj is not an instance of class. |
| assert_kind_of( class, obj, [msg] ) |	Ensures that obj is an instance of class or is descending from it. |
| assert_not_kind_of( class, obj, [msg] ) |	Ensures that obj is not an instance of class and is not descending from it. |
| assert_respond_to( obj, symbol, [msg] ) |	Ensures that obj responds to symbol. |
| assert_not_respond_to( obj, symbol, [msg] ) |	Ensures that obj does not respond to symbol. |
| assert_operator( obj1, operator, [obj2], [msg] ) |	Ensures that obj1.operator(obj2) is true. |
| assert_not_operator( obj1, operator, [obj2], [msg] ) |	Ensures that obj1.operator(obj2) is false. |
| assert_predicate ( obj, predicate, [msg] ) |	Ensures that obj.predicate is true, e.g. assert_predicate str, :empty? |
| assert_not_predicate ( obj, predicate, [msg] ) |	Ensures that obj.predicate is false, e.g. assert_not_predicate str, :empty? |
flunk( [msg] ) |	Ensures failure. This is useful to explicitly mark a test that isn't finished yet. |

The above are a subset of assertions that minitest supports. For an exhaustive & more up-to-date list, please check [Minitest API documentation](http://docs.seattlerb.org/minitest/), specifically ```Minitest::Assertions```.

**Rails** adds some custom assertions of its own to the ```minitest framework```:

| Assertion |	Purpose |
|---|---|
| assert_difference(expressions, difference = 1, message = nil) {...} |	Test numeric difference between the return value of an expression as a result of what is evaluated in the yielded block. |
| assert_no_difference(expressions, message = nil, &block) |	Asserts that the numeric result of evaluating an expression is not changed before and after invoking the passed in block. |
| assert_changes(expressions, message = nil, from:, to:, &block) |	Test that the result of evaluating an expression is changed after invoking the passed in block. |
| assert_no_changes(expressions, message = nil, &block) |	Test the result of evaluating an expression is not changed after invoking the passed in block. |
| assert_nothing_raised { block } |	Ensures that the given block doesn't raise any exceptions. |
| assert_recognizes(expected_options, path, extras={}, message=nil) |	Asserts that the routing of the given path was handled correctly and that the parsed options (given in the ```expected_options``` hash) match path. Basically, it asserts that Rails recognizes the route given by ```expected_options```. |
| assert_generates(expected_path, options, defaults={}, extras = {}, message=nil) |	Asserts that the provided options can be used to generate the provided path. This is the inverse of ```assert_recognizes```. The extras parameter is used to tell the request the names and values of additional request parameters that would be in a query string. The message parameter allows you to specify a custom error message for assertion failures. |
| assert_response(type, message = nil) |	Asserts that the response comes with a specific status code. You can specify ```:success``` to indicate 200-299, ```:redirect``` to indicate 300-399, ```:missing``` to indicate 404, or ```:error``` to match the 500-599 range. You can also pass an explicit status number or its symbolic equivalent. For more information, see [full list of status codes](http://www.rubydoc.info/github/rack/rack/master/Rack/Utils#HTTP_STATUS_CODES-constant) and how their [mapping](http://www.rubydoc.info/github/rack/rack/master/Rack/Utils#SYMBOL_TO_STATUS_CODE-constant) works. |
| assert_redirected_to(options = {}, message=nil) |	Asserts that the redirection options passed in match those of the redirect called in the latest action. This match can be partial, such that ```assert_redirected_to(controller: "weblog")``` will also match the redirection of ```redirect_to(controller: "weblog", action: "show")``` and so on. You can also pass named routes such as ```assert_redirected_to root_path``` and Active Record objects such as ```assert_redirected_to @article```. |

**Exercises**
- Write a test for the error messages. How detailed you want to make your tests is up to you; a suggested template appears below.
```ruby
test "invalid signup information" do
    get signup_path
    assert_no_difference 'User.count' do
      post users_path, params: { user: { name:  "",
                                         email: "user@invalid",
                                         password:              "foo",
                                         password_confirmation: "bar" } }
    end
    assert_template 'users/new'
    assert_select 'div#<CSS id for error explanation>'
    assert_select 'div.<CSS class for field with error>'
  end
```
- The URLs for an unsubmitted signup form and for a submitted signup form are ```/signup``` and ```/users```, respectively, which don’t match. This is due to our use of a custom named route in the former case and a default RESTful route in the latter case. Resolve this discrepancy by adding the code shown in Listing 7.26 and Listing 7.27. Submit the new form to confirm that both cases now use the same ```/signup``` URL. Are the tests still green? Why?
> Get help!

### **The Flash**
The Rails way to display a temporary message is to use a special method called the flash, which we can treat like a hash. Rails adopts the convention of a ```:success``` key for a message indicating a successful result:
```ruby
def create
  @user = User.new(user_params)
  if @user.save
    flash[:success] = "Welcome to the Sample App!"
    redirect_to @user
  else
    render 'new'
  end
end
```
**Exercises**
- Write a test for the flash implemented

### **SSL in Production**
When submitting the signup form developed in this chapter, the name, email address, and password get sent over the network, and hence are vulnerable to being intercepted by malicious users. This is a potentially serious security flaw in our application, and the way to fix it is to use [Secure Sockets Layer (SSL)](https://en.wikipedia.org/wiki/Transport_Layer_Security) to encrypt all relevant information before it leaves the local browser.

Enabling SSL is as easy as uncommenting a single line in ```production.rb```, the configuration file for production applications.
```ruby
Rails.application.configure do
  .
  .
  .
  # Force all access to the app over SSL, use Strict-Transport-Security,
  # and use secure cookies.
  config.force_ssl = true
  .
  .
  .
end
```

### **Production Webserver**
To add the new webserver, we simply follow the [Heroku Puma documentation](https://devcenter.heroku.com/articles/deploying-rails-applications-with-the-puma-web-server).
- The first step is to include the puma gem in our Gemfile, but as of Rails 5 Puma is included by default 
- This means we can skip right to the second step, which is to replace the default contents of the file ```config/puma.rb``` with the configuration:
```ruby
workers Integer(ENV['WEB_CONCURRENCY'] || 2)
threads_count = Integer(ENV['RAILS_MAX_THREADS'] || 5)
threads threads_count, threads_count

preload_app!

rackup      DefaultRackup
port        ENV['PORT']     || 3000
environment ENV['RACK_ENV'] || 'development'

on_worker_boot do
  # Worker specific setup for Rails 4.1+
  # See: https://devcenter.heroku.com/articles/
  # deploying-rails-applications-with-the-puma-web-server#on-worker-boot
  ActiveRecord::Base.establish_connection
end
```
- We also need to make a so-called ```Procfile``` to tell Heroku to run a Puma process in production. The ```Procfile``` should be created in your application’s root directory (i.e., in the same location as the ```Gemfile```).
```
web: bundle exec puma -C config/puma.rb
```
**Exercises**
- Confirm on your browser that the SSL lock and ```https``` appear
- Create a user on the production site using your primary email address. Does your Gravatar appear correctly?
> Done!

### **What We Learnt**
- Rails displays useful debug information via the ```debug``` method
- Sass mixins allow a group of CSS rules to be bundled and reused in multiple places
- Rails comes with three standard environments: ```development```, ```test```, and ```production```
- We can interact with users as a *resource* through a standard set of REST URLs
- Gravatars provide a convenient way of displaying images to represent users
- The ```form_for``` helper is used to generate forms for interacting with Active Record objects
- Signup failure renders the new user page and displays error messages automatically determined by Active Record
- Rails provides the ```flash``` as a standard way to display temporary messages
- Signup success creates a user in the database and redirects to the user show page, and displays a welcome message
- We can use integration tests to verify form submission behavior and catch regressions
- We can configure our production application to use SSL for secure communications and Puma for high performance

