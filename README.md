# URL Shortener

Welcome to the URL Shortener application! This project allows you to shorten long URLs into more manageable, easy-to-share links.

## Features

- Shorten long URLs
- Custom short URLs
- Redirect to the original URL
- Simple and intuitive user interface
- Error handling for invalid and duplicate short URLs

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- EJS (Embedded JavaScript)
- Tailwind CSS

## Demo

![URL Shortener Demo](https://i.postimg.cc/qqcVWYFw/image.png)

## Getting Started

### Prerequisites

Make sure you have the following installed on your local development environment:

- Node.js
- MongoDB

### Installation

1. Clone the repository

```sh
git clone https://github.com/lakshaykamat/url-shortener.git
cd url-shortener
```

2. Install dependencies

```sh
npm install
```

3. Create a `.env` file in the root of your project and add the following environment variables:

```
PORT=5000
MONGO_URI=<your_mongodb_connection_string>
```

4. Start the MongoDB server if it's not running already

```sh
mongod
```

5. Start the application

```sh
npm start
```

6. Visit `http://localhost:5000` in your browser

## Usage

### Shorten a URL

1. Enter a long URL in the input field.
2. Optionally, provide a custom short URL.
3. Click the "Shorten URL" button.
4. The shortened URL will be displayed on the screen.

### Redirect

1. Copy the shortened URL.
2. Paste it into your browser's address bar.
3. You will be redirected to the original URL.

## Project Structure

```
url-shortener/
├── config/
│   └── mongo.js
├── models/
│   └── Url.js
├── public/
├── views/
│   ├── about.ejs
│   └── index.ejs
├── .env
├── .gitignore
├── package.json
├── README.md
└── server.js
```

## Contributing

Contributions are welcome! Please fork this repository and create a pull request with your changes. Make sure to follow the coding standards and include appropriate tests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Maintained by Lakshay Kamat.

- GitHub: [lakshaykamat](https://github.com/lakshaykamat)

### Explanation:

- **Project Overview**: Provides a brief description and key features of the project.
- **Technologies Used**: Lists the technologies and frameworks used in the project.
- **Demo**: Placeholder for a demo GIF or image.
- **Getting Started**: Instructions for setting up the project locally, including prerequisites, installation steps, and environment configuration.
- **Usage**: Describes how to use the application.
- **Project Structure**: Overview of the project directory structure.
- **Contributing**: Guidelines for contributing to the project.
- **License**: Information about the project’s license.
- **Contact**: Maintainer's contact information.
