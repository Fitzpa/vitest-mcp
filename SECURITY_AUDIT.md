# Security Audit Report

**Date:** December 10, 2025  
**Project:** vitest-mcp  
**Version:** 0.5.1

## Executive Summary

A comprehensive security audit was performed on the vitest-mcp repository to identify and remediate security vulnerabilities. The audit covered both dependency vulnerabilities and code-level security issues.

**Results:**
- ✅ **5 High/Moderate dependency vulnerabilities** fixed via updates
- ✅ **Command injection vulnerabilities** prevented through input validation
- ✅ **CodeQL security scan** passed with 0 alerts
- ✅ **All tests passing** (367 tests, 18 skipped)

---

## Dependency Vulnerabilities Fixed

### 1. HIGH: Model Context Protocol SDK - DNS Rebinding Protection
- **Package:** @modelcontextprotocol/sdk
- **Version Before:** 1.17.1
- **Version After:** 1.24.3
- **CVE:** GHSA-w48q-cv73-mx4w
- **Impact:** DNS rebinding attacks were possible due to lack of default protection
- **Resolution:** Updated to version that enables DNS rebinding protection by default

### 2. HIGH: Glob - Command Injection via CLI
- **Package:** glob
- **Version Before:** 10.2.0 - 10.4.5
- **Version After:** Latest (via transitive update)
- **CVE:** GHSA-5j98-mcp5-4vw2
- **Impact:** Command injection possible via -c/--cmd flag with shell:true
- **Resolution:** Updated to patched version

### 3. MODERATE: Body Parser - Denial of Service
- **Package:** body-parser
- **Version Before:** 2.2.0
- **Version After:** Latest (via transitive update)
- **CVE:** GHSA-wqch-xfxh-vrr4
- **Impact:** DoS vulnerability when URL encoding is used
- **Resolution:** Updated to patched version

### 4. MODERATE: js-yaml - Prototype Pollution
- **Package:** js-yaml
- **Version Before:** 4.0.0 - 4.1.0
- **Version After:** Latest (via transitive update)
- **CVE:** GHSA-mh29-5h37-fv8m
- **Impact:** Prototype pollution in merge (<<) operator
- **Resolution:** Updated to patched version

### 5. MODERATE: Vite - Multiple File System Issues
- **Package:** vite
- **Version Before:** 7.0.0 - 7.0.7
- **Version After:** Latest (via transitive update)
- **CVE:** Multiple (GHSA-g4jq-h2w9-997c, GHSA-jqfw-vq24-v9c3, GHSA-93m4-6634-74q7)
- **Impact:** 
  - Middleware may serve files with similar names to public directory
  - server.fs settings not applied to HTML files
  - server.fs.deny bypass via backslash on Windows
- **Resolution:** Updated to patched version

---

## Code Security Improvements

### 1. Command Injection Prevention

#### Vulnerability
User-controlled inputs (project names, glob patterns) were passed to `child_process.spawn()` without validation, potentially allowing command injection attacks.

**Affected Code:**
- `src/tools/run-tests.ts` - Project name parameter
- `src/tools/analyze-coverage.ts` - Exclude patterns parameter

#### Fix Implemented
Added two new security validation functions in `src/utils/path-security.ts`:

1. **`validateCommandArgument(arg: string, argName: string)`**
   - Validates project names and command-line arguments
   - Prevents: semicolons, pipes, command substitution, variable expansion, path traversal
   - Enforces maximum length (256 characters)
   - Example usage: `validateCommandArgument(args.project, "project name")`

2. **`validateGlobPatterns(patterns: string[])`**
   - Validates array of glob patterns for coverage exclusions
   - Prevents: command injection, path traversal, excessive patterns
   - Allows only safe glob characters: alphanumeric, -, /, ., *
   - Enforces maximum of 50 patterns, each up to 256 characters

#### Test Coverage
Added 15 new security-focused test cases:
- Command injection with semicolons, pipes, command substitution
- Variable expansion attacks
- Path traversal attempts
- Invalid glob patterns
- Length validation

All tests passing: `src/utils/__tests__/path-security.test.ts` (35 total tests)

### 2. Existing Security Controls (Verified)

The codebase already has robust security controls in place:

#### Path Security (`src/utils/path-security.ts`)
- ✅ Path traversal prevention (validates `..` patterns)
- ✅ Null byte injection prevention
- ✅ System directory access blocking (`/etc`, `/usr`, `/bin`, etc.)
- ✅ Path length validation (max 4096 characters)
- ✅ Path depth validation (max 20 levels)
- ✅ Command substitution pattern detection
- ✅ Secure path resolution within project boundaries

