# LinkedIn post: AeroDrive

## Main post (copy and paste)

Databases were the topic I struggled with the most.

ER diagrams, normalization, joins, triggers, transactions... I could read the definitions, but none of it really clicked until I had to use it.

So I stopped reading and built something. I made AeroDrive, a vehicle rental management system, and put the database at the center of it instead of treating it as storage behind a UI.

Here is what I ended up building:

🗺️ An ERD and an EERD first, then the schema from them
🗄️ 37 tables in MySQL (InnoDB) with 43 foreign keys, CHECK constraints, ENUMs and cascade rules
🧬 Four specialization (ISA) hierarchies: Person → Customer / Staff → Manager / Clerk / Mechanic, Vehicle → Car / Bike / Truck, Payment → Cash / Card / Online
📐 15 tables for multivalued attributes (1NF) and a view for a derived Age attribute
⚙️ A hand-written SQL layer: triggers, stored procedures and functions, a cursor, views with GROUP BY / HAVING, INNER / LEFT / RIGHT / FULL joins, correlated subqueries, UNION / INTERSECT / EXCEPT, indexes, and GRANT / REVOKE
🔁 ACID transactions: a reservation, a contract or a vehicle return either fully succeeds or rolls back
🔐 JWT login with role-based access for Managers, Clerks, Mechanics and Customers
📊 A manager dashboard with revenue and fleet-utilisation charts

The frontend is React + Vite and the API is Node.js + Express with Sequelize.

What I took from it: a database concept only made sense to me once I had a real problem for it to solve. Why a trigger? Why a transaction? Why split a table? A rental system answers those questions fast, because double-booked cars and half-finished returns are real failures.

🔗 Live demo: https://aerodrive-n1lh.vercel.app
💻 Source code: <paste your GitHub repo link here>

If you work with databases, I would like to know what you would change first.

#MySQL #SQL #DatabaseDesign #DBMS #ERDiagram #Normalization #StoredProcedures #Triggers #ACID #ReactJS #NodeJS #ExpressJS #FullStackDevelopment #SoftwareEngineering #LearningInPublic #BuildInPublic #StudentDeveloper #ComputerScience #Pakistan

---

## Short version

Databases were the topic I struggled with most, so I built a project around them.

AeroDrive is a vehicle rental system with an ERD and EERD, 37 tables, ISA hierarchies, triggers, stored procedures, a cursor, GROUP BY views, ACID transactions and role-based access, connected to a React + Node.js app.

🔗 Live: https://aerodrive-n1lh.vercel.app
💻 Code: <your GitHub link>

#MySQL #DatabaseDesign #SQL #ReactJS #NodeJS #LearningInPublic #StudentDeveloper #SoftwareEngineering

---

## Tips

- Add 3 or 4 images: the EERD (from `docs/EERD.png`), the dashboard, and the reservation wizard.
- Use 5 to 8 hashtags if you want a cleaner look: `#MySQL #DatabaseDesign #SQL #ReactJS #NodeJS #LearningInPublic #StudentDeveloper #SoftwareEngineering`.
- Put the GitHub link in the first comment if you prefer; links in the post body can reduce reach slightly.
- Tag teammates if you had any (the report lists a second author).
