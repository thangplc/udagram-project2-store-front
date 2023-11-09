/* Replace with your SQL commands */
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    price Integer NOT NULL,
    category VARCHAR(64)
);

INSERT INTO public.products (name,price,category) VALUES ('snack',100,'cold');
