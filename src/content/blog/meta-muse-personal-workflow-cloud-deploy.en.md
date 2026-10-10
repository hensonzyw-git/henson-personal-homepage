---
key: meta-muse-personal-workflow-cloud-deploy
lang: en
title: "From Accounting to Cloud Development: Bringing My Workflows into Meta Muse"
date: 2026-10-10
category: AI Collaboration
readMins: 8
summary: "From Feishu accounting and travel follow-up to development and ECS deployment in Muse’s VM: custom connectors, credential separation, Cloud Assistant, private OSS, releases, and rollback."
related:
  - personal-agent-as-my-os
  - agent-memory-knowledge-base
draft: false
draftTranslation: true
---

I started using Muse as soon as it launched, and I have been using it ever since.

I use Muse as an AI assistant that can call tools and actually do things. It has a mobile entry point, connectors that can access my data, and a cloud virtual machine—a remote computer where it can log into websites, install development tools, and run tasks. Connectors, a browser, and automated tasks let it participate in my life and work over time.

I have also been building my own assistant, called Personal Agent. An iPhone app is the conversational interface, while the backend runs on an Alibaba Cloud server, or ECS instance. It includes a conversation service, tools connected to data such as my ledger, and a separate automated development service. It is a system for my own use, and some of its development work originally depended on the Mac at home.

So when I got Muse, I naturally wanted to try something: connect my data, tools, and workflows one by one, and see how many real needs it could handle.

Accounting in Feishu, my knowledge base, calendar, health data, email, and travel have gradually been connected. Over the past two days, I have also moved my automated development toolchain and ECS deployment workflow into Muse’s virtual machine.

The earlier integrations brought Muse closer to my daily life. The later migration changes how I develop software: going forward, most of that work can progress automatically in the cloud, while I use my phone to give requirements, check progress, and make key decisions, without spending all that time at a computer. This article focuses on that shift.

## Connecting my own data and tools first

Feishu came first.

My ledger lives in Feishu, and Personal Agent already had rules for recording expenses and reading bills. I connected Feishu to Muse through a custom connector, then copied over the rules from my own agent so it could follow a workflow I had already refined.

It works. Muse can record expenses, read bills, and answer related questions. In practice, though, it is much slower than my own agent. The same accounting or query task feels more direct in my system; with Muse, I wait longer.

There is still value in building a narrow workflow for my own business rules. That is one reason I will keep developing Personal Agent.

GitHub came next. The first thing I connected was my knowledge base.

I used my own GitHub key through a custom connector, rather than the official GitHub connector.

This effectively gave Muse access to my “external memory.” Material I have already accumulated can become context it reads when needed, so I do not have to explain everything from scratch each time. My knowledge base travels with me and can serve different agents.

This integration experience deserves some praise.

I really like Muse’s custom connector and credential management design. For someone who already has tools, data sources, and access credentials, being able to bring those capabilities in matters a great deal. That is true for both Feishu and GitHub: I can bring my own rules, keys, and knowledge base.

Credential management deserves particular credit. When asking AI to operate an account, the tempting shortcut is to send a username, password, or API key directly in plain text. Once that material enters a conversation, there is another opportunity for it to be retained, forwarded, or accidentally included in later output.

I like the separation between credential configuration and the AI conversation: authentication is configured in a dedicated place, I describe what I want in the conversation, and the tool uses the corresponding credentials when it executes. Calling a tool should not require me to paste passwords and keys into a chat box first. This is a very good design choice.

It reminds me of `.env` files in my earlier projects. Service keys go into environment configuration, the program reads them at runtime, and business code uses them through that configuration. I am looking for the same idea in an agent: give the execution environment the credentials it needs while minimizing the movement of plain-text secrets through conversations. Muse makes that part of the integration experience, which fits what I want from a personal agent.

It also leaves room to expand. I can connect a ledger today, a knowledge base tomorrow, and my own services later. The work already invested in my systems remains useful.

I also connected the iOS calendar, reminders, health data, and Gmail, extending the scheduling, health, and email workflows I already had. Logging into Google, Booking, Xiaohongshu, and other websites in the VM’s browser also lets Muse participate in tasks inside those accounts. The most memorable example came during my National Day trip.

