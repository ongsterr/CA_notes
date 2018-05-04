## **Devise Setup**

### **Setup for `Omni-Auth-Google`**
1. Define your application id and secret in `config/initializers/devise.rb`. Configuration options can be passed as the last parameter here as key/value pairs.
    ```ruby
    config.omniauth :google_oauth2, 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', {}
    ```
2. Specify your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in your `.env` file. Follow the instructions [here](https://richonrails.com/articles/google-authentication-in-ruby-on-rails/) to setup Google API for ominiauth.
3. Create a file `config/initialisers/omniauth.rb` and specify:
    ```ruby
    # config/initialisers/omniauth.rb
    OmniAuth.config.full_host = Rails.env.production? ? 'https://domain.com' : 'http://localhost:3000'
    OmniAuth.config.logger = Rails.logger

    # The below may not be necessary
    Rails.application.config.middleware.use OmniAuth::Builder do
        provider :google_oauth2, ENV.fetch('CLIENT_ID'), ENV.fetch('CLIENT_SECRET'), {client_options: {ssl: {ca_file: Rails.root.join("cacert.pem").to_s}}}
    end
    ```
4. Then add the following to `config/routes.rb` so the callback routes are defined.
    ```ruby
    devise_for :users, controllers: { omniauth_callbacks: 'users/omniauth_callbacks' }
    ```
5. Make sure your model is omniauthable. Generally this is `/app/models/user.rb`
    ```ruby
    devise :omniauthable, omniauth_providers: [:google_oauth2]
    ```
6. Then make sure your callbacks controller is setup in `app/controllers/users/omniauth_callbacks_controller.rb`
    ```ruby
    class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
        def google_oauth2
            # You need to implement the method below in your model (e.g. app/models/user.rb)
            @user = User.from_omniauth(request.env['omniauth.auth'])

            if @user.persisted?
                flash[:notice] = I18n.t 'devise.omniauth_callbacks.success', kind: 'Google'
                sign_in_and_redirect @user, event: :authentication
            else
                session['devise.google_data'] = request.env['omniauth.auth'].except(:extra) # Removing extra as it can overflow some session stores
                redirect_to new_user_registration_url, alert: @user.errors.full_messages.join("\n")
            end

            def failure
                redirect_to root_path
            end

        end
    end
    ```
    **Note**:
    - All information retrieved from Google by OmniAuth is available as a hash at `request.env["omniauth.auth"]`. Here's an example of an authentication hash available in the callback by accessing `request.env['omniauth.auth']`:
        ```ruby
        {
            "provider" => "google_oauth2",
            "uid" => "100000000000000000000",
            "info" => {
                "name" => "John Smith",
                "email" => "john@example.com",
                "first_name" => "John",
                "last_name" => "Smith",
                "image" => "https://lh4.googleusercontent.com/photo.jpg",
                "urls" => {
                    "google" => "https://plus.google.com/+JohnSmith"
                }
            },
            "credentials" => {
                "token" => "TOKEN",
                "refresh_token" => "REFRESH_TOKEN",
                "expires_at" => 1496120719,
                "expires" => true
            },
            "extra" => {
                "id_token" => "ID_TOKEN",
                "id_info" => {
                    "azp" => "APP_ID",
                    "aud" => "APP_ID",
                    "sub" => "100000000000000000000",
                    "email" => "john@example.com",
                    "email_verified" => true,
                    "at_hash" => "HK6E_P6Dh8Y93mRNtsDB1Q",
                    "iss" => "accounts.google.com",
                    "iat" => 1496117119,
                    "exp" => 1496120719
                },
                "raw_info" => {
                    "kind" => "plus#personOpenIdConnect",
                    "gender" => "male",
                    "sub" => "100000000000000000000",
                    "name" => "John Smith",
                    "given_name" => "John",
                    "family_name" => "Smith",
                    "profile" => "https://plus.google.com/+JohnSmith",
                    "picture" => "https://lh4.googleusercontent.com/photo.jpg?sz=50",
                    "email" => "john@example.com",
                    "email_verified" => "true",
                    "locale" => "en",
                    "hd" => "company.com"
                }
            }
        }
        ```
    - When a valid user is found, they can be signed in with one of two Devise methods: `sign_in` or `sign_in_and_redirect`. Passing `:event => :authentication` is optional. You should only do so if you wish to use [Warden callbacks](https://stackoverflow.com/questions/9221390/what-does-event-authentication-do/13389324#13389324).
    - A flash message can also be set using one of Devise's default messages, but that is up to you.
    - In case the user is not persisted, we store the OmniAuth data in the session. Notice we store this data using "devise." as key namespace. This is useful because Devise removes all the data starting with "devise." from the session whenever a user signs in, so we get automatic session clean up. At the end, we redirect the user back to our registration form.
7. Then, create the `from_omniauth` method to bind to or create the user
    ```ruby
    def self.from_omniauth(access_token)
        data = access_token.info
        user = User.where(email: data['email']).first

        # Uncomment the section below if you want users to be created if they don't exist
        # unless user
        #     user = User.create(name: data['name'],
        #        email: data['email'],
        #        password: Devise.friendly_token[0,20]
        #     )
        # end
        user
    end
    ```
    Alternatively, you can also code as the below:
    ```ruby
    def self.from_omniauth(auth)
        where(provider: auth.provider, uid: auth.uid).first_or_create! do |user|
            user.email = auth.info.email
            user.password = Devise.friendly_token[0,20]
            # user.name = auth.info.name   # assuming the user model has a name
            # user.image = auth.info.image # assuming the user model has an image
            # If you are using confirmable and the provider(s) you use validate emails, 
            # uncomment the line below to skip the confirmation emails.
            # user.skip_confirmation!
        end
    end
    ```
    **Note**:
    - This method tries to find an existing user by the `provider` and `uid` fields. If no user is found, a new one is created with a random password and some extra information. Note that the [`first_or_create`](https://apidock.com/rails/v3.2.1/ActiveRecord/Relation/first_or_create) method automatically sets the `provider` and `uid` fields when creating a new user. The [`first_or_create!`](https://apidock.com/rails/v3.2.1/ActiveRecord/Relation/first_or_create!) method operates similarly, except that it will raise an Exception if the user record fails validation.
8. To create logout link/routes, go to `config/routes.rb`:
    ```ruby
    # config/routes.rb
    devise_scope :user do
        delete 'sign_out', :to => 'devise/sessions#destroy', :as => :destroy_user_session
    end
    ```
9. To test it in the view, you can add the below link to `app/views/devise/sessions/new.html.erb`:
    ```erb
    <div class="field">
        <%= link_to "Sign in with Google", user_google_oauth2_omniauth_authorize_path %>
    </div>
    ```
10. Now, time to write integration tests to see if it works!
    - In `spec/rails_helper.rb`, insert the code below:
        ```ruby
        OmniAuth.config.test_mode = true
        OmniAuth.config.mock_auth[:xing] = OmniAuth::AuthHash.new({
            :provider => 'google',
            :uid => '123545',
            :info => {
                :name => "Test",
                :email => "test@test.com"
            },
            :credentials => {
                :token => "token",
                :secret => "secret"
            }
            # etc.
        })
        ```
        And then have a `login_helper` that does something like:
        ```ruby
        def login
            Rails.application.env_config["omniauth.auth"] = OmniAuth.config.mock_auth[:google]
            visit root_path
            click_link 'loginBtn'
        end
        ```

### **Setup for Devise `Confirmable`**

1. Add `devise :confirmable` to your `models/user.rb` file
    ```ruby
    devise :registerable, :confirmable
    ```
2. Do the migration as:
    ```
    $ rails g migration add_confirmable_to_devise
    ```
3. We will Will generate `db/migrate/YYYYMMDDxxx_add_confirmable_to_devise.rb`. Add the following to it in order to do the migration:
    ```ruby
    class AddConfirmableToDevise < ActiveRecord::Migration
    # Note: You can't use change, as User.update_all will fail in the down migration
        def up
            add_column :users, :confirmation_token, :string
            add_column :users, :confirmed_at, :datetime
            add_column :users, :confirmation_sent_at, :datetime
            # add_column :users, :unconfirmed_email, :string # Only if using reconfirmable
            add_index :users, :confirmation_token, unique: true
            # User.reset_column_information # Need for some types of updates, but not for update_all.
            # To avoid a short time window between running the migration and updating all existing
            # users as confirmed, do the following
            User.all.update_all confirmed_at: DateTime.now
            # All existing user accounts should be able to log in after this.
        end

        def down
            remove_columns :users, :confirmation_token, :confirmed_at, :confirmation_sent_at
            # remove_columns :users, :unconfirmed_email # Only if using reconfirmable
        end
    end
    ```
4. Do the migration ```rails db:migrate```
5. Generate the corresponding Devise views if they have not yet been created:
    ```
    $ rails generate devise:views users
    ```
6. If you are not using :reconfirmable (i.e leave the commented out lines as they are in the change method described above), update the configuration in `config/initializers/devise.rb`:
    ```ruby
    config.reconfirmable = false
    ```
7. To use a custom mailer, create a class that extends `Devise::Mailer` in `app/mailers/my_mailer.rb`:
    ```ruby
    class MyMailer < Devise::Mailer   
        helper :application # gives access to all helpers defined within `application_helper`.
        include Devise::Controllers::UrlHelpers # Optional. eg. `confirmation_url`
        default template_path: 'devise/mailer' # to make sure that your mailer uses the devise views
    end
    ```
8. In your `config/initializers/devise.rb`, set ```config.mailer = "MyMailer"```
9. In case you want to override specific mails to add extra headers, you can do so by simply overriding the method and calling `super` at the end of your custom method, to trigger Devise's default behavior.
    
    In `app/mailers/my_mailer.rb`, add:
    ```ruby
    def confirmation_instructions(record, token, opts={})
        headers["Custom-header"] = "Bar"
        opts[:from] = 'my_custom_from@domain.com'
        opts[:reply_to] = 'my_custom_from@domain.com'
        super
    end
    ```
10. In order to get preview (if `User` is your devise model name), add the below code to `spec/mailers/previews/my_mailer_preview.rb`:
    ```ruby
    # spec/mailers/previews/my_mailer_preview.rb
    # Preview all emails at http://localhost:3000/rails/mailers/my_mailer

    class MyMailerPreview < ActionMailer::Preview

        def confirmation_instructions
            MyMailer.confirmation_instructions(User.first, "faketoken", {})
        end

        def reset_password_instructions
            MyMailer.reset_password_instructions(User.first, "faketoken", {})
        end

        def unlock_instructions
            MyMailer.unlock_instructions(User.first, "faketoken", {})
        end
    end
    ```
11. To actually send a test email through sign-up in development, you need to set up the SMTP setting in `config/environments/development.rb`:
    ```ruby
    # Don't care if the mailer can't send.
    config.action_mailer.raise_delivery_errors = true

    config.action_mailer.perform_caching = false

    # Set up default URL options for the Devise mailer
    config.action_mailer.default_url_options = { host: 'localhost', port: 3000 }
    config.action_mailer.default :charset => "utf-8"
    config.action_mailer.perform_deliveries = true
    config.action_mailer.delivery_method = :smtp
    config.action_mailer.smtp_settings = {
        user_name:      ENV['SENDMAIL_USERNAME'],
        password:       ENV['SENDMAIL_PASSWORD'],
        domain:         ENV['MAIL_HOST'],
        address:       'smtp.gmail.com',
        port:          '587',
        authentication: :plain,
        enable_starttls_auto: true
    }
    ```
    **Note**:
    - You will need to specify `SENDMAIL_USERNAME`, `SENDMAIL_PASSWORD` and `MAIL_HOST` in your `.env` file
    - If your email is "gmail", you will need to enable "`Access for less secure apps`" in your google settings.
