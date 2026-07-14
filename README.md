==> Downloading cache...
==> Cloning from https://github.com/HareshK-14/HYPERLOCAL-MARKETPLACE
==> Checking out commit 88a303d81998de7a004df852b3820cb17d9f6a1c in branch master
==> Downloaded 6.0MB in 0s. Extraction took 0s.
==> Using Node.js version 24.14.1 (default)
==> Docs on specifying a Node.js version: https://render.com/docs/node-version
==> Running build command 'npm install'...
removed 25 packages, and audited 133 packages in 838ms
29 packages are looking for funding
  run `npm fund` for details
7 vulnerabilities (5 moderate, 2 high)
To address issues that do not require attention, run:
  npm audit fix
To address all issues (including breaking changes), run:
  npm audit fix --force
Run `npm audit` for details.
==> Uploading build...
==> Uploaded in 1.9s. Compression took 0.4s
==> Build successful 🎉
==> Deploying...
==> Setting WEB_CONCURRENCY=1 by default, based on available CPUs in the instance
==> Running 'npm start'
> backend@1.0.0 start
> node server.js
◇ injected env (0) from .env // tip: ⌁ auth for agents [www.vestauth.com]
◇ injected env (0) from .env // tip: ◈ encrypted .env [www.dotenvx.com]
◇ injected env (0) from .env // tip: ⌘ multiple files { path: ['.env.local', '.env'] }
DB_HOST: gateway01.ap-southeast-1.prod.aws.tidbcloud.com
DB_USER: 3xCE4TsyCws26x9.root
DB_PORT: 4000
DB_NAME: locallink
DB_SSL: true
DB_PASSWORD length: 16
DB_PASSWORD first4: nG6R
Server running on port 5000
Error: Access denied. Please check your user name and password. See https://docs.pingcap.com/tidbcloud/select-cluster-tier#user-name-prefix
==> Exited with status 1
==> Common ways to troubleshoot your deploy: https://render.com/docs/troubleshooting-deploys