## During the National Day trip, Muse saved my ass

That trip was where I really felt its value.

To put it bluntly, Muse saved my ass.

Accommodation involves more than booking a room. The Booking accommodation’s automatic payment failed, so I had to pay separately. I needed to register personal information before the host would provide the entry code. There was a free local travel pass I could request. The host also sent messages asking when I would arrive and leave.

These tasks were scattered across Booking messages and Gmail, arriving at different times. Booking the room left a whole chain of things to follow up on.

While traveling, I cannot keep watching every inbox. I have transport and itinerary decisions to make, and I want to enjoy the trip. Missing one accommodation message could disrupt what comes next.

Muse monitored Booking messages and Gmail through automation, then proactively messaged me about what I needed to do: pay separately, register my information, reply to the host, confirm arrival and departure times, and deal with the local travel pass.

**What other agents had not handled for me on this trip was this whole process of continuing follow-up. Muse’s virtual machine and mobile entry point made a big difference.**

The VM gave it an actual place to do the work. Once I had logged into Booking and other sites in the browser, it could open my reservations and private messages and follow accommodation matters alongside Gmail. This information sits behind account logins and changes as hosts send messages and payment states change. Answering travel questions or searching public webpages does not take care of that.

A cloud execution environment also means I do not have to carry a computer and keep copying page contents into the chat. I can give Muse a follow-up task, let it check those sources according to the automation schedule, and have it bring back new actions. That ability to follow work across websites and time is especially useful while traveling.

The mobile entry point puts it within reach. On the road, I can pull out my phone to give instructions, check progress, receive reminders, and handle the actions that need me. Following up on a host’s message does not require opening a computer and returning to a separate work environment.

For me, both parts are essential: the VM handles website access and execution, while the phone lets me stay involved. Another agent might analyze an email I paste in, but if I still have to watch the websites, carry over new messages, and ask again, it does little to take over this trip’s follow-up burden. Muse connected those pieces.

It brought payment, registration, and confirmation tasks to me in time for me to act.

This is the personal-agent experience I have wanted: keep following something that is unfolding, understand how new messages relate to the current task, and proactively remind me when I need to act.

Reservation, payment, registration, entry code, travel pass, arrival, and departure became one connected accommodation workflow. After that experience, I was willing to give it more complex work.

## Moving the automated development toolchain into Muse’s VM

Over the past two days, I started migrating my development workflow.

This migration draws heavily and directly on the automated development workflow design I had already created. The division between planning, coding, and independent review, the path from review findings to fixes and re-review, and the actions requiring my approval all come from that earlier design. I gave Muse that design as the basis for organizing and executing development tasks.

Parts of the original setup depended on the Mac at home. In this new path, Muse organizes tasks in its cloud VM, and development tools run there too. I give requirements, check progress, and approve decisions from my phone.

I split the workflow into roles:

- Muse organizes tasks, prepares context, dispatches tools, and follows their results.
- Codex’s command-line tool, or CLI, plans and writes code.
- A separate model handles review. This time it was GLM, called through Claude Code with a model-routing configuration.
- I determine the requirements and approve key actions such as merging and deployment.

Separating coding from review matters to me. The reviewer receives the code diff, acceptance criteria, and test evidence. Findings go back for fixes, followed by another review.

For the first practical run, I used a set of travel-query fixes in my personal assistant to verify the workflow. After independent review raised issues, Muse organized additional evidence, code changes, and another review. Once the blocking issues were resolved and offline tests passed, the code went through review and merging on GitHub, ready for the deployment that followed.

A coding tool also encountered permissions that prevented it from writing files. Muse continued the work using the tool’s proposed solution. I started to see the value of the workflow: review findings, fixes, and verification can keep moving in the cloud, reducing the work of carrying things back and forth between tools myself.

### Development credentials need to move without going into chat

The development toolchain needs additional credentials for model services and other tools. The GitHub key configured for the knowledge-base connector is not enough. I did not want to paste these additional keys into chat in plain text.

