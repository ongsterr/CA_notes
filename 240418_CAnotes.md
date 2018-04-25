## **Shrine** - File Storage Solution

Files storing gems that we can use:
- [CarrierWave](https://github.com/carrierwaveuploader/carrierwave)
    - This gem provides a simple and extremely flexible way to upload files from Ruby applications. It works well with Rack based web applications, such as Ruby on Rails.
- [Paperclip](https://github.com/thoughtbot/paperclip)
    - Paperclip is intended as an easy file attachment library for ActiveRecord. The intent behind it was to keep setup as easy as possible and to treat files as much like other attributes as possible. This means they aren't saved to their final locations on disk, nor are they deleted if set to nil, until ```ActiveRecord::Base#save``` is called. It manages validations based on size and presence, if required. It can transform its assigned image into thumbnails if needed, and the prerequisites are as simple as installing [ImageMagick](https://www.imagemagick.org/script/index.php) (which, for most modern Unix-based systems, is as easy as installing the right packages). Attached files are saved to the filesystem and referenced in the browser by an easily understandable specification, which has sensible and useful defaults.
- [Shrine](https://github.com/shrinerb/shrine)
    - Shrine is a toolkit for file attachments in Ruby applications.
    - Motivation behind creating Shrine - read [this](https://twin.github.io/better-file-uploads-with-shrine-motivation/)

### **Learning Shrine** (see [doc](http://shrinerb.com/))
- Learnt how to incorporate Shrine into Rails app
    - Add ```shrine``` gem to gemfile
    - Create an initializer file called "shrine.rb" and add below code to the file:
    ```ruby
    require "shrine"
    require "shrine/storage/file_system"

    Shrine.storages = {
    cache: Shrine::Storage::FileSystem.new("public", prefix: "uploads/cache"), # temporary
    store: Shrine::Storage::FileSystem.new("public", prefix: "uploads/store"), # permanent
    }

    Shrine.plugin :sequel # or :activerecord
    Shrine.plugin :cached_attachment_data # for forms
    Shrine.plugin :rack_file # for non-Rails apps
    ```
    - Build the ```Photo``` model:
    ```
    $ rails g scaffold Photo image_data:text description:text user:references
    ```
    - Add image_uploader.rb and add below ```class```, which is inherited from the ```Shrine``` class:
    ```ruby
    class PhotoUploader < Shrine
    # plugins and uploading logic
    end
    ```
    - Add the below code to the ```PhotoUploader``` model to process files before uploading to storage - including managing file versions i.e. image sizes:
    ```ruby
    require "image_processing/mini_magick"

    class ImageUploader < Shrine
    plugin :processing
    plugin :versions   # enable Shrine to handle a hash of files
    plugin :delete_raw # delete processed files after uploading

        process(:store) do |io, context|
            original = io.download
            pipeline = ImageProcessing::MiniMagick.source(original)

            size_800 = pipeline.resize_to_limit!(800, 800)
            size_500 = pipeline.resize_to_limit!(500, 500)
            size_300 = pipeline.resize_to_limit!(300, 300)

            original.close!

            { original: io, large: size_800, medium: size_500, small: size_300 }
        end
    end
    ```
    - Include below line to "```Photo```" model to create 'image' virtual attribute:
    ```ruby
    class Photo < Sequel::Model # ActiveRecord::Base
    include ImageUploader::Attachment.new(:image) # adds an `image` virtual attribute
    end
    ```
    - Build the form for attaching files:
    ```erb
    <!-- ActionView::Helpers::FormHelper -->
    <%= form_for @photo do |f| %>
    <%= f.hidden_field :image, value: @photo.cached_image_data %>
    <%= f.file_field :image %>
    <% end %>
    ```
    - In your ```Photo``` controller, ensure that the photo_params exclude ```user_id``` as a permitted field (do the same in the form - remove ```user_id``` field).
    - Add ```@photo.user = current_user``` under the ```create``` action.

    - There are many other functionalities that were not included into the exercise such as:
        - **Custom metadata** - In addition to the built-in metadata, you can also extract and store completely custom metadata with the add_metadata plugin.
        - **Custom processing** - the processing tool doesn't have to be in any way designed for Shrine, the only thing that you need to do is return processed files as some kind of IO objects.
        - **Validations** - Shrine can perform file validations for files assigned to the model.
        - **Direct Uploads** - To improve the user experience, the application can actually start uploading the file asynchronously already when files have been selected, and provide a progress bar. This way the user can estimate when the upload is going to finish, and they can continue filling in other fields in the form while the file is being uploaded.
        - **Backgrounding** - Shrine is the first file attachment library designed for backgrounding support. Moving phases of managing file attachments to background jobs is essential for scaling and good user experience, and Shrine provides a ```backgrounding``` plugin which makes it easy to plug in your favourite backgrounding library.
        - **Clearing Cache** - Shrine doesn't automatically delete files uploaded to temporary storage, instead you should set up a separate recurring task that will automatically delete old cached files.
        - **Logging** - Shrine ships with the ```logging``` which automatically logs processing, uploading, and deleting of files. This can be very helpful for debugging and performance monitoring.
        - **On-the-fly Processing** - Shrine allows you to define processing that will be performed on upload. However, what if you want to have processing performed on-the-fly when the URL is requested? Unlike Refile or Dragonfly, Shrine doesn't come with an image server built in; instead it expects you to integrate any of the existing generic image servers.

- Learnt how to build the "Like" and "Unlike" functionality.
- Learnt how to use icons in Rails app
- Learnt how to use Bootstrap cards in Rails app 

### **Questions**:
- Files are stored in ```containers```. What are ```containers```?
- What does Amazon "S3" stands for?
    - Simple storage service
- What is ```hidden_field``` in FormHelper for Rails?
    - Read [docs](https://apidock.com/rails/ActionView/Helpers/FormHelper/hidden_field)
- What is "[Sidekiq](https://sidekiq.org/)" used for?
    - Simple, efficient background processing for Ruby.
    - Sidekiq uses threads to handle many jobs at the same time in the same process. It does not require Rails but will integrate tightly with Rails to make background processing dead simple.
- How did we do "join tables"?
    - ```has_and_belongs_to_many``` method. Read [doc](https://apidock.com/rails/ActiveRecord/Associations/ClassMethods/has_and_belongs_to_many).
    - Learn more about the basics of model associations. Read [doc](http://guides.rubyonrails.org/association_basics.html).
    - Notice how we actually called the "```name```" of the relationship/table.
- Need to learn how to use "Pundit". See [docs](https://github.com/varvet/pundit).
- Need to learn how to use ```mailer```. The API we are using is called [mailgun](https://app.mailgun.com/app/dashboard).
- Rails migration [cheat-sheet](https://www.ralfebert.de/snippets/ruby-rails/models-tables-migrations-cheat-sheet/).
- Learn more about what "[imagemagick](https://www.imagemagick.org/script/command-line-tools.php)" actually do.
- Using icons in Rails. See [font-awesome](https://github.com/bokmann/font-awesome-rails). This is pretty cool!