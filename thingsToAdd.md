# Things to add

- Create a custom Error

> Maybe in the utils folder

```ts
class CustomError extends Error {
    super()
}
```

- Create a custom error Handler in your 

```ts
const errorHandler = (err, req, res, next) => {}

// To use
app.use(errorHandler)
```