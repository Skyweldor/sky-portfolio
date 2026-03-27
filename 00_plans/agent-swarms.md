# Agent Teams (Swarms) in Claude Code

Claude Code calls agent swarms **"agent teams"** — multiple Claude instances
working together in parallel. They are experimental and disabled by default.

---

## Enable Agent Teams

Add this to `~/.claude/settings.json`:

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

Or set the environment variable in your shell:

```bash
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
```

Requires **Claude Code v2.1.32+**.

---

## How It Works

Once enabled, ask Claude to create a team. For example:

> "Create an agent team: one teammate on frontend, one on backend, one on tests."

Claude spawns separate instances for each teammate, coordinated through a
shared task list. Teammates can communicate with each other directly.

---

## Display Modes

| Mode           | Description                                        | Requirement     |
| -------------- | -------------------------------------------------- | --------------- |
| **In-process** | All teammates in your terminal; `Shift+Down` to cycle between them | Default         |
| **Split-pane** | Each teammate gets its own pane                    | tmux or iTerm2  |

Configure in settings:

```json
{
  "teammateMode": "in-process"
}
```

---

## Good Use Cases

- Parallel code reviews across different areas
- Independent modules worked on simultaneously
- Cross-layer changes (frontend + backend + tests)
- Competing hypotheses investigation

---

## Things to Know

- Uses **significantly more tokens** (each teammate is a separate Claude instance)
- Still **experimental** — known limitations around session resumption and cleanup
- Start with **3-5 teammates** for best results
- Use the lead agent to clean up the team when done
