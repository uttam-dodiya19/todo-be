const errorHandler = (err, req, res, next) => {

  // Mongoose ValidationError — missing required field, wrong type etc
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message)
    return res.status(400).json({ message: messages.join(', ') })
  }

  // Mongoose CastError — invalid ID format
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format' })
  }

  // our custom AppError — carries its own status code
  if (err.statusCode) {
    return res.status(err.statusCode).json({ message: err.message })
  }

  // fallback — unknown server error
  console.error(err)
  res.status(500).json({ message: 'Something went wrong' })
}

export default errorHandler