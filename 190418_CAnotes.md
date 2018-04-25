
## **Table of Content**
- Github
    - Setting Up
    - Cloning / forking
    - Pull Request
    - Collaboration
- Geocoding
- Random Questions

## **Github**
1. Let's talk about "```Pull Request```". See [here](https://help.github.com/articles/about-pull-requests/) for docs.
    - What is a "```Pull Request```" in Github?
        - Pull requests let you tell others about changes you've pushed to a repository on GitHub. Once a pull request is opened, you can discuss and review the potential changes with collaborators and add follow-up commits before the changes are merged into the repository.
    - How do you create a "```Pull Request```"?

2. How does **collaboration** works in Github?
    - It is recommended to have someone in charge of the "```master```"
    - A branch is generally named after the "feature" you are building
    - What is a typical process if you would like to contribute to an existing repo?
        - You [clone](https://help.github.com/articles/cloning-a-repository/) the master to your desktop
        - You create a branch from the master and work on your branch
        - Then, you create a "[pull request](https://help.github.com/articles/creating-a-pull-request/)" for the master owner to push your branch into his/her repository
        - The master owner then decide whether or not to merge the ```branch``` into the ```master```
        - If there is a conflict between pull requests, then the ```master``` owner has to decide which ones he/she would like to accept/reject.

3. What is meant by a "```Git rebase```"?
    - In Git, there are two main ways to integrate changes from one branch into another: the ```merge``` and the ```rebase```.
    - ```rebase``` just meant that you are replaying your changes in your branch to a "new" ```master```, so that you are working on the most pdated base
    - For more info, read [doc](https://git-scm.com/book/en/v2/Git-Branching-Rebasing).

4. There is a list of really good Git cheat-sheets
    - https://ndpsoftware.com/git-cheatsheet.html#loc=remote_repo;
    - https://services.github.com/on-demand/downloads/github-git-cheat-sheet.pdf
    - https://git-scm.com/docs

5. Exercise on understanding Git collaboration through repeating the InstaRails_Geo Rails app but splitting up the function

**Questions**:
1. What is "```cancan```" gem used for?
    - ```CanCanCan``` is an authorization library for Ruby >= 2.2.0 and Ruby on Rails >= 4.2 which restricts what resources a given user is allowed to access.
    - All permissions can be defined in one or multiple ability files and not duplicated across controllers, views, and database queries, keeping your permissions logic in one place.
    - It consists of **two main parts**:
        - **the authorizations definition library** that allows you to define the rules, for a user, to access different objects, and provides helpers to check for those permissions.
        - **controller helpers** that help to simplify the code in Rails Controllers by performing the loading and checking of permissions of models for you in the controllers.
    - For more info, read [docs](https://github.com/CanCanCommunity/cancancan).

2. What are some good beginner repos to contribute to?
    - https://github.com/freeCodeCamp
    - https://github.com/TheOdinProject
    - https://www.firsttimersonly.com/
    - https://github.com/MunGell/awesome-for-beginners
    - https://github.com/issues?q=is%3Aopen+is%3Aissue+archived%3Afalse+label%3A%22good+first+issue%22

3. How can I get GUI for git trees (history of all branches and commits)?
    - To see how to do this, read [doc](https://scottiestech.info/2016/08/14/how-to-install-git-and-gitk-on-bash-on-ubuntu-on-windows-10/).
    - This would be helpful understand the latest updates in the repo.

4. For full list of **HTML URL Encoding**, see [docs](https://www.w3schools.com/tags/ref_urlencode.asp).

5. **Interesting read**: Jeff Bezos's [annual letter](file:///C:/Users/ongch/Desktop/Coder%20Academy/Amazon_Shareholder_Letter.pdf) to shareholders