# Poison Latency

A SaaS application built with **Next.js** featuring authentication, Stripe integration for payments, and a dashboard for logged-in users.
Based on https://github.com/nextjs/saas-starter

this project requiert a running instance of https://github.com/Grrraou/latency-poison-go-api

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Database**: [Postgres](https://www.postgresql.org/)
- **ORM**: [Drizzle](https://orm.drizzle.team/)
- **Payments**: [Stripe](https://stripe.com/)
- **UI Library**: [shadcn/ui](https://ui.shadcn.com/)

## Getting Started

```bash
git clone https://github.com/Grrraou/latency-poison-front
cd poison-latency-front
pnpm install
```

## Running Locally

Use the included setup script to create your `.env` file:

```bash
pnpm db:setup
```

Then, run the database migrations and seed the database with a default user and team:

```bash
pnpm db:migrate
pnpm db:seed
```

This will create the following user and team:

- User: `test@test.com`
- Password: `admin123`

You can, of course, create new users as well through `/sign-up`.

Finally, run the Next.js development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app in action.

Optionally, you can listen for Stripe webhooks locally through their CLI to handle subscription change events:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Running with Docker

The project can be run using Docker Compose or Make commands:

### Using Make (Recommended)

1. Start the development environment:
```bash
make dev
```

2. Run database migrations and seed the database:
```bash
make migrate
make seed
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Database Management

A pgAdmin web interface is available at [http://localhost:5050](http://localhost:5050) with the following credentials:
- Email: admin@admin.com
- Password: admin

To connect to the database in pgAdmin:
1. Right-click on "Servers" and select "Register" > "Server"
2. In the "General" tab, enter a name (e.g., "Local")
3. In the "Connection" tab:
   - Host: db
   - Port: 5432
   - Database: saas
   - Username: postgres
   - Password: postgres

Other useful Make commands:
- `make build` - Build containers without starting them
- `make down` - Stop all containers
- `make clean` - Stop containers and clean up volumes and build artifacts

### Using Docker Compose Directly

1. Build and start the containers:
```bash
docker-compose up --build
```

2. Run database migrations and seed the database:
```bash
docker-compose exec app pnpm db:migrate
docker-compose exec app pnpm db:seed
```

The application will be available at [http://localhost:3000](http://localhost:3000).

To stop the containers:
```bash
docker-compose down
```

Note: Make sure to update the environment variables in `docker-compose.yml` with your actual values before running in production.

## Testing Payments

To test Stripe payments, use the following test card details:

- Card Number: `4242 4242 4242 4242`
- Expiration: Any future date
- CVC: Any 3-digit number

## Going to Production

When you're ready to deploy your SaaS application to production, follow these steps:

### Set up a production Stripe webhook

1. Go to the Stripe Dashboard and create a new webhook for your production environment.
2. Set the endpoint URL to your production API route (e.g., `https://yourdomain.com/api/stripe/webhook`).
3. Select the events you want to listen for (e.g., `checkout.session.completed`, `customer.subscription.updated`).

### Deploy to Vercel

1. Push your code to a GitHub repository.
2. Connect your repository to [Vercel](https://vercel.com/) and deploy it.
3. Follow the Vercel deployment process, which will guide you through setting up your project.

### Add environment variables

In your Vercel project settings (or during deployment), add all the necessary environment variables. Make sure to update the values for the production environment, including:

1. `BASE_URL`: Set this to your production domain.
2. `STRIPE_SECRET_KEY`: Use your Stripe secret key for the production environment.
3. `STRIPE_WEBHOOK_SECRET`: Use the webhook secret from the production webhook you created in step 1.
4. `POSTGRES_URL`: Set this to your production database URL.
5. `AUTH_SECRET`: Set this to a random string. `openssl rand -base64 32` will generate one.

