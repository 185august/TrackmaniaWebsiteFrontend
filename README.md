# Trackmania Map times Frontend

This is the frontend for a web application designed for Trackmania players. It allows users to track their performance on official campaign maps, compare their times with other players, and visualize the data.
The backend for this project can be found [here](https://github.com/185august/TrackmaniaProjectAPI)

## Features

- **Map Browser**: Users can browse and select Trackmania campaign maps filtered by year and season.
- **Time Comparison**: Compare your personal best times against friends or other players.
- **Data Visualization**: View time differences from the world record with charts, powered by Chart.js.

## Tech Stack

- **Framework**: [Vue.js 3](https://vuejs.org/) (with Composition API)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Routing**: [Vue Router](https://router.vuejs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Charting**: [Chart.js](https://www.chartjs.org/) via [vue-chartjs](https://vue-chartjs.org/)

## Project Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (version `^20.19.0 || >=22.12.0` as specified in `package.json`)
- A running instance of the backend API server on `http://localhost:5000`. The frontend is configured to proxy API requests from `/api` to this address.

### Installation

1.  Clone the repository:
    ```sh
    git clone https://github.com/185august/TrackmaniaWebsiteFrontend.git
    ```
2.  Navigate to the project directory:
    ```sh
    cd TrackmaniaWebsiteFrontend
    ```
3.  Install the dependencies:
    ```sh
    npm install
    ```

### Running the Application

To run the application in development mode:

```sh
npm run dev
```

The application will be available at `http://localhost:5500`.

## Lessons learned

This project served as a great learning experience, particularly in the following areas:

- **Vue.js Fundamentals**: As my first project using Vue.js, I learned how to set up a project from scratch, create and manage components, and use core Composition API features like `ref`, `computed`, and `reactive`. I also gained experience with `Vue Router` for handling client-side routing.

- **API Integration with Axios**: I learned how to use Axios to make asynchronous HTTP requests to a backend service, handle responses, and manage the data flow within the application.

- **Utility-First CSS with Tailwind CSS**: This was my first time using a CSS framework. I learned how to use Tailwind CSS to style my website.

- **Node Package Manager (npm)**: I became familiar with using `npm` to manage project dependencies and run essential scripts for development, building, and previewing the application.
