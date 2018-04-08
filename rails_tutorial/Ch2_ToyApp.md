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

### **Summary of the Steps in MVC**
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
- By referring to Figure 2.11, write out the analogous steps for visiting the URL /users/1/edit.
- Find the line in the scaffolding code that retrieves the user from the database in the previous exercise.
- What is the name of the view file for the user edit page?