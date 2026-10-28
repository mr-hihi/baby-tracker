# Workflow: Running the Application

| Step | macOS / Git Bash | Windows cmd / PowerShell |
|---|---|---|
| First time | `sh run.sh setup` | `run setup` |
| Dev server (http://localhost:4071) | `sh run.sh start` | `run start` |
| Test server (http://localhost:5101, `.env.test`) | `sh run.sh start_test` | `run start_test` |
| Static build into `out/` | `sh run.sh build` | `run build` |

- `start` / `start_test` refuse to run when the port is taken — stop the other process.
- To check the GitHub Pages base path locally: build with `NEXT_PUBLIC_BASE_PATH=/baby-tracker`, copy `out/` to `<tmp>/baby-tracker/`, serve `<tmp>` with any static server and open `/baby-tracker/`.
- Clear the app's data: browser DevTools → Application → Local Storage → delete `baby-tracker:v1`.
