
### **Product Initial Setup**
1. Setup Gemfile to include all the gems required
    ```ruby
    # Custom gems
    gem 'devise', '~> 4.4', '>= 4.4.3'
    gem "pundit", '~> 1.1'
    gem 'bootstrap', '~> 4.1.0'
    gem 'jquery-rails'
    gem 'shrine', '~> 2.10', '>= 2.10.1'
    gem "image_processing", "~> 1.2"
    gem "font-awesome-rails"
    gem 'country_select'
    gem 'mailgun-ruby'

    group :development, :test do
        gem 'rspec-rails', '~> 3.7'
        gem 'dotenv-rails'
    end
    ```
    ```
    $ bundle
    ```
2. Install RSpec
    ```
    $ rails g rspec:install
    ```
3. Set-up Postgresql database
    - Configure the `config/database.yml` file:
        ```yml
        default: &default
            adapter: postgresql
            encoding: unicode
            username: postgres
            password: password
            host: localhost
        ```
    - Create database
        ```
        $ rails db:create
        ```
4. Set-up `.env.development` file
5. In the `config/locales/en.yml` file, add the below code to translate date into required format in views
    ```yml
    date:
        formats:
            default: "%d/%m/%Y"
    
    # In the view file, add a "l" in front of the date item for it to be rendered in the desired format 
    ```
6. Set-up `Pages controller` for views such as home page, about us page and contact us page
    ```
    $ rails g controller Pages home about contact
    ```
    - Build navbar based on design from Figma

### **CRUD Models**

1. `Account` Management
    - Account Registration
    - Account Login
    - Account Logout
    - Account Update (email and password)
    - Account Cancellation
    - Account Display (index and show) - for admin search or account lookup

2. `Profile` Management
    - Profile Registration
    - Profile Display (show)
    - Profile Display (index)
    - Profile Update
    - Profile Deletion (deletion can only happen in concurrent with account cancellation)

3. `Service/Product` Management
    - Product Registration
    - Product Display (index) - display list of transporters
    - Product Display (show) - detailed display of transporter service
    - Product Update
    - Product Deletion

4. `Booking` Management
    - Booking Registration - show in the same page as "Service Display (show)"
    - Booking Display (show) - Booking Summary Page
    - Booking Display (index) - Booking History Page
    - Booking Update
    - Booking Cancellation

### **Routes based on CRUD Models**

1. `Account` Management (default using Devise) - subject to change

| Page | Prefix | Verb | URI Pattern | Controller#Action |
|---|---|---|---|---|
| Account Registration | new_user_registration | GET | `/sign_up/user` | devise/registrations#new
| | | POST | /users | devise/registrations#create |
| Account Login | new_user_session | GET | /users/sign_in | devise#sessions#new |
| | user_session | POST | /users/sign_in | devise/sessions#create |
| Account Logout | destroy_user_session | DELETE | /users/sign_out | devise/sessions#destroy
| Account Update | edit_user_registration | GET | /users/edit | devise/registrations#edit
| | user_registration | PATCH | /users | devise/registrations#update
| | | PUT | /users | devise/registrations#update
| Account Cancellation | | DELETE | /users | devise/registrations#destroy

2. `Profile` Management

| Page | Prefix | Verb | URI Pattern | Controller#Action |
|---|---|---|---|---|
| Profile Registration | profile_new | GET | `/sign_up/profile` | profiles#new |
| | | POST | /profile | profiles#create |
| Profile Display (show) | profile_show | GET | /profile/show | profiles#show |
| Profile Display (index) | profile_index | GET | /profile/index | profiles#index |
| Profile Update | profile_edit | GET | /profile/edit | profiles#edit |
| | profile_edit | PATCH | /profile/edit | profiles#update |
| Profile Deletion | | DELETE | /profile | profiles#destroy |

3. `Service/Product` Management

| Page | Prefix | Verb | URI Pattern | Controller#Action |
|---|---|---|---|---|
| Product Registration | product_new | GET | `/sign_up/product` | products#new |
| | | POST | /product | products#create |
| Product Display (show) | product_show | GET | /product/show | products#show |
| Product Display (index) | product_index | GET | /product/index | products#index |
| Product Update | product_edit | GET | /product/edit | products#edit |
| | product_edit | PATCH | /product/edit | products#update |
| Product Deletion | | DELETE | /product | products#destroy |

4. `Booking` Management

