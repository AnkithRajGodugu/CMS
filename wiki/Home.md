# Project Wiki

Welcome to the project wiki! Here you'll find documentation, guides, and resources.

## Project Overview
This project is a full-stack application with a Spring Boot backend and a React + Vite frontend. It is containerized with Docker and can be deployed to Kubernetes.

## Getting Started
- Clone the repository
- See the README.md for setup instructions
- Backend: See [Backend Guide](#backend-spring-boot-guide)
- Frontend: See [Frontend Guide](#frontend-react--vite-guide)

## Backend (Spring Boot) Guide
- Location: `backend/`
- Build: `mvn clean install`
- Run: `mvn spring-boot:run`
- Configuration: See `application.properties`
- Main entry: `CmsApplication.java`

## Frontend (React + Vite) Guide
- Location: `frontend/`
- Install dependencies: `npm install`
- Run dev server: `npm run dev`
- Build: `npm run build`

## Deployment
### Docker
- Build images: See `Dockerfile` and `docker-compose.yml`
- Run: `docker-compose up --build`
### Kubernetes
- See `KUBERNETES.md` for cluster setup and deployment steps

## Contribution Guide
- See `CONTRIBUTING.md` for guidelines
- Open issues and pull requests for improvements

## FAQ & Resources
- For troubleshooting, see the [FAQ](FAQ.md) (create as needed)
- Useful links:
	- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
	- [React Documentation](https://react.dev/)
	- [Vite Documentation](https://vitejs.dev/)
	- [Docker Documentation](https://docs.docker.com/)
	- [Kubernetes Documentation](https://kubernetes.io/docs/)