So I had Muse help set up a one-time credential injection path: the browser encrypts, the VM receives and decrypts, and the result is written into the required configuration. It uses the browser’s built-in WebCrypto capability, with ECDH key agreement and AES-GCM encryption. The one-time receiving process on the VM exits after completing configuration.

This avoids sending plain-text keys as conversation content. The encrypted injection path was built separately for these development tools. Muse’s custom connector and credential management, discussed earlier, are part of the product’s integration experience.

The development environment still needs credentials. Their location, permissions, and revocation options need to be clear. Credential management becomes more important as an agent gains access to more tools.

## Connecting ECS through RAM and Cloud Assistant first

To have Muse manage my Alibaba Cloud ECS instance, I first needed a remote operations channel.

I initially asked Muse to log into the server over SSH. The public key, server user, and access settings were ready, but Muse’s runtime prohibited outbound SSH. The connection returned the platform’s rejection message; the SSH handshake never began.

I then created a dedicated user and access key through Alibaba Cloud Resource Access Management, or RAM, and configured permissions for Cloud Assistant. Cloud Assistant is Alibaba Cloud’s server-command execution channel. Muse can call it over HTTPS to execute commands and query results on ECS.

**The RAM user, AccessKey, and Cloud Assistant solved the connection and remote execution problem between Muse and ECS.** Muse successfully queried its execution identity and service status, and verified the root administrator execution permissions needed for deployment.

At that point, Muse could operate ECS. Adapting the deployment workflow raised the next question: how would the built files get there?

## Separating the command channel from the file channel

Remote commands already worked; deployment also needed file transfer. Once both parts were in place, the final path was:

```text
Target source code on GitHub
        ↓
Muse VM builds the wheel, locked dependencies, and build information
        ↓
Private OSS stores deployment artifacts
        ↓ Short-lived signed download URLs
ECS downloads and verifies, builds a new environment, switches, and restarts
        ↑
Muse submits commands and queries results through Cloud Assistant
```

### Cloud Assistant executes commands

Muse calls Cloud Assistant’s HTTPS interface to execute shell scripts on ECS. The VM does not need an SSH session.

The final RAM permissions cover four actions: check Cloud Assistant status, submit commands, read results, and query execution history.

The initial `whoami` test ran under a dedicated operations user. Root identity was verified later to prepare for installation, environment switching, and service restarts. The root test itself only queried identity; the authorized deployment performed the release actions.

### Private OSS transfers deployment packages

The original deployment script assumed a Mac: build a Python installation package, or wheel, export dependencies, copy the files directly to ECS using SCP over SSH, and install them into a Python virtual environment. That path supported both remote commands and file transfer.

In the Muse path, the VM builds the package, and the Mac is not involved. The working Cloud Assistant command interface, `RunCommand`, submits scripts and executes commands, but it does not provide direct large-file upload like SCP.

Command content has a size limit, so a wheel of several MB cannot simply be inserted into one request. Encoding a file, splitting it into many pieces, submitting repeated commands, and reassembling it would be another possible solution, but it adds complexity around retries, ordering, and integrity. Deployment needs a channel suited to transferring files.

The ECS connection was already solved; package transfer was the missing piece. That is why OSS entered the design: Cloud Assistant continues executing commands, while object storage carries files.

One option was to put GitHub credentials on ECS and pull the private repository there. I wanted the server to receive build artifacts without receiving a key that grants access to the source repository.

So I created a private Object Storage Service, or OSS, space dedicated to deployment packages. This storage space is called a Bucket.

I explicitly wanted a long-term deployment repository: the Bucket remains in place, while files are organized by release and retained or cleaned up as needed.

Each release uses its own path:

```text
releases/<commit-sha>/<build-id>/
```

The commit SHA identifies a specific source version; the build ID distinguishes separate builds of that source. The wheel, dependency list, and build information all live in this release directory.

Muse uploads, lists, and reads artifacts using OSS permissions limited to the deployment prefix. ECS downloads through short-lived signed GET URLs, without storing Muse’s AccessKey or a GitHub key. The wheel, dependency file, and build information each get their own complete URL, valid for 15 minutes.

