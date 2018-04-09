## Chapter 4: Rails-Flavored Ruby

### **Built-in Helpers**
Recall the line below in the layout page:
```html
<%= stylesheet_link_tag 'application', media: 'all', 'data-turbolinks-track': 'reload' %>
```
This uses the built-in Rails function ```stylesheet_link_tag``` (which you can read more about at the [Rails API](http://api.rubyonrails.org/classes/ActionView/Helpers/AssetTagHelper.html#method-i-stylesheet_link_tag)) to include application.css for all media types (including computer screens and printers). To an experienced Rails developer, this line looks simple, but there are at least four potentially confusing Ruby ideas: **built-in Rails methods**, **method invocation with missing parentheses**, **symbols**, and **hashes**.

### **Custom Helpers**

### **CSS Revisited**
So we now see the line below as:
```ruby
stylesheet_link_tag 'application', media: 'all',
                                   'data-turbolinks-track': 'reload'

stylesheet_link_tag 'application', { media: 'all',
                                     'data-turbolinks-track': 'reload' }
```
The ```stylesheet_link_tag``` function has two arguments: a string, indicating the path to the stylesheet, and a hash with two elements, indicating the media type and telling Rails to use the turbolinks feature added in Rails 4.0.

See below the HTML syntax for the ERB line above:
```html
<link data-turbolinks-track="true" href="/assets/application.css" media="all"
rel="stylesheet" />
```

## **Ruby Classes**
### **Exercises**
- What is the literal constructor for the range of integers from 1 to 10?
> numbers = 1..10
- What is the constructor using the Range class and the new method? Hint: new takes two arguments in this context.
> range = Range.new(1,10)
- Confirm using the == operator that the literal and named constructors from the previous two exercises are identical.
> numbers == range >> true
- What is the class hierarchy for a range? For a hash? For a symbol?
    - It normally follows the structure as outlined by the image below:
![class hierarchy](https://softcover.s3.amazonaws.com/636/ruby_on_rails_tutorial_4th_edition/images/figures/string_inheritance_ruby_1_9.png)
- Confirm that the method shown in Listing 4.15 works even if we replace self.reverse with just reverse.
```ruby
class Word < String
  def palindrome?
    self == self.reverse
  end
end
```
Results:
```
>> s = Word.new("level")    # Make a new Word, initialized with "level".
=> "level"
>> s.palindrome?            # Words have the palindrome? method.
=> true
>> s.length                 # Words also inherit all the normal string methods.
=> 5
```
- Verify that “racecar” is a palindrome and “onomatopoeia” is not. What about the name of the South Indian language “Malayalam”? Hint: Downcase it first.

A diagram of Rails hierarchy for ```ApplicationController```

![hierarchy](https://softcover.s3.amazonaws.com/636/ruby_on_rails_tutorial_4th_edition/images/figures/static_pages_controller_inheritance.png)

## **What We Learnt**
- Ruby has a large number of methods for manipulating strings of characters.
- Everything in Ruby is an object.
- Ruby supports method definition via the ```def``` keyword.
- Ruby supports class definition via the ```class``` keyword.
- Rails views can contain static HTML or embedded Ruby (ERb).
- Built-in Ruby data structures include arrays, ranges, and hashes.
- Ruby blocks are a flexible construct that (among other things) allow natural iteration over enumerable data structures.
- Symbols are labels, like strings without any additional structure.
- Ruby supports object inheritance.
- It is possible to open up and modify built-in Ruby classes.
- The word “deified” is a palindrome.