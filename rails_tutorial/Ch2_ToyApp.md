## Chapter 2: A Toy App

### **Exercises**
- (For readers who know CSS) Create a new user, then use your browser’s HTML inspector to determine the CSS id for the text “User was successfully created.” What happens when you refresh your browser?
> id = "notice"\
When the browser is refreshed, the text “User was successfully created.” disappeared.

- What happens if you try to create a user with a name but no email address?
> The new user will be created with just a name without its email address

- What happens if you try create a user with an invalid email address, like “@example.com”?
> The user email is added into the database without any validations

- Destroy each of the users created in the previous exercises. Does Rails display a message by default when a user is destroyed?
> Yes. The message "User was successfully destroyed." was displayed.

## **Summary of the Steps in MVC**
- The browser issues a request for the ```/users``` URL
- Rails routes ```/users``` to the **index** action in the Users controller
- The **index** action asks the User model to retrieve all users (User.all)
- The **User** model pulls all the users from the database
- The **User** model returns the list of users to the controller
- The controller captures the users in the ```@users``` variable, which is passed to the **index** view
- The view uses embedded Ruby (ERM) to render the page as HTML
- The controller passes the HTML back to the browser

![MVC Model](https://softcover.s3.amazonaws.com/636/ruby_on_rails_tutorial_4th_edition/images/figures/mvc_detailed.png)

Setting up Rails routes:
```ruby
Rails.application.routes.draw do
  resources :users
  root 'application#hello'
end
```
Setting up **root** route:
```ruby
root 'application#hello'
```

**What is REST?**
REpresentational State Transfer\
In the context of Rails applications REST means that most application components (such as users and microposts) are modeled as resources that can be created, read, updated, and deleted—operations that correspond both to the CRUD operations of relational databases and to the four fundamental HTTP request methods: POST, GET, PATCH, and DELETE.

Note:\
Variables that start with the @ sign, called [instance variables](https://en.wikipedia.org/wiki/Instance_variable), are automatically available in the views; in this case, the index.html.erb view iterates through the @users list and outputs a line of HTML for each one.

### **Exercises**
- By referring to Figure 2.11, write out the analogous steps for visiting the URL /users/1/edit
  - The browser issues a request for the ```/users/1/edit``` URL
  - Rails routes ```/users/1/edit``` to the **edit** action in the Users controller
  - The **edit** action asks the User model to retrieve specific user with id 1
  - The **User** model pulls data for user id 1 from the database
  - The **User** model returns data to the controller
  - The controller captures the user data in the ```@users``` variable, which is passed to the **edit** view
  - It subsequently summon the **form** view
  - The view uses embedded Ruby (ERM) to render the page as HTML
  - The controller passes the HTML back to the browser

- Find the line in the scaffolding code that retrieves the user from the database in the previous exercise
- What is the name of the view file for the user edit page?
  - edit.html.erb
  - _form.html.erb

## Weaknesses of the Users Resource
- No data validations
- No authetication
- No tests
- No style or layout
- No real understanding

Note:
```ruby
Rails.application.routes.draw do
  resources :microposts
  resources :users
  root 'users#index'
end
```
As with users, the ```resources :microposts``` routing rule maps micropost URLs to actions in the Microposts controller as shown in the below table:

| HTTP Request | URL | Action | Purpose |
|--------------|-----|--------|---------|
| GET | /mircoposts | index | *page* to list all microposts |
| GET | /microposts/1 | show | *page* to show micropost with id 1 |
| GET | /microposts/new | new | *page* to make a new mircopost |
| POST | /microposts | create | *create* a new micropost |
| GET | /microposts/1/edit | edit | *page* to edit micropost with id 1 |
| PATCH | /microposts/1 | update | *update* micropost with id 1 |
| DELETE | /microposts/1 | destroy | *delete* micropost with id 1 |

### Exercises
- (For readers who know CSS) Create a new micropost, then use your browser’s HTML inspector to determine the CSS id for the text “Micropost was successfully created.” What happens when you refresh your browser?
  - id = "notice"
  - When the browser is refreshed, text “Micropost was successfully created.” disappeared

- Try to create a micropost with empty content and no user id
- Try to create a micropost with over 140 characters of content (say, the first paragraph from the [Wikipedia article on Ruby](https://en.wikipedia.org/wiki/Ruby_(programming_language)))
- Destroy the microposts from the previous exercises

## Validations
```ruby
class Micropost < ApplicationRecord
  validates :content, length: { maximum: 140 }
end
```

### Exercises
- Try to create a micropost with the same long content used in a previous exercise. How has the behavior changed?
  - With the text length validation in place, it now puts out an error and warn that the text cannot be more than 140 characters long
- (For readers who know CSS) Use your browser’s HTML inspector to determine the CSS id of the error message produced by the previous exercise
  - It has a div with ```id = "error_explanation"```

## A User ```has_many``` Microposts
In apps/models/user.rb:
```ruby
class User < ApplicationRecord
  has_many :microposts
end
```

In apps/models/micropost.rb:
```ruby
class Micropost < ApplicationRecord
  belongs_to :user
  validates :content, length: { maximum: 140 }
end
```

Note:\
Because of the ```user_id``` column in the microposts table, Rails (using Active Record) can infer the microposts associated with each user.

### Exercises
- Edit the user show page to display the content of the user’s first micropost. (Use your technical sophistication to guess the syntax based on the other content in the file.) Confirm by visiting /users/1 that it worked.
> Done!
- The code shows how to add a validation for the presence of micropost content in order to ensure that microposts can’t be blank. Verify that you get the behavior.
> Done!
- Replace FILL_IN with the appropriate code to validate the presence of name and email attributes in the User model
> Done!

## Inheritance Hierarchies
See inheritance hierarchy for the User and Micropost models:

![inheritance hierarchy](https://softcover.s3.amazonaws.com/636/ruby_on_rails_tutorial_4th_edition/images/figures/demo_model_inheritance_4th_ed.png)

![inheritance hierarchy](https://softcover.s3.amazonaws.com/636/ruby_on_rails_tutorial_4th_edition/images/figures/demo_controller_inheritance.png)

### Exercises
- By examining the contents of the Application controller file, find the line that causes ApplicationController to inherit from ActionController::Base
  - See ```class ApplicationController < ActionController::Base```
- Is there an analogous file containing a line where ApplicationRecord inherits from ActiveRecord::Base? Hint: It would probably be a file called something like application_record.rb in the app/models directory

## Deploying the Toy App
Push the repository up to Github:
```
$ git add .
$ git commit -m ""
$ git push origin master
```
Deploy the app to Heroku:
```
$ git push heroku
```
If you haven't create the Heroku app, you should run:
```
heroku create
git push heroku master
```
To get the application database to work, migrate the production database to Heroku, which involves running the migration command:
```
heroku run rails db:migrate
```
This updates the database at Heroku with the necessary user and micropost data models. After running the migration, you should be able to use the toy app in production, with a real PostgreSQL database back-end.

### Exercises
- Create a few users on the production app.
> Done!
- Create a few production microposts for the first user.
> Done!
- By trying to create a micropost with content over 140 characters, confirm that the validation works on the production app
> Done!

## Learning Outcome
- Scaffolding automatically creates code to model data and interact with it through the web
- Scaffolding is good for getting started quickly but is bad for understanding
- Rails uses the Model-View-Controller (MVC) pattern for structuring web applications
- As interpreted by Rails, the REST architecture includes a standard set of URLs and controller actions for interacting with data models
- Rails supports data validations to place constraints on the values of data model attributes
- Rails comes with built-in functions for defining associations between different data models
- We can interact with Rails applications at the command line using the Rails console
