## Topics Covered
**Questions**:
- What is "[Rack](https://rack.github.io/)" used for?

- What is "[Devise](https://github.com/plataformatec/devise)" used for?
    - Devise is a flexible authentication solution for Rails based on Warden. It:
        - Is Rack based
        - Is a complete MVC solution based on Rails engines
        - Allows you to have multiple models signed in at the same time
        - Is based on a modularity concept: use only what you really need
    - See below its 10 modules:
        - [Database Authenticatable](http://www.rubydoc.info/github/plataformatec/devise/master/Devise/Models/DatabaseAuthenticatable): hashes and stores a password in the database to validate the authenticity of a user while signing in. The authentication can be done both through POST requests or HTTP Basic Authentication.
        - [Omniauthable](http://www.rubydoc.info/github/plataformatec/devise/master/Devise/Models/Omniauthable): adds OmniAuth (https://github.com/omniauth/omniauth) support.
        - [Confirmable](http://www.rubydoc.info/github/plataformatec/devise/master/Devise/Models/Confirmable): sends emails with confirmation instructions and verifies whether an account is already confirmed during sign in.
        - [Recoverable](http://www.rubydoc.info/github/plataformatec/devise/master/Devise/Models/Recoverable): resets the user password and sends reset instructions.
        - [Registerable](http://www.rubydoc.info/github/plataformatec/devise/master/Devise/Models/Registerable): handles signing up users through a registration process, also allowing them to edit and destroy their account.
        - [Rememberable](http://www.rubydoc.info/github/plataformatec/devise/master/Devise/Models/Rememberable): manages generating and clearing a token for remembering the user from a saved cookie.
        - [Trackable](http://www.rubydoc.info/github/plataformatec/devise/master/Devise/Models/Trackable): tracks sign in count, timestamps and IP address.
        - [Timeoutable](http://www.rubydoc.info/github/plataformatec/devise/master/Devise/Models/Timeoutable): expires sessions that have not been active in a specified period of time.
        - [Validatable](http://www.rubydoc.info/github/plataformatec/devise/master/Devise/Models/Validatable): provides validations of email and password. It's optional and can be customized, so you're able to define your own validations.
        - [Lockable](http://www.rubydoc.info/github/plataformatec/devise/master/Devise/Models/Lockable): locks an account after a specified number of failed sign-in attempts. Can unlock via email or after a specified time period.

- What is "[Redis](https://en.wikipedia.org/wiki/Redis)"?
    - Redis is an open-source in-memory database project implementing a distributed, in-memory key-value store with optional durability. Redis supports different kinds of abstract data structures, such as strings, lists, maps, sets, sorted sets, hyperloglogs, bitmaps and spatial indexes.