| Page | Prefix | Verb | URI Pattern | Controller#Action |
|---|---|---|---|---|
| Booking Registration | booking_new | GET | /booking/new | bookings#new |
| | | POST | /booking | bookings#create |
| Booking Display (show) | booking_show | GET | /booking/show | bookings#show |
| Booking Update | booking_edit | GET | /booking/edit | bookings#edit |
| | booking_edit | PATCH | /booking/edit | bookings#update |
| Booking Deletion | | DELETE | /booking | bookings#destroy |

### **Setup**

1. **`Account`** Management

    - `Devise` gem setup in Rails app
        ```
        $ bundle
        $ rails g devise:install
        $ rails g devise:views
        $ rails g devise User
        ```
    - In `config/routes.rb`, modify routes as required:
        ```ruby
        devise_for :users
        devise_scope :user do
            GET '/sign_up/user', to: 'devise/registrations#new'
        end
        ```
    - In `models/user.rb`, ensure that all Devise functionality required is included:
        ```ruby
        devise :database_authenticatable, :registerable, :recoverable, :rememberable, :trackable, :validatable, :confirmable, :omniauthable
        ```
    - Set-up Devise `:confirmable` feature:
        - Refer to "setup_devise.md" for instructions
    - Set-up Devise `:omniauthable` feature:
        - Refer to "setup_devise.md" for instructions
        ```
        $ rails db:migrate
        ```

