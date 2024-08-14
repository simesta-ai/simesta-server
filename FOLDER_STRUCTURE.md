# IMPORTANT

Please let there be separation of concerns in the code

- tab-spacing should be 2 for this project

I did some research on the best folder structure for scalability.
I was able to come up with this:

- src
  - controllers (These just take requests and send response)
  - services (These process requests, make any api calls if needed, pass info into models)
  - models (Mongoose models and schemas. Here you define the models and its interaction with the database)
  - schema (Javascript objects of how models look like)
  - routers
  - config
  - lib
    - loggers
  - subscribers

FOR MONOREPO WITH MICROSERVICES (when scaling)

- src
  - app.ts
  - config.ts
  - server.ts
  - users (microservice)
    - controllers
    - services
    - models
    - schema
    - routers
    - config
    - loggers
  - subscribers
  - courses
  - auth
- config
- libs
