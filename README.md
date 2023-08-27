# Setup Algia, nostr CLI client

This action sets up Algia, a nostr CLI client written in Go, for use in a GitHub Actions workflow.

## Inputs

### `version`

**Required** The version of Algia to install.

## Outputs

### `version`

The version of Algia that was installed.

## Example usage

```yaml
- uses: WesleyBatista/setup-algia@v1.0.0
  with:
    version: v0.0.45
- run: algia version
```