2. **`Profile`** Management

    - Generate a Profile `controller`:
        ```
        $ rails g controller Profiles new create show index edit update destroy
        ```
        or
        ```
        $ rails g scaffold Profiles
        ```
    - Set-up controller's `actions`:
        ```ruby
        before_action :authenticate_user!
        before_action :set_profile, only: [:show, :edit, :update, :destroy]

        def new
            @profile = Profile.new
        end

        def create
            @profile = Profile.new(profile_params)
            @profile.user = current_user

            if @profile.save
                flash[:notice] = 'Profile created!'
                redirect_to profile_show_path
            else
                flash[:alert] = 'Profile could not be created!'
                redirect_to :back
            end
        end

        def show
            
        end

        def index
            @profiles = Profile.all
        end

        def edit
            @profile = Profile.find_or_initialize_by(user: current_user)
        end

        def update
            respond_to do |format|
                if @profile.update(profile_params)
                    format.html { redirect_to profile_edit_path, notice: 'Profile was successfully updated.' }
                else
                    format.html { redirect_back, notice: 'Profile could not be updated.' }
                end
            end
        end

        def destroy
            @profile.destroy
        end

        private
            def set_profile
                @profile = current_user.profile
            end

            def profile_params
                params.require(:profile).permit(...)
            end
        ```
        - Set-up Profile `model`
            ```
            $ rails g model Profile 
            user:references 
            first_name 
            last_name 
            date_of_birth:date 
            mobile_phone 
            about_me:text 
            language_1 language_2 language_3 
            profile_image_data:text 
            addr_unit_number addr_street_number addr_street_name addr_city addr_state addr_postcode addr_country_code
            passport_number passport_expiry_date:date passport_country_code passport_image_data:text
            drivers_license_number drivers_license_expiry_date:date drivers_license_country_code drivers_license_image_data:text
            verified?:boolean

            $ rails db:migrate
            ```
            In the `models/profile.rb`, define methods required:
            ```ruby
            belongs_to :user

            include ImageUploader[:profile_image, :passport_image, :drivers_license_image] # part of Shrine setup

            def location
                "#{addr_city}, #{addr_state}, #{country_name}"
            end

            def spoken_language
                l1 = language_1
                l2 = language_2.nil? ? "" : ", #{language_2}"
                l3 = language_3.nil? ? "" : ", #{language_3}"
                return l1 + l2 + l3
            end

            def country_name 
                # This is converting country_code to country name using the country_select gem
                # This will attempt to translate the country name and use the default (usually English) name if no translation is available
                country = ISO3166::Country[addr_country_code]
                country.translations[I18n.locale.to_s] || country.name
            end

            ```
        
        - Set-up `Shrine` for image uploading and storage\
            Install gem:
            ```ruby
            # gemfile
            gem "shrine"
            ```
            Write an initializer for `config/initializers/shrine.rb`:
            ```ruby
            # Option for storage on local drive
            require "shrine"
            require "shrine/storage/file_system"

            Shrine.storages = {
                cache: Shrine::Storage::FileSystem.new("public", prefix: "uploads/cache"), # temporary
                store: Shrine::Storage::FileSystem.new("public", prefix: "uploads/store"), # permanent
            }

            Shrine.plugin :activerecord # or :sequel
            Shrine.plugin :cached_attachment_data # for forms

            # Option for storage using AWS S3
            require "shrine/storage/s3"

            s3_options = {
                access_key_id:     "abc",
                secret_access_key: "xyz",
                region:            "my-region",
                bucket:            "my-bucket",
            }

            Shrine.storages = {
                cache: Shrine::Storage::S3.new(prefix: "cache", **s3_options),
                store: Shrine::Storage::S3.new(**s3_options),
            }

            # Clearing cache in S3 storage
            s3 = Shrine.storages[:cache]
            s3.clear! { |object| object.last_modified < Time.now - 7*24*60*60 } # delete files older than 1 week
            ```
            Install image_processing gem:
            ```
            $ brew install imagemagick
            ```

            ```ruby
            # Gemfile
            gem "image_processing", "~> 1.0"
            ```
            Create uploader files in `app/uploaders/image_uploader.rb` for both uploading capability and image processing:
            ```ruby
            require "image_processing/mini_magick"

            class ImageUploader < Shrine
                plugin :processing
                plugin :versions, names: [:original, :thumb, :medium] # Enable Shrine to handle a hash of files
                plugin :delete_raw # Delete processed files after uploading

                process(:store) do |io, context|
                    original = io.download
                    pipeline = ImageProcessing::MiniMagick.source(original) # What does this do?

                    size_80 = pipeline.resize_to_limit!(80, 80)
                    size_300 = pipeline.resize_to_limit!(300, 300)

                    original.close! # Memory management - clear out of memory
                    {original: io, thumb: size_80, medium: size_300} # Returns hash of the 3 sizes of same image

                end
            end
            ```
            Set-up `attachment` capability with Shrine by adding some codes to `models/profile.rb`:
            ```ruby
            include ImageUploader[:profile_image, :passport_image, :drivers_license_image]
            ```
            Create `forms` as required using the below example as reference:
            ```ruby
            # with Rails form builder:
            form_for @profile do |f|
                f.hidden_field :profile_image, value: @profile.cached_image_data
                f.file_field :profile_image
                f.submit
            end
            ```
        - Build `seed` file for "admin" for testing:
            ```ruby
            admin_user = {
                email: ENV.fetch('ADMIN_EMAIL'),
                password: ENV.fetch('ADMIN_PASSWORD')
            }

            uploader = ImageUploader.new(:store)
            file = File.new(Rails.root.join('app/assets/images/pitch.png'))
            uploaded_file = uploader.upload(file)

            admin_profile = {
                user_id: "1",
                first_name: "Christopher",
                last_name: "Ong",
                date_of_birth: "10/01/1990",
                gender: "Male",
                mobile_phone: "0422678500",
                about_me: "I love travelling!",
                language_1: "English",
                language_2: "Chinese",
                language_3: "Malay",
                profile_image_data: uploaded_file.to_json,
                addr_unit_number: "1",
                addr_street_number: "888",
                addr_street_name: "Collins Street",
                addr_city: "Docklands",
                addr_state: "Victoria",
                addr_postcode: "3008",
                addr_country_code: "AU",
                passport_number: "A123456",
                passport_expiry_date: "12/12/2022",
                passport_country_code: "AU",
                passport_image_data: uploaded_file.to_json,
                drivers_license_number: "A123456",
                drivers_license_expiry_date: "12/12/2022",
                drivers_license_country_code: "AU",
                drivers_license_image_data: uploaded_file.to_json,
                verified?: 0
            }

            User.create!(admin_user) {p "Admin user created"}
            Profile.create!(admin_profile) {p "Admin profile created"}

            ```
            ```
            $ rails db:seed
            ```

        - Set-up required `views`. See Figma for [wireframe](https://www.figma.com/file/gbxDajd7veCgClXHYzTGTq9Q/Wireframe-V1).
            - `Profile Registration` - `Designed`
            - `Profile Edit` (use the same template as "Profile Registration", only difference here is that all the fields are pre-filled with data from registration) - `Designed`
            - `Profile Display` - `Designed`
            - `Profile Index` - `Not Yet Designed`

3. **`Service/Product`** Management

    - Generate a Product `controller`:
        ```
        $ rails g controller Products new create show index edit update destroy
        ```
        or
        ```
        $ rails g scaffold Products
        ```
    - Set-up controller's `actions`:
        ```ruby
        before_action :authenticate_user!, only: [:new, :create, :edit, :update, :destroy]
        before_action :set_product, only: [:show, :edit, :update, :destroy]

        def new
            @product = Product.new
        end

        def create
            @product = Product.new(product_params)
            @product.user = current_user

            if @product.save
                flash[:notice] = 'Product created!'
                redirect_to product_show_path
            else
                flash[:alert] = 'Product listing could not be created!'
                redirect_back
            end
        end

        def show
            
        end

        def index
            @products = Product.all
        end

        def edit
        end

        def update
            if @product.update(product_params)
                flash[:notice] = 'Product updated!'
                redirect_to product_show_path
            else
                flash[:alert] = 'Product listing could not be updated!'
                redirect_back
            end
        end

        def destroy
            @product.destroy
            respond_to do |format|
                format.html { redirect_to profile_show_path, notice: 'Product listing was successfully removed.' }
            end
        end

        private
            def set_product
                @product = Product.find(params[:id])
            end

            def product_params
                params.require(:product).permit(...)
            end
        ```
    - Set-up Location `model`:
        ```
        $ rails g model Location
        location
        country
        continent
        ```
    - Set-up Product `model`:
        ```
        $ rails g model Product
        user:references
        price_per_day:decimal
        vehicle_model
        vehicle_capacity
        vehicle_description:text
        vehicle_image_data:text
        cancellation_policy
        things_to_note:text
        location:references

        $ rails db:migrate
        ```
    - In the `models/product.rb` file, customised the reference column name:
        ```ruby
        class Product < ApplicationRecord
            belongs_to :user, class_name: "User", foreign_key: "transporter"
            belongs_to :location
        end
        ```

    - In the `models/product.rb`, define methods required:
        ```ruby
        belongs_to :user
        belongs_to :location
        has_many :bookings

        include ImageUploader[:vehicle_image] # part of Shrine setup

        def country_name 
            # This is converting country_code to country name using the country_select gem
            # This will attempt to translate the country name and use the default (usually English) name if no translation is available
            country = ISO3166::Country[addr_country_code]
            country.translations[I18n.locale.to_s] || country.name
        end
        ```
    - In the `models/location.rb`, define table relationship:
        ```ruby
        has_many :products

        ```

    - Set-up required `views`. See Figma for [wireframe](https://www.figma.com/file/gbxDajd7veCgClXHYzTGTq9Q/Wireframe-V1).
        - `Product Registration` - `Designed`
        - `Product Edit` (use the same template as "Product Registration", only difference here is that all the fields are pre-filled with data from registration) - `Not Yet Designed`
        - `Product Display` - `Designed`
        - `Product Index` - `Designed`

4. **`Bookings`** Management

    - Generate a Bookings `controller`:
        ```
        $ rails g controller Bookings new create show index edit update destroy
        ```
        or
        ```
        $ rails g scaffold Bookings
        ```
    - Set-up controller's `actions`:
        ```ruby
        before_action :authenticate_user!
        before_action :set_product, only: [:show, :edit, :update, :destroy]

        def new
            @booking = Booking.new
        end

        def create
            @booking = Booking.new(booking_params)
            @booking.user = current_user

            if @booking.save
                flash[:notice] = 'Booking completed!'
                redirect_to booking_show_path
            else
                flash[:alert] = 'Booking could not be completed!'
                redirect_back
            end
        end

        def show
            
        end

        def index
            @bookings = Booking.all
        end

        def edit
        end

        def update
            if @booking.update(booking_params)
                flash[:notice] = 'Booking updated!'
                redirect_to booking_show_path
            else
                flash[:alert] = 'Booking could not be updated!'
                redirect_back
            end
        end

        def destroy
            @booking.destroy
            respond_to do |format|
                format.html { redirect_to profile_show_path, notice: 'Booking was successfully cancelled.' }
            end
        end

        private
            def set_booking
                @booking = Booking.find(params[:id])
            end

            def booking_params
                params.require(:booking).permit(...)
            end
        ```
    - Set-up Booking `model`
        ```
        $ rails g model Booking
        product:references
        transporter_id:integer
        traveler_id:integer
        booking_ref_number
        booking_date_from:date
        booking_date_to:date
        number_of_traveler:integer
        transporter_cost:decimal
        platform_cost:decimal
        total_cost:decimal
        booking_confirmed?:boolean
        ```
    - In the `migration` file, customised the reference column name:
        ```ruby
        create_table :bookings do |t|
            ...
            t.references :user, :transporter_id, foreign_key: true
            t.references :user, :traveler_id, foreign_key: true
            ...
        end
        ```
    - Set-up Review `model`:
        ```
        $ rails g model Review
        booking:references
        reviewer:integer
        reviewed:integer
        review:text
        rating:decimal
        ```
        Update the below components to change column name for foreign key:
        ```ruby
        # In the migration file
        def change
            create_table :bookings do |t|
                ...
                t.references :reviewer, index: true
                t.references :reviewed, index: true
                ...
            end
            add_foreign_key :reviews, :users, column: :reviewer_id
            add_foreign_key :reviews, :users, column: :reviewed_id
        end
        ```
        
    - In the `models/booking.rb`, define methods required:
        ```ruby
        belongs_to :transporter, class_name: 'User'
        belongs_to :traveler, class_name: 'User'
        belongs_to :product
        has_many :reviews

        ```
    - In the `models/review.rb`, define table relationship:
        ```ruby
        belongs_to :booking
        belongs_to :reviewer, class_name: "User"
        belongs_to :reviewed, class_name: "User"
        ```
    - Set-up required `views`. See Figma for [wireframe](https://www.figma.com/file/gbxDajd7veCgClXHYzTGTq9Q/Wireframe-V1).
        - `Booking Registration` (in the same view as Product Display) - `Designed`
        - `Booking Edit` (use the same template as "Booking Registration", only difference here is that all the fields are pre-filled with data from registration) - `Not Yet Designed`
        - `Booking Display` (Booking Summary) - `Designed`

### **Set-up Validations and User Authorization**

1. `Pundit` Setup
    - Installation
        ```ruby
        # Gemfile
        gem 'pundit'

        # app/controllers/application_controller.rb
        class ApplicationController < ActionController::Base
            include Pundit
            protect_from_forgery
        end
        ```
        OR alternatively, you can just do the following:
        ```
        $ rails g pundit:install
        ```

2. `Account` Management
    - What are some validation rules that we need to set?
        - User password length
            ```ruby
            # In config/initializers/devise.rb
            # ==> Configuration for :validatable
            # Range for password length.
            config.password_length = 8..128
            ```

3. `Profile` Management
    - What are some user authorization rules that we need to set?
        ```ruby
        # In app/policies/profile_policy.rb
        class ProfilePolicy < ApplicationPolicy
            def index?
                return true if user_signed_in?
            end

            def show?
                return true if user_signed_in?
            end

            def create?
                user_signed_in?
            end

            def update?
                return true if user_signed_in? && user == profile.user
            end

            def edit?
                return true if user_signed_in? && user == profile.user
            end

            def destroy?
                return true if user_signed_in? && user == profile.user
            end

            private
                def profile
                    record
                end
        end

        # In the Profiles controller
        def index
            @profiles = Profile.all
            authorize @profiles
        end

        def new
            @profile = Profile.new
            authorize @profile
        end

        def create
            @profile = Profile.new(profile_params)
            @profile.user = current_user
            authorize @profile

            if @profile.save
                flash[:notice] = 'Profile created!'
                redirect_to profile_show_path
            else
                flash[:alert] = 'Profile could not be created!'
                redirect_back
            end
        end

        private
            def set_profile
                @profile = current_user.profile
                @reviews = Review.find_by(reviewed_id: current_user)
                authorize @profile
            end
        
        # In app/controllers/application_controller.rb, add a standard error message that shows whenever a non-authorized user tries to access a restricted page
        ...
        rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized
        
        private
            def user_not_authorized
                flash[:warning] = "You are not authorized to perform this action."
                redirect_to(request.referrer || root_path)
            end
        ```
    - Setup using `Pundit`
        ```ruby
        # Create a file called app/policies/profile_policy.rb
        class ProfilePolicy < ApplicationPolicy
            # An example
            def update?
                user.admin? or not record.published?
            end
        end

        # In the Profile Controllers
        def update
            authorize @profile
            if @profile.update(profile_params)
                flash[:notice] = 'Profile updated!'
                redirect_to profile_show_path
            else
                flash[:alert] = 'Profile could not be updated!'
                redirect_back
            end
        end
        ```

