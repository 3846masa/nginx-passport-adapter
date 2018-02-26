<h1 align="center">@3846masa/nginx-passport-adapter</h1>

<p align="center"><img alt="logo" src="https://i.imgur.com/6fsfzou.png" /></p>

<p align="right">Icon made by <a href="https://www.flaticon.com/authors/roundicons">Roundicons</a> from <a href="https://www.flaticon.com/">https://www.flaticon.com/</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/">CC 3.0 BY</a></p>

---

> Authentication system for nginx auth_request using passport.

Use passport for your nginx's authentication via ngx_http_auth_request_module.

Inspired by [sorah/nginx_omniauth_adapter](https://github.com/sorah/nginx_omniauth_adapter).

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Contribute](#contribute)
- [License](#license)

## Install

```
# WIP
```

## Usage

```
# WIP
```

### Environment variables

See [.env.sample](./.env.sample)

| ENV                           | Example                     |
| :---------------------------- | :-------------------------- |
| PORT                          | 3000                        |
| NGX_PASSPORT_SECRET_KEY       | `$ openssl rand -base64 32` |
| NGX_PASSPORT_HOST_URL         | https://auth.example.com    |
| NGX_PASSPORT_REFRESH_INTERVAL | 3600                        |
| NGX_PASSPORT_DEFAULT_PROVIDER | slack                       |

#### Discord
| ENV                                |
| :--------------------------------- |
| NGX_PASSPORT_DISCORD_CLIENT_ID     |
| NGX_PASSPORT_DISCORD_CLIENT_SECRET |
| NGX_PASSPORT_DISCORD_GUILD_ID      |

#### Slack
| ENV                              |
| :------------------------------- |
| NGX_PASSPORT_SLACK_CLIENT_ID     |
| NGX_PASSPORT_SLACK_CLIENT_SECRET |
| NGX_PASSPORT_SLACK_TEAM_ID       |

## Contribute

PRs accepted.

## License

[MIT © 3846masa](./LICENSE)
