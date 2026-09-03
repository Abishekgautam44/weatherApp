# Incident Report: Docker Build Dependency Failure

## Summary

The Docker image build failed during the dependency installation step. The React source code was not the cause of this failure.

## Error

Docker stopped at this Dockerfile instruction:

```dockerfile
RUN npm ci
```

The relevant npm error was:

```text
npm error `npm ci` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync.
npm error Missing: yaml@2.9.0 from lock file
```

A separate local failure also occurred when `react-scripts` was temporarily set to an invalid version:

```text
'react-scripts' is not recognized as an internal or external command
```

## Root Cause

The dependency tree in `package-lock.json` required a compatible `yaml` peer dependency, but the lockfile only contained an incompatible `yaml@1.10.3` entry. Docker uses `npm ci`, which performs a clean and strict lockfile validation. Because the lockfile did not describe a complete installable dependency tree, the Docker build stopped.

The local project also had to use a valid Create React App dependency version. The required version is:

```json
"react-scripts": "^5.0.1"
```

## Fix Applied

1. Restored the valid `react-scripts` version in `package.json`:

   ```json
   "react-scripts": "^5.0.1"
   ```

2. Added the compatible YAML dependency:

   ```json
   "devDependencies": {
     "yaml": "^2.9.0"
   }
   ```

3. Regenerated the dependency tree and lockfile:

   ```bash
   npm install
   ```

4. Added `.dockerignore` so Docker does not copy local dependencies, build output, or git metadata into the build context.

## Verification

The repaired project was validated with:

```bash
npm run build
docker build -t weather .
```

Both commands completed successfully.

The image was also started as a container and returned:

```text
HTTP 200
```

## Running the Image

```bash
docker run --rm -p 8080:3000 weather
```

Open [http://localhost:8080](http://localhost:8080).

## Notes

`npm install` reported dependency audit warnings. These are security and maintenance notices from transitive packages used by Create React App; they did not cause the Docker build failure. Review them separately with:

```bash
npm audit
```

Avoid using `npm audit fix --force` without reviewing the resulting dependency upgrades, because forced upgrades may introduce breaking changes.