Those signed URLs themselves must be treated as temporary credentials and kept out of casual chat or log output.

Private access controls who can read and write. An object with the same name can still be overwritten, so unique release paths, digest checks, and release records need to work together.

### A small transfer test before a real release

I first had Muse exercise the path with a 51B test file: upload it from the VM, download it back from OSS, and have ECS download it through a Cloud Assistant command.

Matching SHA256 digests across all three copies showed that the small file had traveled intact through “VM → private OSS → ECS.”

The actual release later transferred a wheel of about 2.5MB and a dependency list of about 46KB. The small test was only a starting point. Transferring a real package, installing it, and switching services each still needed to be exercised.

Uploads and signed URLs used the Python `oss2` library, installed in a virtual environment dedicated to the transfer tools so its dependencies stayed separate from other tools.

## Getting releases and rollback right took the real work

Delivering files to the server does not complete a deployment workflow.

The old script installed a new wheel into the existing Python virtual environment, or venv. A venv keeps the application’s Python and dependency packages together in a separate environment. Updating in place can change dependencies too. Reinstalling an old wheel during rollback may not restore those dependencies, leaving an environment different from the original.

The new design creates a separate venv for every release, keeps the old environment, and selects the active version through a symbolic link. The link acts as a fixed entry point: services follow it to the environment they should run, and switching versions changes its target.

```text
/opt/personal-agent/
├── .venv → releases/<commit>/<build-id>/.venv
└── releases/
    ├── <old-version>/<old-build>/.venv
    └── <new-version>/<new-build>/.venv
```

Several details become critical when executing this design.

### Build the venv in its final location

The initial idea was to build the environment in a temporary directory and move it into the release directory afterward. Reproducing this with a real venv showed that moving it broke entry-point scripts.

Scripts such as pip inside a Python venv have an interpreter declaration, or shebang, on their first line that contains an absolute path. After moving the directory, the script still points to the old location.

The final approach determines a unique release directory first, creates the venv in that final location, and never moves it after installation. Services use the fixed `.venv` link to access it.

Before switching, I had Muse check the actual GNU coreutils version on ECS and use the link-replacement behavior supported by that version. Replacing the release link and restarting services are separate actions. This release still required restarts; I did not treat it as zero-downtime deployment.

### Root installation must also work for service users

Root builds the new environment, but the applications have their own service users.

If a parent directory is `0700`, a service user cannot reach the venv even if the files inside are readable. Fixing permissions only on the final build directory is not enough. Every directory along the path must allow the service user to traverse it.

I therefore had Muse check permissions on every parent directory in the release path and perform basic startup checks as the actual users of the conversation backend and data tools.

Something working as root does not establish that it works as a service user. That boundary must be checked before release.

### Bind build identity to artifacts, not just a package version

The build uses `uv build --wheel`, exports dependencies from the lockfile, and installs them into the new environment with a hash-verified dependency list.

Each release also generates build information containing the commit, build ID, file sizes, and SHA256 digests. Expected files are checked individually after download, ensuring none are missing or unexpected, before installation.

Two more problems surfaced here.

The first was the wheel filename. A wheel’s complete name contains the package, version, and compatibility tags. Renaming it to something short for scripting convenience can fail because pip follows wheel naming rules. Downloading, verification, and installation must all use the same real filename.

The second was the build-information file’s “self-verification.” The initial idea was to put its own SHA256 inside it. Writing the digest changes the file’s contents, which invalidates that digest.

The final design records wheel and dependency-file digests in the build information. The build-information file’s own digest is computed after its contents are final and saved in a separate release record.

Likewise, seeing `personal-agent 0.1.0` on the server cannot prove that it is the intended commit. Different builds can share a package version. The source version, artifact digests, and actual release path must be tied together.

### Rollback restores the old environment’s actual target

Before switching, Muse uses `readlink` to read the current `.venv` link’s actual target and saves it as this release’s recovery target.

That record is created only once. Running the switch script again must not record the already-active new environment as the “old environment.”

Recovery must not construct a guessed path either. The original link may be relative or absolute. Checking whether the old directory exists requires handling those cases separately, while restoring the link preserves the original target’s meaning.

