# CI Fix Demo

A minimal Node.js project demonstrating common GitHub Actions CI failures and how to diagnose and fix them.

## Project Overview

This repository contains:
- A simple Node.js ES module with utility functions
- Jest tests covering the utilities
- ESLint for code quality
- A **broken** GitHub Actions workflow (`ci.yml`)
- The **fix** as a patch file and corrected workflow

## The Failures

The workflow in `.github/workflows/ci.yml` contains **4 intentional bugs** that cause CI to fail:

### Bug #1: Wrong Node.js Version

```yaml
node-version: '16'
```

**What fails:** The code uses the native `fetch()` API, which was only added in Node.js 18. Running on Node 16 causes:

```
ReferenceError: fetch is not defined
```

**Why this matters:** Node 16 reached end-of-life in September 2023. Modern JavaScript features like native fetch require Node 18+.

---

### Bug #2: Caching Wrong Directory

```yaml
path: node_modules
```

**What fails:** Caching `node_modules` directly is problematic because:
- Different OS/arch may have different native bindings
- `node_modules` can become stale or corrupted
- It bypasses npm's integrity checks

**The right approach:** Cache the npm cache directory (`~/.npm`) or use `setup-node`'s built-in caching.

---

### Bug #3: Bad Cache Key

```yaml
key: ${{ runner.os }}-node-${{ hashFiles('package.json') }}
```

**What fails:** The cache key uses `package.json` instead of `package-lock.json`. This means:
- Cache isn't invalidated when specific dependency versions change
- Only invalidates when you add/remove a dependency entirely
- Can serve stale dependencies

**The right approach:** Use `package-lock.json` (or use `setup-node`'s automatic handling).

---

### Bug #4: Using `npm install` Instead of `npm ci`

```yaml
run: npm install
```

**What fails:** `npm install` can:
- Modify `package-lock.json` unexpectedly
- Install different versions than intended
- Be slower due to dependency resolution

**The right approach:** Use `npm ci` which:
- Is faster (skips resolution)
- Ensures reproducible builds
- Fails if `package-lock.json` is out of sync

---

## How to Diagnose

### Step 1: Read the Action Logs

Go to the **Actions** tab and click on the failed run. The error message will point to the issue:

```
ReferenceError: fetch is not defined
    at fetchData (src/index.js:18:28)
```

### Step 2: Check Node Version Compatibility

The error mentions `fetch is not defined`. A quick search reveals fetch was added in Node 18. Check the workflow:

```yaml
node-version: '16'  # Too old!
```

### Step 3: Review Caching Strategy

If you see intermittent failures or stale dependencies, check the cache configuration:

```yaml
path: node_modules  # Wrong path
key: ${{ hashFiles('package.json') }}  # Wrong file
```

### Step 4: Verify Install Command

If `package-lock.json` changes unexpectedly in CI, you're likely using `npm install` instead of `npm ci`.

---

## The Fix

### Option A: Apply the Patch

```bash
git apply fix.patch
```

### Option B: Replace the Workflow

```bash
cp .github/workflows/ci-fixed.yml .github/workflows/ci.yml
```

### Option C: Manual Fix

Edit `.github/workflows/ci.yml`:

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'  # Use Node 20 LTS
    cache: 'npm'        # Built-in caching

- name: Install dependencies
  run: npm ci           # Reproducible installs
```

Remove the manual cache step entirely (the `setup-node` cache handles it).

---

## Verify the Fix

### Locally

```bash
# Install dependencies
npm ci

# Run linter
npm run lint

# Run tests
npm test
```

Expected output:
```
PASS  tests/index.test.js
  Math functions
    ✓ add returns correct sum
    ✓ multiply returns correct product
    ✓ factorial calculates correctly
    ✓ factorial throws for negative numbers
  Modern JS features
    ✓ nullish coalescing works correctly
    ✓ optional chaining works correctly

Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total
```

### On GitHub

1. Push the fix to your repository
2. Go to **Actions** tab
3. Watch the workflow run
4. Verify all steps pass (green checkmark)

---

## Key Takeaways

| Issue | Bad Practice | Best Practice |
|-------|-------------|---------------|
| Node version | Using EOL versions | Use current LTS (20.x) |
| Caching | Cache `node_modules` directly | Use `setup-node` cache or `~/.npm` |
| Cache key | Hash `package.json` | Hash `package-lock.json` |
| Install | `npm install` | `npm ci` |

---

## File Structure

```
ci-fix-demo/
├── .github/
│   └── workflows/
│       ├── ci.yml          # Broken workflow (intentional)
│       └── ci-fixed.yml    # Working workflow
├── src/
│   └── index.js            # Source code
├── tests/
│   └── index.test.js       # Jest tests
├── .eslintrc.json          # ESLint config
├── .gitignore
├── fix.patch               # Patch file with the fix
├── jest.config.js          # Jest config
├── package.json
└── README.md
```

## License

MIT


