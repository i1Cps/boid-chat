<!-- ⚠️ This README has been generated from the file(s) "blueprint.md" ⚠️--><h1 align="center">boid-chat</h1>
<p align="center">
  <img src="images/boid_pic_clean.png" alt="Logo" width="550" height="auto" />
</p>


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png)](#table-of-contents)

## ➤ Table of Contents

* [➤ ::pencil:: About The Project](#-pencil-about-the-project)
* [➤ :rocket: Dependencies](#-rocket-dependencies)
* [➤ :floppy_disk: Key Project File Description](#-floppy_disk-key-project-file-description)
	* [Front End](#front-end)
	* [Back End](#back-end)
* [➤ :coffee: Buy me a coffee](#-coffee-buy-me-a-coffee)
* [➤ :scroll: Credits](#-scroll-credits)
* [➤ License](#-license)


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png)](#pencil-about-the-project)

## ➤ ::pencil:: About The Project

Boid Chat is an innovative real-time web Chat Application that combines interactive 3D-rendered flock simulations with global connectivity.

By selecting a unique username and joining a chat room, users can seamlessly exchange messages with people from across the globe. Each virtual room is driven by 600 individual boids, each adhering to the fundamental principles outlined in the renowned [Boids](https://www.red3d.com/cwr/boids) paper by Craig Reynolds, first published in 1987.

Explore the dynamic world of Boid Chat and connect with users worldwide through this engaging platform!


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png)](#rocket-dependencies)

## ➤ :rocket: Dependencies

Boid Chat utilizes several key packages and technologies to power its features:

  

![React Badge](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=000&style=for-the-badge) ![Three.js Badge](https://img.shields.io/badge/Three.js-000?logo=threedotjs&logoColor=fff&style=for-the-badge) ![TypeScript Badge](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff&style=for-the-badge)

 ![Tailwind CSS Badge](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=fff&style=for-the-badge) ![Node.js Badge](https://img.shields.io/badge/Node.js-393?logo=nodedotjs&logoColor=fff&style=for-the-badge) ![Socket.io Badge](https://img.shields.io/badge/Socket.io-010101?logo=socketdotio&logoColor=fff&style=for-the-badge)

![Express Badge](https://img.shields.io/badge/Express-000?logo=express&logoColor=fff&style=for-the-badge) ![NGINX Badge](https://img.shields.io/badge/NGINX-009639?logo=nginx&logoColor=fff&style=for-the-badge) ![PM2 Badge](https://img.shields.io/badge/PM2-2B037A?logo=pm2&logoColor=fff&style=for-the-badge)

[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png)](#floppy_disk-key-project-file-description)

## ➤ :floppy_disk: Key Project File Description

### Front End
* boids.tsx - Renders the boids
* boidAgent.ts - Handles boids logic
* joinPage.tsx - Page where users select a name and a room
* main.tsx - Client-side socket logic
* chatbox.tsx - Main chat box component
### Back End
* router.ts - Initiates the server-side server
* index.ts - Handles the real-time server with user  management logic
* users.ts - Several function to manage user data in chat app

[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png)](#coffee-buy-me-a-coffee)

## ➤ :coffee: Buy me a coffee
Whether you use this project, have learned something from it, or just like it, please consider supporting it by buying me a coffee, so I can dedicate more time on open-source projects like this :)

<a href="https://www.buymeacoffee.com/i1Cps" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-violet.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>



[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png)](#scroll-credits)

## ➤ :scroll: Credits

Theo Moore-Calters 


[![GitHub Badge](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/i1Cps) [![LinkedIn Badge](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](www.linkedin.com/in/theo-moore-calters)


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png)](#license)

## ➤ License
	
Licensed under [MIT](https://opensource.org/license/mit-0/).
