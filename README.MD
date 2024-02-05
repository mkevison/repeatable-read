# Create Database and Set Environment Variables

To begin, follow the instructions below to set up a database and the necessary environment variables:

1. **Create Database**: Make sure you have a postgres database configured.

2. **Set Environment Variables**: Define the required environment variables. For example:

   ```bash
   export DB_HOST=your_host
   export DB_USER=your_user
   export DB_PASS=your_password
   export DB_DATABASE=your_database
   ```

   Replace `your_host`, `your_user`, `your_password`, and `your_database` with the specific information for your environment.

3. **Run Migrations**: Use the following command to create tables in the database:

   ```bash
   node ace migration:run
   ```

   This will execute migrations and create necessary tables in the database.

4. **Insert Sample Data**: Execute the following command to insert two clients into the "client" table:

   ```bash
   node ace db:seed
   ```

   This will populate the "client" table with sample data.

## Using the Transactional Endpoint with Concurrency Simulation

To utilize the provided endpoint, follow these steps:

1. **Endpoint:**

   - **Method:** POST
   - **Route:** `/transfer`

2. **Payload:**

   - The endpoint expects the following JSON payload:
     ```json
     {
       "from": "source_client_id",
       "to": "destination_client_id",
       "amount": "transfer_amount"
     }
     ```
     Ensure you provide valid client IDs (`from` and `to`) along with the transfer `amount`.

3. **Concurrency Simulation:**

   - Within the processing, a concurrency simulation occurs. It zeroes the balance of the client (`from`) during the transaction processing.


## Handling Concurrency Issues with Repeatable Read Transactions

In scenarios where the first transaction (`trx`) operates under the isolation level of "repeatable read" and reads a piece of data from the database, if that data is modified by another transaction before the first transaction commits, an error is expected during the commit of the first transaction.

### Understanding the Scenario:

- **Isolation Level:** The first transaction operates under the "repeatable read" isolation level, ensuring that it sees a consistent snapshot of the data throughout its execution.

- **Data Reading:** During its execution, the first transaction reads information from the database based on its current state.

- **Concurrency Issue:** If another transaction modifies the same piece of data that the first transaction read before the first transaction commits, this creates a concurrency issue.

### Expected Error:

- As per the ACID properties (Atomicity, Consistency, Isolation, Durability), if the data read by the first transaction is altered by another transaction before the first transaction commits, it violates the isolation principle, and an error is expected during the commit of the first transaction.
