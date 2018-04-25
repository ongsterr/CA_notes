## **Geocoding**
A few geo-mapping providers:
- Google Maps
- OpenStreetMap

### **How to Use a Geocoder?**
- **Google Map APIs** (See [here](https://developers.google.com/maps/documentation/geocoding/start) for more info.)
    - The Google Maps Geocoding API is a service that provides geocoding and reverse geocoding of addresses.
    - **Geocoding** is the process of converting addresses (like a street address) into geographic coordinates (like latitude and longitude), which you can use to place markers on a map, or position the map.
    - **Reverse geocoding** is the process of converting geographic coordinates into a human-readable address.
    - Using the "```Static Maps```" API, create your map based on URL parameters sent through a standard HTTPS request and display the map as an image. For more info, read [docs](https://developers.google.com/maps/documentation/static-maps/).

- ```Address validation``` by Auspost for addresses in Australia (See [here](https://auspost.com.au/business/marketing-and-communications/access-data-and-insights/address-data))

- "**Geocoder**" Ruby Gem (See [here](https://github.com/alexreisner/geocoder) for more info.)
    - Geocoder is a complete geocoding solution for Ruby. With Rails, it adds geocoding (by street or IP address), reverse geocoding (finding street address based on given coordinates), and distance queries. It's as simple as calling ```geocode``` on your objects, and then using a scope like ```Venue.near("Billings, MT")```.

- Country codes:
    - ```ISO 3166-1 alpha-2``` codes are two-letter country codes defined in ISO 3166-1, part of the ISO 3166 standard published by the International Organization for Standardization (ISO), to represent countries, dependent territories, and special areas of geographical interest. See [here](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) for more info!
    - "[countries](https://github.com/hexorx/countries)" gem
    - "[country_select](https://github.com/stefanpenner/country_select)" gem

- Some recommended practices for storing postal address in database:
    - Read [this](https://stackoverflow.com/questions/310540/best-practices-for-storing-postal-addresses-in-a-database-rdbms).

### **Steps to Create a New Rails Projects**
- rails New XXX
- Add custom gems to Gemfile and ```bundle```
- rails g rspec:install
- rails g devise:install
- rails g devise User
- rails g model Profile first_name last_name latitude:decimal longitude:decimal user:references
    - What does ```user:references``` do?
        - It adds a ```belongs_to :user``` relationship in your model. When this relationship is specified, ActiveRecord will assume that the foreign key is kept in the ```user_id``` column and it will use a model named User to instantiate the specific user. (See [here](https://stackoverflow.com/questions/7861971/generate-model-using-userreferences-vs-user-idinteger))

**Questions**:
- What is an "[iFrame](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe)"?
    - The HTML Inline Frame element ```<iframe>``` represents a nested browsing context, effectively embedding another HTML page into the current page.
    - Because each embedded browsing content created by ```<iframe>``` is itself a complete document environment, every use of ```<iframe>``` within a page can cause substantial increases in the amount of memory and other computing resources required by the document overall, so while theoretically you can use as many ```<iframes>``` as you like on a page, you should keep the potential for performance issues in mind.

- What is the "[Shrine](https://github.com/shrinerb/shrine)" gem used for?
    - ```Shrine``` is a toolkit for file attachments in Ruby applications.
    - A "```storage```" in ```Shrine``` is an object responsible for managing files on a specific storage service (filesystem, Amazon S3 etc), which implements a generic method interface. Storages are configured directly and registered under a name in ```Shrine.storages```, so that they can be later used by uploaders.
    - ```Uploaders``` are subclasses of ```Shrine```, and are essentially wrappers around storages. In addition to actually calling the underlying storage when they need to, they also perform many generic tasks which aren't related to a particular storage (like processing, extracting metadata, logging etc).
    - The uploader can also delete uploaded files via ```#delete```. Internally this just delegates to the uploaded file, but some plugins bring additional behaviour (e.g. logging).

- What is the difference between ```form_for``` and ```form_with```?
    - Read "[form_with vs form_for vs form_tag](https://www.engineyard.com/blog/using_form_with-vs-form_for-vs-form_tag)"

- What does ```find_or_initialize_by``` do?
    - ```find_or_initialize_by(attributes, &block)```
    - Finds the first record with the given attributes, or ```new``` a record with the attributes if one is not found
    - For more info, read [docs](https://apidock.com/rails/v4.0.2/ActiveRecord/Relation/find_or_create_by).

- Is ```destroy``` method self defined or is it built-in model function for Rails?
    - It is built-in function under ```ActiveRecord::Relation```. See[here](https://apidock.com/rails/ActiveRecord/Relation/destroy) for more info.
- What is ```params``` when called?
    - It is actually an instance of a model called ```ActionController::Parameters```
    - Allows you to choose which attributes should be whitelisted for mass updating and thus prevent accidentally exposing that which shouldn't be exposed.
    - Provides two methods for this purpose: ```require``` and ```permit```
        - ```require``` is used to mark parameters as required.
        - ```permit``` is used to set the parameter as permitted and limit which attributes should be allowed for mass updating
    - See [here](http://edgeapi.rubyonrails.org/classes/ActionController/Parameters.html) for more info.

- What are ```parameters``` in Rails? For more info, see [this](http://edgeguides.rubyonrails.org/action_controller_overview.html).
    - There are **two kinds** of parameters possible in a web application:
        - The first are parameters that are sent as part of the URL, called ```query string parameters```. The query string is everything after "?" in the URL.
        - The second type of parameter is usually referred to as ```POST data```.
            - This information usually comes from an HTML form which has been filled in by the user.
            - It's called ```POST data``` because it can only be sent as part of an HTTP POST request.
```ruby
class ClientsController < ApplicationController
# This action uses query string parameters because it gets run
# by an HTTP GET request, but this does not make any difference
# to the way in which the parameters are accessed. The URL for
# this action would look like this in order to list activated
# clients: /clients?status=activated
def index
    if params[:status] == "activated"
    @clients = Client.activated
    else
    @clients = Client.inactivated
    end
end

# This action uses POST parameters. They are most likely coming
# from an HTML form which the user has submitted. The URL for
# this RESTful request will be "/clients", and the data will be
# sent as part of the request body.
def create
    @client = Client.new(params[:client])
    if @client.save
    redirect_to @client
    else
    # This line overrides the default rendering behavior, which
    # would have been to render the "create" view.
    render "new"
    end
end
end
```