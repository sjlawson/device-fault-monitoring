FROM node:20-alpine
# Node 20 LTS is used instead of Node 23 because:
# 1. Node 23 is not an LTS (Long Term Support) version and is still in development
# 2. Many packages and dependencies may not be fully compatible with Node 23 yet
# 3. Node 20 is the current Active LTS version with guaranteed stability and security updates until April 2026
# 4. The react-plotly.js package used in this project has better compatibility with Node LTS versions

WORKDIR /app

# Install dependencies first for better caching
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Start the development server
CMD ["npm", "run", "dev"]
