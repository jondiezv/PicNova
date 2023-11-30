# PicNova

Live Website: https://picnova.onrender.com/

# Description:

   PicNova is a full-stack web application inspired by Imgur. It is designed to be a image hosting website with light social media elements.

# Features:

   User Authentication:

      PicNova protects the security of accounts registered with it by encrypting and securing passwords to offer security to users signing up. A demo user is also available to allow exploration of the site. Users must be logged in to access features such as uploading images, commenting, favoriting, and any update/delete actions associated with such features.

   Posts:

      PicNova allows users to view "posts" on a landing page in a modern, grid like layout design that adjusts dynamically depending on the size of the images. These posts are simply images with titles and descriptions attached to them. The images are handled with AWS S3 cloud object storage.

      - User can view posts regardless of whether they are logged in or not.
      - User can upload images themselves, the uploading and storing of the images is handled by Amazon's AWS S3 service.
      - User can click on his user menu in the banner to get a link to all his posts.
      - User can make posts private, which won't show on the landing page, but will show on the user's profile.
      - User can update or delete posts.

   Comments:

      PicNova allows users to comment on posts.

      - User can add comments in any post, even his own
      - There is no limit to the number of comments a user can make
      - User can update or delete his own comments
      - User comments can only be 200 characters long, comment lenght is tracked in real time to make it user friendly for the user
      

   Favorites:

      PicNova allows users to favorite posts, this feature is currently a work in progress.

      - User can click on the heart button to favorite a post, clicking on it again will unfavorite the post without the need to refresh the page to see the changes, seamless!


# Technlogies:

- Frontend:
   - Redux
   - React
   - Javascript
   - CSS
   - HTML

- Backend:
   - Flask
   - Python
   - AWS S3


# Screenshots:
   - Landing Page:
      ![image](https://github.com/jondiezv/PicNova/assets/122311212/18cc4587-dbe3-472b-a8d3-66d09ba852a7)

   - Post details:
      ![image](https://github.com/jondiezv/PicNova/assets/122311212/b1291bc4-42d9-447d-8863-c87e4f79d56c)

   - User posts in their user profile:
      ![image](https://github.com/jondiezv/PicNova/assets/122311212/bbdacb99-3e29-480c-94ef-8c2a0f8989f6)


# Installation Instructions:

   - install dependencies:
      ```bash
         pipenv install -r requirements.txt
      ```

   - Create a .env file using the provided .envexample file.
   - Run the following commands in the terminal to setup the database and run the backend server:
      ```bash
         pipenv run flask db upgrade
      ```
      ```bash
         pipenv run flask seed all
      ```
      ```bash
         pipenv run flask run
      ```
   - In another terminal enter the react-app directory and run the following command to run the frontend:
      ```bash
         npm start
      ```

# Future Plans:

   - The user profile only shows posts, this will be updated with favorites and comments soon
   - Likes, which allows users to like/dislike posts
   - Ability to post images in comments and multiple images in a single post
