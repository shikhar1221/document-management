
# Stage 1: Build
FROM --platform=linux/amd64 node:20 AS builder
WORKDIR /usr/src/app

# # A wildcard is used to ensure both package.json AND package-lock.json are copied
# COPY package*.json ./

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN corepack prepare pnpm@latest --activate
# # Install pnpm globally
# RUN npm install -g pnpm
# Copy dependency files and install dependencies using pnpm
COPY package*.json pnpm-lock.yaml ./
RUN pnpm install
# Copy the rest of the application code and build the project
COPY . .
# Copy the .env and .env.development files
COPY .env ./
RUN pnpm run build

EXPOSE 3000
CMD ["pnpm", "run", "start:prod"]
