Spud Spotter
=========

Spud Spotter is a multi-page app that lets users create and share maps of their favourite potato themed places.

## Final Product

On the landing page, as an unregistered user you can view authenticated user's maps.

As a registered user you can create, edit and delete your maps, clicking right on the map drops a potato where you can input information about the specific place.

Registered users can also favourite other people's maps.

## Getting Started

1. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
2. Update the .env file with your correct local information 
  - username: `labber` 
  - password: `labber` 
  - database: `midterm`
  - Google_maps_key: YOUR_API_KEY
3. Install dependencies: `npm i`
4. Fix to binaries for sass: `npm rebuild node-sass`
5. Reset database: `npm run db:reset`
  - Check the db folder to see what gets created and seeded in the SDB
7. Run the server: `npm run local`
  - Note: nodemon is used, so you should not have to restart your server
8. Visit `http://localhost:8080/`

## Dependencies

- Node 10.x or above
- NPM 5.x or above
- PG 6.x
