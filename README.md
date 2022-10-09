# Smart Campus Frontend
> This repo is for development, not for production.

## Environment
* npm@6.12.0
* ReactJS@17
* react-bootstrap@1.4.3
* esri/react-arcgis@5.1.0
* Ogre service : transfer geojson to shapefile

## Deploy
* In root
  * `npm install -g npm@6.12.0` if necessary.
  * `npm install`
  * `npm run build`
  * `npm start`

## Trouble shooting
* If there is error with Node Sass:
  * `npm uninstall node-sass`
  * `npm i -D sass`
  * `npm start`
* [(Reference)](https://stackoverflow.com/questions/70281346/node-js-sass-version-7-0-0-is-incompatible-with-4-0-0-5-0-0-6-0-0)