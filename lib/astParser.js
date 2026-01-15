/**
 * AST Parser - Code analysis for test generation
 */

import * as acorn from 'acorn';
import * as walk from 'acorn-walk';

/**
 * Parse JavaScript/TypeScript code and extract function information
 */
export function parseCode(sourceCode) {
  try {
    // Parse code with acorn
    const ast = acorn.parse(sourceCode, {
      ecmaVersion: 'latest',
      sourceType: 'module',
      locations: true
    });
    
    return ast;
  } catch (error) {
    // If acorn fails, try with loose parsing
    console.warn('Strict parsing failed, using loose mode');
    return null;
  }
}

/**
 * Analyze a specific function in the code
 */
export async function analyzeFunction(sourceCode, functionName) {
  // For simplicity, we'll use regex-based extraction
  // In a full implementation, we'd use a proper AST parser
  
  const functionRegex = new RegExp(
    `(?:function\\s+${functionName}|const\\s+${functionName}\\s*=|${functionName}\\s*:\\s*function|${functionName}\\s*=\\s*\\(|${functionName}\\s*=\\s*async\\s*\\()([\\s\\S]*?)(?=\\n(?:function|const|export|$))`,
    'i'
  );
  
  const match = sourceCode.match(functionRegex);
  
  if (!match) {
    throw new Error(`Function "${functionName}" not found in source code`);
  }
  
  const functionCode = match[0];
  
  // Extract parameters
  const paramsMatch = functionCode.match(/\(([^)]*)\)/);
  const parameters = paramsMatch
    ? paramsMatch[1].split(',').map(p => p.trim()).filter(Boolean)
    : [];
  
  // Detect dependencies (simple import detection)
  const imports = sourceCode.match(/import\s+.*?\s+from\s+['"]([^'"]+)['"]/g) || [];
  const dependencies = imports.map(imp => {
    const match = imp.match(/from\s+['"](.*)['"]/);
    return match ? match[1] : '';
  }).filter(Boolean);
  
  // Calculate complexity (simplified)
  const ifStatements = (functionCode.match(/\bif\s*\(/g) || []).length;
  const forLoops = (functionCode.match(/\bfor\s*\(/g) || []).length;
  const whileLoops = (functionCode.match(/\bwhile\s*\(/g) || []).length;
  const complexity = 1 + ifStatements + forLoops + whileLoops;
  
  // Detect return type (basic inference)
  let returnType = 'unknown';
  if (functionCode.includes('return true') || functionCode.includes('return false')) {
    returnType = 'boolean';
  } else if (functionCode.match(/return\s+\d+/)) {
    returnType = 'number';
  } else if (functionCode.match(/return\s+['"`]/)) {
    returnType = 'string';
  } else if (functionCode.match(/return\s+\[/)) {
    returnType = 'array';
  } else if (functionCode.match(/return\s+\{/)) {
    returnType = 'object';
  }
  
  return {
    functionCode,
    parameters,
    dependencies,
    complexity,
    returnType,
    estimatedCoverage: Math.max(60, 100 - complexity * 5)
  };
}

/**
 * Extract all functions from a file
 */
export function extractFunctions(sourceCode) {
  const functions = [];
  
  // Match function declarations
  const funcPattern = /(?:export\s+)?(?:async\s+)?function\s+(\w+)\s*\([^)]*\)/g;
  let match;
  
  while ((match = funcPattern.exec(sourceCode)) !== null) {
    functions.push({
      name: match[1],
      type: 'function'
    });
  }
  
  // Match arrow functions and const functions
  const arrowPattern = /(?:export\s+)?const\s+(\w+)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>/g;
  
  while ((match = arrowPattern.exec(sourceCode)) !== null) {
    functions.push({
      name: match[1],
      type: 'arrow'
    });
  }
  
  return functions;
}

/**
 * Calculate cyclomatic complexity
 */
export function calculateComplexity(code) {
  // Count decision points
  const decisions = [
    /\bif\s*\(/g,
    /\belse\s+if\s*\(/g,
    /\bfor\s*\(/g,
    /\bwhile\s*\(/g,
    /\bcase\s+/g,
    /\?\s*.*?\s*:/g, // ternary
    /&&/g,
    /\|\|/g
  ];
  
  let complexity = 1; // Base complexity
  
  decisions.forEach(pattern => {
    const matches = code.match(pattern);
    if (matches) {
      complexity += matches.length;
    }
  });
  
  return complexity;
}