The normal sequence is to prepare the new environment, pass the pre-release checks, record the old target, switch the link, restart services, and verify. Recovery switches back to the retained old environment, restarts, and checks again.

This also differs from an existing project script called `rollback.sh`. That script stops and removes systemd service configuration; it is an uninstall path. A rollback name alone does not make it suitable for restoring a version.

The old environment and recovery record were retained, and the relevant templates were exercised locally. A complete rollback drill in production still needs separate verification.

## Reviewing the deployment guide before the first release

I asked Muse to write `MUSE_DEPLOY.md` for this path while retaining the original Mac deployment entry point. Both paths coexist.

The guide covers pre-deployment checks, building, OSS transfer, Cloud Assistant operations, installation and switching, acceptance checks, rollback, logs, and cleanup, with parameterized execution templates.

It went through multiple review rounds. The non-movable venv, parent-directory permissions, real wheel filename, independent signed URLs, one-time rollback record, and relative-versus-absolute paths were tightened up during that process.

The approval model is written down too: a deployment approval specifies the target commit, service scope, restarts, verification steps, and recovery scope if it fails. Execution continues within that approved scope; changes outside it require another confirmation.

That is how I want an agent to work. Explain the work clearly up front, then keep carrying out what has been approved.

The first release eventually completed, but review did not make production execution trouble-free. Another shell-compatibility issue appeared: the actual shell did not support the template’s `pipefail`, so the script needed a compatible form. The build-information self-reference problem also surfaced during the formal build and required correction and re-upload.

A good operating guide helps, but the actual environment still needs execution-based verification.

This release updated the conversation backend and data-tool services of my personal assistant. The automated development service remained in its separate environment on ECS; it was neither moved nor updated by this release.

After deployment, Codex used my existing Mac operations channel for an independent read-only check: services were running, the conversation and data-tool environment links pointed to the new release directory, my personal site was reachable, and application endpoints returned the expected unauthenticated responses.

These checks establish basic service operation and access boundaries. Real travel-query acceptance and a production rollback drill still need to be completed.

What is working now is the development toolchain on Muse’s VM, the review-and-repair loop, and the build and release channels. Connecting this path to the phone approvals, operation records, and failure recovery in my existing automated development system remains future work.

But there is already a foundation for continuing automated development inside Muse. I give requirements from my phone, Muse organizes development in the VM, and approved artifacts reach the server. That is what I wanted to connect over these two days.

## Muse gives me a concrete direction to iterate toward

From my experience so far, Muse is the product that best fits my personal-agent needs.

Custom connectors and credential management let me bring in my tools, data, and rules. Continuing follow-up and proactive reminders during travel brought it into my actual life. The VM gives development tools a real place to run.

I will keep building Personal Agent and moving it toward these experiences. My own system still has advantages in speed and business fit for specialized workflows such as accounting. Muse gives me a concrete reference for how a personal agent can participate in life and work once data, tools, a browser, and an execution environment are connected.

## What I most want to learn is context management in one timeline

What I most want to understand now is how Muse manages context in a single timeline. By timeline, I mean the ongoing conversational stream I use in Muse: accounting, travel, and development tasks can unfold one after another in that same stream.

My own mechanism is explicit: after a timeout, it starts a new session, then carries forward what needs to be retained through short-, medium-, and long-term memory. It works, but after using Muse, I feel that its continuity is better.

Accounting, travel, email, and development can switch within one timeline. Development and deployment in particular take time and include review, fixes, failed attempts, and human approvals. I care about how it carries those tasks forward.

When does it compress context? How does it distinguish current work from long-term information? What does a completed task leave behind? How is memory from another task retrieved? How does it prevent earlier work from interfering with the current task?

I do not know the implementation behind this. Some of the experience may come from model capability or the way tool execution handles context. My impression from using it cannot tell me which mechanism is responsible.

That is precisely what I want to learn from it.

Over these two days, I connected the development tools and deployment channels to Muse. Next, I want my own Personal Agent to understand progress better, find the right tools when action is needed, and keep the work moving.
