import app from './server.js';

const PORT = 3300;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
export { app }; // Export the app for testing or further use