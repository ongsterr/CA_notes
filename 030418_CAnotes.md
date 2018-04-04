## Topics Covered
- Testing
    - What is testing?
    - Why is it important?
    - How to write tests?
- Setting up RSpec for Rails - What is RSpec?
- Active Record Validations
- What is Guard? Setting up Guard.

## Revision
- Ruby classes (very brief revsion)

## We learnt the existence of these things, but not how to use it
- What is meant by "**Extreme Programming**"?
> Extreme programming (XP) is a software development methodology which is intended to improve software quality and responsiveness to changing customer requirements. As a type of agile software development, it advocates frequent "releases" in short development cycles, which is intended to improve productivity and introduce checkpoints at which new customer requirements can be adopted.\
See: http://www.extremeprogramming.org/

- **Continuous Integration** - What's that?
> Continuous Integration (CI) is a development practice that requires developers to integrate code into a shared repository several times a day. Each check-in is then verified by an automated build, allowing teams to detect problems early.\
See: https://en.wikipedia.org/wiki/Continuous_integration

- **Travis** - What's that?
> Travis CI is a hosted, distributed continuous integration service used to build and test software projects hosted at GitHub. Open source projects may be tested at no charge via travis-ci.org.

- "Shrine" gem (Ruegen's favorite gem for managing image in database) - check it out!
> Shrine is a toolkit for file attachments in Ruby applications.\
Why "Shrine"? See: https://twin.github.io/better-file-uploads-with-shrine-motivation/ 

- "**Factory Bot**" gem (extension gem on top of RSpec for testing) - What's that?
> Factory Bot, originally known as Factory Girl, is a software library for the Ruby programming language that provides factory methods to create test fixtures for automated software testing.\
See for more info: https://en.wikipedia.org/wiki/Factory_Bot_(Rails_Testing)

- **Cucumber** exists - What's that?
> See: https://cucumber.io/

- What are some principles of **Behavior Driven Development (BDD)**?
> Behavior-driven development specifies that tests of any unit of software should be specified in terms of the desired behavior of the unit. Borrowing from agile software development the "desired behavior" in this case consists of the requirements set by the business — that is, the desired behavior that has business value for whatever entity commissioned the software unit under construction. Within BDD practice, this is referred to as BDD being an "outside-in" activity.\
See: https://en.wikipedia.org/wiki/Behavior-driven_development

- An interesting gem called **Hirb** that provides a mini view framework for console applications and uses it to improve irb’s default inspect output. Hirb has useful default views for at least ten popular database gems i.e. Rails’ ActiveRecord::Base. ([readme doc](http://tagaholic.me/hirb/doc/index.html))

## Testing
- Code written to test other codes
- There are 2 types of software testing concepts/frameworks:
    - [Test Driven Development (TDD)](https://en.wikipedia.org/wiki/Test-driven_development)
    - [Behavioral Driven Developement](https://en.wikipedia.org/wiki/Behavior-driven_development)
- TDD - write tests before writing codes - don't wait for a problem to happen
- In Rails we can write tests for: views, routes, models etc.
    - http://guides.rubyonrails.org/testing.html
- Guide on testing with Ruby on Rails.
    - https://hackernoon.com/your-guide-to-testing-in-ruby-on-rails-5-c8bd122e38ad

### When to Test?
See excerpt from "Learn Just Enought to be Dangerous" series on Rails ([Rails tutorial box 3.3](https://www.railstutorial.org/book/static_pages)):
```
When deciding when and how to test, it’s helpful to understand why to test. In my view, writing automated tests has three main benefits:

1. Tests protect against regressions, where a functioning feature stops working for some reason.

2. Tests allow code to be refactored (i.e., changing its form without changing its function) with greater confidence.

3. Tests act as a client for the application code, thereby helping determine its design and its interface with other parts of the system.

Although none of the above benefits require that tests be written first, there are many circumstances where test-driven development (TDD) is a valuable tool to have in your kit. Deciding when and how to test depends in part on how comfortable you are writing tests; many developers find that, as they get better at writing tests, they are more inclined to write them first. It also depends on how difficult the test is relative to the application code, how precisely the desired features are known, and how likely the feature is to break in the future.

In this context, it’s helpful to have a set of guidelines on when we should test first (or test at all). Here are some suggestions based on my own experience:
- When a test is especially short or simple compared to the application code it tests, lean toward writing the test first.
- When the desired behavior isn’t yet crystal clear, lean toward writing the application code first, then write a test to codify the result.
- Because security is a top priority, err on the side of writing tests of the security model first.
Whenever a bug is found, write a test to reproduce it and protect against regressions, then write the application code to fix it.
- Lean against writing tests for code (such as detailed HTML structure) likely to change in the future.
- Write tests before refactoring code, focusing on testing error-prone code that’s especially likely to break.

In practice, the guidelines above mean that we’ll usually write controller and model tests first and integration tests (which test functionality across models, views, and controllers) second. And when we’re writing application code that isn’t particularly brittle or error-prone, or is likely to change (as is often the case with views), we’ll often skip testing altogether.
```

### Gems/Modules for Testing in Ruby
1. [test-unit](https://rubygems.org/gems/test-unit)
> Good docs for test-units:\
http://www.rubydoc.info/github/test-unit/test-unit/Test/Unit/Assertions\
https://en.wikibooks.org/wiki/Ruby_Programming/Unit_testing

2. [Minitest](https://rubygems.org/gems/minitest)
> Good docs for Minitest:\
http://docs.seattlerb.org/minitest/\
http://docs.seattlerb.org/minitest/Minitest/Assertions.html

3. [RSpec](https://rubygems.org/gems/rspec)
    - RSpec is what the industry tend to use - why?
    - Here is how to write better specs (approved by Ruegen) - http://www.betterspecs.org/

### Exercises
#### Exercise #1
1. Complete the morning challenge:
```Ruby
# Included Once
#
# Write a method that takes an array and a string. Return
# true if the string is found in the array only once.
# Otherwise return false.
#
# What's the time complexity of your solution? Can it be improved?
#
# *** Whiteboard this first ***
#
# Difficulty: 4/10
#
# Example:
# includedOnce(['hello','hi','hi'], 'hi') -> false
# includedOnce(['hello','hi','hey'], 'hi') -> true
#
# Check your solution by running the tests:
# ruby tests/14_included_once_test.rb
#

def includedOnce (haystack, needle)
  # Your code here
end
```
See utility_methods.rb.

2. Write tests for the function you wrote. See test_utility_methods.rb.
3. Run the tests and make sure they pass. Run in the terminal:
```
ruby test_utility_methods.rb
```

#### Exercise #2
Ruegen wrote these tests:
```ruby
class TestPerson < Test::Unit::TestCase
    def test_person_created_instance
        john = Person.new
        assert_instance_of(Person, john)
    end

    def test_person_instance_first_name
        john = Person.new first_name: 'John'
        assert_equal('John', john.first_name)
    end
end
```
**Task**: Write a Class to make this test pass\
See solution in utility_methods.rb\
For more info on ```test::unit``` module, visit https://test-unit.github.io/test-unit/en/Test/Unit.html.

### RSpec
Code-along-with-Ruegen exercise\
It is pretty much code along with http://rspec.info/ - just watch the videos and code along.

```bash
mkdir person-testing
cd person-testing
bundle init
```
Go to Gemfile and insert\
```bash
gem 'rspec', '~> 3.7'
```

Back to the terminal:
```bash
bundle install --binstubs
```

What "binstubs" does?
> Creates a directory (defaults to ~/bin) and place any executables from the gem there. These executables run in Bundler's context. If used, you might add this directory to your environment's PATH variable. For instance, if the rails gem comes with a rails executable, this flag will create a bin/rails executable that ensures that all referred dependencies will be resolved using the bundled gems.\
Source: http://bundler.io/v1.10/man/bundle-install.1.html

```bash
bin/rspec --init # "Runs rspec from your ./bin (local bin) instead of usr/bin (global bin)"
```

Running ```bin/rspec``` or ```bin/rails``` from your local bin ensures that you are running the same version that you installed from your Gemfile (as opposed to your global bin which might have a different version)

Create ```person.rb```
```ruby
# person.rb
# Copy paste the person class made in Exercise 2
class Person
    attr_reader :first_name
    def initialize(attributes = {})
        @first_name = attributes[:first_name]
    end
end
```
Create ```/spec/person_spec.rb```
```ruby
require './person'

RSpec.describe Person, '#person' do

    context 'test person first_name class method' do
        it 'should return first name' do
            sally = Person.new first_name: 'Sally'
            result = sally.first_name
            expect(result).to eq 'Sally'
        end
    end
end
```
Run the test ```bin/rspec```

### Learn Some RSpec Commands
In the terminal, type ```bin/rspec -h```
```
Usage: rspec [options] [files or directories]

    -I PATH                            Specify PATH to add to $LOAD_PATH (may be used more than once).
    -r, --require PATH                 Require a file.
    -O, --options PATH                 Specify the path to a custom options file.
        --order TYPE[:SEED]            Run examples by the specified order type.
                                         [defined] examples and groups are run in the order they are defined
                                         [rand]    randomize the order of groups and examples
                                         [random]  alias for rand
                                         [random:SEED] e.g. --order random:123
        --seed SEED                    Equivalent of --order rand:SEED.
        --bisect[=verbose]             Repeatedly runs the suite in order to isolate the failures to the
                                         smallest reproducible case.
        --[no-]fail-fast[=COUNT]       Abort the run after a certain number of failures (1 by default).
        --failure-exit-code CODE       Override the exit code used when there are failing specs.
    -X, --[no-]drb                     Run examples via DRb.
        --drb-port PORT                Port to connect to the DRb server.

  **** Output ****

    -f, --format FORMATTER             Choose a formatter.
                                         [p]rogress (default - dots)
                                         [d]ocumentation (group and example names)
                                         [h]tml
                                         [j]son
                                         custom formatter class name
    -o, --out FILE                     Write output to a file instead of $stdout. This option applies
                                         to the previously specified --format, or the default format
                                         if no format is specified.
        --deprecation-out FILE         Write deprecation warnings to a file instead of $stderr.
    -b, --backtrace                    Enable full backtrace.
        --force-color, --force-colour  Force the output to be in color, even if the output is not a TTY
        --no-color, --no-colour        Force the output to not be in color, even if the output is a TTY
    -p, --[no-]profile [COUNT]         Enable profiling of examples and list the slowest examples (default: 10).
        --dry-run                      Print the formatter output of your suite without
                                         running any examples or hooks
    -w, --warnings                     Enable ruby warnings

  **** Filtering/tags ****

    In addition to the following options for selecting specific files, groups, or
    examples, you can select individual examples by appending the line number(s) to
    the filename:

      rspec path/to/a_spec.rb:37:87

    You can also pass example ids enclosed in square brackets:

      rspec path/to/a_spec.rb[1:5,1:6] # run the 5th and 6th examples/groups defined in the 1st group

        --only-failures                Filter to just the examples that failed the last time they ran.
    -n, --next-failure                 Apply `--only-failures` and abort after one failure.
                                         (Equivalent to `--only-failures --fail-fast --order defined`)
    -P, --pattern PATTERN              Load files matching pattern (default: "spec/**/*_spec.rb").
        --exclude-pattern PATTERN      Load files except those matching pattern. Opposite effect of --pattern.
    -e, --example STRING               Run examples whose full nested names include STRING (may be
                                         used more than once)
    -t, --tag TAG[:VALUE]              Run examples with the specified tag, or exclude examples
                                       by adding ~ before the tag.
                                         - e.g. ~slow
                                         - TAG is always converted to a symbol
        --default-path PATH            Set the default path where RSpec looks for examples (can
                                         be a path to a file or a directory).

  **** Utility ****

        --init                         Initialize your project with RSpec.
    -v, --version                      Display the version.
    -h, --help                         You're looking at it.
```

### Let's Install Guard
What is [Guard](https://github.com/guard/guard)?

"Guard automates various tasks by running custom rules whenever file or directories are modified."

Guard keeps watch over folders/files you ask it to in the background, so it can keep running tests for you, everytime you change a file, as opposed to constantly re-running your tests manually.

Note: we are still in the folder ```/person-testing```

Update Gemfile!

```bash
#Gemfile
group :development, :test do
    gem 'rspec', '~> 3.7'
    gem 'guard-rspec', require: false
end
```

Note: Grouping your dependencies (e.g. :development) allows you to perform operations on the entire group. http://bundler.io/v1.3/groups.html

Install the new gem
```bash
bundle install
```
Initialise Guardfile:
```bash
bundle exec guard init
```
You should have a Guardfile that looks like this:
```ruby
# Guardfile
guard :rspec, cmd: "bundle exec rspec" do
  require "guard/rspec/dsl"
  dsl = Guard::RSpec::Dsl.new(self)

  # Feel free to open issues for suggestions and improvements

  # RSpec files
  rspec = dsl.rspec
  watch(rspec.spec_helper) { rspec.spec_dir }
  watch(rspec.spec_support) { rspec.spec_dir }
  watch(rspec.spec_files)

  # Ruby files
  ruby = dsl.ruby
  dsl.watch_spec_files_for(ruby.lib_files)

  # Rails files
  rails = dsl.rails(view_extensions: %w(erb haml slim))
  dsl.watch_spec_files_for(rails.app_files)
  dsl.watch_spec_files_for(rails.views)

  watch(rails.controllers) do |m|
    [
      rspec.spec.call("routing/#{m[1]}_routing"),
      rspec.spec.call("controllers/#{m[1]}_controller"),
      rspec.spec.call("acceptance/#{m[1]}")
    ]
  end

  # Rails config changes
  watch(rails.spec_helper)     { rspec.spec_dir }
  watch(rails.routes)          { "#{rspec.spec_dir}/routing" }
  watch(rails.app_controller)  { "#{rspec.spec_dir}/controllers" }

  # Capybara features specs
  watch(rails.view_dirs)     { |m| rspec.spec.call("features/#{m[1]}") }
  watch(rails.layouts)       { |m| rspec.spec.call("features/#{m[1]}") }

  # Turnip features and steps
  watch(%r{^spec/acceptance/(.+)\.feature$})
  watch(%r{^spec/acceptance/steps/(.+)_steps\.rb$}) do |m|
    Dir[File.join("**/#{m[1]}.feature")][0] || "spec/acceptance"
  end
end
```

As seen in the comments: These are the folders guard watches by default:\
```
# directories %w(app lib config test spec features)
```
So we rearranged our folder structure to let guard watch over person.rb in the ```/lib``` folder.

Move ```person-testing/person.rb``` to ```person-testing/lib/person.rb```

Update ```person-testing/spec/person_spec.rb```:
```ruby
require './lib/person'
```
Run your Guard:
```
bundle exec guard
```
Now everytime you make a change to person.rb, Guard is running your tests in the background!

### Make a new Rails Project with RSpec
Code along with Ruegen
1. In the terminal:
```bash
cd ..
rails new pharmacy
```
2. Follow the instruction below to install rspec-rails:\
https://github.com/rspec/rspec-rails
```
# Gemfile
group :development, :test do
  gem 'rspec-rails', '~> 3.7'
end
```
3. Back to the terminal:
```bash
bundle install
```
4. Initialize the ```spec/``` directory (where specs will reside) with:
```
rails generate rspec:install
```
5. Use the rspec command to run your specs
```
bundle exec rspec
```
6. Create a scaffold for your products:
```
rails g scaffold Product name:string price:integer description:text brand:string image_data:text
```
7. Run your migration:
```
bin/rails db:migrate
```

### Adding a column to your Model using migration with Rails
Use the below command:
```
rails g migration AddTitleToProduct title
```
Interesting facts about Rails:
- g is short for "generate"
- "If the migration name is of the form “AddXXXToYYY” or “RemoveXXXFromYYY” and is followed by a list of column names and types then a migration containing the appropriate add_column and remove_column statements will be created."
- ```AddColumnToTable``` in camelcase sets up the name of your migration
- "title" is the name of the column (default type is string)
- Rails adds "Title" column to table named ```table``` (based on what you name your migration)

This generates a new migration:
```ruby
# This is automatically generated
class addTitleToProduct < ActiveRecord::Migration[5.1]
    def change
        add_column :products, :title, :string
    end
end
```
Then run:
```
bin/rails db:migrate
```
For more details, see: http://guides.rubyonrails.org/v3.2/migrations.html

### RSpec "Model" Test
1. Open ```/spec/models/product_spec.rb```\
Note: This file should have already been generated when you bundle generateed and executed rspec

2. Write the below test:
```ruby
require 'rails_helper'

RSpec.describe Product, type: :model do
    it 'should have product name' do
        product = Product.new title: 'Centrum Advance'
        result = product.title
        expect(result).to eq('Centrum Advance')
    end
end
```
3. Run your model tests: ```bundle exec rspec spec/models```

## ActiveRecord Validations
Another test was written for the Product "Model"
```ruby
RSpec.describe Product, type: :model do
    it 'should have product name' do
        product = Product.new title: 'Centrum Advance'
        result = product.title
        expect(result).to eq('Centrum Advance')
    end

    it 'should validate product title' do
        result = Product.new().valid?
        expect(result).to eq(false)
        assert(Product.new().invalid?))
    end
end
```

The new test failed:
```
Failed examples:
rspec ./spec/models/product_spec.rb:10 # Product should validate product title
```
To get the test to pass, Ruegen opened ```app/models/products.rb``` and added a validation:
```ruby
class Product < ApplicationRecord
    validates :title, presence: true
end
```
and this now passes!!!
```
Finished in 0.03707 seconds (files took 4.43 seconds to load)
2 examples, 0 failures
```
Read the docs for more info: http://guides.rubyonrails.org/active_record_validations.html

### Exercise 3
Using the docs for validations, write: a) tests & b) validations for:
1. Description has more than 5 words
2. Price is present
3. Price is integer
4. Brand is valid

Note from Nat: I have written my tests & validations, but I'm 99.99% sure there is a better way to do this. I'll need to re-read validations docs & guide to writing good rspecs.