## Chapter 3: Mostly Static Pages

### **Undoing Things**
In Rails, this can be accomplished with rails destroy followed by the name of the generated element. In particular, these two commands cancel each other out:

```
$ rails generate controller StaticPages home help
$ rails destroy  controller StaticPages home help
```
To undo a model generated:
```
$ rails generate model User name:string email:string
$ rails destroy model User
```

Another technique related to models involves undoing migrations. Migrations change the state of the database using the command:
```
rails db:migrate
```
To undo single migration step:
```
rails db:rollback
```
To go all the way to the beginning:
```
rails db:migrate VERSION=0
```
With these techniques in hand, we are well-equipped to recover from the inevitable development [snafus](https://en.wiktionary.org/wiki/SNAFU).

 ### **HTTP Basic Operations**
 The **hypertext transfer protocol (HTTP)** defines the basic operations GET, POST, PATCH, and DELETE. These refer to operations between a client computer (typically running a web browser such as Chrome, Firefox, or Safari) and a server (typically running a webserver such as Apache or Nginx).

 - **GET** is the most common HTTP operation, used for reading data on the web; it just means “get a page”, and every time you visit a site like http://www.google.com/ or http://www.wikipedia.org/ your browser is submitting a GET request.
 - **POST** is the next most common operation; it is the request sent by your browser when you submit a form. In Rails applications, POST requests are typically used for creating things (although HTTP also allows POST to perform updates).
 - **PATCH** and **DELETE**, are designed for updating and destroying things on the remote server.

### **Why do Rails use classes to build controllers?**
- Classes are simply a convenient way to organize functions (also called methods) like the home and help actions, which are defined using the ```def``` keyword.

### **When to test?**
When deciding when and how to test, it’s helpful to understand why to test.\
Writing automated tests have 3 key benefits:
- Tests protect against **regressions**, where a functioning feature stops working for some reason
- Tests allow code to be **refactored** (i.e., changing its form without changing its function) with greater confidence
- Tests act as a **client** for the application code, thereby helping determine its design and its interface with other parts of the system

See below some suggestions on the guidelines on when we should test first:
- When a test is especially short or simple compared to the application code it tests, lean toward writing the test first
- When the desired behavior isn’t yet crystal clear, lean toward writing the application code first, then write a test to codify the result
- Because security is a top priority, err on the side of writing tests of the security model first
- Whenever a bug is found, write a test to reproduce it and protect against regressions, then write the application code to fix it
- Lean against writing tests for code (such as detailed HTML structure) likely to change in the future
- Write tests before refactoring code, focusing on testing error-prone code that’s especially likely to break

Summary:\
In practice, the guidelines above mean that we’ll **usually write controller and model tests first** and **integration tests (which test functionality across models, views, and controllers) second**. And when we’re writing application code that isn’t particularly brittle or error-prone, or is likely to change (as is often the case with views), we’ll often skip testing altogether.

### **First Test**
Study what the below tests are doing:
```ruby
require 'test_helper'

class StaticPagesControllerTest < ActionDispatch::IntegrationTest

  test "should get home" do
    get static_pages_home_url
    assert_response :success
  end

  test "should get help" do
    get static_pages_help_url
    assert_response :success
  end
end
```
Here the use of get indicates that our tests expect the Home and Help pages to be ordinary web pages, accessed using a GET request. The response ```:success``` is an abstract representation of the underlying HTTP status code (in this case, 200 OK).

### **Recall: Technical Sophistication**
The theme of technical sophistication: the combination of hard and soft skills that make it seem like you can magically solve any technical problem. See below figure.\
Web development, and computer programming in general, are essential components of technical sophistication, but there’s more to it than that—you also have to know how to click around menu items to learn the capabilities of a particular application, how to clarify a confusing error message by [Googling it](https://www.google.com.au/), or when to give up and just reboot the darn thing.\
As we say in [geek speak](https://www.learnenough.com/command-line-tutorial#aside-speak_geek): "It’s not a bug, it’s a feature!"

![problem solver](https://softcover.s3.amazonaws.com/636/ruby_on_rails_tutorial_4th_edition/images/figures/tech_support_cheat_sheet.png)

### **Embedded Ruby**
To get the layout to work, we have to replace the default title with the embedded Ruby from the examples above:
```html
<!DOCTYPE html>
<html>
  <head>
    <title><%= yield(:title) %> | Ruby on Rails Tutorial Sample App</title>
    <%= csrf_meta_tags %>
    <%= stylesheet_link_tag 'application', media: 'all', 'data-turbolinks-track': 'reload' %>
    <%= javascript_include_tag 'application', 'data-turbolinks-track': 'reload' %>
  </head>

  <body>
    <%= yield %>
  </body>
</html>
```
It’s also worth noting that the default Rails layout includes several additional lines:
```
<%= csrf_meta_tags %>
<%= stylesheet_link_tag ... %>
<%= javascript_include_tag "application", ... %>
```
This code arranges to include the application stylesheet and JavaScript, which are part of the asset pipeline, together with the Rails method ```csrf_meta_tags```, which prevents [cross-site request forgery (CSRF)](https://en.wikipedia.org/wiki/Cross-site_request_forgery), a type of malicious web attack.

In each of the HTML page, add:
```
<% provide(:title, "Placeholder") %>
```
The ```provide``` function stores a block of markup in an identifier for later use. See [here](http://api.rubyonrails.org/classes/ActionView/Helpers/CaptureHelper.html#method-i-provide) for more info.

```yield``` in this case just spits that block back out. The yield is enclosed in <%= %> to indicate it is being printed out into the view. See [here](https://stackoverflow.com/questions/17457985/yield-and-provide-inside-template) for more info.

### **Setting the Root Route**
Example of setting the root route:
```ruby
Rails.application.routes.draw do
#   root 'static_pages#home'
  get  'static_pages/home'
  get  'static_pages/help'
  get  'static_pages/about'
end
```
Example of setting up the test for root route:
```ruby
class StaticPagesControllerTest < ActionDispatch::IntegrationTest

  test "should get root" do
    get FILL_IN
    assert_response FILL_IN
  end

end
```

### **What We Learnt**
- The rails script generates a new controller with rails generate controller ControllerName (optional action names)
- New routes are defined in the file ```config/routes.rb```
- Rails views can contain static HTML or embedded Ruby (ERb)
- Automated testing allows us to write test suites that drive the development of new features, allow for confident refactoring, and catch regressions
- Test-driven development uses a “Red, Green, Refactor” cycle
- Rails layouts allow the use of a common template for pages in our application, thereby eliminating duplication

## Advanced Testing Setup
To get the default Rails tests to show red and green at the appropriate times, I recommend adding the below code to your test helper file, thereby making use of the [minitest-reporters](https://github.com/kern/minitest-reporters) gem.

```ruby
ENV['RAILS_ENV'] ||= 'test'
require File.expand_path('../../config/environment', __FILE__)
require 'rails/test_help'
require "minitest/reporters"
Minitest::Reporters.use! Minitest::Reporters::SpecReporter.new

class ActiveSupport::TestCase
  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all

  # Add more helper methods to be used by all tests here...
end
```

### **Automated Test with Guard**

See below a custom guard file:
```ruby
# Defines the matching rules for Guard.
guard :minitest, spring: "bin/rails test", all_on_start: false do
  watch(%r{^test/(.*)/?(.*)_test\.rb$})
  watch('test/test_helper.rb') { 'test' }
  watch('config/routes.rb')    { integration_tests }
  watch(%r{^app/models/(.*?)\.rb$}) do |matches|
    "test/models/#{matches[1]}_test.rb"
  end
  watch(%r{^app/controllers/(.*?)_controller\.rb$}) do |matches|
    resource_tests(matches[1])
  end
  watch(%r{^app/views/([^/]*?)/.*\.html\.erb$}) do |matches|
    ["test/controllers/#{matches[1]}_controller_test.rb"] +
    integration_tests(matches[1])
  end
  watch(%r{^app/helpers/(.*?)_helper\.rb$}) do |matches|
    integration_tests(matches[1])
  end
  watch('app/views/layouts/application.html.erb') do
    'test/integration/site_layout_test.rb'
  end
  watch('app/helpers/sessions_helper.rb') do
    integration_tests << 'test/helpers/sessions_helper_test.rb'
  end
  watch('app/controllers/sessions_controller.rb') do
    ['test/controllers/sessions_controller_test.rb',
     'test/integration/users_login_test.rb']
  end
  watch('app/controllers/account_activations_controller.rb') do
    'test/integration/users_signup_test.rb'
  end
  watch(%r{app/views/users/*}) do
    resource_tests('users') +
    ['test/integration/microposts_interface_test.rb']
  end
end

# Returns the integration tests corresponding to the given resource.
def integration_tests(resource = :all)
  if resource == :all
    Dir["test/integration/*"]
  else
    Dir["test/integration/#{resource}_*.rb"]
  end
end

# Returns the controller tests corresponding to the given resource.
def controller_test(resource)
  "test/controllers/#{resource}_controller_test.rb"
end

# Returns all tests for the given resource.
def resource_tests(resource)
  integration_tests(resource) << controller_test(resource)
end
```

The line below causes Guard to use the Spring server supplied by Rails to speed up loading times, while also preventing Guard from running the full test suite upon starting.
```ruby
guard :minitest, spring: "bin/rails test", all_on_start: false do
```
To prevent conflicts between Spring and Git when using Guard, you should add the spring/ directory to the .gitignore file used by Git to determine what to ignore when adding files or directories to the repository.

Once Guard is configured, you should open a new terminal and run it at the command line as follows:
```
$ bundle exec guard
```
To run all the tests, hit return at the ```guard>``` prompt.

### **Unix Processess**
To see all the processes on your system, you can use the ps command with the aux options:
```
$ ps aux
```
To filter the processes by type, you can run the results of ps through the grep pattern-matcher using a Unix pipe |:
```
$ ps aux | grep spring
```
To eliminate an unwanted process, use the kill command to issue the Unix termination signal (which happens to be 15) to the pid:
```
$ kill -15 12241
```
This is the technique I recommend for killing individual processes, such as a rogue Rails server (with the pid found via ps aux | grep server), but sometimes it’s convenient to kill all the processes matching a particular process name, such as when you want to kill all the spring processes gunking up your system. In this particular case, you should first try stopping the processes with the spring command itself:
```
$ spring stop
```
Sometimes this doesn’t work, though, and you can kill all the processes with name spring using the pkill command as follows:
```
$ pkill -15 -f spring
```
