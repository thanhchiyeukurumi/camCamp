# camCamp

## Overview
camCamp is a web application inspired by Yelp, allowing users to discover, review, and share information about campgrounds. Built with Node.js, Express.js, MongoDB, and EJS, this application provides a platform for users to create, edit, and delete campground listings and reviews.

## Features
- **User Authentication**: Sign up, log in, and manage user profiles.
- **Campground Listings**: Create, edit, and delete campground entries.
- **Reviews**: Add, edit, and delete reviews for campgrounds.
- **Interactive Maps**: View campground locations on an integrated map.
- **Responsive Design**: Optimized for various devices using Bootstrap.

## Technologies Used
- **Front-end**: HTML, CSS, Bootstrap, EJS
- **Back-end**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Authentication**: Passport.js
- **Others**: Connect-Flash for flash messages, Express-Session for session management

## Installation

1. **Clone the repository**:
    ```sh
    git clone https://github.com/thanhchiyeukurumi/camCamp.git
    cd camCamp
    ```

2. **Install dependencies**:
    ```sh
    npm install
    ```

3. **Set up environment variables**:
    Create a [.env](http://_vscodecontentref_/2) file in the root directory and add the following:
    ```env
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_KEY=your_cloudinary_key
    CLOUDINARY_SECRET=your_cloudinary_secret
    MAPTILER_API_KEY=your_maptiler_api_key
    DB_URL=your_mongodb_atlas_api_key
    SECRET=your_secret_key
    ```

4. **Run the application**:
    ```sh
    nodemon app.js
    ```

5. **Seed the database** (optional):
    ```sh
    node seeds/index.js
    ```

## Usage

### Creating a New Campground
1. Navigate to the "New Campground" page.
2. Fill in the form with the campground details.
3. Submit the form to create a new campground entry.

### Adding a Review
1. Navigate to a campground's detail page.
2. Scroll down to the reviews section.
3. Fill in the review form and submit it.

### Editing a Campground or Review
1. Navigate to the campground or review you want to edit.
2. Click the "Edit" button.
3. Update the details and submit the form.

### Deleting a Campground or Review
1. Navigate to the campground or review you want to delete.
2. Click the "Delete" button.

## Example Code

### Connecting to MongoDB
```js
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log('Database connected');
    })
    .catch(err => {
        console.log('Database connection error:', err);
    });
