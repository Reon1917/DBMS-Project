const oracledb = require('oracledb');
const path = require('path');

// Configure thick mode with instant client
try {
  // Set Oracle Client library directory
  const clientPath = process.env.ORACLE_CLIENT_PATH;
  if (!clientPath) {
    throw new Error('ORACLE_CLIENT_PATH environment variable is not set');
  }
  
  console.log('Initializing Oracle Client at:', clientPath);
  oracledb.initOracleClient({ libDir: clientPath });
  console.log('Oracle Client initialized successfully');
} catch (err) {
  if (err.message.includes('DPI-1047')) {
    console.log('Oracle Client library is already initialized');
  } else {
    console.error('Error initializing Oracle Client:', err);
    throw err;
  }
}

// Enable auto commit
oracledb.autoCommit = true;

// Connection configuration
const dbConfig = {
  user: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASSWORD,
  connectString: process.env.ORACLE_CONNECT_STRING, // Note: Using ORACLE_CONNECT_STRING instead of ORACLE_CONNECTION_STRING
  // Enable thick mode
  libDir: process.env.ORACLE_CLIENT_PATH
};

// Get a connection from the pool
async function getConnection() {
  try {
    console.log('Attempting to connect with config:', {
      ...dbConfig,
      password: '***hidden***'
    });
    const connection = await oracledb.getConnection(dbConfig);
    console.log('Database connection established');
    return connection;
  } catch (err) {
    console.error('Error getting database connection:', err);
    throw err;
  }
}

// Execute a query and return results
async function executeQuery(sql, params = [], options = {}) {
  let connection;
  try {
    connection = await getConnection();
    console.log('Executing query:', sql, 'with params:', params);
    const result = await connection.execute(sql, params, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      ...options
    });
    return result.rows;
  } catch (err) {
    console.error('Error executing query:', err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
}

// Helper to convert Oracle results to camelCase objects
function toCamelCase(rows) {
  return rows.map(row => {
    const newRow = {};
    Object.keys(row).forEach(key => {
      const camelKey = key.toLowerCase().replace(/([-_][a-z])/g, group =>
        group.toUpperCase().replace('-', '').replace('_', '')
      );
      newRow[camelKey] = row[key];
    });
    return newRow;
  });
}

// Execute a query and return results in camelCase
async function executeQueryCamelCase(sql, params = [], options = {}) {
  const result = await executeQuery(sql, params, options);
  return toCamelCase(result);
}

module.exports = {
  getConnection,
  executeQuery,
  executeQueryCamelCase
};
