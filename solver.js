// HIVEL Placement Assignment - Polynomial Constant Finder
// Language: JavaScript (Plain/Vanilla)
// Author: Pardhardha

const fs = require('fs');

/**
 * Decode a value from a given base to decimal
 * @param {string} base - The base of the number system
 * @param {string} value - The encoded value
 * @returns {number} - The decoded decimal value
 */
function decodeValue(base, value) {
    return parseInt(value, parseInt(base));
}

/**
 * Parse the JSON input and extract points (x, y)
 * @param {object} jsonData - The parsed JSON object
 * @returns {object} - Object containing points array and k value
 */
function parseInput(jsonData) {
    const n = jsonData.keys.n;
    const k = jsonData.keys.k;
    const points = [];

    // Extract all points except the 'keys' object
    for (let key in jsonData) {
        if (key !== 'keys') {
            const x = parseInt(key);
            const base = jsonData[key].base;
            const encodedValue = jsonData[key].value;
            const y = decodeValue(base, encodedValue);
            
            points.push({ x: x, y: y });
        }
    }

    return { points, k };
}

/**
 * Calculate the constant term C using Lagrange Interpolation
 * The constant term is f(0) where f is the polynomial
 * 
 * Lagrange Formula: f(x) = Σ(y_i * L_i(x))
 * where L_i(x) = Π((x - x_j) / (x_i - x_j)) for all j ≠ i
 * 
 * For constant term: f(0) = Σ(y_i * L_i(0))
 * 
 * @param {Array} points - Array of {x, y} points
 * @param {number} k - Minimum number of points to use
 * @returns {number} - The constant term C
 */
function lagrangeInterpolation(points, k) {
    // Use exactly k points for interpolation
    const selectedPoints = points.slice(0, k);
    
    let constantTerm = 0;

    // Calculate f(0) using Lagrange interpolation
    for (let i = 0; i < selectedPoints.length; i++) {
        const xi = selectedPoints[i].x;
        const yi = selectedPoints[i].y;
        
        // Calculate L_i(0)
        let Li = 1;
        for (let j = 0; j < selectedPoints.length; j++) {
            if (i !== j) {
                const xj = selectedPoints[j].x;
                // L_i(0) = Π((0 - x_j) / (x_i - x_j))
                Li *= (0 - xj) / (xi - xj);
            }
        }
        
        // Add y_i * L_i(0) to the sum
        constantTerm += yi * Li;
    }

    return Math.round(constantTerm);
}

/**
 * Main function to read JSON file and calculate constant C
 */
function main() {
    // Get filename from command line arguments
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log('Usage: node solver.js <testcase.json>');
        console.log('Example: node solver.js testcase1.json');
        process.exit(1);
    }

    const filename = args[0];

    try {
        // Read and parse JSON file
        const fileContent = fs.readFileSync(filename, 'utf8');
        const jsonData = JSON.parse(fileContent);

        // Parse input and extract points
        const { points, k } = parseInput(jsonData);

        console.log('\n=== HIVEL Polynomial Constant Finder ===\n');
        console.log(`Input File: ${filename}`);
        console.log(`Total roots provided (n): ${jsonData.keys.n}`);
        console.log(`Minimum roots required (k): ${k}`);
        console.log(`\nDecoded Points (x, y):`);
        
        points.forEach(point => {
            console.log(`  (${point.x}, ${point.y})`);
        });

        // Calculate constant term using Lagrange interpolation
        const constantC = lagrangeInterpolation(points, k);

        console.log(`\n=== RESULT ===`);
        console.log(`Constant Term C: ${constantC}`);
        console.log('================\n');

    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

// Run the main function
main();
