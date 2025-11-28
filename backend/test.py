import time
import psycopg

dsn = "postgresql://neondb_owner:npg_1f9MHNTIoXOa@ep-jolly-mud-adcf8y2x-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"

t1 = time.time()
conn = psycopg.connect(dsn)
print("Connect:", time.time() - t1)

t2 = time.time()
conn.execute("SELECT 1")
print("Query:", time.time() - t2)


# vPDBwMDKO68z1I7A