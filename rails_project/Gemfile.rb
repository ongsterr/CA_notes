
# Custom Gems
gem 'devise', '~> 4.4', '>= 4.4.3'
gem "pundit", '~> 1.1'
gem 'bootstrap', '~> 4.1.0'
gem 'jquery-rails'
gem 'shrine', '~> 2.10', '>= 2.10.1'
gem "image_processing", "~> 1.2"
gem "font-awesome-rails"

gem 'blockscore'
gem 'mailgun-ruby'
gem 'paypal-sdk-rest'

group :development, :test do
  gem 'rspec-rails', '~> 3.7'
  gem 'dotenv-rails'
end