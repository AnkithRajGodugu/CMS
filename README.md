# CMS (Customer Management System)

[![pipeline status](https://gitlab.com/AnkithRajGodugu/cms/badges/main/pipeline.svg)](https://gitlab.com/AnkithRajGodugu/cms/-/commits/main)
[![coverage report](https://gitlab.com/AnkithRajGodugu/cms/badges/main/coverage.svg)](https://gitlab.com/AnkithRajGodugu/cms/-/commits/main)

A full-stack Java-based Customer Management System with:

---

## Features
- User authentication & authorization
- Customer CRUD operations
- Sector & report management
- Responsive React UI
- RESTful API integration
- Dockerized deployment
- Kubernetes manifests included

## Project Structure
```
cms/
 ├── backend/      # Spring Boot backend
 ├── frontend/     # React + Vite frontend
 ├── k8s/          # Kubernetes manifests
 ├── .gitlab-ci.yml
 ├── Dockerfile
 └── README.md
```

## Getting Started
### Prerequisites
- Java 17+
- Node.js 18+
- Docker
- Kubernetes (optional)

### Backend Setup
```sh
cd backend
mvn clean install
mvn spring-boot:run
```

### Frontend Setup
```sh
cd frontend
npm install
npm run dev
```

### Run with Docker Compose
```sh
docker-compose up --build
```

### Deploy to Kubernetes
```sh
kubectl apply -f k8s/
```

## Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License
This project is licensed under the MIT License.
