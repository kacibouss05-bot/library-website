function ErrorMessage({ message }) {
  return (
    <div className="error-message">
      <span>⚠️</span>
      <p>{message || 'Une erreur est survenue'}</p>
    </div>
  )
}

export default ErrorMessage