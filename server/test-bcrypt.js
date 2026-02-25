try {
    const bcrypt = require('bcrypt');
    console.log('PASS: bcrypt is loadable!');
    process.exit(0);
} catch (err) {
    console.error('FAIL: bcrypt error:', err.message);
    process.exit(1);
}
