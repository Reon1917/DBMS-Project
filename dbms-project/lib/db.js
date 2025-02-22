const oracledb = require('oracledb');
const path = require('path');

// Configure Oracle Client
const initializeOracleClient = () => {
  try {
    const clientPath = process.env.ORACLE_CLIENT_PATH;
    if (!clientPath) {
      throw new Error('ORACLE_CLIENT_PATH environment variable is not set');
    }
    
    console.log('🔌 Oracle Client Path:', clientPath);
    oracledb.initOracleClient({ libDir: clientPath });
    console.log('✅ Oracle Client ready');
  } catch (err) {
    if (err.message.includes('DPI-1047')) {
      console.log('ℹ️ Oracle Client already initialized');
    } else {
      console.error('❌ Oracle Client init failed:', err.message);
      throw err;
    }
  }
};

// Initialize client
initializeOracleClient();

// Enable auto commit for all connections
oracledb.autoCommit = true;

// Connection configuration
const dbConfig = {
  user: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASSWORD,
  connectString: process.env.ORACLE_CONNECT_STRING,
  libDir: process.env.ORACLE_CLIENT_PATH
};

// Pool configuration
const poolConfig = {
  ...dbConfig,
  poolMin: 10,
  poolMax: 25,
  poolIncrement: 5,
  poolTimeout: 60,
  queueTimeout: 60000
};

// Initialize the connection pool
let pool;
async function initPool() {
  try {
    pool = await oracledb.createPool(poolConfig);
    console.log('🏊 Connection pool ready');
  } catch (err) {
    console.error('❌ Pool creation failed:', err.message);
    throw err;
  }
}

// Initialize pool
initPool();

// Connection error messages
const CONNECTION_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid database credentials',
  CONNECTION_FAILED: 'Failed to connect to database',
  QUERY_FAILED: 'Failed to execute query',
  CONNECTION_CLOSED: 'Failed to close connection'
};

/**
 * Get a database connection
 * @returns {Promise<Connection>} Oracle connection object
 * @throws {Error} If connection fails
 */
async function getConnection() {
  try {
    if (!pool) {
      await initPool();
    }
    const connection = await pool.getConnection();
    return connection;
  } catch (err) {
    console.error('Database connection error:', err);
    throw new Error(
      err.message.includes('ORA-01017') 
        ? CONNECTION_ERRORS.INVALID_CREDENTIALS 
        : CONNECTION_ERRORS.CONNECTION_FAILED
    );
  }
}

/**
 * Execute a database query
 * @param {string} sql - SQL query to execute
 * @param {Array} params - Query parameters
 * @param {Object} options - Query options
 * @returns {Promise<Array>} Query results
 * @throws {Error} If query fails
 */
async function executeQuery(sql, params = [], options = {}) {
  let connection;
  try {
    connection = await getConnection();
    // Get first line of SQL for compact logging
    const sqlFirstLine = sql.split('\n')[0].trim();
    const compactSql = sqlFirstLine + (sql.includes('\n') ? '...' : '');
    
    console.log(`📝 Query: ${compactSql}`);
    if (params.length > 0) {
      console.log(`📎 Params:`, JSON.stringify(params, null, 0));
    }
    
    const result = await connection.execute(sql, params, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      ...options
    });
    
    // Log results in compact JSON
    if (result.rows?.length > 0) {
      console.log(`✨ Result (${result.rows.length} rows):`, 
        JSON.stringify(result.rows.slice(0, 2), null, 0) + 
        (result.rows.length > 2 ? '...' : '')
      );
    }
    
    return result.rows;
  } catch (err) {
    console.error('❌ Query failed:', err.message);
    throw new Error(CONNECTION_ERRORS.QUERY_FAILED);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('❌ Connection close failed:', err.message);
        throw new Error(CONNECTION_ERRORS.CONNECTION_CLOSED);
      }
    }
  }
}

/**
 * Convert Oracle column names to camelCase
 * @param {Array} rows - Query results
 * @returns {Array} Transformed results
 */
function toCamelCase(rows) {
  if (!rows || !Array.isArray(rows)) return rows;
  
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

/**
 * Execute a query and return results in camelCase
 * @param {string} sql - SQL query to execute
 * @param {Array} params - Query parameters
 * @param {Object} options - Query options
 * @returns {Promise<Array>} Transformed query results
 */
async function executeQueryCamelCase(sql, params = [], options = {}) {
  const result = await executeQuery(sql, params, options);
  return toCamelCase(result);
}

module.exports = {
  getConnection,
  executeQuery,
  executeQueryCamelCase
};