#### File Operations
- ✅ File extension validation (whitelist approach)
- ✅ Test file pattern validation
- ✅ Config file validation
- ✅ Secure temporary file creation with crypto random bytes

#### Content Sanitization
- ✅ Script tag removal
- ✅ Dangerous protocol filtering (javascript:, data:, vbscript:, etc.)
- ✅ Control character filtering
- ✅ Content length limits (1MB max)

### 3. Command Execution Safety

All command execution uses `child_process.spawn()` with proper argument separation:

**Safe Pattern:**
```typescript
const child = spawn(cmd, args, {
  shell: false,  // Explicitly disabled except when necessary
  // Arguments are properly separated, not concatenated
});
```

**Windows-Specific Handling:**
```typescript
// Only use shell for npm/npx on Windows (required for batch files)
...(process.platform === "win32" && cmd === "npx" ? { shell: true } : {})
```

This is safe because:
1. Command and arguments are separated (no string concatenation)
2. All user inputs are validated before being passed as arguments
3. Shell is only enabled when absolutely necessary (npx on Windows)

---

## CodeQL Security Analysis

**Result:** ✅ **0 Alerts** (No security issues found)

CodeQL analysis was run on all code changes and found no security vulnerabilities including:
- No SQL injection risks
- No command injection risks  
- No path traversal issues
- No prototype pollution
- No XSS vulnerabilities
- No regex DoS patterns

---

## Verification & Testing

### Test Results
- **Total Tests:** 385
- **Passed:** 367
- **Skipped:** 18
- **Failed:** 0
- **New Security Tests:** 15

### Test Coverage
Security-critical modules have comprehensive test coverage:
- `path-security.ts`: 35 tests (includes 15 new tests)
- `run-tests.ts`: 82 tests
- `analyze-coverage.ts`: 71 tests
- Integration tests: 20 tests

### Linting
All code passes ESLint with TypeScript strict mode:
```bash
npm run lint  # 0 errors, warnings only in pre-existing test files
```

---

## Risk Assessment

### Before Audit
- **HIGH Risk**: Command injection via user inputs
- **HIGH Risk**: Vulnerable dependencies with known CVEs
- **MEDIUM Risk**: Potential for path traversal attacks

### After Audit
- **LOW Risk**: All high-severity issues resolved
- **LOW Risk**: Comprehensive input validation in place
- **LOW Risk**: All dependencies up to date with security patches

---

## Recommendations

### Immediate (Completed ✅)
1. ✅ Update all vulnerable dependencies
2. ✅ Add input validation for command arguments
3. ✅ Add validation for glob patterns
4. ✅ Run CodeQL security scanner

### Future Enhancements (Optional)
1. **Dependency Scanning**: Set up automated dependency vulnerability scanning (e.g., Dependabot, Snyk)
2. **Security Policy**: Create SECURITY.md with vulnerability disclosure process
3. **Supply Chain**: Consider using npm audit in CI/CD pipeline
4. **Rate Limiting**: Add rate limiting for MCP server operations
5. **Input Sanitization**: Consider additional sanitization for error messages

### Maintenance
1. Run `npm audit` regularly (monthly minimum)
2. Keep dependencies up to date
3. Run CodeQL on all PRs
4. Review security changes in dependency updates

---

## Security Best Practices Applied

✅ **Principle of Least Privilege**: Minimal file system access, restricted paths  
✅ **Defense in Depth**: Multiple layers of validation (path, extension, content)  
✅ **Input Validation**: Whitelist approach for allowed patterns  
✅ **Secure Defaults**: Shell disabled by default, explicit opt-in  
✅ **Fail Secure**: Validation failures throw errors, don't continue  
✅ **Security by Design**: Security checks built into core utilities  

---

## Conclusion

The security audit successfully identified and resolved all critical security vulnerabilities:

- **5 dependency vulnerabilities** updated to secure versions
- **Command injection risks** mitigated through comprehensive input validation
- **0 CodeQL alerts** - clean security scan
- **367 passing tests** - no regressions introduced

The codebase now has robust security controls and follows industry best practices for secure coding. Regular security maintenance and dependency updates are recommended to maintain this security posture.

---

**Audited by:** GitHub Copilot Agent  
**Approved by:** [Pending Review]  
**Next Review Date:** [3 months from approval]
