## **Database Design**
**Steps when planning database for website development**:
1. What functionality do you need your database to have?
    - Brainstorm various aspects on the database e.g. what will be stored, what the site will use it for etc.
    - Think about what the site will do – what users will need to do, what information they will require and how this should be stored. 
    - Determine what information will be accessible for all users, and what will require special permissions e.g. if you’re running a site that requires registration for membership.
2. Determine tables and individual fields
    - Determine precisely what tables the database will contain and the field that each table should have
    - Establish how tables will be linked to each other, how data will be sorted in the table for continuity and ease of retrieval, if and how grouping or separation should be done
    - Using database design tools, you can create database models, diagrams and flowcharts indicating your plan
    - Grouping or Separating Data info Fields
        - A good way to determine which information should be in the same field or otherwise is to think about what it would take to change that piece of information if necessary
3. Database normalization
    - This refers to the set of guidelines and best practices set up by the community to enable efficient organization of data within a database
    - There are two goals of the normalization process: *eliminating redundant data (for example, storing the same data in more than one table)* and *ensuring data dependencies make sense (only storing related data in a table)*
    - For more info, read this [**article**](https://www.lifewire.com/database-normalization-basics-1019735)

**Tips for Better Database Design**:
- Plan Ahead
- Document your Model
    - When choosing names for tables and columns, make it clear what the usage of each object will be
    - Using a naming convention is one step towards effective documentation
    - Document the definition of tables, columns and relationships so that programmers can access the information. The documentation must describe expectations of the database structure.
- Follow Conventions
- Think Carefully about Keys
    - Tables need a primary key that identifies each row. The art is to decide which columns should be part of the primary key and what values to include.
- Use Integrity Checks Carefully
    - To ensure data integrity, we need foreign keys and constraints. Be careful not to overuse or underuse these integrity checks.
- Don’t Forget Indexes in Your Design
    - Indexes are important when considering queries on the data. When modeling, you should consider how the data will be queried. Take care not to over-index. Indexing revolves around query optimization.
- Avoid Common Lookup Tables
- Define an Archiving Strategy
- Test Early, Test Often

For more info, read this [**article**](http://www.vertabelo.com/blog/notes-from-the-lab/9-tips-for-better-database-design)

### **Resources:**
- https://onextrapixel.com/the-basics-of-good-database-design-in-web-development/
- https://www.qltech.com.au/develop/web-development/database-design-in-web-development/
