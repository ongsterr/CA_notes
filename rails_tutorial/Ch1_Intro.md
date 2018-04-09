## Chapter 1: From Zero to Deploy
## **Deploying**
What are some of the options to deploy a Rails application?
- Shared hosts or virtual private servers running [Phusion Passenger](https://www.phusionpassenger.com/) (a module for the Apache and Nginx web servers)
- Full service deployment companies such as [Engine Yard](https://www.engineyard.com/) and [Rails Machine](https://railsmachine.com/)
- CLoud deployment services such as [Engine Yard Cloud](https://login.engineyard.com/login) and [Heroku](https://www.heroku.com/)

See below the modified Gemfile required for Rails if deployed with Heroku:
```ruby
source 'https://rubygems.org'

gem 'rails',        '5.1.4'
gem 'puma',         '3.9.1'
gem 'sass-rails',   '5.0.6'
gem 'uglifier',     '3.2.0'
gem 'coffee-rails', '4.2.2'
gem 'jquery-rails', '4.3.1'
gem 'turbolinks',   '5.0.1'
gem 'jbuilder',     '2.7.0'

group :development, :test do
  gem 'sqlite3', '1.3.13'
  gem 'byebug',  '9.0.6', platform: :mri
end

group :development do
  gem 'web-console',           '3.5.1'
  gem 'listen',                '3.1.5'
  gem 'spring',                '2.0.2'
  gem 'spring-watcher-listen', '2.0.1'
end

group :production do
  gem 'pg', '0.20.0'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
```
To prepare the system for deployment to production, we run bundle install with a special flag to prevent the local installation of any production gems (which in this case consists of the pg gem):
```
bundle install --without production
```

## **What We Learnt in this Chapter**
- Ruby on Rails is a web development framework written in the Ruby programming language.
- Rails comes with a command-line command called rails that can generate new applications (rails new) and run local servers (rails server).
- We protected against data loss while enabling collaboration by placing our application source code under version control with Git and pushing the resulting code to a private repository at Bitbucket.
- We deployed our application to a production environment using Heroku.