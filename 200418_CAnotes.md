

## **Rails Authorisation**
Finnnalllllyyyy....

1. [```pundit```](https://github.com/varvet/pundit) gem
    - ```Pundit``` provides a set of helpers which guide you in leveraging regular Ruby classes and object oriented design patterns to build a simple, robust and scaleable authorization system.
    - Need to read the docs and learn more about it!


**Questions**:
- Interesting read about git merge vs rebase:
    - https://www.atlassian.com/git/tutorials/merging-vs-rebasing

- How to Write Good Git Commit Messages? - Read this [article](https://chris.beams.io/posts/git-commit/)

- How do you ```git push``` multiple branches at the same time?
    - See [here](https://stackoverflow.com/questions/13000563/how-to-push-multiple-branches-from-multiple-commits) for more info.
    ```
    $ git push origin branch1 branch2 branch3
    ```

- How do you hide some files or content in Rails?
    - Rails encryption methods - Rails 5.2 replaces the old Rails secrets with [encrypted credentials](https://www.engineyard.com/blog/rails-encrypted-credentials-on-rails-5.2). You cannot use plain text credentials. There's only ```credentials.yml.enc```.
    - [dotenv](https://github.com/bkeepers/dotenv) gem
        - Shim to load environment variables from ```.env``` into ```ENV``` in development
        - It is not always practical to set environment variables on development machines or continuous integration servers where multiple projects are run. dotenv loads variables from a ```.env``` file into ```ENV``` when the environment is bootstrapped.

- How do we test Rails app using ```rspec```? See [docs](https://github.com/rspec/rspec-rails).
- What is the link on browser that we use to see all the routes in our Rails application?
    - See [link](http://localhost:3000/rails/info/routes).

- Some useful git help
    - http://ohshitgit.com/
    - https://learngitbranching.js.org/
    - http://rogerdudler.github.io/git-guide/
