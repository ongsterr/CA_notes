## **Working with Stripe and PostgreSQL**

### **Using PostgreSQL**
1. Install PostgreSQL using the [guide](https://www.mirrorcommunications.com/blog/how-to-install-ruby-on-rails-on-windows-10-with-postgresql) by Mirror.
    - Note that you need to include your username and password in the database.yml file in ```config``` folder
2. To use PostgreSQL on terminal using ```psql``` - see [docs](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-ubuntu-16-04)
    - See [docs](https://www.postgresql.org/docs/current/static/app-psql.html) for ```psql``` commands.

### **Using Stripe**
- Include "[stripe](https://github.com/stripe/stripe-ruby)" gem in your Gemfile
- Refer to [docs](https://stripe.com/docs/checkout/rails) to set up payment checkout Stripe in Rails app
- Using webhook - what is a [webhook](https://stripe.com/docs/webhooks)?
    - Use webhooks to be notified about events that happen in a Stripe account

### **Using Heroku**
- What is [Heroku](https://devcenter.heroku.com/articles/getting-started-with-rails5) used for?
    - Heroku allows you to deploy your Rails app through git quickly
- To set up config variables in Heroku, see [docs](https://devcenter.heroku.com/articles/config-vars).

### **Other Notes**
- What is the "[Phoenix](http://phoenixframework.org/)" framework?
    - **Phoenix** is a web development framework written in [Elixir](https://elixir-lang.org/getting-started/introduction.html) which implements the server-side MVC pattern. Many of its components and concepts will seem familiar to those of us with experience in other web frameworks like Ruby on Rails or Python’s Django.
    - **Elixir vs Ruby - Which One is the Language for Your Next Project?** - read [article](https://www.netguru.co/blog/elixir-vs-ruby-which-one-is-the-language-for-your-next-project).

- Let's learn how to web scrape using Ruby - read [article](https://www.promptcloud.com/blog/web-scraping-using-ruby).
- Learn how to write your own gemspec file - read [article](https://jeffkreeftmeijer.com/2010/be-awesome-write-your-gemspec-yourself/).
- Melbourne Accelerator Program on May 30 - Buy tickets [here](https://www.eventbrite.com.au/e/map18-accelerator-launch-tickets-44312792756?aff=ebdssbcitybrowse#).

- Nat has got some good [notes](https://github.com/natalieytan/nats-rspec-notes) on Github about [RSpec](http://rspec.info/).
    - How to test Rails models with RSpec? See [Semaphore tutorial](https://semaphoreci.com/community/tutorials/how-to-test-rails-models-with-rspec) and [Thoughtbot tutorial](https://robots.thoughtbot.com/how-we-test-rails-applications).
    - [RSpec Cheatsheet](https://www.anchor.com.au/wp-content/uploads/rspec_cheatsheet_attributed.pdf) - for RSpec syntax in general
    - [RSpec Cheatsheet](https://thoughtbot.com/upcase/test-driven-rails-resources/rspec.pdf) - for RSpec concepts and syntax in general
    - [RSpec Cheatsheet](https://gist.github.com/eliotsykes/5b71277b0813fbc0df56) - for testing controllers for Rails app

### **Revision**
- How do we do "searching" for something in a website?
    ```ruby
    search = params[:search] # This gives you what was inputted for "search"
    Product.where(name: search)

    # An example of how CSV can be incorporated into Ruby - read the docs
    require 'csv'
    students = CSV.read('/student-list.csv', headers: true)
    Student.create!(students)

    ```
    - Check out the exercises on "search-example"

- Try this tutorial to build a Rails app - read [article](https://medium.com/@danamulder/tutorial-create-a-simple-messaging-system-on-rails-d9b94b0fbca1).

- Querying in a Rails application - a gem called [Squeel](https://github.com/activerecord-hackery/squeel#compound-conditions) that makes it more "Ruby-like"
