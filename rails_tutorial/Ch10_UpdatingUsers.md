## **Chapter 10: Updating, Showing and Deleting Users
1. Visualise potential page for updating user information:

![update page](https://softcover.s3.amazonaws.com/636/ruby_on_rails_tutorial_4th_edition/images/figures/edit_user_mockup_bootstrap.png)

2. To find user in the edit view:
```ruby
  def edit
    @user = User.find(params[:id])
  end
```
3. Build user edit view:
```html
<% provide(:title, "Edit user") %>
<h1>Update your profile</h1>

<div class="row">
  <div class="col-md-6 col-md-offset-3">
    <%= form_for(@user) do |f| %>
      <%= render 'shared/error_messages' %>

      <%= f.label :name %>
      <%= f.text_field :name, class: 'form-control' %>

      <%= f.label :email %>
      <%= f.email_field :email, class: 'form-control' %>

      <%= f.label :password %>
      <%= f.password_field :password, class: 'form-control' %>

      <%= f.label :password_confirmation, "Confirmation" %>
      <%= f.password_field :password_confirmation, class: 'form-control' %>

      <%= f.submit "Save changes", class: "btn btn-primary" %>
    <% end %>

    <div class="gravatar_edit">
      <%= gravatar_for @user %>
      <a href="http://gravatar.com/emails" target="_blank">change</a>
    </div>
  </div>
</div>
```

4. HTML for the edit form:
```html
<form accept-charset="UTF-8" action="/users/1" class="edit_user"
      id="edit_user_1" method="post">
  <input name="_method" type="hidden" value="patch" />
  .
  .
  .
</form>
```
Since web browsers can’t natively send *PATCH* requests (as required by the REST conventions, Rails fakes it with a *POST* request and a hidden ```input``` field. But how does Rails know to use a *POST* request for new users and a *PATCH* for editing users?
- It is possible to tell whether a user is new or already exists in the database via Active Record’s ```new_record?``` boolean method:
```irb
$ rails console
>> User.new.new_record?
=> true
>> User.first.new_record?
=> false
```
When constructing a form using ```form_for(@user)```, Rails uses POST if ```@user.new_record?``` is true and PATCH if it is false.

**Exercises**
- As noted above, there’s a minor security issue associated with using ```target="_blank"``` to open URLs, which is that the target site gains control of what’s known as the “window object” associated with the HTML document. The result is that the target site could potentially introduce malicious content, such as a [phishing](https://en.wikipedia.org/wiki/Phishing) page. This is extremely unlikely to happen when linking to a reputable site like Gravatar, but [it turns out](http://lmgtfy.com/?q=target+_blank+security) that we can eliminate the risk entirely by setting the ```rel``` attribute (“relationship”) to "```noopener```" in the origin link. Add this attribute to the Gravatar edit link.
```html
    <a href="http://gravatar.com/emails" target="_blank" rel="noopener">Change</a>
```
For more information, read [this](https://mathiasbynens.github.io/rel-noopener/).

- Remove the duplicated form code by refactoring the ```new.html.erb``` and ```edit.html.erb``` views to use the partial in Listing 10.5, as shown in Listing 10.6 and Listing 10.7. Note the use of the provide method, which we used before in Section 3.4.3 to eliminate duplication in the layout.3 (If you solved the exercise corresponding to Listing 7.27, this exercise won’t work exactly as written, and you’ll have to apply your technical sophistication to resolve the discrepancy. My suggestion is to use the variable-passing technique shown in Listing 10.5 to pass the needed URL from Listing 10.6 and Listing 10.7 to the form in Listing 10.5.)
> Done!

### **Testing Unsuccessful Edits**
Our first step is to generate an integration test:
```
$ rails generate integration_test users_edit
      invoke  test_unit
      create    test/integration/users_edit_test.rb
```
The test checks for the correct behavior by verifying that the edit template is rendered after getting the edit page and re-rendered upon submission of invalid information.

See below users_edit_test.rb:
```ruby
require 'test_helper'

class UsersEditTest < ActionDispatch::IntegrationTest

  def setup
    @user = users(:michael)
  end

  test "unsuccessful edit" do
    get edit_user_path(@user)
    assert_template 'users/edit'
    patch user_path(@user), params: { user: { name:  "",
                                              email: "foo@invalid",
                                              password:              "foo",
                                              password_confirmation: "bar" } }

    assert_template 'users/edit'
  end
end
```
**Exercises**
- Add a line in Listing 10.9 to test for the correct number of error messages. Hint: Use an ```assert_select``` that tests for a div with class alert containing the text “The form contains 4 errors.”
```ruby
assert_select 'div.alert', "The form contains 4 errors."
```

### **Successful Edits (with TDD)**
As you get more comfortable with testing, you might find that it’s useful to write integration tests before writing the application code instead of after. In this context, such tests are sometimes known as ```acceptance tests```, since they determine when a particular feature should be accepted as complete.

Note also the use of ```@user.reload``` to reload the user’s values from the database and confirm that they were successfully updated.
```ruby
require 'test_helper'

class UsersEditTest < ActionDispatch::IntegrationTest

  def setup
    @user = users(:michael)
  end
  .
  .
  .
  test "successful edit" do
    get edit_user_path(@user)
    assert_template 'users/edit'
    name  = "Foo Bar"
    email = "foo@bar.com"
    patch user_path(@user), params: { user: { name:  name,
                                              email: email,
                                              password:              "",
                                              password_confirmation: "" } }
    assert_not flash.empty?
    assert_redirected_to @user
    @user.reload
    assert_equal name,  @user.name
    assert_equal email, @user.email
  end
end
```
The ```update``` action needed to get the tests to pass is similar to the final form of the ```create``` action. In User controller:
```ruby
class UsersController < ApplicationController
  .
  .
  .
  def update
    @user = User.find(params[:id])
    if @user.update_attributes(user_params)
      flash[:success] = "Profile updated"
      redirect_to @user
    else
      render 'edit'
    end
  end
  .
  .
  .
end
```
We need to make an exception to the password validation if the password is empty. We can do this by passing the ```allow_nil: true``` option to ```validates```
```ruby
class User < ApplicationRecord
  attr_accessor :remember_token
  before_save { self.email = email.downcase }
  validates :name, presence: true, length: { maximum: 50 }
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  validates :email, presence: true, length: { maximum: 255 },
                    format: { with: VALID_EMAIL_REGEX },
                    uniqueness: { case_sensitive: false }
  has_secure_password
  validates :password, presence: true, length: { minimum: 6 }, allow_nil: true
  .
  .
  .
end
```
**Exercises**
- Double-check that you can now make edits by making a few changes on the development version of the application.
- What happens when you change the email address to one without an associated Gravatar?
> It brings you to the sign in page of gravatar

### **Authorization**
In the context of web applications, ```authentication``` allows us to identify users of our site, while ```authorization``` lets us control what they can do.

To implement the forwarding behavior, we’ll use a ```before filter``` in the Users controller. ```Before filters``` use the ```before_action``` command to arrange for a particular method to be called before the given actions.
To require users to be logged in, we define a ```logged_in_user``` method and invoke it using ```before_action :logged_in_user``` in the Application Controller:
```ruby
class UsersController < ApplicationController
  before_action :logged_in_user, only: [:edit, :update]
  .
  .
  .
  private

    def user_params
      params.require(:user).permit(:name, :email, :password,
                                   :password_confirmation)
    end

    # Before filters

    # Confirms a logged-in user.
    def logged_in_user
      unless logged_in?
        flash[:danger] = "Please log in."
        redirect_to login_url
      end
    end
end
```
By default, before filters apply to every action in a controller, so here we restrict the filter to act only on the ```:edit``` and ```:update``` actions by passing the appropriate only: options hash.

To test if the before filter is working:
```ruby
require 'test_helper'

class UsersControllerTest < ActionDispatch::IntegrationTest

  def setup
    @user = users(:michael)
  end
  .
  .
  .
  test "should redirect edit when not logged in" do
    get edit_user_path(@user)
    assert_not flash.empty?
    assert_redirected_to login_url
  end

  test "should redirect update when not logged in" do
    patch user_path(@user), params: { user: { name: @user.name,
                                              email: @user.email } }
    assert_not flash.empty?
    assert_redirected_to login_url
  end
end
```
**Exercises**
- As noted above, by default before filters apply to every action in a controller, which in our cases is an error (requiring, e.g., that users log in to hit the signup page, which is absurd). By commenting out the ```only:``` hash, confirm that the test suite catches this error.

### **Requiring the Right User**
In order to make sure users can’t edit other users’ information, we need to be able to log in as a second user. This means adding a second user to our users fixture file:
```yaml
michael:
  name: Michael Example
  email: michael@example.com
  password_digest: <%= User.digest('password') %>

archer:
  name: Sterling Archer
  email: duchess@example.gov
  password_digest: <%= User.digest('password') %>
```
 Note that we expect to redirect users to the root path instead of the login path because a user trying to edit a different user would already be logged in.
 ```ruby
 require 'test_helper'

class UsersControllerTest < ActionDispatch::IntegrationTest

  def setup
    @user       = users(:michael)
    @other_user = users(:archer)
  end
  .
  .
  .
  test "should redirect edit when logged in as wrong user" do
    log_in_as(@other_user)
    get edit_user_path(@user)
    assert flash.empty?
    assert_redirected_to root_url
  end

  test "should redirect update when logged in as wrong user" do
    log_in_as(@other_user)
    patch user_path(@user), params: { user: { name: @user.name,
                                              email: @user.email } }
    assert flash.empty?
    assert_redirected_to root_url
  end
end
```
To redirect users trying to edit another user’s profile, we’ll add a second method called ```correct_user```, together with a before filter to call it. Note that the ```correct_user``` before filter defines the ```@user``` variable, so we can eliminate the ```@user``` assignments in the ```edit``` and ```update``` actions.
```ruby
class UsersController < ApplicationController
  before_action :logged_in_user, only: [:edit, :update]
  before_action :correct_user,   only: [:edit, :update]
  .
  .
  .
  def edit
  end

  def update
    if @user.update_attributes(user_params)
      flash[:success] = "Profile updated"
      redirect_to @user
    else
      render 'edit'
    end
  end
  .
  .
  .
  private

    def user_params
      params.require(:user).permit(:name, :email, :password,
                                   :password_confirmation)
    end

    # Before filters

    # Confirms a logged-in user.
    def logged_in_user
      unless logged_in?
        flash[:danger] = "Please log in."
        redirect_to login_url
      end
    end

    # Confirms the correct user.
    def correct_user
      @user = User.find(params[:id])
      redirect_to(root_url) unless @user == current_user
    end
end
```
**Exercises**
- Why is it important to protect both the edit and update actions?
- Which action could you more easily test in a browser?

### **Friendly Forwarding**
Problem Statement:\
- When users try to access a protected page, they are currently redirected to their profile pages regardless of where they were trying to go. If a non-logged-in user tries to visit the edit page, after logging in, the user will be redirected to ```/users/1``` instead of ```/users/1/edit```. It would be much friendlier to redirect them to their intended destination instead.

Write a test: Test tries to visit the *edit* page, then logs in, and then checks that the user is redirected to the *edit* page instead of the default profile page.
```ruby
require 'test_helper'

class UsersEditTest < ActionDispatch::IntegrationTest

  def setup
    @user = users(:michael)
  end
  .
  .
  .
  test "successful edit with friendly forwarding" do
    get edit_user_path(@user)
    log_in_as(@user)
    assert_redirected_to edit_user_url(@user)
    name  = "Foo Bar"
    email = "foo@bar.com"
    patch user_path(@user), params: { user: { name:  name,
                                              email: email,
                                              password:              "",
                                              password_confirmation: "" } }
    assert_not flash.empty?
    assert_redirected_to @user
    @user.reload
    assert_equal name,  @user.name
    assert_equal email, @user.email
  end
end
```
In order to forward users to their intended destination, we need to store the location of the requested page somewhere, and then redirect to that location instead of to the default.
- We accomplish this with a pair of methods, ```store_location``` and ```redirect_back_or```, both defined in the Sessions helper:
```ruby
module SessionsHelper
  .
  .
  .
  # Redirects to stored location (or to the default).
  def redirect_back_or(default)
    redirect_to(session[:forwarding_url] || default)
    session.delete(:forwarding_url)
  end

  # Stores the URL trying to be accessed.
  def store_location
    session[:forwarding_url] = request.original_url if request.get?
  end
end
```
- Here the storage mechanism for the forwarding URL is the same ```session``` facility we used to log the user in. It also uses the ```request``` object (via ```request.original_url```) to get the URL of the requested page.
- The ```store_location``` method above puts the requested URL in the ```session``` variable under the key ```:forwarding_url```, but only for a GET request.
    - This prevents storing the forwarding URL if a user, say, submits a form when not logged in (which is an edge case but could happen if, e.g., a user deleted the session cookies by hand before submitting the form).

To make use of ```store_location```, we need to add it to the ```logged_in_user``` before filter:
```ruby
class UsersController < ApplicationController
  before_action :logged_in_user, only: [:edit, :update]
  before_action :correct_user,   only: [:edit, :update]
  .
  .
  .
  def edit
  end
  .
  .
  .
  private

    def user_params
      params.require(:user).permit(:name, :email, :password,
                                   :password_confirmation)
    end

    # Before filters

    # Confirms a logged-in user.
    def logged_in_user
      unless logged_in?
        store_location
        flash[:danger] = "Please log in."
        redirect_to login_url
      end
    end

    # Confirms the correct user.
    def correct_user
      @user = User.find(params[:id])
      redirect_to(root_url) unless current_user?(@user)
    end
end
```
To implement the forwarding itself, we use the ```redirect_back_or``` method to redirect to the requested URL if it exists, or some default URL otherwise, which we add to the Sessions controller ```create``` action to redirect after successful login.

```
session[:forwarding_url] || default
```
- This evaluates to ```session[:forwarding_url]``` unless it’s nil, in which case it evaluates to the given default URL.
- It also removes the forwarding URL (via ```session.delete(:forwarding_url)```); otherwise, subsequent login attempts would forward to the protected page until the user closed their browser.
- Also note that the session deletion occurs even though the line with the redirect appears first; redirects don’t happen until an explicit ```return``` or the end of the method, so any code appearing after the redirect is still executed.

**Exercises**
- Write a test to make sure that friendly forwarding only forwards to the given URL the first time. On subsequent login attempts, the forwarding URL should revert to the default (i.e., the profile page). Hint: Add to the test by checking for the right value of ```session[:forwarding_url]```.
- Put a ```debugger``` (Section 7.1.3) in the Sessions controller’s ```new``` action, then log out and try to visit /users/1/edit. Confirm in the debugger that the value of ```session[:forwarding_url]``` is correct. What is the value of ```request.get```? for the ```new``` action? (Sometimes the terminal can freeze up or act strangely when you’re using the debugger; use your technical sophistication (Box 1.1) to resolve any issues.)

### **Showing All Users**
To get started with the users index, we’ll first implement a security model. Although we’ll keep individual user ```show``` pages visible to all site visitors, the user ```index``` will be restricted to logged-in users so that there’s a limit to how much unregistered users can see by default.

To protect the index page from unauthorized access, we’ll first add a short test to verify that the index action is redirected properly:
```ruby
require 'test_helper'

class UsersControllerTest < ActionDispatch::IntegrationTest

  def setup
    @user       = users(:michael)
    @other_user = users(:archer)
  end

  test "should redirect index when not logged in" do
    get users_path
    assert_redirected_to login_url
  end
  .
  .
  .
end
```
Then we just need to add an ```index``` action and include it in the list of actions protected by the ```logged_in_user``` before filter:
```ruby
class UsersController < ApplicationController
  before_action :logged_in_user, only: [:index, :edit, :update]
  before_action :correct_user,   only: [:edit, :update]

  def index
  end

  def show
    @user = User.find(params[:id])
  end
  .
  .
  .
end
```
We can use ```User```.all to pull all the users out of the database, assigning them to an ```@users``` instance variable for use in the view:
```ruby
class UsersController < ApplicationController
  before_action :logged_in_user, only: [:index, :edit, :update]
  .
  .
  .
  def index
    @users = User.all
  end
  .
  .
  .
end
```
To make the actual ```index``` page, we’ll make a view (whose file you’ll have to create) that iterates through the users and wraps each one in an ```li``` tag.
```html
<% provide(:title, 'All users') %>
<h1>All users</h1>

<ul class="users">
  <% @users.each do |user| %>
    <li>
      <%= gravatar_for user, size: 50 %>
      <%= link_to user.name, user %>
    </li>
  <% end %>
</ul>
```
Gravatar allows us to pass an option to the Gravatar helper specifying a size other than the default.
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
Let's also add a little CSS:
```css
/* Users index */

.users {
  list-style: none;
  margin: 0;
  li {
    overflow: auto;
    padding: 10px 0;
    border-bottom: 1px solid $gray-lighter;
  }
}
```
**Exercises**
- We’ve now filled in all the links in the site layout. Write an integration test for all the layout links, including the proper behavior for logged-in and non-logged-in users. Hint: Use the ```log_in_as``` helper.
```ruby
  test 'users layout link' do
    get login_path
    post login_path, params: {session: {email: @user.email, password: 'password'}}
    assert is_logged_in?
    get users_path
    assert_template 'users/index'
    assert_select "title", "All Users | Ruby on Rails Tutorial Sample App"
  end
```

### **Sample Users**
we’ll add the ```Faker``` gem to the Gemfile, which will allow us to make sample users with semi-realistic names and email addresses. (Ordinarily, you’d probably want to restrict the faker gem to a development environment, but in the case of the sample app we’ll be using it on our production site as well).
```ruby
source 'https://rubygems.org'

gem 'rails',          '5.1.4'
gem 'bcrypt',         '3.1.11'
gem 'faker',          '1.7.3'
```
Next, we’ll add a Ruby program to ```seed``` the database with sample users, for which Rails uses the standard file ```db/seeds.rb```.
```ruby
User.create!(name:  "Example User",
             email: "example@railstutorial.org",
             password:              "foobar",
             password_confirmation: "foobar")

99.times do |n|
  name  = Faker::Name.name
  email = "example-#{n+1}@railstutorial.org"
  password = "password"
  User.create!(name:  name,
               email: email,
               password:              password,
               password_confirmation: password)
end
```
 The ```create!``` method is just like the ```create``` method, except it raises an exception for an invalid user rather than returning ```false```.\
 Note: Some readers have reported that they are unable to run the ```reset``` command if the Rails server is running, so you may have to stop the server first before proceeding.

 **Exercises**
 - Verify that trying to visit the edit page of another user results in a redirect as required
> Done!

### **Pagination**
There are several pagination methods available in Rails; we’ll use one of the simplest and most robust, called [will_paginate](https://github.com/mislav/will_paginate/wiki). To use it, we need to include both the ```will_paginate``` gem and ```bootstrap-will_paginate```, which configures ```will_paginate``` to use Bootstrap’s pagination styles.
```ruby
source 'https://rubygems.org'

gem 'rails',                   '5.1.4'
gem 'bcrypt',                  '3.1.11'
gem 'faker',                   '1.7.3'
gem 'will_paginate',           '3.1.6'
gem 'bootstrap-will_paginate', '1.0.0'
```
To get pagination working, we need to add some code to the ```index``` view telling Rails to paginate the users, and we need to replace ```User.all``` in the index action with an object that knows about pagination.
```html
<% provide(:title, 'All users') %>
<h1>All users</h1>

<%= will_paginate %>

<ul class="users">
  <% @users.each do |user| %>
    <li>
      <%= gravatar_for user, size: 50 %>
      <%= link_to user.name, user %>
    </li>
  <% end %>
</ul>

<%= will_paginate %>
```
The ```will_paginate``` method is a little magical; inside a users view it automatically looks for an ```@users``` object, and then displays pagination links to access other pages.

Using the ```paginate``` method, we can ```paginate``` the users in the sample application by using paginate in place of all in the ```index``` action:
```ruby
class UsersController < ApplicationController
  before_action :logged_in_user, only: [:index, :edit, :update]
  .
  .
  .
  def index
    @users = User.paginate(page: params[:page])
  end
  .
  .
  .
end
```
**Exercises**
- Confirm at the console that setting the page to nil pulls out the first page of users
```irb
2.4.1 :005 > User.paginate(page: nil)
  User Load (0.3ms)  SELECT  "users".* FROM "users" LIMIT ? OFFSET ?  [["LIMIT", 11], ["OFFSET", 0]]
   (0.2ms)  SELECT COUNT(*) FROM "users"
 => #<ActiveRecord::Relation [#<User id: 1, name: "Rails Tutorial", email: "example@railstutorial.org", created_at: "2018-04-12 03:57:06", updated_at: "2018-04-14 06:25:59", password_digest: "$2a$10$GRkvHlSf6gtNwXAu.qXcL.49NIGWF/3Tq3GEYHd9MBB...", remember_digest: nil>, #<User id: 2, name: "Chris Ong", email: "ong.chris11@gmail.com", created_at: "2018-04-12 03:57:59", updated_at: "2018-04-14 21:56:44", password_digest: "$2a$10$x1td3RzazSEPO68IBJ.xCOU2Ud/tx73jFJwNHkhWKA2...", remember_digest: "$2a$10$p7jt1LlAfabx8imVJt9TmuPRGZiRBH9Q7jTk2fz1jJ6...">, #<User id: 3, name: "Flossie Mitchell", email: "example-1@railstutorial.org", created_at: "2018-04-14 22:32:21", updated_at: "2018-04-14 22:32:21", password_digest: "$2a$10$wObCDHiwHct4bzKlBX7nVONSLnSiQMubkr8RePVTiEj...", remember_digest: nil>, #<User id: 4, name: "Destini Dooley DDS", email: "example-2@railstutorial.org", created_at: "2018-04-14 22:32:21", updated_at: "2018-04-14 22:32:21", password_digest: "$2a$10$ejbyou0WauhA37Q2j1FNheTfFiTdQumgcvnp9/pkvCF...", remember_digest: nil>, #<User id: 5, name: "Melisa Larson PhD", email: "example-3@railstutorial.org", created_at: "2018-04-14 22:32:21", updated_at: "2018-04-14 22:32:21", password_digest: "$2a$10$/PoTQTZZ1F4aGAarnEsNBOflcAmdQt3Xy8D9C6SyVD2...", remember_digest: nil>, #<User id: 6, name: "Heath Gerlach", email: "example-4@railstutorial.org", created_at: "2018-04-14 22:32:21", updated_at: "2018-04-14 22:32:21", password_digest: "$2a$10$epwKmwxCm8Bd.EFPMcb/Ve/Wxbg7T1NjZlbWN6Nc.wj...", remember_digest: nil>, #<User id: 7, name: "Elian Funk", email: "example-5@railstutorial.org", created_at: "2018-04-14 22:32:21", updated_at: "2018-04-14 22:32:21", password_digest: "$2a$10$SKfreIbr8BCNbCtnGRLETOuIRNcmquuilgdiw.0827z...", remember_digest: nil>, #<User id: 8, name: "Mrs. Evangeline Johnson", email: "example-6@railstutorial.org", created_at: "2018-04-14 22:32:22", updated_at: "2018-04-14 22:32:22", password_digest: "$2a$10$d67Zm51012H0bRnkG/4cGuCMJfTubVDPLimBFk4KtMp...", remember_digest: nil>, #<User id: 9, name: "Fritz Huels", email: "example-7@railstutorial.org", created_at: "2018-04-14 22:32:22", updated_at: "2018-04-14 22:32:22", password_digest: "$2a$10$BTMgUxFEmlEoR/Fx1eq9sOuquzpaLvtdmB0ykAjlfx1...", remember_digest: nil>, #<User id: 10, name: "Rosemary Stoltenberg DDS", email: "example-8@railstutorial.org", created_at: "2018-04-14 22:32:22", updated_at: "2018-04-14 22:32:22", password_digest: "$2a$10$JghC0UZSrcp/shDUlkhGZu8PyRhVft68pDHocaAWBtx...", remember_digest: nil>, ...]>
 ```
- What is the Ruby class of the pagination object? How does it compare to the class of ```User.all```?
```irb
2.4.1 :006 > User.paginate(page: nil).class
 => User::ActiveRecord_Relation
2.4.1 :007 > User.paginate(page: nil).class.superclass
 => ActiveRecord::Relation
2.4.1 :008 > User.paginate(page: nil).class.superclass.superclass
 => Object
 ```

 ### **Users Index Test**
 Now that our users index page is working, we’ll write a lightweight test for it, including a minimal test for the pagination. The idea is to:
 - Log in
 - Visit the index path
 - Verify the first page of users is present
 - Confirm that pagination is present on the page

 Fixture files support embedded Ruby, which means we can create 30 additional users:
 ```yml
 michael:
  name: Michael Example
  email: michael@example.com
  password_digest: <%= User.digest('password') %>

archer:
  name: Sterling Archer
  email: duchess@example.gov
  password_digest: <%= User.digest('password') %>

lana:
  name: Lana Kane
  email: hands@example.gov
  password_digest: <%= User.digest('password') %>

malory:
  name: Malory Archer
  email: boss@example.gov
  password_digest: <%= User.digest('password') %>

<% 30.times do |n| %>
user_<%= n %>:
  name:  <%= "User #{n}" %>
  email: <%= "user-#{n}@example.com" %>
  password_digest: <%= User.digest('password') %>
<% end %>
```
Generate the relevant test:
```
rails g integration_test users_index
```
The test itself involves checking for a ```div``` with the required ```pagination``` class and verifying that the first page of users is present.
```ruby
require 'test_helper'

class UsersIndexTest < ActionDispatch::IntegrationTest

  def setup
    @user = users(:michael)
  end

  test "index including pagination" do
    log_in_as(@user)
    get users_path
    assert_template 'users/index'
    assert_select 'div.pagination'
    User.paginate(page: 1).each do |user|
      assert_select 'a[href=?]', user_path(user), text: user.name
    end
  end
end
```
**Exercises**
- By commenting out the pagination links, confirm that the test goes red.
- Confirm that commenting out only one of the calls to ```will_paginate``` leaves the tests green. How would you test for the presence of both sets of ```will_paginate``` links?

### **Partial Refactoring**
> Refer to codes

### **Deleting Users**
We will identify privileged administrative users with a boolean ```admin``` attribute in the User model, which will lead automatically to an ```admin?``` boolean method to test for admin status.\
we add the ```admin``` attribute with a migration, indicating the ```boolean``` type on the command line:
```
$ rails generate migration add_admin_to_users admin:boolean
```
Note that we’ve added the argument ```default: false``` to add_column, which means that users will not be administrators by default.
```ruby
class AddAdminToUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :admin, :boolean, default: false
  end
end
```
Rails figures out the boolean nature of the ```admin``` attribute and automatically adds the question-mark method ```admin?```:
```irb
$ rails console --sandbox
>> user = User.first
>> user.admin?
=> false
>> user.toggle!(:admin)
=> true
>> user.admin?
=> true
```
Here we’ve used the ```toggle!``` method to flip the admin attribute from ```false``` to ```true```.
**Exercises**
- By issuing a PATCH request directly to the user path as shown, verify that the ```admin``` attribute isn’t editable through the web. To be sure your test is covering the right thing, your first step should be to add ```admin``` to the list of permitted parameters in ```user_params``` so that the initial test is red.
```ruby
  test 'should not allow the admin attribute to be edited via the web' do
    log_in_as(@other_user)
    assert_not @other_user.admin?
    patch user_path(@other_user), params: {user: {password: 'password', password_confirmation: 'password', admin: true}}
    assert_not @other_user.reload.admin?
  end
```

### **The Destroy Action**
The final step needed to complete the Users resource is to add delete links and a ```destroy``` action. The resulting "```delete```" links will be displayed only if the current user is an admin:
```html
<li>
  <%= gravatar_for user, size: 50 %>
  <%= link_to user.name, user %>
  <% if current_user.admin? && !current_user?(user) %>
    | <%= link_to "delete", user, method: :delete,
                                  data: { confirm: "You sure?" } %>
  <% end %>
</li>
```
Note the ```method: :delete``` argument, which arranges for the link to issue the necessary DELETE request. We’ve also wrapped each link inside an ```if``` statement so that only admins can see them.

To get the delete links to work
- Add a ```destroy``` action, which finds the corresponding user and destroys it with the Active Record ```destroy``` method
- Redirect to the users index
- Because users have to be logged in to ```delete``` users, we also adds ```:destroy``` to the ```logged_in_user``` before filter
```ruby
class UsersController < ApplicationController
  before_action :logged_in_user, only: [:index, :edit, :update, :destroy]
  before_action :correct_user,   only: [:edit, :update]
  .
  .
  .
  def destroy
    User.find(params[:id]).destroy
    flash[:success] = "User deleted"
    redirect_to users_url
  end

  private
  .
  .
  .
end
```

**Problem!!**\
As constructed, only admins can destroy users through the web since only they can *see the delete links*, but there’s still a terrible security hole: any sufficiently sophisticated attacker could simply issue a DELETE request directly from the command line to delete any user on the site.

Solution:
```ruby
class UsersController < ApplicationController
  before_action :logged_in_user, only: [:index, :edit, :update, :destroy]
  before_action :correct_user,   only: [:edit, :update]
  before_action :admin_user,     only: :destroy
  .
  .
  .
  private
    .
    .
    .
    # Confirms an admin user.
    def admin_user
      redirect_to(root_url) unless current_user.admin?
    end
end
```
**Exercises**
- As the admin user, destroy a few sample users through the web interface. What are the corresponding entries in the server log?
```irb
Started DELETE "/users/6" for 127.0.0.1 at 2018-04-15 13:28:25 +1000
Processing by UsersController#destroy as HTML
  Parameters: {"authenticity_token"=>"AhHdamG0iz962NVXfriE6TORIrwrw0jueNJXeAKwf2TAzEUL33TKJ4BAI4CBYepSnxnlUs4BkGeD4nq0RbRVqA==", "id"=>"6"}
  User Load (0.3ms)  SELECT  "users".* FROM "users" WHERE "users"."id" = ? LIMIT ?  [["id", 1], ["LIMIT", 1]]
  User Load (0.3ms)  SELECT  "users".* FROM "users" WHERE "users"."id" = ? LIMIT ?  [["id", 6], ["LIMIT", 1]]
   (0.1ms)  begin transaction
  SQL (2.6ms)  DELETE FROM "users" WHERE "users"."id" = ?  [["id", 6]]
   (20.0ms)  commit transaction
Redirected to http://localhost:3000/users
Completed 302 Found in 31ms (ActiveRecord: 23.3ms)
```

### **User Destroy Tests**
We start by arranging for one of our fixture users to be an admin:
```yml
michael:
  name: Michael Example
  email: michael@example.com
  password_digest: <%= User.digest('password') %>
  admin: true

archer:
  name: Sterling Archer
  email: duchess@example.gov
  password_digest: <%= User.digest('password') %>

lana:
  name: Lana Kane
  email: hands@example.gov
  password_digest: <%= User.digest('password') %>

malory:
  name: Malory Archer
  email: boss@example.gov
  password_digest: <%= User.digest('password') %>

<% 30.times do |n| %>
user_<%= n %>:
  name:  <%= "User #{n}" %>
  email: <%= "user-#{n}@example.com" %>
  password_digest: <%= User.digest('password') %>
<% end %>
```
We need to check two cases:
- Users who aren’t logged in should be redirected to the login page
- users who are logged in but who aren’t admins should be redirected to the Home page
```ruby
require 'test_helper'

class UsersControllerTest < ActionDispatch::IntegrationTest

  def setup
    @user       = users(:michael)
    @other_user = users(:archer)
  end
  .
  .
  .
  test "should redirect destroy when not logged in" do
    assert_no_difference 'User.count' do
      delete user_path(@user)
    end
    assert_redirected_to login_url
  end

  test "should redirect destroy when logged in as a non-admin" do
    log_in_as(@other_user)
    assert_no_difference 'User.count' do
      delete user_path(@user)
    end
    assert_redirected_to root_url
  end
end
```
We also want to check that an admin can use a delete link to successfully destroy a user. The only really tricky part is verifying that a user gets deleted when an admin clicks on a delete link
```ruby
assert_difference 'User.count', -1 do
  delete user_path(@other_user)
end
```
Putting everything together gives the ```pagination``` and ```delete``` test:
```ruby
require 'test_helper'

class UsersIndexTest < ActionDispatch::IntegrationTest

  def setup
    @admin     = users(:michael)
    @non_admin = users(:archer)
  end

  test "index as admin including pagination and delete links" do
    log_in_as(@admin)
    get users_path
    assert_template 'users/index'
    assert_select 'div.pagination'
    first_page_of_users = User.paginate(page: 1)
    first_page_of_users.each do |user|
      assert_select 'a[href=?]', user_path(user), text: user.name
      unless user == @admin
        assert_select 'a[href=?]', user_path(user), text: 'delete'
      end
    end
    assert_difference 'User.count', -1 do
      delete user_path(@non_admin)
    end
  end

  test "index as non-admin" do
    log_in_as(@non_admin)
    get users_path
    assert_select 'a', text: 'delete', count: 0
  end
end
```
**Exercises**
- By commenting out the admin user before filter, confirm that the tests go red.
> Done!

### **What We Learnt**
- Users can be updated using an edit form, which sends a PATCH request to the ```update``` action.
- Safe updating through the web is enforced using ```strong parameters```.
- Before filters give a standard way to run methods before particular controller actions.
- We implement an authorization using before filters.
- Authorization tests use both low-level commands to submit particular HTTP requests directly to controller actions and high-level integration tests.
- Friendly forwarding redirects users where they wanted to go after logging in.
- The users index page shows all users, one page at a time.
- Rails uses the standard file ```db/seeds.rb``` to seed the database with sample data using ```rails db:seed```.
- Running ```render @users``` automatically calls the ```_user.html.erb``` partial on each user in the collection.
- A boolean attribute called ```admin``` on the User model automatically creates an ```admin?``` boolean method on user objects.
- Admins can delete users through the web by clicking on delete links that issue DELETE requests to the Users controller ```destroy``` action.
- We can create a large number of test users using embedded Ruby inside fixtures.