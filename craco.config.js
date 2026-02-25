module.exports = {
    babel: {
      plugins: [
        // Tento plugin odstráni volania console.log iba v produkcii
        process.env.NODE_ENV === 'production' && 'transform-remove-console',
      ].filter(Boolean),
    },
  };