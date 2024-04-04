# EVM Wallet Authentication Project README

## Overview

This Next.js application demonstrates the integration of Ethereum Virtual Machine (EVM) wallet authentication for user login. It is designed to showcase various advanced technologies and libraries, including server-side actions, server components, Drizzle ORM, Wagmi.sh, Viem.sh, PostgreSQL, and Lucia auth. This project is initially set up for local development, with future updates planned to cover deployment using Serverless Stack (SST).

## Database Schema Explained

The application uses PostgreSQL for data persistence and defines the following tables:

### Session Table

Stores session information for authenticated users.

- `id`: Primary key, a unique identifier for each session.
- `userId`: References the `id` in the `UserTable`, linking the session to a specific user.
- `expiresAt`: Timestamp indicating when the session expires.

### User Table

Holds data about users.

- `id`: Primary key, a unique identifier for each user.

### Wallet Table

Records information about users' wallets. Notably, the `walletAddress` field is no longer unique, allowing users to link multiple wallets to their account.

- `id`: Primary key, automatically generated for each entry.
- `userId`: Links the wallet to a specific user in the `UserTable`. Cascades on delete.
- `walletAddress`: The wallet address. Unique constraint removed to support multiple wallets per user.

## Wallet Authentication Workflow

1. **Token Generation on Server**: A JWT containing a nonce and an address is created server-side.
2. **Client Signature**: The client signs the message using their EVM wallet and sends the signed message back to the server along with the token.
3. **Validation**: The server validates the token and the signature.
4. **Sign-In or Sign-Up**: Depending on whether the wallet is already associated with a user, the server either signs the user in or creates a new user account.

### Example Sign-In/Sign-Up Function

```javascript
"use server"
import { lucia } from "@/auth/lucia"
import { db } from "@/database/database"
import { UserTable, WalletTable } from "@/database/schemas"
import { and, eq } from "drizzle-orm"
import { generateId } from "lucia"
import { cookies } from "next/headers"
import "server-only"

export async function signInSignUp(walletAddress: string) {
  let userId
  const [existingWallet] = await db
    .select()
    .from(WalletTable)
    .where(and(eq(WalletTable.walletAddress, walletAddress)))
  if (existingWallet && existingWallet.userId) {
    userId = existingWallet.userId
  } else {
    userId = generateId(15)
    await db.insert(UserTable).values({ id: userId })
    await db.insert(WalletTable).values({ userId, walletAddress })
  }
  const session = await lucia.createSession(userId)
  const sessionCookie = lucia.createSessionCookie(session.id)
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
}
```

## Setup Instructions

### Installation

- **Command**: `bun install`
- **Purpose**: Install all necessary dependencies for the project.

### Environment Variables

- **Required Variables**: `NEXTAUTH_JWT_SECRET` and `DATABASE_URL`
- **File Location**: Add these variables to your `.env` file for proper configuration.

### Database Migration

- **Generate Schema Changes**
  - **Command**: `bun db:generate`
  - **When to Run**: After making any modifications to the database schema.
- **Apply Migrations**
  - **Command**: `bun db:migrate`
  - **Purpose**: Apply the generated migrations to update the database structure.

### Development Server

- **Command**: `bun dev`
- **Purpose**: Start the development server for local project testing.

### Database Studio

- **Command**: `bun db:studio`
- **Purpose**: Access the database's user interface for direct visualization and interaction with the database.

## NPM Scripts

- **`dev`**: Starts the Next.js development server, allowing for live reloading and debugging during development.
- **`build`**: Compiles the application into static files for production deployment.
- **`start`**: Runs the compiled application in production mode, serving the pre-built pages.
- **`lint`**: Runs the linter to check for and fix syntax and style issues.
- **`pretty`**: Formats the codebase using Prettier to ensure consistency in code style.
- **`db:generate`**: Generates new database migration files based on changes to the schema.
- **`db:migrate`**: Applies the database migrations, updating the database schema as needed.
- **`db:studio`**: Launches the Drizzle Kit Studio, a GUI for viewing and interacting with the database.

## Dependencies

The project's dependencies, specified in the `package.json` file, include key libraries and frameworks such as:

- **Next.js**: A React framework for building single-page JavaScript applications with server-side rendering and static site generation capabilities.
- **React**: A JavaScript library for building user interfaces, maintaining the application's dynamic components.
- **Drizzle ORM**: An object-relational mapping library to interact with the database using JavaScript.
- **Lucia for authentication**: A library providing authentication solutions, specifically designed to work with Next.js applications.
- **Wagmi.sh for blockchain interactions**: A set of React hooks for interfacing with Ethereum, simplifying blockchain interactions.
- Additionally, the project utilizes various utilities for design, development, and code formatting.

## Additional Notes

The application leverages the Next.js app routing system to manage navigation and page loading dynamically. This setup ensures an efficient data fetching process and a smooth user experience, optimizing the application for performance and usability.

For any inquiries or requests, please don't hesitate to contact us at [contact@lualabs.xyz](mailto:contact@lualabs.xyz), or visit our website at [lualabs.xyz](http://lualabs.xyz).
