# Release-Please Stuck State Fix

If you see `There are untagged, merged release PRs outstanding - aborting`:

1. **Remove autorelease labels** from PR #28 (and any other release PRs):
   - Go to https://github.com/HakkaOfDev/hakkaofdev.fr/pull/28
   - Remove `autorelease:pending` and `autorelease:tagged` if present

2. **Manually tag the release** (if PR #28's merge never got a tag):
   - Find the merge commit SHA of PR #28
   - Run: `git tag v1.1.2 <merge-commit-sha>`
   - Push: `git push origin v1.1.2`
   - Or create the GitHub Release manually for that commit
